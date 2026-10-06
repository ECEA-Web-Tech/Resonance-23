import { useDeferredValue, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ToggleGroup } from "radix-ui";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { CATEGORIES } from "../data/events";
import { ChapterHead } from "./Chapter";

const COLUMNS = [
  ["venue", "Venue"],
  ["team", "Team"],
  ["fee", "Entry fee"],
  ["date", "Date"],
];

const label = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

// 03 — Event archive: search + world filter over every event, as one table at every screen size.
// On small screens the table keeps its columns and scrolls sideways inside its panel.
export default function Archive({ events }) {
  const [query, setQuery] = useState("");
  const [world, setWorld] = useState("all");
  const q = useDeferredValue(query.trim().toLowerCase());
  const navigate = useNavigate();

  const list = events || [];
  const worlds = CATEGORIES.filter((c) => list.some((e) => e.category === c.id));
  const results = list.filter(
    (e) =>
      (world === "all" || e.category === world) &&
      (!q || [e.name, e.code, e.tagline, e.venue, e.mode, label(e.category), ...(e.pocs || []).map((p) => p.name)].some((v) => v?.toLowerCase().includes(q)))
  );
  const where = (e) => e.venue || e.mode;
  const open = (e) => navigate(`/events/${e.id}`, { preventScrollReset: true });

  return (
    <section id="archive" data-chapter="03" data-title="Event archive" className="veil wrap scroll-mt-24 py-24 md:py-36">
      <ChapterHead no="03" label="Event archive" title="Every event, one ledger.">
        <p>Search by event, venue or coordinator, or filter by world. Select a row to open its dossier.</p>
      </ChapterHead>

      <div className="panel mt-10 md:mt-12">
        {/* Search + filter bar */}
        <div className="flex flex-col gap-3 border-b border-line px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <label className="flex min-h-11 items-center gap-3 rounded-full border border-line bg-white/[0.03] px-4 transition-colors focus-within:border-gold/60 md:w-80">
            <Search className="size-4 shrink-0 text-gold" strokeWidth={1.8} aria-hidden="true" />
            <span className="sr-only">Search events</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the archive"
              className="w-full bg-transparent py-2 text-[15px] outline-none placeholder:text-muted/70"
            />
          </label>
          <ToggleGroup.Root
            type="single"
            value={world}
            onValueChange={(v) => v && setWorld(v)}
            aria-label="Filter by world"
            className="-mx-1 flex flex-wrap gap-1"
          >
            {[{ id: "all", label: "All" }, ...worlds].map((w) => (
              <ToggleGroup.Item
                key={w.id}
                value={w.id}
                className="micro min-h-10 rounded-full border border-transparent px-3.5 text-ink/70 transition hover:text-ink data-[state=on]:border-gold/60 data-[state=on]:bg-gold/10 data-[state=on]:text-gold"
              >
                {w.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>

        <div className="micro flex items-center justify-between gap-4 px-4 py-3 text-ink/70 sm:px-6">
          <p aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <p className="flex items-center gap-1.5 text-muted/80 lg:hidden" aria-hidden="true">
            Swipe for more <ArrowRight className="size-3" />
          </p>
        </div>

        <div className="table-scroll" tabIndex={0} role="region" aria-label="Event archive table">
          <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
            <caption className="sr-only">All Resonance ’26 events with venue, team size, entry fee and date</caption>
            <thead>
              <tr className="micro border-y border-line bg-gold/[0.07] text-ink/75">
                <th scope="col" className="py-3.5 pl-4 pr-4 font-medium sm:pl-6">ID</th>
                <th scope="col" className="py-3.5 pr-6 font-medium">Event</th>
                <th scope="col" className="py-3.5 pr-6 font-medium">World</th>
                {COLUMNS.map(([k, l]) => (
                  <th key={k} scope="col" className="py-3.5 pr-6 font-medium">
                    {l}
                  </th>
                ))}
                <th scope="col" className="w-12 py-3.5 pr-4 sm:pr-6">
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => !e.closed && open(e)}
                  className={`group border-b border-line/50 transition-colors last:border-b-0 odd:bg-white/[0.018] ${
                    e.closed
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-gold/[0.07] active:bg-gold/[0.1]"
                  }`}
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-4 align-middle code text-xs text-gold sm:pl-6">{e.code}</td>
                  <th scope="row" className="py-4 pr-6 align-middle font-normal">
                    {e.closed ? (
                      <span className="whitespace-nowrap font-display text-[1.05rem] leading-tight text-ink/50 line-through">
                        {e.name}
                      </span>
                    ) : (
                      <Link
                        to={`/events/${e.id}`}
                        preventScrollReset
                        onClick={(ev) => ev.stopPropagation()}
                        className="whitespace-nowrap font-display text-[1.05rem] leading-tight transition-colors group-hover:text-gold-hi"
                      >
                        {e.name}
                      </Link>
                    )}
                    {e.tagline && <span className="mt-0.5 block max-w-64 text-xs leading-snug text-muted">{e.tagline}</span>}
                    {e.closed && (
                      <span className="mt-1 block text-[11px] font-medium text-red-400">
                        Registrations closed
                      </span>
                    )}
                  </th>
                  <td className="whitespace-nowrap py-4 pr-6 align-middle">
                    <span className="micro rounded-full border border-line px-2.5 py-1 text-[10px] text-ink/80">{label(e.category)}</span>
                  </td>
                  {COLUMNS.map(([k]) => (
                    <td key={k} className={`py-4 pr-6 align-middle text-ink/85 ${k === "venue" || k === "team" ? "min-w-40" : "whitespace-nowrap"}`}>
                      {(k === "venue" ? where(e) : e[k]) || <span className="text-muted/50">—</span>}
                    </td>
                  ))}
                  <td className="py-4 pr-4 align-middle sm:pr-6">
                    {e.closed ? (
                      <span className="micro whitespace-nowrap rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-400">
                        Closed
                      </span>
                    ) : (
                      <ChevronRight className="ml-auto size-4 text-gold/60 transition group-hover:translate-x-0.5 group-hover:text-gold" aria-hidden="true" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!results.length && events && (
          <p className="px-4 pb-6 pt-4 text-ink/80 sm:px-6">
            Nothing matches “{query}”.{" "}
            <button onClick={() => (setQuery(""), setWorld("all"))} className="text-gold underline underline-offset-4">
              Clear search
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
