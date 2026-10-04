import { useEffect, useState } from "react";
import { domAnimation, LazyMotion, m, useScroll } from "motion/react";

// Fixed left rail: page progress plus the chapter currently in view (desktop only).
export default function Rail() {
  const { scrollYProgress } = useScroll();
  const [current, setCurrent] = useState({ no: "00", title: "Orbit" });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        // A chapter becomes current when it crosses the middle of the viewport.
        const hit = entries.filter((x) => x.isIntersecting).at(-1);
        if (hit) setCurrent({ no: hit.target.dataset.chapter, title: hit.target.dataset.title });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    // Children are mounted by the time this runs; re-scan when data loads more sections in.
    const scan = () => document.querySelectorAll("[data-chapter]").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
    return () => (io.disconnect(), mo.disconnect());
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex" aria-hidden="true">
        <span className="micro text-muted">00</span>
        <div className="relative h-40 w-px bg-line">
          <m.div style={{ scaleY: scrollYProgress }} className="absolute inset-0 origin-top bg-gold" />
        </div>
        <span className="micro tabular-nums text-gold">{current.no}</span>
        <span className="micro max-w-24 text-center leading-relaxed text-muted [writing-mode:vertical-rl]">{current.title}</span>
      </div>
    </LazyMotion>
  );
}
