import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import events, { CATEGORIES } from "./src/data/events.js";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "./src/lib/site.js";

/* ------------------------------------------------------------------------------------------------
   SEO at build time, from the same data the app renders (src/data/events.js):
   - index.html ships real, readable markup inside #root (painted before any script, replaced on mount)
   - every event also gets its own static page (events/<id>.html) with its own title, description,
     canonical URL and share card, so /events/<id> is a real document and not only a client route
   - JSON-LD (organisation, website, event list, dated events) and sitemap.xml (with poster images) are generated
   - every event's share card is its own poster (public/og/<id>.jpg, written by scripts/media.mjs)
   Nothing here is invented: an event only gets a schema.org Event entry if the data gives it a date.
   ------------------------------------------------------------------------------------------------ */

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const label = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
const driveId = (url) => url?.match(/\/d\/([\w-]{20,})|[?&]id=([\w-]{20,})/)?.slice(1).find(Boolean);
// The share card made from the poster, served from this site; the original link only if there is none yet.
const hasCard = (e) => existsSync(new URL(`./public/og/${e.id}.jpg`, import.meta.url));
const posterUrl = (e) =>
  hasCard(e) ? `${SITE_URL}/og/${e.id}.jpg` : driveId(e.poster) ? `https://drive.google.com/thumbnail?id=${driveId(e.poster)}&sz=w1200` : e.poster;
const facts = (e) =>
  [
    ["Venue", e.venue],
    ["Mode", e.mode],
    ["Date", e.date],
    ["Time", e.time],
    ["Team", e.team],
    ["Entry fee", e.fee],
  ].filter(([, v]) => v);
const trim = (s, n) => (s.length > n ? `${s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,.;:]$/, "")}…` : s);

const VENUE = {
  "@type": "Place",
  name: "College of Engineering, Guindy (CEG), Anna University",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sardar Patel Road, Guindy",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600025",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 13.0102, longitude: 80.2354 },
};
const ORG = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#ecea`,
  name: "Electronics and Communication Engineers’ Association",
  alternateName: ["ECEA", "ECEA CEG"],
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/ecea-logo.png`,
  sameAs: ["https://instagram.com/ecea_ceg", "https://www.linkedin.com/in/ecea-ceg", "https://youtube.com/@ecea_ceg"],
  parentOrganization: { "@type": "CollegeOrUniversity", name: "College of Engineering, Guindy, Anna University", address: VENUE.address },
};

// "10.10.2026" (+ "9 AM to 12 PM") -> ISO 8601 in IST. Returns {} when the data has no date.
function when(e) {
  const d = e.date?.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!d) return {};
  const day = `${d[3]}-${d[2]}-${d[1]}`;
  const times = [...(e.time || "").matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)].map(([, h, m = "00", ap]) => {
    const hour = (Number(h) % 12) + (ap.toUpperCase() === "PM" ? 12 : 0);
    return `${day}T${String(hour).padStart(2, "0")}:${m}:00+05:30`;
  });
  return { startDate: times[0] || day, ...(times[1] && { endDate: times[1] }) };
}

function eventSchema(e) {
  const dates = when(e);
  if (!dates.startDate) return null;
  const online = /online/i.test(e.mode || "");
  return {
    "@type": "Event",
    "@id": `${SITE_URL}/events/${e.id}#event`,
    name: `${e.name} · ${SITE_NAME}`,
    description: e.description,
    url: `${SITE_URL}/events/${e.id}`,
    image: posterUrl(e),
    ...dates,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: `https://schema.org/${online ? "Online" : "Offline"}EventAttendanceMode`,
    location: online ? { "@type": "VirtualLocation", url: e.register || `${SITE_URL}/events/${e.id}` } : { ...VENUE, name: `${e.venue}, ${VENUE.name}` },
    organizer: { "@id": ORG["@id"] },
  };
}

const jsonLd = (graph) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`;

const homeSchema = () =>
  jsonLd([
    ORG,
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, description: SITE_DESCRIPTION, inLanguage: "en-IN", publisher: { "@id": ORG["@id"] } },
    {
      "@type": "ItemList",
      name: `${SITE_NAME} events`,
      itemListElement: events.map((e, i) => ({ "@type": "ListItem", position: i + 1, name: e.name, url: `${SITE_URL}/events/${e.id}`, ...(posterUrl(e) && { image: posterUrl(e) }) })),
    },
    ...events.map(eventSchema).filter(Boolean),
  ]);

const factList = (e) => facts(e).map(([k, v]) => `${k}: ${esc(v)}`).join(" · ");

// Home: every event, grouped by category, with its description.
const homeSeed = () =>
  `<h2>Events at Resonance ’26</h2>` +
  CATEGORIES.map((c) => [c, events.filter((e) => e.category === c.id)])
    .filter(([, list]) => list.length)
    .map(
      ([c, list]) =>
        `<h3>${esc(c.label)} ${c.id === "workshop" ? "" : "events"}</h3><ul>` +
        list
          .map(
            (e) =>
              `<li><a href="/events/${e.id}">${esc(e.name)}</a>${e.tagline ? ` — ${esc(e.tagline)}` : ""}.${factList(e) ? ` ${factList(e)}.` : ""}<br />${esc(e.description)}</li>`
          )
          .join("") +
        `</ul>`
    )
    .join("");

// One event: its own document.
const eventSeed = (e) => `<main class="seed">
        <header class="seed-hero">
          <img src="__LOGO__" alt="Resonance ’26" width="488" height="265" />
          <h1>${esc(e.name)} <span>${esc(label(e.category))}${e.category === "workshop" ? "" : " event"} at Resonance ’26</span></h1>
          ${e.tagline ? `<p>${esc(e.tagline)}</p>` : ""}
        </header>
        <div class="seed-body">
          __POSTER__
          <h2>About ${esc(e.name)}</h2>
          <p>${esc(e.description)}</p>
          ${factList(e) ? `<p>${factList(e)}</p>` : ""}
          ${e.pocs?.length ? `<h3>Coordinators</h3><ul>${e.pocs.map((p) => `<li>${esc(p.name)}, <a href="tel:+91${esc(p.phone)}">${esc(p.phone)}</a></li>`).join("")}</ul>` : ""}
          ${e.register ? `<p><a href="${esc(e.register)}">Register for ${esc(e.name)}</a></p>` : ""}
          <p><a href="/">All Resonance ’26 events</a> · ECEA, College of Engineering, Guindy, Anna University, Chennai</p>
        </div>
      </main>`;

function eventHead(e) {
  const title = `${e.name} · ${label(e.category)} · ${SITE_NAME}, ECEA CEG`;
  const description = trim(`${e.name}${e.tagline ? ` (${e.tagline})` : ""} at Resonance ’26, ECEA, CEG, Anna University. ${e.description}`, 158);
  const url = `${SITE_URL}/events/${e.id}`;
  return `<title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${esc(posterUrl(e) || `${SITE_URL}/og.jpg`)}" />${hasCard(e) ? `
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />` : ""}
    <meta property="og:image:alt" content="${esc(`${e.name} poster, Resonance ’26`)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(posterUrl(e) || `${SITE_URL}/og.jpg`)}" />`;
}

function eventSchemaTag(e) {
  const crumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: e.name, item: `${SITE_URL}/events/${e.id}` },
    ],
  };
  return jsonLd([ORG, crumbs, eventSchema(e)].filter(Boolean));
}

function seo() {
  let outDir;
  return {
    name: "resonance-seo",
    configResolved(config) {
      outDir = join(config.root, config.build.outDir);
    },
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        html
          .replaceAll("%SITE_TITLE%", esc(SITE_TITLE))
          .replaceAll("%SITE_DESCRIPTION%", esc(SITE_DESCRIPTION))
          .replaceAll("%SITE_URL%", SITE_URL)
          .replace("<!--seed:events-->", homeSeed())
          .replace("<!--seo:jsonld-->", `<!--jsonld:start-->${homeSchema()}<!--jsonld:end-->`),
    },
    // After the build: derive the per-event pages and the sitemap from the finished index.html.
    closeBundle() {
      if (!outDir) return;
      let home;
      try {
        home = readFileSync(join(outDir, "index.html"), "utf8");
      } catch {
        return; // not a client build
      }
      const logo = home.match(/<img src="([^"]+)" alt="Resonance ’26"/)?.[1] ?? "";
      const built = readdirSync(join(outDir, "assets"));
      // The 3D scene's code starts downloading alongside the app instead of after it (not on data saver).
      const scene = built.find((f) => /^Starfield-.*\.js$/.test(f));
      if (scene) {
        home = home.replace(
          "</head>",
          `  <script>if(!(navigator.connection&&navigator.connection.saveData)){var l=document.createElement("link");l.rel="modulepreload";l.href="/assets/${scene}";document.head.appendChild(l)}</script>\n  </head>`
        );
        writeFileSync(join(outDir, "index.html"), home);
      }
      // The poster as built (hashed file name), for the static event pages.
      const poster = (e) => {
        const file = built.find((f) => f.startsWith(`${e.id}-800-`) && f.endsWith(".webp"));
        return file ? `<p><img src="/assets/${file}" alt="${esc(e.name)} poster, Resonance ’26" style="width:100%;max-width:26rem;height:auto;border-radius:12px" /></p>` : "";
      };
      const swap = (html, name, value) => html.replace(new RegExp(`<!--${name}:start-->[\\s\\S]*?<!--${name}:end-->`), () => value);
      mkdirSync(join(outDir, "events"), { recursive: true });
      for (const e of events) {
        let page = swap(home, "head", eventHead(e));
        page = swap(page, "seed", eventSeed(e).replace("__LOGO__", logo).replace("__POSTER__", poster(e)));
        page = swap(page, "jsonld", eventSchemaTag(e));
        writeFileSync(join(outDir, "events", `${e.id}.html`), page);
      }
      const today = new Date().toISOString().slice(0, 10);
      const urls = [`${SITE_URL}/`, ...events.map((e) => `${SITE_URL}/events/${e.id}`)];
      writeFileSync(
        join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls
          .map((u, i) => {
            const images = (i ? [events[i - 1]] : events).filter(hasCard).map((e) => `<image:image><image:loc>${SITE_URL}/og/${e.id}.jpg</image:loc></image:image>`);
            return `  <url><loc>${u}</loc><lastmod>${today}</lastmod><priority>${i ? "0.7" : "1.0"}</priority>${images.join("")}</url>`;
          })
          .join("\n")}\n</urlset>\n`
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: {
    // three.js is ~250 kB gzipped; it is only fetched once the page has painted and the browser is idle.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Framework code changes far less often than the site: keep it in its own long-cached file.
        manualChunks: (id) => (/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id) ? "react" : undefined),
      },
    },
  },
});
