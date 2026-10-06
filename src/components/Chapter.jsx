// Numbered chapter heading: "02 — Event worlds" over a large editorial title.
export function ChapterHead({ no, label, title, children, className = "" }) {
  return (
    <header className={className}>
      <p className="micro flex items-center gap-3 text-gold">
        <span>{no}</span>
        <span className="h-px w-8 bg-gold/60" />
        <span className="text-ink/75">{label}</span>
      </p>
      <h2 className="text-veil mt-5 max-w-3xl text-balance font-display text-[clamp(2.5rem,7.4vw,4.75rem)] leading-[1.02]">{title}</h2>
      {children && <div className="mt-6 max-w-xl text-[15px] leading-7 text-ink/80 sm:text-base sm:leading-7">{children}</div>}
    </header>
  );
}

// Small label/value pair used for technical metadata rows.
// Figures are set in the sans (its numerals can't be misread); words in the display serif.
export function Meta({ label, value }) {
  const figure = typeof value === "number";
  return (
    <div>
      <dt className="micro text-muted">{label}</dt>
      <dd className={`mt-1.5 text-[1.7rem] leading-tight sm:text-3xl ${figure ? "font-light tabular-nums tracking-tight" : "font-display"}`}>{value}</dd>
    </div>
  );
}
