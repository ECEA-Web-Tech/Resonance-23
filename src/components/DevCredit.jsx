const URL = "https://shameer-room-portfolio.netlify.app/";

// compact: a single quiet line (used on the loader). Default: the footer credit.
export default function DevCredit({ className = "", compact = false }) {
  if (compact)
    return (
      <p className={`max-w-[17rem] text-balance text-center text-[11px] leading-relaxed text-muted/70 sm:max-w-none ${className}`}>
        Designed and developed by{" "}
        <a href={URL} target="_blank" rel="noreferrer" className="text-muted underline-offset-4 transition hover:text-gold hover:underline">
          Mohamed Shameer
        </a>
        <span className="mx-1.5 text-muted/40" aria-hidden="true">·</span>
        <span className="code text-[10.5px] text-gold/80">2023105707</span>
      </p>
    );
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <p className="text-xs text-muted">Designed and developed by</p>
      <a
        href={URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface-solid/90 py-1.5 pl-4 pr-1.5 transition hover:border-gold"
      >
        <span className="text-sm font-semibold">Mohamed Shameer</span>
        <span className="h-px w-3 bg-muted/50" aria-hidden="true" />
        <span className="rounded-full bg-gold/15 px-2.5 py-0.5 code text-xs font-semibold text-gold">2023105707</span>
      </a>
    </div>
  );
}
