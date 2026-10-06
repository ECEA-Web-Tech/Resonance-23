import { useRef, useState } from "react";
import { Link } from "react-router";
import { domAnimation, LazyMotion, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { CATEGORIES } from "../data/events";
import Planet from "./Planet";
import Poster from "./Poster";
import { ChapterHead } from "./Chapter";
import { scrollToId } from "../lib/scroll";

const joinNames = (names) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0]);
const count = (n, one) => `${n} ${n === 1 ? one : `${one}s`}`;

// Event card. Phones: a compact row (poster thumb beside the details). From sm up: poster on top.
function DossierCard({ e, world }) {
  const facts = [
    ["Venue", e.venue || e.mode],
    ["Team", e.team],
    ["Entry fee", e.fee],
    ["Date", e.date],
  ].filter(([, v]) => v);

  return (
    <Link
      to={`/events/${e.id}`}
      preventScrollReset
      aria-label={`${e.name}: read more`}
      className="event-card group relative grid grid-cols-[7rem_minmax(0,1fr)] grid-rows-[auto_1fr] overflow-hidden rounded-2xl border border-line bg-[#090c1e] transition duration-300 active:scale-[0.985] sm:flex sm:flex-col sm:hover:-translate-y-1 sm:hover:border-gold/55 sm:hover:shadow-[0_26px_60px_-34px_rgb(217_180_90/0.55)] motion-reduce:transform-none"
    >
      {/* Category and code: beside the details on phones, a header strip above the poster from sm up */}
      <p className="col-start-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 px-4 pt-4 sm:order-first sm:px-4 sm:py-3">
        <span className="micro whitespace-nowrap rounded-full border border-gold/40 px-2 py-1 text-[10px] tracking-[0.14em] text-gold-hi sm:px-2.5 sm:tracking-[0.2em]">{world.label}</span>
        <span className="whitespace-nowrap font-mono text-[11px] tracking-wide text-gold">{e.code}</span>
      </p>
      <div className="relative row-span-2 row-start-1 sm:order-none">
        <Poster src={e.poster} alt={`${e.name} poster`} className="h-full min-h-44 sm:aspect-[4/5] sm:h-auto sm:min-h-0" />
      </div>

      <div className="col-start-2 flex min-w-0 flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5 sm:pt-4">
        <h4 className="mt-3 font-display text-[1.65rem] leading-[1.05] transition-colors duration-300 group-hover:text-gold-hi sm:mt-0 sm:text-[2rem]">{e.name}</h4>
        {e.tagline && <p className="mt-1.5 text-[13px] leading-snug text-gold sm:text-sm">{e.tagline}</p>}

        {!!facts.length && (
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-3 text-[13px] leading-snug sm:mt-4 sm:pt-4">
            {facts.map(([label, value]) => (
              <div key={label} className={label === "Venue" ? "col-span-2" : "max-sm:col-span-2"}>
                <dt className="micro text-[10px] text-muted">{label}</dt>
                <dd className="mt-0.5 text-ink/90">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[13px] font-semibold tracking-wide text-gold transition-colors group-hover:text-gold-hi sm:pt-5">
          Read More
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function World({ world, index, total, small }) {
  const pin = useRef();
  const reduce = useReducedMotion();
  const calm = reduce || small; // phones skip the wipe and the sideways drift: less to paint, nothing near the edges
  // Arrival: the panel opens from an inset window to full bleed (the chapter "wipe").
  const { scrollYProgress: arrive } = useScroll({ target: pin, offset: ["start end", "start start"] });
  // Pinned travel: the planet turns and drifts while the name holds.
  const { scrollYProgress: p } = useScroll({ target: pin, offset: ["start start", "end end"] });

  const clip = useTransform(arrive, (v) => {
    const k = (1 - v) * 14;
    return `inset(${k}% ${k}% 0% ${k}% round ${k * 2}px)`;
  });
  // The planet drifts up and grows while the panel is pinned (its spin is driven by scroll in the WebGL scene).
  const planetY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : small ? ["6%", "-6%"] : ["16%", "-16%"]);
  const planetScale = useTransform(p, [0, 1], [0.9, reduce ? 0.9 : small ? 1 : 1.15]);
  const planetOpacity = useTransform(arrive, [0.15, 0.75], [0, 1]);
  const nameX = useTransform(p, [0, 1], calm ? ["0%", "0%"] : ["4%", "-6%"]);

  const venues = [...new Set(world.events.map((e) => e.venue).filter(Boolean))];
  const flip = index % 2 === 1;
  const no = String(index + 1).padStart(2, "0");

  return (
    <section id={`world-${world.id}`} data-chapter={`02.${index + 1}`} data-title={world.label} className="scroll-mt-0">
      <div ref={pin} className="relative h-[120vh] md:h-[180vh]">
        <m.div style={calm ? undefined : { clipPath: clip }} className="sticky top-0 h-[100svh] overflow-hidden border-y border-line">
          {/* Phones: planet centred above the copy. Desktop: to one side, alternating. */}
          <m.div
            style={{ y: planetY, scale: planetScale }}
            className={`absolute left-1/2 top-[11%] aspect-square w-[min(82vw,46svh)] -translate-x-1/2 md:top-[14%] md:w-[min(72vw,600px)] md:translate-x-0 ${
              flip ? "md:left-[4%]" : "md:left-auto md:right-[4%]"
            }`}
          >
            <Planet variant={world.id} className="h-full w-full" opacity={planetOpacity} />
          </m.div>

          {/* Dark overlay between the planet and the text: from below on phones, from the text side on desktop */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020510] from-[16%] via-[#020510]/50 via-[46%] to-transparent md:from-[#020510]/90 md:from-0% md:via-[#020510]/55 md:via-50% md:to-transparent ${
              flip ? "md:bg-gradient-to-l" : "md:bg-gradient-to-r"
            }`}
            aria-hidden="true"
          />

          <div className="wrap relative flex h-full flex-col justify-end gap-5 pb-9 pt-24 md:justify-between md:gap-0 md:pb-10 md:pt-28">
            <div className={`micro flex flex-wrap items-center gap-3 max-md:mb-auto ${flip ? "md:justify-end md:text-right" : ""}`}>
              <span className="text-gold">World {no}</span>
              <span className="h-px w-8 bg-line" />
              <span className="text-ink/75">
                {no} / {String(total).padStart(2, "0")}
              </span>
            </div>

            <m.h3
              style={{ x: nameX }}
              className={`text-veil font-display text-[clamp(2.9rem,13.5vw,13rem)] leading-[0.9] tracking-[-0.02em] ${flip ? "md:text-right" : ""}`}
            >
              {world.label}
            </m.h3>

            <div className={`grid gap-5 md:items-end md:gap-6 ${flip ? "md:justify-items-end md:text-right" : "md:grid-cols-[1fr_auto]"}`}>
              <p className="max-w-md text-[15px] leading-7 text-ink/90">{joinNames(world.events.map((e) => e.name))}.</p>
              <dl className="micro flex flex-wrap gap-x-6 gap-y-2 text-ink/75">
                <div>
                  <dt className="sr-only">Code</dt>
                  <dd className="text-gold">RES-{world.code}</dd>
                </div>
                <div>
                  <dt className="sr-only">Events</dt>
                  <dd>{count(world.events.length, "event")}</dd>
                </div>
                {!!venues.length && (
                  <div>
                    <dt className="sr-only">Venues</dt>
                    <dd>{count(venues.length, "venue")}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </m.div>
      </div>

      <div className="veil wrap pb-20 pt-12 md:pb-24 md:pt-14">
        <p className="micro mb-6 flex items-center gap-3 text-ink/75">
          <span className="text-gold">{world.label}</span>
          <span className="h-px w-8 bg-line" aria-hidden="true" />
          {count(world.events.length, "event")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {world.events.map((e) => (
            <DossierCard key={e.id} e={e} world={world} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 02 — Event worlds: one world per category that actually has events.
export default function Worlds({ events }) {
  const [small] = useState(() => innerWidth < 768);
  const worlds = CATEGORIES.map((c) => ({ ...c, events: (events || []).filter((e) => e.category === c.id) })).filter(
    (w) => w.events.length
  );

  return (
    <LazyMotion features={domAnimation}>
      <div id="worlds" data-chapter="02" data-title="Event worlds" className="scroll-mt-20">
        <div className="veil wrap pb-14 pt-10 max-md:[--veil-t:0px] md:pb-16">
          <ChapterHead no="02" label="Event worlds" title="Each category is its own world. Travel through them.">
            <p>Scroll to move from one world to the next, then open a dossier for the full brief, contacts and registration.</p>
          </ChapterHead>

          {/* Phones: a jump list, in the same panel style as the brief figures above it. */}
          {!!worlds.length && (
            <nav aria-label="Event worlds" className="panel mt-8 md:hidden">
              <ul className="divide-y divide-line">
                {worlds.map((w, i) => (
                  <li key={w.id}>
                    <a
                      href={`#world-${w.id}`}
                      onClick={(ev) => (ev.preventDefault(), scrollToId(`world-${w.id}`, 0))}
                      className="flex min-h-[4.5rem] items-center gap-4 px-5 py-4 transition-colors active:bg-gold/10"
                    >
                      <span className="micro tabular-nums text-gold">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[1.7rem] leading-none">{w.label}</span>
                        <span className="micro mt-2 block text-[10px] text-muted">{count(w.events.length, "event")}</span>
                      </span>
                      <ArrowDown className="size-4 shrink-0 text-gold" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
        {!events && <div className="wrap"><div className="h-[60vh] animate-pulse rounded-2xl border border-line bg-surface-solid/60" aria-busy="true" /></div>}
        {worlds.map((w, i) => (
          <World key={w.id} world={w} index={i} total={worlds.length} small={small} />
        ))}
      </div>
    </LazyMotion>
  );
}
