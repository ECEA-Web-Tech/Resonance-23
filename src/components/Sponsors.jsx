import { driveImg } from "../lib/drive";
import { ChapterHead } from "./Chapter";

export default function Sponsors({ sponsors, no }) {
  if (!sponsors?.length) return null;

  return (
    <section
      id="sponsors"
      data-chapter={no}
      data-title="Partners"
      className="scroll-mt-24 px-4 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <ChapterHead no={no} label="Partners" title="Sponsors." />

        {/* Background panel */}
        <div
          className="mt-14 rounded-2xl border border-line p-8 sm:p-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,17,36,0.92) 0%, rgba(8,10,28,0.96) 100%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(217,180,90,0.08)",
          }}
        >
          {/* Single responsive row */}
          <ul className="flex flex-wrap items-stretch justify-center gap-6 sm:gap-8">
            {sponsors.map((s) => {
              const Tag = s.link ? "a" : "div";
              return (
                <li key={s.id} className="flex w-[calc(50%-12px)] sm:w-56 lg:w-64">
                  <Tag
                    {...(s.link && { href: s.link, target: "_blank", rel: "noreferrer" })}
                    className="group flex w-full flex-col items-center gap-4 rounded-xl border border-line/60 bg-white/[0.04] p-5 text-center transition-all duration-300 hover:border-gold/50 hover:bg-white/[0.08] hover:shadow-[0_0_24px_rgba(217,180,90,0.12)]"
                  >
                    {/* Logo box */}
                    {s.logo && (
                      <div className="flex h-20 w-full items-center justify-center rounded-lg bg-white p-3">
                        <img
                          src={driveImg(s.logo, 400)}
                          alt={s.name}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      </div>
                    )}

                    {/* Name */}
                    <span className="text-sm font-semibold leading-tight text-white">
                      {s.name}
                    </span>

                    {/* Tier badge */}
                    {s.tier && (
                      <span
                        className="mt-auto rounded-full border border-gold/30 px-3 py-0.5 text-[11px] font-medium tracking-wider uppercase"
                        style={{ color: "var(--gold)", letterSpacing: "0.12em" }}
                      >
                        {s.tier}
                      </span>
                    )}
                  </Tag>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
