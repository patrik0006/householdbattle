// HouseholdBattle sync layer.
// The whole household game state lives in ONE Firestore document: households/{inviteCode}
//   { memberUids: [uid, uid], pids: { uid: 'A' | 'B' }, state: '<JSON>', rev: n, updatedAt, updatedBy }
// and users/{uid} = { householdId } remembers which household a signed-in person belongs to.
// Every write is a transaction on `rev`, so two phones can never overwrite each other blindly.
//
// Add ?mock=<name> to the URL to run against a fake in-browser backend (used for local testing).

import { firebaseConfig, vapidKey } from './firebase-config.js';

const FB_VERSION = '12.11.0';
const FB = 'https://www.gstatic.com/firebasejs/' + FB_VERSION + '/';

export async function createSync() {
  const params = new URLSearchParams(location.search);
  if (params.has('mock')) return mockSync(params.get('mock') || 'tester');
  return firebaseSync();
}

/* ---------------- Firebase ---------------- */
async function firebaseSync() {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(FB + 'firebase-app.js'),
    import(FB + 'firebase-auth.js'),
    import(FB + 'firebase-firestore.js')
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  let db;
  try {
    db = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) });
  } catch (e) {
    db = F.getFirestore(app);
  }
  A.getRedirectResult(auth).catch(() => {});
  const hhRef = (code) => F.doc(db, 'households', code);
  const userRef = (uid) => F.doc(db, 'users', uid);
  const me = () => auth.currentUser;

  return {
    kind: 'firebase',
    onAuth(cb) {
      return A.onAuthStateChanged(auth, (u) => cb(u ? { uid: u.uid, name: u.displayName || '', email: u.email || '' } : null));
    },
    async signIn() {
      const provider = new A.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      try {
        await A.signInWithPopup(auth, provider);
      } catch (e) {
        if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) {
          await A.signInWithRedirect(auth, provider);
          return;
        }
        throw e;
      }
    },
    signOut() { return A.signOut(auth); },
    async getMyHouseholdId() {
      const s = await F.getDoc(userRef(me().uid));
      return s.exists() ? (s.data().householdId || null) : null;
    },
    async getHousehold(code) {
      const s = await F.getDoc(hhRef(code));
      return s.exists() ? s.data() : null;
    },
    // Creates the household. Rejects with Error('exists') if the code is taken.
    async createHousehold(code, pid, stateJSON) {
      const uid = me().uid;
      await F.runTransaction(db, async (tx) => {
        const s = await tx.get(hhRef(code));
        if (s.exists()) throw new Error('exists');
        tx.set(hhRef(code), { memberUids: [uid], pids: { [uid]: pid }, state: stateJSON, rev: 1, updatedAt: F.serverTimestamp(), updatedBy: uid });
      });
      await F.setDoc(userRef(uid), { householdId: code }, { merge: true });
      return { rev: 1 };
    },
    // Adds the signed-in person to the household. build(remoteStateJSON) returns the new state JSON.
    async joinHousehold(code, pid, build) {
      const uid = me().uid;
      const res = await F.runTransaction(db, async (tx) => {
        const s = await tx.get(hhRef(code));
        if (!s.exists()) throw new Error('missing');
        const d = s.data();
        if (d.memberUids.indexOf(uid) >= 0) return { rev: d.rev, state: d.state };
        if (d.memberUids.length >= 2) throw new Error('full');
        const json = build(d.state);
        tx.update(hhRef(code), { memberUids: d.memberUids.concat([uid]), ['pids.' + uid]: pid, state: json, rev: d.rev + 1, updatedAt: F.serverTimestamp(), updatedBy: uid });
        return { rev: d.rev + 1, state: json };
      });
      await F.setDoc(userRef(uid), { householdId: code }, { merge: true });
      return res;
    },
    subscribe(code, cb, onError) {
      return F.onSnapshot(hhRef(code), (s) => { if (s.exists()) cb(s.data()); }, (e) => { if (onError) onError(e); });
    },
    // build(remoteRev, remoteStateJSON) returns { json, replayed }.
    async commit(code, build) {
      const uid = me().uid;
      return F.runTransaction(db, async (tx) => {
        const s = await tx.get(hhRef(code));
        if (!s.exists()) throw new Error('missing');
        const d = s.data();
        const out = build(d.rev, d.state);
        tx.update(hhRef(code), { state: out.json, rev: d.rev + 1, updatedAt: F.serverTimestamp(), updatedBy: uid });
        return { rev: d.rev + 1, json: out.json, replayed: out.replayed };
      });
    },
    async leaveHousehold() {
      await F.setDoc(userRef(me().uid), { householdId: null, push: null }, { merge: true });
    },
    // Push: get this phone's FCM token (using our own service worker) and store it on users/{uid}.
    async registerPush(swReg, info) {
      const M = await import(FB + 'firebase-messaging.js');
      if (!(await M.isSupported())) throw new Error('messaging-unsupported');
      const messaging = M.getMessaging(app);
      const opts = { serviceWorkerRegistration: swReg };
      if (vapidKey) opts.vapidKey = vapidKey;
      const token = await M.getToken(messaging, opts);
      if (!token) throw new Error('no-token');
      await F.setDoc(userRef(me().uid), { push: { token, code: info.code, pid: info.pid, at: Date.now(), ua: navigator.userAgent.slice(0, 120) } }, { merge: true });
      return token;
    },
    // Feedback notes wait on users/{uid}.feedback until the job copies them into the repo.
    async sendFeedback(rec) {
      await F.setDoc(userRef(me().uid), { feedback: F.arrayUnion(rec) }, { merge: true });
    },
    // Gemini through Firebase AI Logic (free Gemini Developer API tier). Returns the model's text.
    async ai(prompt) {
      const AI = await import(FB + 'firebase-ai.js');
      const ai = AI.getAI(app, { backend: new AI.GoogleAIBackend() });
      const models = ['gemini-3.5-flash', 'gemini-3-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
      const start = Math.max(0, models.indexOf(localStorage.getItem('hb-ai-model') || ''));
      let lastErr = null;
      for (let i = start; i < models.length; i++) {
        try {
          const model = AI.getGenerativeModel(ai, { model: models[i], generationConfig: { responseMimeType: 'application/json', temperature: 0.9 } });
          const res = await model.generateContent(prompt);
          localStorage.setItem('hb-ai-model', models[i]);
          return res.response.text();
        } catch (e) {
          lastErr = e;
          const msg = String((e && e.message) || e);
          if (!/not found|404|unsupported|not supported|does not exist|permission|403/i.test(msg)) break; // only try the next model when this one isn't available
        }
      }
      throw lastErr;
    }
  };
}

/* ---------------- Mock (local testing only) ---------------- */
function mockSync(name) {
  const KEY = 'hb-mock-db';
  const uid = 'mock-' + name;
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { households: {}, users: {} }; } catch (e) { return { households: {}, users: {} }; } };
  const write = (db) => { localStorage.setItem(KEY, JSON.stringify(db)); notify(); };
  const subs = new Set();
  const notify = () => subs.forEach((f) => f());
  window.addEventListener('storage', (e) => { if (e.key === KEY) notify(); });
  const offline = () => !!window.__hbOffline;
  const delay = () => new Promise((r) => setTimeout(r, 30));
  let signedIn = localStorage.getItem('hb-mock-signedin-' + name) === '1';
  let authCb = null;
  const user = () => (signedIn ? { uid, name: name.charAt(0).toUpperCase() + name.slice(1), email: name + '@example.com' } : null);
  return {
    kind: 'mock',
    onAuth(cb) { authCb = cb; setTimeout(() => cb(user()), 0); return () => {}; },
    async signIn() { signedIn = true; localStorage.setItem('hb-mock-signedin-' + name, '1'); if (authCb) authCb(user()); },
    async signOut() { signedIn = false; localStorage.removeItem('hb-mock-signedin-' + name); if (authCb) authCb(null); },
    async getMyHouseholdId() { await delay(); return (read().users[uid] || {}).householdId || null; },
    async getHousehold(code) { await delay(); return read().households[code] || null; },
    async createHousehold(code, pid, stateJSON) {
      await delay(); const db = read();
      if (db.households[code]) throw new Error('exists');
      db.households[code] = { memberUids: [uid], pids: { [uid]: pid }, state: stateJSON, rev: 1, updatedBy: uid };
      db.users[uid] = { householdId: code }; write(db); return { rev: 1 };
    },
    async joinHousehold(code, pid, build) {
      await delay(); const db = read(), d = db.households[code];
      if (!d) throw new Error('missing');
      if (d.memberUids.indexOf(uid) < 0) {
        if (d.memberUids.length >= 2) throw new Error('full');
        d.state = build(d.state); d.memberUids.push(uid); d.pids[uid] = pid; d.rev += 1; d.updatedBy = uid;
      }
      db.users[uid] = { householdId: code }; write(db); return { rev: d.rev, state: d.state };
    },
    subscribe(code, cb) {
      let last = -1;
      const f = () => { if (offline()) return; const d = read().households[code]; if (d && d.rev !== last) { last = d.rev; cb(JSON.parse(JSON.stringify(d))); } };
      subs.add(f); setTimeout(f, 0);
      const t = setInterval(f, 250);
      return () => { subs.delete(f); clearInterval(t); };
    },
    async commit(code, build) {
      await delay();
      if (offline()) throw new Error('unavailable');
      const db = read(), d = db.households[code];
      if (!d) throw new Error('missing');
      const out = build(d.rev, d.state);
      d.state = out.json; d.rev += 1; d.updatedBy = uid; write(db);
      return { rev: d.rev, json: out.json, replayed: out.replayed };
    },
    async leaveHousehold() { const db = read(); db.users[uid] = { householdId: null }; write(db); },
    async sendFeedback(rec) { await delay(); const db = read(); const u = db.users[uid] = db.users[uid] || {}; u.feedback = (u.feedback || []).concat([rec]); write(db); },
    async registerPush(swReg, info) { await delay(); const db = read(); db.users[uid] = Object.assign({}, db.users[uid], { push: { token: 'mock-token-' + name, code: info.code, pid: info.pid, at: Date.now() } }); write(db); return 'mock-token-' + name; },
    async ai(prompt) {
      await delay(); if (offline() || window.__hbAiFail) throw new Error('unavailable');
      window.__hbAiPrompt = prompt;
      return JSON.stringify([
        { title: 'Swap to winter tyres', size: 5, reason: 'It is November in Sweden. The first frost will not wait.' },
        { title: 'Descale the coffee machine', size: 2, reason: 'Never done here, and your coffee knows it.' },
        { title: 'Clean the oven', size: 4, reason: 'Last done 7 months ago. Brave soul wanted.' },
        { title: 'Pay the bills', size: 2, reason: 'End of the month is coming.' },
        { title: 'Test the smoke alarms', size: 1, reason: 'Two minutes. Possibly life-saving.' }
      ]);
    }
  };
}
