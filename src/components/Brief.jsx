import { ChapterHead, Meta } from "./Chapter";
import { CATEGORIES } from "../data/events";

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const word = (n) => WORDS[n] ?? String(n);

// 01 — Brief. Every figure here is counted from the event and credits data.
// On phones this chapter and the worlds index below it read as one block: same veil, same panels, no gap.
export default function Brief({ events, people }) {
  const list = events || [];
  const worlds = CATEGORIES.filter((c) => list.some((e) => e.category === c.id));
  const venues = new Set(list.map((e) => e.venue).filter(Boolean));
  const title = list.length
    ? `${word(list.length)} events across ${word(worlds.length).toLowerCase()} worlds.`
    : "Mission brief.";

  return (
    <section id="brief" data-chapter="01" data-title="Brief" className="veil wrap scroll-mt-24 pb-10 pt-24 max-md:[--veil-b:0px] md:py-40">
      <div className="grid gap-10 md:gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <ChapterHead no="01" label="Resonance brief" title={title}>
          <p>
            The Electronics and Communication Engineers’ Association is a student-run organisation that has worked for
            the well-being of students for nearly three decades. It organises activities that contribute to the academic
            and professional development of students, and builds a platform for young minds to grow into productive
            engineers.
          </p>
        </ChapterHead>

        <div className="max-md:panel max-md:p-5">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-8 md:border-t md:border-line md:pt-8">
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
