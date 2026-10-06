import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/theme";

// Each blob chases the pointer at its own speed, so the colours smear into an aurora trail.
// Desktop only (mounted by Shell when there is a cursor).
const BLOBS = [
  { ease: 0.09, orbit: 60, speed: 0.5 },
  { ease: 0.05, orbit: 120, speed: 0.33 },
  { ease: 0.03, orbit: 160, speed: 0.27 },
  { ease: 0.018, orbit: 220, speed: 0.21 },
];
const LINGER = 5000; // keep swaying this long after the cursor rests, then stop the loop

export default function Aurora() {
  const ref = useRef();
  const still = prefersReducedMotion();

  useEffect(() => {
    if (still) return;
    const els = [...ref.current.children];
    const target = { x: innerWidth / 2, y: innerHeight * 0.4 };
    const pos = BLOBS.map(() => ({ ...target }));
    let raf = 0;
    let until = performance.now() + LINGER;

    const tick = (now) => {
      const t = now / 1000;
      BLOBS.forEach((b, i) => {
        const tx = target.x + Math.cos(t * b.speed + i * 2) * b.orbit;
        const ty = target.y + Math.sin(t * b.speed * 1.3 + i) * b.orbit * 0.6;
        const p = pos[i];
        p.x += (tx - p.x) * b.ease;
        p.y += (ty - p.y) * b.ease;
        els[i].style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${t * 8 + i * 45}deg)`;
      });
      raf = now < until ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      until = e.timeStamp + LINGER;
      raf ||= requestAnimationFrame(tick);
    };

    addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [still]);

  return (
    <div ref={ref} className="aurora" data-mode={still ? "drift" : "follow"} aria-hidden="true">
      {BLOBS.map((_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}
