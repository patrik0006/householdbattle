// Copies feedback notes (users/{uid}.feedback) into feedback/inbox.md in the repo.
//   node feedback.mjs          -> append new notes to the inbox (skips ids already there), list ids in .fb-ack.json
//   node feedback.mjs --ack    -> after the commit was pushed, remove those notes from Firebase
import fs from 'fs';
const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!sa) { console.log('No FIREBASE_SERVICE_ACCOUNT secret yet. Skipping.'); process.exit(0); }
const { initializeApp, cert } = await import('firebase-admin/app');
const { getFirestore, FieldValue } = await import('firebase-admin/firestore');
initializeApp({ credential: cert(JSON.parse(sa)) });
const db = getFirestore();
const INBOX = '../feedback/inbox.md', ACK = '../feedback/.fb-ack.json';

if (process.argv.includes('--ack')) {
  if (!fs.existsSync(ACK)) process.exit(0);
  const ack = JSON.parse(fs.readFileSync(ACK, 'utf8'));
  for (const [uid, recs] of Object.entries(ack)) await db.doc('users/' + uid).update({ feedback: FieldValue.arrayRemove(...recs) });
  fs.unlinkSync(ACK);
  console.log('cleared', Object.values(ack).reduce((n, r) => n + r.length, 0), 'note(s) from Firebase');
  process.exit(0);
}

const fmt = (t) => new Date(t).toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' }).slice(0, 16);
let inbox = fs.existsSync(INBOX) ? fs.readFileSync(INBOX, 'utf8') : '# Feedback inbox\n\nNotes left in the app with feedback mode. Newest at the bottom. Claude moves handled notes to done.md.\n';
const users = await db.collection('users').get();
const ack = {}; let added = 0;
for (const u of users.docs) {
  const recs = (u.data().feedback || []);
  if (!recs.length) continue;
  ack[u.id] = recs;
  for (const r of recs.sort((a, b) => a.at - b.at)) {
    if (inbox.includes('<!-- ' + r.id + ' -->')) continue;
    inbox += `\n## ${fmt(r.at)} · ${r.by || '?'} · v${r.version || '?'} <!-- ${r.id} -->\n- **Screen:** ${r.screen || '?'}\n- **Spot:** ${r.text ? '“' + r.text + '” · ' : ''}\`${r.spot || '?'}\` (at ${r.x}% across, ${r.y}% down)\n- **Note:** ${String(r.note || '').replace(/\n+/g, ' ')}\n`;
    added++;
  }
}
if (Object.keys(ack).length) {
  fs.mkdirSync('../feedback', { recursive: true });
  fs.writeFileSync(INBOX, inbox);
  fs.writeFileSync(ACK, JSON.stringify(ack));
}
console.log(added, 'new feedback note(s)');
