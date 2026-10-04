// The site is dark-only: the universe has no daylight.
export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = () => matchMedia("(pointer: coarse)").matches;
