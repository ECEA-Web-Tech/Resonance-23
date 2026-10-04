// Numbered chapter heading: "02 — Event worlds" over a large editorial title.
export function ChapterHead({ no, label, title, children, className = "" }) {
  return (
    <header className={className}>
      <p className="micro flex items-center gap-3 text-gold">
        <span>{no}</span>
        <span className="h-px w-8 bg-gold/60" />
        <span className="text-muted">{label}</span>
      </p>
      <h2 className="mt-5 max-w-3xl text-balance font-display text-5xl leading-[0.95] sm:text-7xl">{title}</h2>
      {children && <div className="mt-6 max-w-xl text-[15px] leading-7 text-muted">{children}</div>}
    </header>
  );
}

// Small label/value pair used for technical metadata rows.
export function Meta({ label, value }) {
  return (
    <div>
      <dt className="micro text-muted">{label}</dt>
      <dd className="mt-1.5 font-display text-3xl leading-tight [font-variant-numeric:lining-nums]">{value}</dd>
    </div>
  );
}
