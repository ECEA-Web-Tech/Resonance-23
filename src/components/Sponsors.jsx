import Picture from "./Picture";
import { ChapterHead } from "./Chapter";

function Sponsor({ s }) {
  const Tag = s.link ? "a" : "div";
  return (
    <Tag
      {...(s.link && { href: s.link, target: "_blank", rel: "noreferrer" })}
      className="panel group flex w-full flex-col items-center gap-4 p-5 text-center transition duration-300 hover:border-gold/50 sm:p-6"
    >
      {/* Tier leads: it is what distinguishes one sponsor from the next. */}
      {s.tier && <span className="micro text-gold">{s.tier}</span>}
      {/* Same logo slot on every card. If a logo can't be loaded, the slot carries the name instead. */}
      <Picture
        src={s.logo}
        alt={`${s.name} logo`}
        fit="contain"
        remote={[400]}
        className="h-24 w-full rounded-xl bg-white!"
        imgClassName="p-4"
        fallback={
          <div className="flex h-24 w-full items-center justify-center rounded-xl border border-line bg-white/[0.04] p-4 font-display text-2xl text-gold-hi" aria-hidden="true">
            {s.name}
          </div>
        }
      />
      <span className="font-display text-xl leading-tight">{s.name}</span>
    </Tag>
  );
}

export default function Sponsors({ sponsors, no }) {
  if (!sponsors?.length) return null;

  return (
    <section id="sponsors" data-chapter={no} data-title="Partners" className="veil wrap scroll-mt-24 py-24 md:py-36">
      <ChapterHead no={no} label="Partners" title="Sponsors." />
      <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5 md:mt-14">
        {sponsors.map((s) => (
          <li key={s.id} className="flex">
            <Sponsor s={s} />
          </li>
        ))}
      </ul>
    </section>
  );
}
