# HouseholdBattle

Chores, but you're winning. A two-player household task game for you and your partner.

- Live app: https://patrik0006.github.io/householdbattle/
- Runs as an installable web app (open in Chrome on Android → menu → Add to Home screen).
- Data: Firebase (Google sign-in + Firestore). Security rules are in `firestore.rules`.

## Files
- `index.html` – page, styles, startup
- `app.js` – the game (generated from the prototype test bench)
- `sync.js` – sign-in and syncing with Firebase (`?mock=name` uses a local fake backend for testing)
- `firebase-config.js` – the project's public web config
- `sw.js`, `manifest.webmanifest`, `icons/` – installable app + offline support
