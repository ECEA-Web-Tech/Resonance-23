import { useRef, useState } from "react";
import { Link } from "react-router";
import { domAnimation, LazyMotion, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { CATEGORIES } from "../data/events";
import Planet from "./Planet";
import Picture from "./Picture";
import { CARD_SIZES } from "../lib/media";
import { ChapterHead } from "./Chapter";
import { scrollToId } from "../lib/scroll";

const joinNames = (names) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0]);
const count = (n, one) => `${n} ${n === 1 ? one : `${one}s`}`;

// Event card, the same at every screen size: category and code, the poster, then the details.
// One column of cards on phones, two from sm, three from lg.
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
      className="event-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[#090c1e] transition duration-300 active:scale-[0.99] sm:hover:-translate-y-1 sm:hover:border-gold/55 sm:hover:shadow-[0_26px_60px_-34px_rgb(217_180_90/0.55)] motion-reduce:transform-none"
    >
      <p className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="micro whitespace-nowrap rounded-full border border-gold/40 px-2.5 py-1 text-[10px] tracking-[0.16em] text-gold-hi">{world.label}</span>
        <span className="code whitespace-nowrap text-xs text-gold">{e.code}</span>
      </p>
      <Picture
        src={e.poster}
        alt={`${e.name} poster`}
        fit="contain"
        remote={[400, 800]}
        sizes={CARD_SIZES}
        className="aspect-square w-full"
        imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
        fallback={<div className="micro grid aspect-square w-full place-items-center bg-surface-solid p-4 text-center text-muted">{e.name}</div>}
      />

      <div className="flex min-w-0 flex-1 flex-col px-4 pb-5 pt-4 sm:px-5">
        <h4 className="font-display text-[1.5rem] leading-[1.12] transition-colors duration-300 group-hover:text-gold-hi sm:text-[1.6rem]">{e.name}</h4>
        {e.tagline && <p className="mt-1.5 text-sm leading-snug text-gold">{e.tagline}</p>}

        {!!facts.length && (
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 text-sm leading-snug">
            {facts.map(([label, value]) => (
              <div key={label} className={label === "Venue" && facts.length % 2 ? "col-span-2" : ""}>
                <dt className="micro text-[10px] text-muted">{label}</dt>
                <dd className="mt-1 text-ink/90">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold tracking-wide text-gold transition-colors group-hover:text-gold-hi">
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
  // Right-aligned names (every second world) drift the other way, so neither ever leans on the screen edge.
  const nameX = useTransform(p, [0, 1], calm ? ["0%", "0%"] : index % 2 ? ["-5%", "1%"] : ["4%", "-6%"]);

  const venues = [...new Set(world.events.map((e) => e.venue).filter(Boolean))];
  const flip = index % 2 === 1;
  const no = String(index + 1).padStart(2, "0");

  return (
    <section id={`world-${world.id}`} data-chapter={`02.${index + 1}`} data-title={world.label} className="scroll-mt-0">
      <div ref={pin} className="relative h-[125vh] md:h-[180vh]">
        {/* The panel covers the tallest viewport the browser can show (address bar hidden), so its edge and its
            overlay never show as a band while the bar slides away; the copy stays inside the smallest one. */}
        <m.div style={calm ? undefined : { clipPath: clip }} className="h-tall sticky top-0 overflow-hidden md:border-y md:border-line">
          {/* Phones: planet centred above the copy. Desktop: to one side, alternating. */}
          <m.div
            style={{ y: planetY, scale: planetScale }}
            className={`absolute left-1/2 top-[11svh] aspect-square w-[min(82vw,46svh)] -translate-x-1/2 md:top-[14svh] md:w-[min(72vw,600px)] md:translate-x-0 ${
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

          <div className="wrap h-short relative flex flex-col justify-end gap-5 pb-9 pt-24 md:justify-between md:gap-0 md:pb-10 md:pt-28">
            <div className={`micro flex flex-wrap items-center gap-3 max-md:mb-auto ${flip ? "md:justify-end md:text-right" : ""}`}>
              <span className="text-gold">World {no}</span>
              <span className="h-px w-8 bg-line" />
              <span className="text-ink/75">
                {no} / {String(total).padStart(2, "0")}
              </span>
            </div>

            <m.h3
              style={{ x: nameX }}
              className={`text-veil text-[clamp(2.5rem,11.4vw,9.75rem)] font-bold leading-[0.95] tracking-[-0.045em] ${flip ? "md:text-right" : ""}`}
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

      {/* The cards pick up exactly where the panel's dark foot ends: no bright seam between the two. */}
      <div className="veil wrap pb-20 pt-12 [--veil-t:0px] md:pb-24 md:pt-14">
        <span className="pointer-events-none absolute left-1/2 top-0 -z-10 h-40 w-screen -translate-x-1/2 bg-gradient-to-b from-[#020510] to-transparent md:hidden" aria-hidden="true" />
        <p className="micro mb-6 flex items-center gap-3 text-ink/75">
          <span className="text-gold">{world.label}</span>
          <span className="h-px w-8 bg-line" aria-hidden="true" />
          {count(world.events.length, "event")}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                        <span className="block font-display text-[1.45rem] leading-none">{w.label}</span>
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
