import { useEffect, useRef, useState } from "react";
import { domAnimation, LazyMotion, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import logo from "../assets/resonance-logo.webp";
import Planet from "./Planet";
import { useOffscreenPause } from "../lib/inview";
import { scrollToId } from "../lib/scroll";

const RINGS = [
  { size: "100%", dur: "90s", moon: true },
  { size: "76%", dur: "60s", reverse: true },
  { size: "54%", dur: "40s", moon: true },
];

// Its own component, so the once-a-second tick re-renders one text node and not the hero.
function Clock() {
  const fmt = () => new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" });
  const [now, setNow] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => !document.hidden && setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <>{now}</>;
}

// 00 — Orbit. A tall section with a pinned viewport; scroll scrubs the descent.
export default function Hero({ launched }) {
  const ref = useRef();
  const pinned = useOffscreenPause();
  const reduce = useReducedMotion();
  const [small] = useState(() => innerWidth < 768);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const brandOpacity = useTransform(p, [0, 0.4], [1, 0]);
  const brandY = useTransform(p, [0, 0.4], [0, small ? -80 : -140]);
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);
  const planetY = useTransform(p, [0, 1], ["72vh", reduce ? "72vh" : small ? "30vh" : "22vh"]);
  const planetScale = useTransform(p, [0, 1], [0.8, reduce ? 0.8 : small ? 1.3 : 1.7]);

  const enter = (delay, from = {}) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, ...from },
          animate: launched ? { opacity: 1, y: 0, scale: 1 } : undefined,
          transition: { duration: 1.2, delay, ease: [0.2, 0.7, 0.1, 1] },
        };

  return (
    <LazyMotion features={domAnimation}>
      <section id="top" ref={ref} data-chapter="00" data-title="Orbit" className="relative h-[165vh] md:h-[220vh]">
        <div ref={pinned} className="sticky top-0 h-[100svh] overflow-hidden">
          <m.div style={{ y: planetY, scale: planetScale }} className="absolute left-[6vw] right-[6vw] top-0 mx-auto max-w-[760px] will-change-transform">
            <Planet variant="earth" />
          </m.div>

          <m.div
            style={{ opacity: brandOpacity, y: brandY }}
            className="hero-brand relative flex h-full flex-col items-center justify-center px-5 pb-28 pt-24 text-center"
          >
            <m.p {...enter(0.1, { y: 12 })} className="micro text-gold">
              ECEA presents
            </m.p>
            <h1 className="flex flex-col items-center">
              <span className="relative my-3 grid aspect-[5/3] w-[min(88vw,58svh,620px)] place-items-center [perspective:1200px]">
                {RINGS.map((r, i) => (
                  <m.span
                    key={i}
                    {...enter(0.35 + i * 0.12, { scale: 0.6 })}
                    className="absolute inset-0 grid place-items-center [transform-style:preserve-3d]"
                    aria-hidden="true"
                  >
                    <span className="orbit" style={{ width: r.size }}>
                      <span className="orbit-spin" style={{ "--dur": r.dur, animationDirection: r.reverse ? "reverse" : undefined }}>
                        {r.moon && <span className="moon" />}
                      </span>
                    </span>
                  </m.span>
                ))}
                <span className="orbit pulse-ring" style={{ width: "60%", borderColor: "var(--gold)" }} aria-hidden="true" />
                <m.img
                  {...enter(0.2, { scale: 0.94 })}
                  src={logo}
                  alt="Resonance ’26"
                  width="488"
                  height="265"
                  fetchPriority="high"
                  decoding="async"
                  className="relative h-auto w-[78%]"
                />
              </span>
              <m.span {...enter(0.7, { y: 12 })} className="flex items-center gap-4">
                <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-gold/70 sm:block" aria-hidden="true" />
                <span className="gold-text text-[clamp(1.45rem,4.2vw,2.4rem)] font-medium leading-tight tracking-[-0.015em]">Intercollege Symposium</span>
                <span className="hidden h-px w-10 bg-gradient-to-l from-transparent to-gold/70 sm:block" aria-hidden="true" />
              </m.span>
            </h1>
            <m.p {...enter(0.9, { y: 12 })} className="text-veil mt-4 max-w-[34rem] text-balance text-[15px] leading-relaxed text-ink/85 sm:mt-5 sm:text-[17px]">
              Technical and non-technical events and a workshop, from the Electronics and Communication Engineers’
              Association, CEG.
            </m.p>
          </m.div>

          <m.a
            href="#brief"
            onClick={(e) => (e.preventDefault(), scrollToId("brief"))}
            style={{ opacity: cueOpacity }}
            className="micro text-veil absolute bottom-7 left-1/2 flex min-h-11 -translate-x-1/2 flex-col items-center justify-end gap-2 whitespace-nowrap text-ink/85 transition hover:text-gold"
          >
            Scroll to descend
            <ChevronDown className="size-4 motion-safe:animate-[nudge_2s_ease-in-out_infinite]" />
          </m.a>

          <div className="micro pointer-events-none absolute bottom-8 left-6 hidden space-y-1.5 text-muted lg:block">
            <p>ECEA / CEG, Anna University</p>
            <p>13.0102° N · 80.2354° E</p>
          </div>
          <div className="micro pointer-events-none absolute bottom-8 right-6 hidden space-y-1.5 text-right text-muted lg:block">
            <p>Chennai</p>
            <p className="tabular-nums text-ink/80">
              <Clock /> IST
            </p>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
