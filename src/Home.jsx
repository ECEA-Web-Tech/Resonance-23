import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router";
import Aurora from "./components/Aurora";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Brief from "./components/Brief";
import Worlds from "./components/Worlds";
import Archive from "./components/Archive";
import Rail from "./components/Rail";
import EventDialog from "./components/EventDialog";
import Credits from "./components/Credits";
import Sponsors from "./components/Sponsors";
import Finale from "./components/Finale";
import { withCodes } from "./data/events";
import Loader from "./components/Loader";
import { launch } from "./lib/flight";
import { useCollection } from "./lib/data";
import { scrollToId, startSmoothScroll } from "./lib/scroll";
import { useTheme } from "./lib/theme";

const Starfield = lazy(() => import("./components/Starfield"));

export function Shell({ children }) {
  const [theme, toggleTheme] = useTheme();
  return (
    <>
      <div className="sky" aria-hidden="true" />
      <Suspense fallback={null}>
        <Starfield dark={theme === "dark"} />
      </Suspense>
      <Aurora />
      {typeof children === "function" ? children(theme, toggleTheme) : children}
    </>
  );
}

export default function Home() {
  const raw = useCollection("events");
  const events = useMemo(() => raw && withCodes(raw), [raw]);
  const people = useCollection("credits");
  const sponsors = useCollection("sponsors");
  const { hash } = useLocation();
  const [launched, setLaunched] = useState(() => {
    try {
      // The launch sequence plays once per browser session.
      return sessionStorage.getItem("launched") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (launched) launch();
  }, [launched]);
  useEffect(() => (launched ? startSmoothScroll() : undefined), [launched]);
  // Deep links like /#events (and the old /techevents routes) land on their section once content exists.
  useEffect(() => {
    if (hash && events && launched) setTimeout(() => scrollToId(hash.slice(1)), 100);
  }, [hash, events, launched]);

  const hasSponsors = !!sponsors?.length;
  const links = [
    { id: "brief", label: "Brief" },
    { id: "worlds", label: "Worlds" },
    { id: "archive", label: "Archive" },
    { id: "team", label: "Crew" },
    ...(hasSponsors ? [{ id: "sponsors", label: "Sponsors" }] : []),
  ];

  return (
    <Shell>
      {(theme, toggleTheme) => (
        <>
          {!launched && <Loader onDone={() => setLaunched(true)} />}
          {/* Content stays hidden behind the launch sequence so only the sky shows through. */}
          <div className={launched ? "transition-opacity duration-1000" : "invisible opacity-0"}>
          <Nav theme={theme} toggleTheme={toggleTheme} links={links} />
          <main>
            <Hero launched={launched} />
            <Brief events={events} people={people} />
            <Worlds events={events} />
            <Archive events={events} />
            <Credits people={people} no="04" />
            <Sponsors sponsors={sponsors} no="05" />
          </main>
          <Finale no={hasSponsors ? "06" : "05"} />
          <Rail />
          </div>
          <Outlet context={events} />
        </>
      )}
    </Shell>
  );
}

export function EventRoute() {
  return <EventDialog events={useOutletContext()} />;
}
