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
- **Images are served from the site, not from Drive.** `scripts/media.mjs` downloads every photo, poster and logo the data points at, and writes optimised WebP into `src/assets/crew`, `src/assets/events` and `src/assets/sponsors`, a share card per event into `public/og`, and the manifest `src/data/media.json`. After changing a photo or poster in `src/data`, run `npx -y -p sharp node scripts/media.mjs` and commit the result. An image that is not in the manifest yet (for example one just added from the admin panel) loads from its original link until then.

## Structure

| Path | What it is |
| --- | --- |
| `src/Home.jsx` | Page shell: loader, chapters and the event dossier route |
| `src/components/Hero.jsx` | 00 Orbit: the scroll-scrubbed descent toward the planet |
| `src/components/Brief.jsx` | 01 Brief, with figures counted from the data |
| `src/components/Worlds.jsx` | 02 Event worlds: one pinned chapter per category, plus its dossier cards |
| `src/components/Archive.jsx` | 03 Archive: searchable and filterable table; scrolls sideways inside its panel on small screens |
| `src/components/Credits.jsx` | 04 Crew: one card, one size, for every group |
| `src/components/Picture.jsx` | Every content image: instant blurred preview, then the local WebP |
| `src/lib/media.js` | Maps an image link from the data to its local files; background prefetch |
| `scripts/media.mjs` | Downloads and optimises the images (see Content) |
| `src/components/EventDialog.jsx` | Event dossier at `/events/:id` |
| `src/components/Starfield.jsx` | WebGL scene: baked nebula sky, parallax stars, bright stars, shooting stars. Owns the frame loop (see Performance) |
| `src/components/space/Planets.jsx` | Realistic planets (Earth with clouds, city lights and moon; ice giant; ringed gas giant; desert world) that follow `<Planet>` anchors in the page |
| `src/components/space/shaders.js` | GLSL for the planet surfaces, atmosphere, rings and sky (surfaces are baked once by `bake.js`) |
| `src/components/Aurora.jsx` | Aurora glow that follows the cursor (desktop only) |
| `src/lib/theme.js` | `renderTier()`: how much 3D a device gets (`off`, `min`, `low`, `high`) |
| `src/lib/site.js` | Site URL, title and description, shared by the app and the build |
| `vite.config.js` | Build, plus the SEO plugin: static markup in `index.html`, one page per event, JSON-LD, `sitemap.xml` |
| `src/admin/Admin.jsx` | Admin panel (create, edit and delete for events, team and sponsors) |

## Performance

- **First paint is static.** `index.html` ships real markup (logo, heading, every event) that paints before any script and is replaced when the app mounts.
- **The loader works like a game's loading screen.** While it shows, three.js downloads (in parallel with the app), every world's textures are generated and every shader is compiled, one after another. Nothing is built or compiled once the visitor is scrolling. The wait is capped at five seconds; on a slow connection the scene fades in afterwards. Posters are fetched in the background from the same moment.
- **No 3D where it can't run well.** On data saver, very low memory, no WebGL or software-only WebGL, `src/assets/sky.webp` and CSS planets stand in and three.js is never downloaded.
- **The scene draws only when it has to.** Every frame while something moves (scroll, pointer, fly-in), about 30 fps while a planet is on screen, a slow idle rate for the sky alone, and nothing at all behind an open dossier or in a hidden tab. Phones draw at up to 2x pixels; if frames arrive late the density steps down by itself.
- **Fixed layers are sized to the tallest viewport** (`100lvh`), so nothing shows a band at the bottom while a phone's address bar slides away.
- **Touch devices** keep native scrolling and skip the cursor effects, the chapter wipe and the sideways drift.
- One typeface, Roboto, self-hosted in `public/fonts` as a single variable file (latin subset, preloaded). `public/_headers` and `firebase.json` cache fingerprinted assets and fonts for a year.

## SEO

`vite.config.js` generates, from `src/data/events.js`: the crawlable markup in `index.html`, a static page per event (`events/<id>.html`, with its own title, description, canonical URL, poster and share card), JSON-LD and `sitemap.xml` (with the poster images). `public/robots.txt` allows every crawler and points at the sitemap. An event gets a schema.org `Event` entry only if it has a `date`. `public/_redirects` sends every other path to the app (Netlify). If the events in Firestore differ from `src/data/events.js`, update the file too: the static pages are built from it.

Designed and developed by [Mohamed Shameer](https://shameer-room-portfolio.netlify.app/).
