import { useEffect, useRef, useState } from "react";
import { domAnimation, LazyMotion, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import logo from "../assets/resonance-logo.png";
import Planet from "./Planet";
import { scrollToId } from "../lib/scroll";

const RINGS = [
  { size: "100%", dur: "90s", moon: true },
  { size: "76%", dur: "60s", reverse: true },
  { size: "54%", dur: "40s", moon: true },
];

function useClock() {
  const fmt = () => new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" });
  const [now, setNow] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// 00 — Orbit. The section is 220vh tall with a pinned viewport; scroll scrubs the descent.
export default function Hero({ launched }) {
  const ref = useRef();
  const reduce = useReducedMotion();
  const clock = useClock();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const brandOpacity = useTransform(p, [0, 0.4], [1, 0]);
  const brandY = useTransform(p, [0, 0.4], [0, -140]);
  const brandScale = useTransform(p, [0, 0.4], [1, 1.08]);
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);
  const planetY = useTransform(p, [0, 1], ["66vh", reduce ? "66vh" : "22vh"]);
  const planetScale = useTransform(p, [0, 1], [0.8, reduce ? 0.8 : 1.7]);

  const enter = (delay, from = {}) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, ...from },
          animate: launched ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : undefined,
          transition: { duration: 1.4, delay, ease: [0.2, 0.7, 0.1, 1] },
        };

  return (
    <LazyMotion features={domAnimation}>
      <section id="top" ref={ref} data-chapter="00" data-title="Orbit" className="relative h-[220vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <m.div style={{ y: planetY, scale: planetScale }} className="absolute left-[6vw] right-[6vw] top-0 mx-auto max-w-[760px]">
            <Planet variant="earth" />
          </m.div>

          <m.div
            style={{ opacity: brandOpacity, y: brandY, scale: brandScale }}
            className="relative flex h-full flex-col items-center justify-center px-4 pb-24 pt-24 text-center"
          >
            <m.p {...enter(0.2, { y: 12 })} className="micro text-gold">
              ECEA presents
            </m.p>
            <div className="relative my-4 grid aspect-[5/3] w-[min(94vw,640px)] place-items-center [perspective:1200px]">
              {RINGS.map((r, i) => (
                <m.div
                  key={i}
                  {...enter(0.5 + i * 0.15, { scale: 0.6 })}
                  className="absolute inset-0 grid place-items-center [transform-style:preserve-3d]"
                >
                  <div className="orbit" style={{ width: r.size }}>
                    <div className="orbit-spin" style={{ "--dur": r.dur, animationDirection: r.reverse ? "reverse" : undefined }}>
                      {r.moon && <span className="moon" />}
                    </div>
                  </div>
                </m.div>
              ))}
              <div className="orbit pulse-ring" style={{ width: "60%", borderColor: "var(--gold)" }} aria-hidden="true" />
              <m.img
                {...enter(0.3, { scale: 0.92, filter: "blur(12px)" })}
                src={logo}
                alt="Resonance ’26"
                width="488"
                height="265"
                className="relative w-[78%] drop-shadow-[0_0_40px_rgb(217_180_90/0.3)]"
              />
            </div>
            <m.p {...enter(1.1, { y: 12 })} className="max-w-lg text-balance text-base leading-relaxed text-muted sm:text-lg">
              Technical and non-technical events and a workshop, from the Electronics and Communication Engineers’
              Association, CEG.
            </m.p>
          </m.div>

          <m.a
            href="#brief"
            onClick={(e) => (e.preventDefault(), scrollToId("brief"))}
            style={{ opacity: cueOpacity }}
            className="micro absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 whitespace-nowrap text-ink/80 transition hover:text-gold"
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
            <p className="tabular-nums text-ink/80">{clock} IST</p>
          </div>

        </div>
      </section>
    </LazyMotion>
  );
}
