import Lenis from "lenis";
import { prefersReducedMotion } from "./theme";

export let lenis = null;

export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({ autoRaf: true, anchors: false });
  if (import.meta.env.DEV) window.__lenis = lenis; // lets browser tests drive scrolling
  return () => {
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  lenis ? lenis.scrollTo(el, { offset: -80 }) : el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
