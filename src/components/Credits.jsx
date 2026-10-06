import { useState } from "react";
import { ROLE_ORDER } from "../data/credits";
import { driveImg } from "../lib/drive";
import Brand from "./Brand";
import { ChapterHead } from "./Chapter";

const PLURAL = {
  "Vice President": "Vice Presidents",
  "General Secretary": "General Secretaries",
  "General Secretary (PG)": "General Secretaries (PG)",
  "Organizing Secretary": "Organizing Secretaries",
  "Joint Secretary": "Joint Secretaries",
};
// President through Deputy Treasurer share one "Office bearers" group, in order of office.
const LEADS = new Set(ROLE_ORDER.slice(0, 5));
// Every other group is listed alphabetically by name.
const byName = (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });

// One card for everyone: fixed 3:4 portrait, two-line name slot and a role line, so every card in a row
// has the same dimensions whatever the name length.
function Portrait({ p, large }) {
  const [failed, setFailed] = useState(false);
  const initials = p.name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <figure className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[#090c1e] transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_22px_50px_-30px_rgb(217_180_90/0.5)] motion-reduce:transform-none">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-solid">
        {p.photo && !failed ? (
          <img
            src={driveImg(p.photo, 400)}
            srcSet={`${driveImg(p.photo, 240)} 240w, ${driveImg(p.photo, 400)} 400w, ${driveImg(p.photo, 640)} 640w`}
            sizes={large ? "(min-width: 1024px) 210px, (min-width: 640px) 30vw, 45vw" : "(min-width: 1024px) 172px, (min-width: 640px) 23vw, 45vw"}
            alt={`${p.name}, ${p.role}, ECEA`}
            width="300"
            height="400"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="size-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid size-full place-items-center font-display text-4xl text-gold">{initials}</div>
        )}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090c1e] via-[#090c1e]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
        {p.linkedin && (
          <a
            href={p.linkedin}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-2 right-2 grid size-10 place-items-center rounded-full border border-line bg-[#090c1e]/85 text-ink/85 transition hover:border-gold hover:text-gold"
            aria-label={`${p.name} on LinkedIn`}
          >
            <Brand name="LinkedIn" className="size-[18px]" />
          </a>
        )}
      </div>
      {/* Fixed-height caption: room for a two-line name and a two-line role, so cards never differ in size. */}
      <figcaption className={`px-3.5 pb-3 pt-3 [overflow-wrap:anywhere] ${large ? "min-h-[6.5rem] sm:min-h-[7rem]" : "min-h-[5.5rem]"}`}>
        <span className={`line-clamp-2 ${large ? "font-display text-[1.3rem] leading-[1.12] sm:text-2xl" : "text-[13.5px] font-semibold leading-[1.25] sm:text-sm"}`}>{p.name}</span>
        <span className="micro mt-1.5 line-clamp-2 text-[10px] leading-snug tracking-[0.14em] text-gold/85">{p.role}</span>
      </figcaption>
    </figure>
  );
}

export default function Credits({ people, no }) {
  if (people && !people.length) return null;
  const list = people || [];
  const rank = (p) => (ROLE_ORDER.includes(p.role) ? ROLE_ORDER.indexOf(p.role) : ROLE_ORDER.length);
  const extra = [...new Set(list.map((p) => p.role).filter((r) => !ROLE_ORDER.includes(r)))];
  const groups = [
    { role: "Office bearers", large: true, list: list.filter((p) => LEADS.has(p.role)).sort((a, b) => rank(a) - rank(b)) },
    ...[...ROLE_ORDER.filter((r) => !LEADS.has(r)), ...extra].map((role) => ({ role, list: list.filter((p) => p.role === role).sort(byName) })),
  ].filter((g) => g.list.length);

  return (
    <section id="team" data-chapter={no} data-title="Mission control" className="veil wrap scroll-mt-24 py-24 md:py-36">
      <ChapterHead no={no} label="Mission control" title="The Resonance crew.">
        <p>The office bearers and secretaries of ECEA behind Resonance ’26.</p>
      </ChapterHead>

      {!people && <div className="mt-12 h-80 animate-pulse rounded-2xl border border-line bg-surface-solid/60" aria-busy="true" />}

      <div className="mt-12 space-y-14 md:mt-14 md:space-y-16">
        {groups.map(({ role, list, large }) => (
          <div key={role}>
            <h3 className="micro mb-6 flex items-center justify-between border-b border-line pb-3 text-gold">
              <span>{list.length > 1 ? PLURAL[role] || role : role}</span>
              <span className="text-ink/70">{String(list.length).padStart(2, "0")}</span>
            </h3>
            <ul
              className={`grid gap-3.5 sm:gap-5 ${
                large ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
              }`}
            >
              {list.map((p) => (
                <li key={p.id}>
                  <Portrait p={p} large={large} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
