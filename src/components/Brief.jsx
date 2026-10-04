import { ChapterHead, Meta } from "./Chapter";
import { CATEGORIES } from "../data/events";

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const word = (n) => WORDS[n] ?? String(n);

// 01 — Brief. Every figure here is counted from the event and credits data.
export default function Brief({ events, people }) {
  const list = events || [];
  const worlds = CATEGORIES.filter((c) => list.some((e) => e.category === c.id));
  const venues = new Set(list.map((e) => e.venue).filter(Boolean));
  const title = list.length
    ? `${word(list.length)} events across ${word(worlds.length).toLowerCase()} worlds.`
    : "Mission brief.";

  return (
    <section id="brief" data-chapter="01" data-title="Brief" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-28 sm:py-40">
      <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <ChapterHead no="01" label="Resonance brief" title={title}>
          <p>
            The Electronics and Communication Engineers’ Association is a student-run organisation that has worked for
            the well-being of students for nearly three decades. It organises activities that contribute to the academic
            and professional development of students, and builds a platform for young minds to grow into productive
            engineers.
          </p>
        </ChapterHead>

        <div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8">
            <Meta label="Events" value={list.length || "—"} />
            <Meta label="Worlds" value={worlds.length || "—"} />
            <Meta label="Venues listed" value={venues.size || "—"} />
            <Meta label="Crew" value={people?.length || "—"} />
            <Meta label="Host" value="ECEA" />
            <Meta label="Campus" value="CEG, Anna University" />
          </dl>
        </div>
      </div>
    </section>
  );
}
