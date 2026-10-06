import { ArrowUp } from "lucide-react";
import logo from "../assets/resonance-logo.webp";
import eceaLogo from "../assets/ecea-gold.webp";
import Planet from "./Planet";
import Brand from "./Brand";
import DevCredit from "./DevCredit";
import { scrollToId } from "../lib/scroll";

const SOCIALS = [
  ["Instagram", "https://instagram.com/ecea_ceg"],
  ["LinkedIn", "https://www.linkedin.com/in/ecea-ceg"],
  ["YouTube", "https://youtube.com/@ecea_ceg"],
];

// Last chapter: a quiet horizon, the brand, and a way back up.
export default function Finale({ no }) {
  return (
    <footer data-chapter={no} data-title="Return to orbit" className="relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute -bottom-[62vw] left-1/2 w-[110vw] -translate-x-1/2 sm:-bottom-[48vw] sm:w-[80vw]">
        <Planet variant="home" />
      </div>

      <div className="wrap relative flex flex-col items-center pb-12 pt-24 text-center md:pt-28">
        <p className="micro flex items-center gap-3 text-gold">
          <span>{no}</span>
          <span className="h-px w-8 bg-gold/60" />
          <span className="text-ink/75">Return to orbit</span>
        </p>
        <img src={logo} alt="Resonance ’26" width="488" height="265" className="mt-10 h-auto w-[min(70vw,360px)]" loading="lazy" decoding="async" />

        <button
          onClick={() => scrollToId("top")}
          className="micro group mt-12 inline-flex min-h-12 items-center gap-3 rounded-full border border-gold/60 bg-bg/60 px-7 py-3.5 text-gold transition hover:bg-gold hover:text-on-gold"
        >
          Return to orbit
          <ArrowUp className="size-4 transition group-hover:-translate-y-0.5" />
        </button>

        <ul className="mt-14 flex gap-2">
          {SOCIALS.map(([name, href]) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`ECEA on ${name}`}
                className="grid size-11 place-items-center rounded-full border border-line bg-bg/70 text-muted transition hover:border-gold hover:text-gold"
              >
                <Brand name={name} />
              </a>
            </li>
          ))}
        </ul>

        <DevCredit className="mt-14" />

        <div className="mt-14 flex flex-col items-center gap-3 sm:flex-row">
          <img src={eceaLogo} alt="ECEA logo" width="160" height="222" className="h-9 w-auto" loading="lazy" decoding="async" />
          <p className="text-xs leading-relaxed text-muted sm:text-left">
            Electronics and Communication Engineers’ Association
            <br />
            College of Engineering, Guindy
          </p>
        </div>
      </div>
    </footer>
  );
}
