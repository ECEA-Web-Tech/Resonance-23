// Shared state between the page and the WebGL scene's frame loop (see Starfield.jsx).
// The scene only draws at full rate while something is moving; `wake` marks that moment.
export const scene = { active: 0, busyUntil: 0, paused: false };

export const wake = () => (scene.active = performance.now());
/** Keep drawing at full rate for the next `ms` (used by one-off animations inside the scene). */
export const keepBusy = (ms) => (scene.busyUntil = Math.max(scene.busyUntil, performance.now() + ms));
