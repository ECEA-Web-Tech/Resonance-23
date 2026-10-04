import { driveImg } from "../lib/drive";
import { ChapterHead } from "./Chapter";

export default function Sponsors({ sponsors, no }) {
  if (!sponsors?.length) return null;
  const tierOf = (s) => s.tier || "Sponsors";
  const tiers = [...new Set(sponsors.map(tierOf))];

  return (
    <section id="sponsors" data-chapter={no} data-title="Partners" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-28 sm:py-36">
      <ChapterHead no={no} label="Partners" title="Sponsors." />
      <div className="mt-12 space-y-12">
        {tiers.map((tier) => (
          <div key={tier}>
            {tiers.length > 1 && <h3 className="mb-6 font-display text-2xl italic text-gold sm:text-3xl">{tier}</h3>}
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {sponsors
                .filter((s) => tierOf(s) === tier)
                .map((s) => {
                  const Tag = s.link ? "a" : "div";
                  return (
                    <li key={s.id}>
                      <Tag
                        {...(s.link && { href: s.link, target: "_blank", rel: "noreferrer" })}
                        className="flex h-full flex-col items-center gap-4 rounded-[22px] border border-line bg-surface p-5 text-center backdrop-blur-md transition hover:border-gold/60"
                      >
                        {s.logo && (
                          <div className="grid h-24 w-full place-items-center rounded-xl bg-white/90 p-3">
                            <img src={driveImg(s.logo, 400)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{s.name}</span>
                      </Tag>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
