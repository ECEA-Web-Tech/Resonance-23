import { useEffect, useRef, useState } from "react";
import { ChevronRight, Cpu, ShieldCheck, Activity } from "lucide-react";
import logo from "../assets/resonance-logo.png";
import DevCredit from "./DevCredit";
import { launch } from "../lib/flight";
import { load } from "../lib/data";
import { prefersReducedMotion } from "../lib/theme";

const MIN_MS = 1800; // long enough to read, short enough not to annoy

// Real work the page needs before it looks right: fonts, the WebGL chunk, the logo and the content.
const tasks = () => [
  document.fonts?.ready,
  import("./Starfield"),
  load("events"),
  load("credits"),
  new Promise((r) => Object.assign(new Image(), { src: logo, onload: r, onerror: r })),
];

export default function Loader({ onDone }) {
  const [target, setTarget] = useState(0);
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const enterRef = useRef();
  const started = useRef(performance.now());

  useEffect(() => {
    const html = document.documentElement;
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    html.style.overflow = "hidden";
    return () => (html.style.overflow = "");
  }, []);

  useEffect(() => {
    const list = tasks();
    let done = 0;
    list.forEach((p) => Promise.resolve(p).finally(() => setTarget(++done / list.length)));
  }, []);

  // Ease the displayed number toward real progress, capped by elapsed time so it never just blinks.
  useEffect(() => {
    let raf;
    let last = performance.now();
    const tick = (now) => {
      // Time-based easing, so slow first frames (shader compile, texture bakes) don't stall the counter.
      const k = Math.min(1, ((now - last) / 1000) * 5);
      last = now;
      const timeCap = Math.min(1, (performance.now() - started.current) / MIN_MS);
      setShown((s) => {
        const next = s + (Math.min(target, timeCap) - s) * k;
        return Math.abs(next - s) < 0.0005 ? Math.min(target, timeCap) : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const ready = shown >= 0.999;
  useEffect(() => {
    if (ready) enterRef.current?.focus();
  }, [ready]);

  const enter = () => {
    launch();
    setLeaving(true);
    try {
      sessionStorage.setItem("launched", "1");
    } catch {}
    setTimeout(onDone, prefersReducedMotion() ? 0 : 900);
  };

  const altitude = Math.round(shown * 35786).toLocaleString("en-IN"); // geostationary orbit, in km

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading Resonance ’26"
      className={`loader fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-bg/55 px-4 text-ink backdrop-blur-[2px] transition-opacity duration-700 ${
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

      <div className={`relative grid aspect-square w-[min(80vw,52svh,440px)] place-items-center transition-transform duration-[900ms] ease-in ${leaving ? "scale-[2.4]" : ""}`}>
        <div className="absolute inset-0 rounded-full border border-dashed border-gold/40 motion-safe:animate-[spin_40s_linear_infinite]" />
        <div className="absolute inset-[6%] rounded-full border border-line" />
        <div className="absolute inset-[18%] rounded-full border border-line/60" />
        <div className="absolute inset-x-[6%] top-1/2 h-px bg-line" />
        <div className="absolute inset-y-[6%] left-1/2 w-px bg-line" />
        <div className="radar absolute inset-[6%] rounded-full motion-safe:animate-[spin_3.2s_linear_infinite]" />
        <div className="absolute inset-[6%] rounded-full shadow-[inset_0_0_80px_rgb(0_0_0/0.5)]" />

        <div className="relative flex flex-col items-center text-center">
          <span className="mb-4 rounded-full border border-line bg-surface px-3 py-1 text-[11px] tracking-[0.18em] text-gold">
            ECEA · CEG, Anna University
          </span>
          <img src={logo} alt="Resonance ’26" className="w-[min(58vw,250px)] drop-shadow-[0_0_30px_rgb(217_180_90/0.35)]" />
          <span className="mt-5 rounded-full border border-line bg-surface px-4 py-1.5 font-mono text-sm tabular-nums">
            <span className="text-muted">Altitude </span>
            {altitude} km
          </span>
        </div>
      </div>

      <div className="mt-8 h-1.5 w-[min(84vw,440px)] overflow-hidden rounded-full border border-line bg-surface">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--gold),var(--gold-hi),#5ee6d6)]"
          style={{ width: `${shown * 100}%` }}
          role="progressbar"
          aria-valuenow={Math.round(shown * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <button
        ref={enterRef}
        onClick={enter}
        disabled={!ready}
        className="group mt-7 inline-flex items-center gap-2 rounded-full border border-gold/60 bg-gold/10 px-8 py-3.5 text-sm font-semibold tracking-[0.2em] text-gold shadow-[0_0_40px_-10px_var(--gold)] transition enabled:hover:bg-gold enabled:hover:text-on-gold disabled:opacity-40"
      >
        {ready ? "ENTER ORBIT" : "CALIBRATING"}
        <ChevronRight className="size-4 transition group-enabled:group-hover:translate-x-0.5" />
      </button>

      <DevCredit className="mt-10" />
      <p className="mt-6 flex items-center gap-2 px-4 text-center text-[11px] tracking-[0.16em] text-muted">
        <Activity className="size-3.5 shrink-0 text-gold" />
        Electronics and Communication Engineers’ Association · CEG
      </p>
    </div>
  );
}
