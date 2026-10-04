import { useEffect, useRef } from "react";

// Wave-light ripple that spawns expanding rings wherever the cursor moves.
// Uses a fixed overlay + pooled DOM nodes for performance (no React re-renders per ripple).
export default function CursorRipple() {
  const containerRef = useRef(null);
  const lastPos = useRef({ x: -999, y: -999 });
  const lastTime = useRef(0);
  const pool = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Minimum px the cursor must travel before a new ring spawns.
    const MIN_DIST = 20;
    // Minimum ms between rings (prevents flooding on fast moves).
    const MIN_INTERVAL = 60;

    function getNode() {
      // Reuse a finished node from the pool or create a new one.
      const recycled = pool.current.find((n) => n.dataset.done === "1");
      if (recycled) {
        recycled.dataset.done = "0";
        return recycled;
      }
      const el = document.createElement("div");
      el.className = "cursor-ripple-ring";
      container.appendChild(el);
      pool.current.push(el);
      return el;
    }

    function spawnRipple(x, y) {
      const ring = getNode();
      // Reset: remove/re-add class to restart the animation.
      ring.style.cssText = `left:${x}px;top:${y}px`;
      ring.classList.remove("cursor-ripple-ring--active");
      // Force reflow so the animation restarts cleanly.
      void ring.offsetWidth;
      ring.classList.add("cursor-ripple-ring--active");
      ring.addEventListener(
        "animationend",
        () => { ring.dataset.done = "1"; },
        { once: true }
      );
    }

    function onMove(e) {
      const now = performance.now();
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MIN_DIST || now - lastTime.current < MIN_INTERVAL) return;
      lastPos.current = { x: e.clientX, y: e.clientY };
      lastTime.current = now;
      spawnRipple(e.clientX, e.clientY);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return <div ref={containerRef} className="cursor-ripple-layer" aria-hidden="true" />;
}
