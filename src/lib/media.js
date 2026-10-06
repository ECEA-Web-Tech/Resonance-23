import manifest from "../data/media.json";
import { driveId, driveImg } from "./drive";

// Photos, posters and logos live in the repo (src/assets/{crew,events,sponsors}, written by scripts/media.mjs)
// and are served from the site itself. The manifest maps each image's original link to its local files.
// An image that isn't in the manifest yet still loads from its original link.
const files = import.meta.glob("../assets/{crew,events,sponsors}/*.webp", { eager: true, query: "?url", import: "default" });
const file = (dir, name) => files[`../assets/${dir}/${name}.webp`];
const WIDTHS = { crew: [240, 480], events: [400, 800] };

/**
 * @param url     the image link from the data (a Drive share link or any image URL)
 * @param remote  widths to ask Drive for when there is no local copy
 * @returns {{ src, srcSet?, full, ratio?, blur?, local }} or null when there is no image
 */
export function media(url, remote = [320, 640]) {
  if (!url) return null;
  const m = manifest[driveId(url) || url];
  if (m) {
    const set = (WIDTHS[m.dir] || []).map((w) => [file(m.dir, `${m.name}-${w}`), w]).filter(([u]) => u);
    const single = file(m.dir, m.name);
    if (set.length || single)
      return {
        src: set[0]?.[0] || single,
        srcSet: set.length ? set.map(([u, w]) => `${u} ${w}w`).join(", ") : undefined,
        full: file(m.dir, `${m.name}-full`) || set.at(-1)?.[0] || single,
        ratio: m.ratio,
        blur: m.blur,
        local: true,
      };
  }
  const resizable = !!driveId(url);
  return {
    src: driveImg(url, remote.at(-1)),
    srcSet: resizable ? remote.map((w) => `${driveImg(url, w)} ${w}w`).join(", ") : undefined,
    full: url,
    local: false,
  };
}

/** `sizes` of an event card's poster; shared so a prefetch picks the same file the card will ask for. */
export const CARD_SIZES = "(min-width: 1152px) 360px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw";

/**
 * Fetches local images ahead of need: one at a time, only while the browser is idle, so they are already
 * in the cache when their card scrolls into view. Skipped on data saver and very slow connections.
 */
export function prefetch(urls, sizes) {
  const c = navigator.connection;
  if (c?.saveData || /2g/.test(c?.effectiveType || "")) return () => {};
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200));
  let i = 0;
  let stopped = false;
  const next = () => {
    if (stopped || i >= urls.length) return;
    const m = media(urls[i++]);
    if (!m?.local) return next();
    const img = new Image();
    img.onload = img.onerror = () => idle(next);
    img.decoding = "async";
    if (m.srcSet) {
      img.sizes = sizes;
      img.srcset = m.srcSet;
    }
    img.src = m.src;
  };
  idle(next);
  return () => (stopped = true);
}
