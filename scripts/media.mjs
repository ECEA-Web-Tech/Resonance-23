// Pulls every photo, poster and sponsor logo the data points at into the repo, as optimised WebP:
//
//   src/assets/crew/<name>-240.webp, -480.webp          3:4 portraits
//   src/assets/events/<id>-400.webp, -800.webp, -full   posters, original proportions
//   src/assets/sponsors/<id>.webp                       logos
//   public/og/<id>.jpg                                  1200x630 share card per event
//   src/data/media.json                                 source URL -> local files (+ a tiny blur preview)
//
// The site serves these instead of Google Drive. An image that isn't in the manifest (say, a person added
// later from the admin panel) still loads from its original link, so nothing breaks before a re-run.
//
// Run after changing photos or posters in src/data:   npx -y -p sharp node scripts/media.mjs
// Add --force to re-download everything, or --only=crew|events|sponsors to redo one folder.
import { mkdir, writeFile, access } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import credits from "../src/data/credits.js";
import events from "../src/data/events.js";
import sponsors from "../src/data/sponsors.js";

const ROOT = new URL("..", import.meta.url).pathname;
const FORCE = process.argv.includes("--force");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7); // redo one folder: --only=sponsors
const driveId = (url) => url?.match(/\/d\/([\w-]{20,})|[?&]id=([\w-]{20,})/)?.slice(1).find(Boolean);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const exists = (p) => access(p).then(() => true, () => false);

// Where the face sits when a portrait is cropped to 3:4. Default is the centre; list exceptions here.
const FOCUS = {};

async function fetchImage(url) {
  const id = driveId(url);
  const src = id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1600` : url;
  // Drive rate-limits bursts: wait and try again a few times before giving up.
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(src, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0" } });
    if (res.ok && (res.headers.get("content-type") || "").startsWith("image/")) return Buffer.from(await res.arrayBuffer());
    if (attempt === 4 || ![429, 500, 502, 503].includes(res.status)) throw new Error(`${res.status} ${res.headers.get("content-type")}`);
    await new Promise((r) => setTimeout(r, attempt * 4000));
  }
}

const blur = async (img) => `data:image/webp;base64,${(await img.clone().resize(16).webp({ quality: 30 }).toBuffer()).toString("base64")}`;

const manifest = {};
const failed = [];

async function each(list, dir, name, build) {
  await mkdir(join(ROOT, "src/assets", dir), { recursive: true });
  for (const item of list) {
    const url = item.photo || item.poster || item.logo;
    if (!url) continue;
    const key = driveId(url) || url;
    const base = name(item);
    try {
      const marker = join(ROOT, "src/assets", dir, `${base}${dir === "sponsors" ? "" : dir === "crew" ? "-480" : "-800"}.webp`);
      if (!FORCE && ONLY !== dir && (await exists(marker))) {
        const meta = await sharp(marker).metadata();
        manifest[key] = { dir, name: base, ratio: +(meta.width / meta.height).toFixed(4), ...(dir !== "sponsors" && { blur: await blur(sharp(marker)) }) };
        continue;
      }
      await new Promise((r) => setTimeout(r, 250)); // stay under Drive's rate limit
      const input = sharp(await fetchImage(url)).rotate();
      manifest[key] = { dir, name: base, ...(await build(input, base, item)) };
      console.log("ok  ", dir, base);
    } catch (err) {
      failed.push(`${dir}/${base}: ${err.message}`);
      console.warn("FAIL", dir, base, err.message);
    }
  }
}

const out = (dir, file) => join(ROOT, "src/assets", dir, file);

await each(credits, "crew", (p) => slug(p.name), async (img, base, p) => {
  const crop = (w) => img.clone().resize(w, Math.round((w * 4) / 3), { fit: "cover", position: FOCUS[p.id] || "centre" });
  await crop(240).webp({ quality: 72, effort: 6 }).toFile(out("crew", `${base}-240.webp`));
  await crop(480).webp({ quality: 64, effort: 6 }).toFile(out("crew", `${base}-480.webp`));
  return { ratio: 0.75, blur: await blur(crop(64)) };
});

await mkdir(join(ROOT, "public/og"), { recursive: true });
await each(events, "events", (e) => e.id, async (img, base) => {
  const { width, height } = await img.metadata();
  for (const w of [400, 800]) await img.clone().resize(w, null, { withoutEnlargement: true }).webp({ quality: 74, effort: 6 }).toFile(out("events", `${base}-${w}.webp`));
  await img.clone().resize(1400, null, { withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toFile(out("events", `${base}-full.webp`));
  // Share card: the poster, whole, over a blurred, darkened copy of itself.
  const back = await img.clone().resize(1200, 630, { fit: "cover" }).blur(40).modulate({ brightness: 0.45 }).toBuffer();
  const front = await img.clone().resize(null, 590, { fit: "inside" }).toBuffer();
  await sharp(back).composite([{ input: front, gravity: "centre" }]).jpeg({ quality: 82, mozjpeg: true }).toFile(join(ROOT, "public/og", `${base}.jpg`));
  return { ratio: +(width / height).toFixed(4), blur: await blur(img) };
});

await each(sponsors, "sponsors", (s) => s.id, async (img, base) => {
  // Logos come with uneven margins: trim to the artwork so every logo fills its slot the same way.
  const logo = sharp(await img.clone().trim({ threshold: 12 }).toBuffer()).resize(480, 240, { fit: "inside", withoutEnlargement: true });
  const info = await logo.webp({ quality: 88 }).toFile(out("sponsors", `${base}.webp`));
  return { ratio: +(info.width / info.height).toFixed(4) };
});

await writeFile(join(ROOT, "src/data/media.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(`\n${Object.keys(manifest).length} images in the manifest.`);
if (failed.length) console.log(`Failed (these keep loading from their original link):\n  ${failed.join("\n  ")}`);
