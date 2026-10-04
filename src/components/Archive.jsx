import { useDeferredValue, useState } from "react";
import { Link } from "react-router";
import { ToggleGroup } from "radix-ui";
import { Search } from "lucide-react";
import { CATEGORIES } from "../data/events";
import { ChapterHead } from "./Chapter";

const COLUMNS = [
  ["venue", "Venue"],
  ["team", "Team"],
  ["fee", "Entry fee"],
  ["date", "Date"],
];

const label = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

// 03 — Event archive: search + world filter over every event, as a ledger.
export default function Archive({ events }) {
  const [query, setQuery] = useState("");
  const [world, setWorld] = useState("all");
  const q = useDeferredValue(query.trim().toLowerCase());

  const list = events || [];
  const worlds = CATEGORIES.filter((c) => list.some((e) => e.category === c.id));
  const results = list.filter(
    (e) =>
      (world === "all" || e.category === world) &&
      (!q || [e.name, e.code, e.tagline, e.venue, e.mode, label(e.category), ...(e.pocs || []).map((p) => p.name)].some((v) => v?.toLowerCase().includes(q)))
  );
  const where = (e) => e.venue || e.mode;

  return (
    <section id="archive" data-chapter="03" data-title="Event archive" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-28 sm:py-36">
      <ChapterHead no="03" label="Event archive" title="Every event, one ledger.">
        <p>Search by event, venue or coordinator, or filter by world. Select a row to open its dossier.</p>
      </ChapterHead>

      {/* Background panel wrapping search + table */}
      <div
        className="mt-12 overflow-hidden rounded-2xl border border-line"
        style={{
          background: "linear-gradient(135deg, rgba(13,17,36,0.94) 0%, rgba(8,10,28,0.97) 100%)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(217,180,90,0.10)",
        }}
      >
      {/* Search + filter bar */}
      <div className="flex flex-col gap-4 border-b border-line px-6 py-4 md:flex-row md:items-center md:justify-between">
        <label className="flex items-center gap-3 md:w-80">
          <Search className="size-4 shrink-0 text-gold" strokeWidth={1.8} />
          <span className="sr-only">Search events</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the archive"
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted"
          />
        </label>
        <ToggleGroup.Root
          type="single"
          value={world}
          onValueChange={(v) => v && setWorld(v)}
          aria-label="Filter by world"
          className="flex flex-wrap gap-1"
        >
          {[{ id: "all", label: "All" }, ...worlds].map((w) => (
            <ToggleGroup.Item
              key={w.id}
              value={w.id}
              className="micro rounded-full border border-transparent px-3.5 py-2 text-muted transition hover:text-ink data-[state=on]:border-gold/60 data-[state=on]:text-gold"
            >
              {w.label}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <p className="micro px-6 pt-4 pb-2 text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      {/* Desktop: comparative ledger */}
      <table className="mt-0 hidden w-full border-collapse text-left text-sm md:table">
        <thead>
          <tr
            className="micro text-muted"
            style={{ background: "rgba(217,180,90,0.07)", borderBottom: "1px solid rgba(217,180,90,0.18)" }}
          >
            <th className="px-6 py-3 font-normal">ID</th>
            <th className="py-3 pr-4 font-normal">Event</th>
            <th className="py-3 pr-4 font-normal">World</th>
            {COLUMNS.map(([k, l]) => (
              <th key={k} className="py-3 pr-6 font-normal">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((e, i) => (
            <tr
              key={e.id}
              className="group relative border-b border-line/40 transition-colors hover:bg-gold/[0.06]"
              style={i % 2 === 0 ? { background: "rgba(255,255,255,0.015)" } : {}}
            >
              <td className="py-4 pl-6 pr-4 font-mono text-xs text-gold">{e.code}</td>
              <td className="py-4 pr-4">
                <Link to={`/events/${e.id}`} preventScrollReset className="font-display text-xl after:absolute after:inset-0 group-hover:text-gold">
                  {e.name}
                </Link>
              </td>
              <td className="py-4 pr-4 text-muted">{label(e.category)}</td>
              {COLUMNS.map(([k]) => (
                <td key={k} className="py-4 pr-6 text-white/85">
                  {(k === "venue" ? where(e) : e[k]) || <span className="text-muted/50">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked records */}
      <ul className="divide-y divide-line border-t border-line px-4 md:hidden">
        {results.map((e) => (
          <li key={e.id}>
            <Link to={`/events/${e.id}`} preventScrollReset className="block py-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-2xl">{e.name}</span>
                <span className="font-mono text-xs text-gold">{e.code}</span>
              </div>
              <p className="micro mt-1 text-muted">{label(e.category)}</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                {COLUMNS.filter(([k]) => (k === "venue" ? where(e) : e[k])).map(([k, l]) => (
                  <div key={k} className={k === "venue" ? "col-span-2" : ""}>
                    <dt className="micro text-muted">{l}</dt>
                    <dd className="mt-0.5">{k === "venue" ? where(e) : e[k]}</dd>
                  </div>
                ))}
              </dl>
            </Link>
          </li>
        ))}
      </ul>

      {!results.length && events && (
        <p className="px-6 pb-6 pt-4 text-muted">
          Nothing matches "{query}".{" "}
          <button onClick={() => (setQuery(""), setWorld("all"))} className="text-gold underline underline-offset-4">
            Clear search
          </button>
        </p>
      )}
      </div>{/* end background panel */}
    </section>
  );
}
