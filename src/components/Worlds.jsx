import { useRef } from "react";
import { Link } from "react-router";
import { domAnimation, LazyMotion, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { CATEGORIES } from "../data/events";
import Planet from "./Planet";
import Poster from "./Poster";
import { ChapterHead } from "./Chapter";

const joinNames = (names) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0]);

function DossierCard({ e }) {
  return (
    <Link
      to={`/events/${e.id}`}
      preventScrollReset
      className="group flex flex-col border border-line bg-surface p-2.5 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-gold/60"
    >
      <div className="micro flex items-center justify-between px-1.5 pb-2.5 pt-1 text-muted">
        <span className="text-gold">{e.code}</span>
        {e.mode && <span>{e.mode}</span>}
      </div>
      <Poster src={e.poster} alt={`${e.name} poster`} className="aspect-[4/5]" />
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-4">
        <h4 className="font-display text-[1.75rem] leading-tight">{e.name}</h4>
        {e.tagline && <p className="mt-0.5 text-sm text-gold">{e.tagline}</p>}
        <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-[13px]">
          {e.venue && (
            <div className="col-span-2">
              <dt className="micro text-muted">Venue</dt>
              <dd className="mt-0.5">{e.venue}</dd>
            </div>
          )}
          {e.team && (
            <div>
              <dt className="micro text-muted">Team</dt>
              <dd className="mt-0.5">{e.team}</dd>
            </div>
          )}
          {e.fee && (
            <div>
              <dt className="micro text-muted">Fee</dt>
              <dd className="mt-0.5">{e.fee}</dd>
            </div>
          )}
        </dl>
      </div>
    </Link>
  );
}

function World({ world, index, total }) {
  const pin = useRef();
  const reduce = useReducedMotion();
  // Arrival: the panel opens from an inset window to full bleed (the chapter "wipe").
  const { scrollYProgress: arrive } = useScroll({ target: pin, offset: ["start end", "start start"] });
  // Pinned travel: the planet turns and drifts while the name holds.
  const { scrollYProgress: p } = useScroll({ target: pin, offset: ["start start", "end end"] });

  const clip = useTransform(arrive, (v) => {
    const k = reduce ? 0 : (1 - v) * 14;
    return `inset(${k}% ${k}% 0% ${k}% round ${k * 2}px)`;
  });
  const planetY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["18%", "-14%"]);
  const planetRotate = useTransform(p, [0, 1], [0, reduce ? 0 : 28]);
  const planetScale = useTransform(p, [0, 1], [0.92, reduce ? 0.92 : 1.12]);
  const nameX = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["4%", "-6%"]);

  const venues = [...new Set(world.events.map((e) => e.venue).filter(Boolean))];
  const flip = index % 2 === 1;

  return (
    <section id={`world-${world.id}`} data-chapter={`02.${index + 1}`} data-title={world.label} className="scroll-mt-0">
      <div ref={pin} className="relative h-[180vh]">
        <m.div style={{ clipPath: clip }} className="sticky top-0 h-[100svh] overflow-hidden border-y border-line bg-bg/40">
          <m.div
            style={{ y: planetY, rotate: planetRotate, scale: planetScale }}
            className={`absolute top-[12%] w-[min(78vw,640px)] ${flip ? "-left-[8%] sm:left-[4%]" : "-right-[8%] sm:right-[4%]"}`}
          >
            <Planet variant={world.id} />
          </m.div>

          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-4 pb-10 pt-28">
            <div className={`micro flex flex-wrap items-center gap-3 ${flip ? "justify-end text-right" : ""}`}>
              <span className="text-gold">World {String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-line" />
              <span className="text-muted">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>

            <m.h3
              style={{ x: nameX }}
              className={`font-display text-[clamp(3.6rem,15vw,13rem)] leading-[0.85] tracking-tight [text-shadow:0_6px_40px_rgb(0_0_0/0.45)] ${
                flip ? "text-right" : ""
              }`}
            >
              {world.label}
            </m.h3>

            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-md text-[15px] leading-7 text-ink/85">{joinNames(world.events.map((e) => e.name))}.</p>
              <dl className="micro flex flex-wrap gap-x-6 gap-y-2 text-muted">
                <div>
                  <dt className="sr-only">Code</dt>
                  <dd className="text-gold">RES-{world.code}</dd>
                </div>
                <div>
                  <dt className="sr-only">Events</dt>
                  <dd>
                    {world.events.length} {world.events.length === 1 ? "event" : "events"}
                  </dd>
                </div>
                {!!venues.length && (
                  <div>
                    <dt className="sr-only">Venues</dt>
                    <dd>
                      {venues.length} {venues.length === 1 ? "venue" : "venues"}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </m.div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14">
        <p className="micro mb-6 text-muted">
          <span className="text-gold">{world.label}</span> — dossiers
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {world.events.map((e) => (
            <DossierCard key={e.id} e={e} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 02 — Event worlds: one world per category that actually has events.
export default function Worlds({ events }) {
  const worlds = CATEGORIES.map((c) => ({ ...c, events: (events || []).filter((e) => e.category === c.id) })).filter(
    (w) => w.events.length
  );

  return (
    <LazyMotion features={domAnimation}>
      <div id="worlds" data-chapter="02" data-title="Event worlds" className="scroll-mt-0">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
          <ChapterHead no="02" label="Event worlds" title="Each category is its own world. Travel through them.">
            <p>Scroll to move from one world to the next, then open a dossier for the full brief, contacts and registration.</p>
          </ChapterHead>
        </div>
        {!events && <div className="mx-auto h-[60vh] max-w-6xl animate-pulse border border-line bg-surface" aria-busy="true" />}
        {worlds.map((w, i) => (
          <World key={w.id} world={w} index={i} total={worlds.length} />
        ))}
      </div>
    </LazyMotion>
  );
}
