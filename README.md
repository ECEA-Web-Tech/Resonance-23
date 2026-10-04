# Resonance ’26

The Resonance ’26 website for ECEA, CEG. It is built with React 19, Vite, Tailwind CSS v4, Radix UI, Motion, Lenis and three.js (React Three Fiber), and uses Firebase for hosting, Firestore and Auth.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

The site works without Firebase. It falls back to the bundled data in `src/data/`:

- `events.js` comes from `R'26_EVENTS.docx`.
- `credits.js` comes from the credits Google Sheet.

## Connect Firebase (needed for the admin panel)

1. In the [Firebase console](https://console.firebase.google.com), open the project and add a **Web app**. Copy its config.
2. Copy `.env.example` to `.env.local` and fill in the `VITE_FIREBASE_*` values.
3. **Firestore:** create a database in production mode.
4. **Authentication:** enable **Email/Password**. Under *Users*, add the admin account. The email must match the one in `firestore.rules`.
5. Under *Authentication → Settings → User actions*, turn off **Enable create (sign-up)**.
6. Point `.firebaserc` at your project, then deploy the rules and the site:

   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules,hosting
   ```

7. Open `/<VITE_ADMIN_PATH>` and sign in. On the Events and Team tabs, use **Import … from the bundled data** once to seed Firestore.

### Admin panel security

- The admin URL comes from `VITE_ADMIN_PATH`. It isn't linked anywhere and is marked `noindex`.
- The URL only hides the panel. The real protection is `firestore.rules`: everyone can read `events`, `credits` and `sponsors`, but only the admin account (signed in with a password) can write. Links must be `https://`.
- Sessions end when the browser tab closes.

## Content

- **Events, team and sponsors** are managed from the admin panel. The Sponsors chapter stays hidden until at least one sponsor exists.
- **Images** can be Google Drive share links (set to *Anyone with the link*) or any `https://` image URL.

## Structure

| Path | What it is |
| --- | --- |
| `src/Home.jsx` | Page shell: loader, chapters and the event dossier route |
| `src/components/Hero.jsx` | 00 Orbit: the scroll-scrubbed descent toward the planet |
| `src/components/Brief.jsx` | 01 Brief, with figures counted from the data |
| `src/components/Worlds.jsx` | 02 Event worlds: one pinned chapter per category, plus its dossier cards |
| `src/components/Archive.jsx` | 03 Archive: searchable and filterable ledger, stacked cards on mobile |
| `src/components/Credits.jsx` | 04 Crew |
| `src/components/EventDialog.jsx` | Event dossier at `/events/:id` |
| `src/components/Starfield.jsx` | WebGL sky (Milky Way shader), stars and drifting 3D models |
| `src/components/Aurora.jsx` | Aurora glow that follows the cursor |
| `src/admin/Admin.jsx` | Admin panel (create, edit and delete for events, team and sponsors) |

Designed and developed by [Mohamed Shameer](https://shameer-room-portfolio.netlify.app/).
