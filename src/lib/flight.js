// Shared between the loader and the WebGL scene: when the visitor "enters orbit", the camera flies in.
export const flight = { start: null };

export function launch() {
  // Reduced motion: arrive at once (the scene only redraws on demand, so a timed fly-in would stall).
  flight.start ??= performance.now() - (matchMedia("(prefers-reduced-motion: reduce)").matches ? 1e6 : 0);
}

/** 1 while parked far out, easing to 0 over the fly-in. */
export function flightOffset(now = performance.now()) {
  if (flight.start === null) return 1;
  const t = Math.min(1, (now - flight.start) / 2200);
  return (1 - t) ** 3;
}
