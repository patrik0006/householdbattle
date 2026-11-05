// The game code was written for a browser. The nudge job only needs its logic, so give it a do-nothing page.
const noop = () => {};
const el = () => ({ style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, setAttribute: noop, getAttribute: () => null, appendChild: noop, addEventListener: noop, removeEventListener: noop, querySelector: () => null, querySelectorAll: () => [], innerHTML: '', textContent: '' });
const storage = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), clear: () => m.clear() }; };
globalThis.window = globalThis;
globalThis.document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], createElement: el, addEventListener: noop, removeEventListener: noop, body: el(), head: el(), documentElement: el(), visibilityState: 'visible' };
if (!globalThis.navigator || !globalThis.navigator.userAgent) Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'nudger', vibrate: noop }, configurable: true });
globalThis.localStorage = storage();
globalThis.sessionStorage = storage();
globalThis.matchMedia = () => ({ matches: false, addEventListener: noop, addListener: noop });
globalThis.requestAnimationFrame = (f) => setTimeout(f, 0);
globalThis.location = { search: '', pathname: '/', href: 'http://localhost/' };
globalThis.history = { replaceState: noop };
// timers the UI starts must not keep the job alive
const realSI = globalThis.setInterval;
globalThis.setInterval = (...a) => { const t = realSI(...a); if (t && t.unref) t.unref(); return t; };
