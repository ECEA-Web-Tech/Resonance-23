import { useSyncExternalStore } from "react";
import { wake } from "./scene";

// DOM elements that mark where a WebGL planet should sit. The scene follows each anchor's box,
// so layout, scroll and Motion transforms all move the planet exactly as they would an image.
//
// A planet's textures are only generated once its anchor comes within a viewport of the screen
// (`near`, sticky), and its box is only measured while it is in that range (`inRange`).
let anchors = [];
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

let io;
const observer = () =>
  (io ??= new IntersectionObserver(
    (entries) => {
      let changed = false;
      for (const entry of entries) {
        const a = anchors.find((x) => x.el === entry.target);
        if (!a) continue;
        a.inRange = entry.isIntersecting;
        if (entry.isIntersecting && !a.near) changed = a.near = true;
      }
      if (changed) {
        anchors = [...anchors];
        emit();
      }
      wake();
    },
    { rootMargin: "100% 0px 100% 0px" }
  ));

/** opacity: optional MotionValue the scene reads directly (no style lookups per frame). */
export function registerAnchor(el, variant, opacity) {
  const a = { el, variant, opacity, id: Math.random().toString(36).slice(2), near: false, inRange: false, onScreen: false };
  anchors = [...anchors, a];
  observer().observe(el);
  emit();
  return () => {
    io.unobserve(el);
    anchors = anchors.filter((x) => x !== a);
    emit();
  };
}

const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));
export const useAnchors = () => useSyncExternalStore(subscribe, () => anchors);
export const anyPlanetOnScreen = () => anchors.some((a) => a.onScreen);
