// HouseholdBattle service worker: the app opens offline and updates itself in the background.
const VERSION = '0.12.0';
const CACHE = 'hb-' + VERSION;
const SHELL = ['./', 'index.html', 'app.js?v=' + VERSION, 'sync.js?v=' + VERSION, 'sync.js', 'version.js', 'firebase-config.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'splash/frenchie.webp', 'splash/spaniel.webp'];

self.addEventListener('install', (e) => {
  // cache: 'reload' skips the browser's own HTTP cache, so a new version never stores stale files.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('hb-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase talks to its own servers; never cache those calls.
  if (/googleapis\.com$|firebaseapp\.com$/.test(url.hostname) && !/fonts\.googleapis\.com$/.test(url.hostname)) return;
  // Update checks (version.js / CHANGELOG.md with ?nocache) always go to the network and are never cached.
  if (url.searchParams.has('nocache')) return;
  const isPage = req.mode === 'navigate';
  if (isPage) {
    // Page: network first so updates arrive quickly, cache when offline.
    e.respondWith(fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('index.html', copy)); return res; }).catch(() => caches.match('index.html')));
    return;
  }
  // Everything else (app code, Firebase SDK, fonts, icons): cache first, refresh in the background.
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});

// ---------- 0.7.0: nudges arrive as push messages from the nudge job (via Firebase Cloud Messaging) ----------
self.addEventListener('push', (e) => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (err) { p = { data: { title: 'HouseholdBattle', body: e.data ? e.data.text() : '' } }; }
  const d = p.data || p.notification || p;
  const title = d.title || 'HouseholdBattle';
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: d.tag || 'nudge',
    data: { nudge: d.nudge || '' }
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const id = (e.notification.data && e.notification.data.nudge) || '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    const open = list.find((c) => c.url.indexOf(self.registration.scope) === 0);
    if (open) { open.postMessage({ nudge: id }); return open.focus(); }
    return self.clients.openWindow('./' + (id ? '?nudge=' + encodeURIComponent(id) : ''));
  }));
});
