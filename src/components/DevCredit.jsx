export default function DevCredit({ className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-2.5 ${className}`}>
      <p className="text-xs text-muted">Designed and Developed by</p>
      <a
        href="https://shameer-room-portfolio.netlify.app/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-3 rounded-full border border-line bg-surface-solid/90 py-2 pl-5 pr-2 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)] backdrop-blur transition hover:border-gold"
      >
        <span className="text-[15px] font-semibold">Mohamed Shameer</span>
        <span className="h-px w-3 bg-muted/50" aria-hidden="true" />
        <span className="rounded-full bg-gold/15 px-3 py-1 font-mono text-[13px] font-semibold text-gold">2023105707</span>
      </a>
    </div>
  );
}
