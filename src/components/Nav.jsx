import { useEffect, useState } from "react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { Menu, X } from "lucide-react";
import eceaLogo from "../assets/ecea-gold.webp";
import { scrollToId } from "../lib/scroll";

export default function Nav({ links }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(scrollY > 40);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    // Let the sheet close before scrolling so Lenis isn't fighting the scroll lock.
    setTimeout(() => scrollToId(id), open ? 220 : 0);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border py-2 pl-3 pr-2 transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled ? "border-line bg-[#070a1a]/92 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.7)] md:bg-surface md:backdrop-blur-xl" : "border-transparent"
        }`}
        aria-label="Main"
      >
        <a href="#top" onClick={go("top")} className="flex items-center gap-3" aria-label="Resonance ’26, back to top">
          <img src={eceaLogo} alt="ECEA" width="160" height="222" className="h-9 w-auto" />
          <span className="font-display text-[1.35rem] tracking-wide">Resonance ’26</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id)}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition hover:text-gold-hi"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="grid size-10 place-items-center rounded-full border border-line" aria-label="Open menu">
              <Menu className="size-5" strokeWidth={1.6} />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="overlay fixed inset-0 z-50 bg-bg/85" />
              <Dialog.Content className="sheet fixed inset-x-4 top-4 z-50 rounded-[28px] border border-line bg-surface-solid p-6 text-ink">
                <VisuallyHidden.Root>
                  <Dialog.Title>Menu</Dialog.Title>
                </VisuallyHidden.Root>
                <div className="mb-6 flex items-center justify-between">
                  <img src={eceaLogo} alt="" width="160" height="222" className="h-9 w-auto" />
                  <Dialog.Close className="grid size-10 place-items-center rounded-full border border-line" aria-label="Close menu">
                    <X className="size-5" strokeWidth={1.6} />
                  </Dialog.Close>
                </div>
                <ul className="space-y-1">
                  {links.map((l) => (
                    <li key={l.id}>
                      <a href={`#${l.id}`} onClick={go(l.id)} className="block rounded-2xl px-3 py-3 font-display text-3xl transition hover:bg-gold/10">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}
