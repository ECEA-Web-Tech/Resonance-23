import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/theme";

// Wave-light ripple: expanding rings wherever the cursor moves (desktop only; mounted by Shell).
// Pooled DOM nodes animated with the Web Animations API on transform and opacity alone, so a ripple
// never touches layout or paint.
const MIN_DIST = 24; // px the cursor must travel before a new ring spawns
const MIN_INTERVAL = 70; // ms between rings
const MAX_RINGS = 14;
const TIMING = { duration: 900, easing: "cubic-bezier(0.15, 0.5, 0.35, 1)" };

export default function CursorRipple() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;
    const free = [];
    let count = 0;
    let lastX = -999;
    let lastY = -999;
    let lastTime = 0;

    function onMove(e) {
      const now = e.timeStamp;
      if (now - lastTime < MIN_INTERVAL || Math.hypot(e.clientX - lastX, e.clientY - lastY) < MIN_DIST) return;
      let ring = free.pop();
      if (!ring) {
        if (count >= MAX_RINGS) return;
        count++;
        ring = container.appendChild(Object.assign(document.createElement("div"), { className: "cursor-ripple-ring" }));
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
      const at = `translate3d(${lastX}px, ${lastY}px, 0)`;
      ring.animate(
        [
          { transform: `${at} scale(0)`, opacity: 0.85 },
          { transform: `${at} scale(1)`, opacity: 0 },
        ],
        TIMING
      ).onfinish = () => free.push(ring);
    }

    addEventListener("mousemove", onMove, { passive: true });
    return () => removeEventListener("mousemove", onMove);
  }, []);

  return <div ref={containerRef} className="cursor-ripple-layer" aria-hidden="true" />;
}
