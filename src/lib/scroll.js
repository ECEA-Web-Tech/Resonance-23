import Lenis from "lenis";
import { isTouch, prefersReducedMotion } from "./theme";

export let lenis = null;
let driven = 0;

// The WebGL scene ticks Lenis from its own frame loop so planets and page move in the same frame.
// If the scene isn't running (no WebGL, tab just opened), this fallback loop keeps scrolling alive.
export function tickScroll(time) {
  driven = time;
  lenis?.raf(time);
}

export function startSmoothScroll() {
  // Touch devices keep native scrolling: it is already smooth, and it runs off the main thread.
  if (prefersReducedMotion() || isTouch()) return () => {};
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

export function scrollToId(id, offset = -80) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) return lenis.scrollTo(el, { offset, duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  // Native scrolling (touch, reduced motion). Measured by hand: sticky panels confuse scrollIntoView.
  scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
