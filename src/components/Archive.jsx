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

      <div className="mt-12 flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
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

      <p className="micro mt-4 text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      {/* Desktop: comparative ledger */}
      <table className="mt-4 hidden w-full border-collapse text-left text-sm md:table">
        <thead>
          <tr className="micro border-b border-line text-muted">
            <th className="py-3 pr-4 font-normal">ID</th>
            <th className="py-3 pr-4 font-normal">Event</th>
            <th className="py-3 pr-4 font-normal">World</th>
            {COLUMNS.map(([k, l]) => (
              <th key={k} className="py-3 pr-4 font-normal">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((e) => (
            <tr key={e.id} className="group relative border-b border-line/70 transition hover:bg-gold/5">
              <td className="py-4 pr-4 font-mono text-xs text-gold">{e.code}</td>
              <td className="py-4 pr-4">
                <Link to={`/events/${e.id}`} preventScrollReset className="font-display text-xl after:absolute after:inset-0 group-hover:text-gold">
                  {e.name}
                </Link>
              </td>
              <td className="py-4 pr-4 text-muted">{label(e.category)}</td>
              {COLUMNS.map(([k]) => (
                <td key={k} className="py-4 pr-4 text-ink/85">
                  {(k === "venue" ? where(e) : e[k]) || <span className="text-muted/60">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked records, no sideways scrolling */}
      <ul className="mt-4 divide-y divide-line border-y border-line md:hidden">
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
        <p className="mt-8 text-muted">
          Nothing matches “{query}”.{" "}
          <button onClick={() => (setQuery(""), setWorld("all"))} className="text-gold underline underline-offset-4">
            Clear search
          </button>
        </p>
      )}
    </section>
  );
}
