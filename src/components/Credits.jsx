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
// President through Deputy Treasurer share one "Office bearers" group with larger portraits.
const LEADS = new Set(ROLE_ORDER.slice(0, 5));

function Portrait({ p, large }) {
  const [failed, setFailed] = useState(false);
  const initials = p.name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <figure className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] border border-line bg-surface">
        {p.photo && !failed ? (
          <img
            src={driveImg(p.photo, large ? 500 : 360)}
            alt={p.name}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="size-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center font-display text-4xl text-gold">{initials}</div>
        )}
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-2">
        <span className="min-w-0">
          <span className={`block leading-snug ${large ? "font-display text-xl sm:text-2xl" : "text-sm font-medium"}`}>{p.name}</span>
          {large && <span className="mt-0.5 block text-sm text-gold">{p.role}</span>}
        </span>
        {p.linkedin && (
          <a
            href={p.linkedin}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 shrink-0 text-muted transition hover:text-gold"
            aria-label={`${p.name} on LinkedIn`}
          >
            <Brand name="LinkedIn" className="size-[18px]" />
          </a>
        )}
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
    ...[...ROLE_ORDER.filter((r) => !LEADS.has(r)), ...extra].map((role) => ({ role, list: list.filter((p) => p.role === role) })),
  ].filter((g) => g.list.length);

  return (
    <section id="team" data-chapter={no} data-title="Mission control" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-28 sm:py-36">
      <ChapterHead no={no} label="Mission control" title="The Resonance crew.">
        <p>The office bearers and secretaries of ECEA behind Resonance ’26.</p>
      </ChapterHead>

      {!people && <div className="mt-12 h-80 animate-pulse rounded-[22px] border border-line bg-surface" aria-busy="true" />}

      <div className="mt-14 space-y-16">
        {groups.map(({ role, list, large }) => {
          return (
            <div key={role}>
              <h3 className="micro mb-6 flex items-center justify-between border-b border-line pb-3 text-gold">
                <span>{list.length > 1 ? PLURAL[role] || role : role}</span>
                <span className="text-muted">{String(list.length).padStart(2, "0")}</span>
              </h3>
              <div
                className={`grid gap-x-5 gap-y-8 ${
                  large ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"
                }`}
              >
                {list.map((p) => (
                  <Portrait key={p.id} p={p} large={large} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
