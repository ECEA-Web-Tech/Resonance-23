// The site is dark-only: the universe has no daylight.
export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = () => matchMedia("(pointer: coarse)").matches;

let tier;
/**
 * How much 3D this device gets, decided once:
 * "off"  no WebGL at all (data saver, very little memory, no WebGL): static sky and CSS planets
 * "min"  low-end phones: smallest textures, 1x pixels
 * "low"  phones and tablets
 * "high" desktop
 */
export function renderTier() {
  if (tier) return tier;
  const small = isTouch() || innerWidth < 768;
  const memory = navigator.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (navigator.connection?.saveData || memory <= 2 || !window.WebGLRenderingContext) tier = "off";
  else if (small) tier = memory <= 4 || cores <= 4 ? "min" : "low";
  else tier = cores <= 2 ? "low" : "high";
  return tier;
}

/** Called when WebGL fails at runtime: the page falls back to the static sky. */
export function disableWebGL() {
  tier = "off";
  document.documentElement.dataset.webgl = "off";
  dispatchEvent(new Event("webgl-off"));
}
