import Lenis from "lenis";
import { prefersReducedMotion } from "./theme";

export let lenis = null;
let driven = 0;

// The WebGL scene ticks Lenis from its own frame loop so planets and page move in the same frame.
// If the scene isn't running (no WebGL, tab just opened), this fallback loop keeps scrolling alive.
export function tickScroll(time) {
  driven = time;
  lenis?.raf(time);
}

export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({ autoRaf: false, anchors: false, lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
  if (import.meta.env.DEV) window.__lenis = lenis; // lets browser tests drive scrolling
  let raf;
  const loop = (t) => {
    if (t - driven > 120) lenis?.raf(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  lenis
    ? lenis.scrollTo(el, { offset: -80, duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) })
    : el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
