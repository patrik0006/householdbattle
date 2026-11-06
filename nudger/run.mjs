// HouseholdBattle nudge job. Runs every hour on GitHub Actions.
// For each household: runs the app's own nudge rules, records the nudge in the shared state, and sends it as a push.
import './dom-stub.mjs';
import { startEngine } from './engine.mjs';

const DRY = process.argv.includes('--dry');
const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!sa) { console.log('No FIREBASE_SERVICE_ACCOUNT secret yet. Skipping.'); process.exit(0); }

const { initializeApp, cert } = await import('firebase-admin/app');
const { getFirestore, FieldValue } = await import('firebase-admin/firestore');
const { getMessaging } = await import('firebase-admin/messaging');
initializeApp({ credential: cert(JSON.parse(sa)) });
const db = getFirestore();
const messaging = getMessaging();

const homes = await db.collection('households').get();
let total = 0;
for (const home of homes.docs) {
  let sent = [], pids = {};
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(home.ref);
      const d = snap.data();
      pids = d.pids || {};
      const eng = startEngine();
      eng.load(d.state);
      sent = eng.tick(Date.now());
      if (!sent.length || DRY) return;
      tx.update(home.ref, { state: eng.json(), rev: d.rev + 1, updatedAt: FieldValue.serverTimestamp(), updatedBy: 'nudger' });
    });
  } catch (e) { console.error(home.id, 'failed:', e.message); continue; }
  if (!sent.length) console.log(home.id, ': nobody to nudge right now');
  for (const n of sent) {
    const uid = Object.keys(pids).find((u) => pids[u] === n.pid);
    console.log(home.id, n.pid, n.kind, '-', n.title, '|', n.body, DRY ? '(dry run)' : '');
    if (DRY || !uid) continue;
    const user = await db.doc('users/' + uid).get();
    const token = user.exists && user.data().push && user.data().push.token;
    if (!token) { console.log('  no push token for', n.pid); continue; }
    try {
      await messaging.send({ token, webpush: { headers: { TTL: '3600', Urgency: 'normal' }, data: { title: n.title, body: n.body, nudge: n.id, tag: 'nudge' } } });
      total++;
    } catch (e) {
      console.log('  send failed:', e.code || e.message);
      if (e.code === 'messaging/registration-token-not-registered' || e.code === 'messaging/invalid-argument') await db.doc('users/' + uid).set({ push: null }, { merge: true });
    }
  }
}
console.log('checked', homes.size, 'household(s);', total, 'push(es) sent');
