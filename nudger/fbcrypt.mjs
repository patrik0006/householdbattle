// Feedback notes are stored encrypted in the (public) repo: AES-256-GCM per note, its key wrapped with RSA-OAEP.
// Only the private key (kept outside the repo) can read them. One note per line: <id>\t<base64 JSON>.
import crypto from 'crypto';
import fs from 'fs';
export function seal(pubPem, obj) {
  const key = crypto.randomBytes(32), iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key, iv), data = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final()]);
  const k = crypto.publicEncrypt({ key: pubPem, oaepHash: 'sha256' }, key);
  return Buffer.from(JSON.stringify({ k: k.toString('base64'), iv: iv.toString('base64'), t: c.getAuthTag().toString('base64'), d: data.toString('base64') })).toString('base64');
}
export function open(privPem, line) {
  const b = JSON.parse(Buffer.from(line, 'base64').toString('utf8'));
  const key = crypto.privateDecrypt({ key: privPem, oaepHash: 'sha256' }, Buffer.from(b.k, 'base64'));
  const d = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(b.iv, 'base64')); d.setAuthTag(Buffer.from(b.t, 'base64'));
  return JSON.parse(Buffer.concat([d.update(Buffer.from(b.d, 'base64')), d.final()]).toString('utf8'));
}
export function readLines(path) { return fs.existsSync(path) ? fs.readFileSync(path, 'utf8').split('\n').filter((l) => l.includes('\t')).map((l) => { const i = l.indexOf('\t'); return { id: l.slice(0, i), blob: l.slice(i + 1) }; }) : []; }
