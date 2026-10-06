import { useEffect, useRef, useState } from "react";
import { ChevronRight, Cpu, ShieldCheck, Activity } from "lucide-react";
import logo from "../assets/resonance-logo.webp";
import DevCredit from "./DevCredit";
import { launch } from "../lib/flight";
import { load } from "../lib/data";
import { prefersReducedMotion } from "../lib/theme";

const MIN_MS = 900; // long enough to register, short enough not to hold anyone up
const FONT_WAIT = 1200; // fonts swap in on their own; never let a slow one block the door

// Only what the first screen needs: type, the logo and the content. The 3D scene loads by itself, off this path.
const tasks = () => [
  Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, FONT_WAIT))]),
  load("events"),
  load("credits"),
  new Promise((r) => Object.assign(new Image(), { src: logo, onload: r, onerror: r })),
];

export default function Loader({ onDone }) {
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const enterRef = useRef();
  const barRef = useRef();
  const altRef = useRef();

  useEffect(() => {
    const html = document.documentElement;
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    html.style.overflow = "hidden";
    return () => (html.style.overflow = "");
  }, []);

  // Real progress, eased and capped by elapsed time so it never just blinks.
  // The bar and the readout are written straight to the DOM: no React render per frame.
  useEffect(() => {
    const list = tasks();
    const started = performance.now();
    let target = 0;
    let shown = 0;
    let done = 0;
    let last = started;
    let raf;
    list.forEach((p) => Promise.resolve(p).finally(() => (target = ++done / list.length)));

    const tick = (now) => {
      const goal = Math.min(target, (now - started) / MIN_MS);
      shown += (goal - shown) * Math.min(1, ((now - last) / 1000) * 7);
      last = now;
      if (goal >= 1 && shown > 0.995) shown = 1;
      barRef.current.style.transform = `scaleX(${shown})`;
      barRef.current.setAttribute("aria-valuenow", Math.round(shown * 100));
      altRef.current.textContent = Math.round(shown * 35786).toLocaleString("en-IN"); // geostationary orbit, in km
      if (shown === 1) return setReady(true);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (ready) enterRef.current?.focus({ preventScroll: true });
  }, [ready]);

  const enter = () => {
    launch();
    setLeaving(true);
    try {
      sessionStorage.setItem("launched", "1");
    } catch {}
    setTimeout(onDone, prefersReducedMotion() ? 0 : 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading Resonance ’26"
      className={`loader fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-5 text-ink transition-opacity duration-700 ${
        leaving ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <div className="hud-corner left-0 top-0 hidden border-l border-t sm:block">
        <p className="flex items-center gap-2 text-gold">
          <ShieldCheck className="size-3.5" /> Systems online
        </p>
        <p className="text-muted">Lat 13.0102° N | Lon 80.2354° E</p>
      </div>
      <div className="hud-corner right-0 top-0 hidden border-r border-t text-right sm:block">
        <p className="flex items-center justify-end gap-2 text-gold">
          <Cpu className="size-3.5" /> ECEA mission core v26
        </p>
        <p className="text-muted">Orbital approach module</p>
      </div>

      <div className={`relative grid aspect-square w-[min(78vw,46svh,420px)] place-items-center transition-transform duration-700 ease-in ${leaving ? "scale-[2.2]" : ""}`}>
        <div className="absolute inset-0 rounded-full border border-dashed border-gold/40 motion-safe:animate-[spin_40s_linear_infinite]" />
        <div className="absolute inset-[6%] rounded-full border border-line" />
        <div className="absolute inset-[18%] rounded-full border border-line/60" />
        <div className="absolute inset-x-[6%] top-1/2 h-px bg-line" />
        <div className="absolute inset-y-[6%] left-1/2 w-px bg-line" />
        <div className="radar absolute inset-[6%] rounded-full motion-safe:animate-[spin_3.2s_linear_infinite]" />

        <div className="relative flex flex-col items-center text-center">
          <span className="micro mb-4 rounded-full border border-line bg-surface-solid/80 px-3 py-1 text-gold">ECEA · CEG, Anna University</span>
          <img src={logo} alt="Resonance ’26" width="488" height="265" className="h-auto w-[min(54vw,240px)]" />
          <span className="mt-5 rounded-full border border-line bg-surface-solid/80 px-4 py-1.5 font-mono text-[13px] tabular-nums">
            <span className="text-muted">Altitude </span>
            <span ref={altRef}>0</span> km
          </span>
        </div>
      </div>

      <div className="mt-8 h-1 w-[min(78vw,420px)] overflow-hidden rounded-full bg-white/10">
        <div
          ref={barRef}
          className="h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--gold),var(--gold-hi),var(--cyan))]"
          style={{ transform: "scaleX(0)" }}
          role="progressbar"
          aria-label="Loading"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <button
        ref={enterRef}
        onClick={enter}
        disabled={!ready}
        className="cta-orbit group mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold/10 px-9 py-3.5 text-[13px] font-semibold tracking-[0.24em] text-gold-hi transition-colors duration-300 enabled:hover:bg-gold/20 enabled:hover:text-white disabled:text-gold/50"
      >
        {ready ? "ENTER ORBIT" : "CALIBRATING"}
        <ChevronRight className="size-4 transition group-enabled:group-hover:translate-x-0.5" />
      </button>

      <div className="mt-12 flex flex-col items-center gap-3 sm:mt-16">
        <p className="micro flex max-w-[19rem] items-center gap-2 text-balance text-center text-muted sm:max-w-none">
          <Activity className="hidden size-3.5 shrink-0 text-gold sm:block" />
          Electronics and Communication Engineers’ Association · CEG
        </p>
        <DevCredit compact />
      </div>
    </div>
  );
}
