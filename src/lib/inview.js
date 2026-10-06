import { useEffect, useRef } from "react";

/**
 * Marks an element with data-offscreen while it is outside the viewport.
 * CSS pauses every animation under it (see index.css), so nothing ticks where nobody is looking.
 */
export function useOffscreenPause(margin = "10%") {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute("data-offscreen", !entry.isIntersecting), {
      rootMargin: `${margin} 0px ${margin} 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return ref;
}
