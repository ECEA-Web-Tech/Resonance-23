import { useSyncExternalStore } from "react";

// DOM elements that mark where a WebGL planet should sit. The scene follows each anchor's box every frame,
// so layout, scroll and Motion transforms all move the planet exactly as they would an image.
let anchors = [];
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export function registerAnchor(el, variant) {
  const a = { el, variant, id: Math.random().toString(36).slice(2) };
  anchors = [...anchors, a];
  emit();
  return () => {
    anchors = anchors.filter((x) => x !== a);
    emit();
  };
}

const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));
export const useAnchors = () => useSyncExternalStore(subscribe, () => anchors);
