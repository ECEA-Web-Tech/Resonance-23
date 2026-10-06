import { useEffect } from "react";
import { Dialog } from "radix-ui";
import { Navigate, useNavigate, useParams } from "react-router";
import { ArrowUpRight, Phone, X } from "lucide-react";
import { CATEGORIES } from "../data/events";
import { lenis } from "../lib/scroll";
import { scene, wake } from "../lib/scene";
import { SITE_TITLE } from "../lib/site";
import Picture from "./Picture";
import { media } from "../lib/media";

// Only fields present in the source are rendered.
const FACTS = [
  ["venue", "Venue"],
  ["mode", "Mode"],
  ["date", "Date"],
  ["time", "Time"],
  ["team", "Team"],
  ["fee", "Entry fee"],
];

function Block({ title, children }) {
  return (
    <section className="border-t border-line pt-5">
      <h3 className="micro text-gold">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

// Event dossier, opened over the page at /events/:id.
export default function EventDialog({ events }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const e = events?.find((x) => x.id === id);
  const close = () => navigate("/", { preventScrollReset: true });

  useEffect(() => {
    lenis?.stop();
    scene.paused = true; // the page behind is covered: stop drawing the 3D scene
    return () => {
      lenis?.start();
      scene.paused = false;
      wake();
    };
  }, []);

  useEffect(() => {
    if (e) document.title = `${e.name} · Resonance ’26`;
    return () => {
      document.title = SITE_TITLE;
    };
  }, [e]);

  if (events && !e) return <Navigate to="/" replace />;
  if (!e) return null;

  const poster = media(e.poster);
  const category = CATEGORIES.find((c) => c.id === e.category)?.label;
  const facts = [["code", "Event ID"], ["category", "World"], ...FACTS].filter(([k]) => e[k]);

  return (
    <Dialog.Root open onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay fixed inset-0 z-50 bg-bg/90" />
        <Dialog.Content
          data-lenis-prevent
          className="sheet fixed inset-x-3 top-3 z-50 mx-auto max-h-[calc(100dvh-1.5rem)] max-w-5xl overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface-solid text-ink shadow-2xl sm:inset-x-6 sm:top-10 sm:max-h-[calc(100dvh-5rem)]"
        >
          <div className="micro sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface-solid px-4 py-3 sm:px-8">
            <span>
              <span className="text-gold">Dossier</span>
              <span className="text-muted"> / {e.code}</span>
            </span>
            <Dialog.Close className="grid size-9 place-items-center rounded-full border border-line transition hover:border-gold" aria-label="Close dossier">
              <X className="size-4" strokeWidth={1.6} />
            </Dialog.Close>
          </div>

          <div className="grid gap-8 p-4 sm:p-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <a href={poster?.full || e.poster} target="_blank" rel="noreferrer" className="group block self-start md:sticky md:top-20" title="Open full poster">
              <Picture
                src={e.poster}
                alt={`${e.name} poster`}
                fit="contain"
                natural
                eager
                remote={[640, 1000]}
                sizes="(min-width: 1024px) 400px, (min-width: 768px) 38vw, 92vw"
                className="w-full rounded-xl"
                fallback={<div className="micro grid aspect-square place-items-center rounded-xl bg-bg/60 p-4 text-center text-muted">{e.name}</div>}
              />
            </a>

            <div className="space-y-7 pb-4">
              <header>
                <p className="micro text-muted">{category}</p>
                <Dialog.Title className="mt-2 font-display text-[clamp(2rem,7vw,3rem)] leading-[1.05]">{e.name}</Dialog.Title>
                {e.tagline && <p className="mt-2 text-gold">{e.tagline}</p>}
              </header>

              <dl className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3">
                {facts.map(([k, label]) => (
                  <div key={k} className="border-b border-r border-line p-3.5">
                    <dt className="micro text-muted">{label}</dt>
                    <dd className={`mt-1.5 text-sm font-medium ${k === "code" ? "code text-gold" : ""}`}>
                      {k === "category" ? category : e[k]}
                    </dd>
                  </div>
                ))}
              </dl>

              <Block title="Overview">
                <Dialog.Description lang="en" className="hyphens-auto whitespace-pre-line text-justify text-[15px] leading-7 text-ink/85">
                  {e.description}
                </Dialog.Description>
              </Block>

              {!!e.pocs?.length && (
                <Block title="Coordinators">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {e.pocs.map((p) => (
                      <li key={p.name + p.phone}>
                        <a
                          href={`tel:+91${p.phone.replace(/\D/g, "").slice(-10)}`}
                          className="block border border-line px-4 py-3 transition hover:border-gold"
                        >
                          <span className="block text-sm font-medium">{p.name}</span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                            <Phone className="size-3.5" strokeWidth={1.8} />
                            {p.phone}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {e.register && (
                <a
                  href={e.register}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-semibold text-on-gold shadow-[0_8px_30px_-8px_var(--gold)] transition hover:bg-gold-hi sm:w-auto"
                >
                  <span className="sm:hidden">Register now</span>
                  <span className="max-sm:hidden">Register for {e.name}</span>
                  <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
