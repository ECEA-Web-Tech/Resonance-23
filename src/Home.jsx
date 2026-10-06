import { Component, lazy, Suspense, useEffect, useMemo, useState } from "react";
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
import CursorRipple from "./components/CursorRipple";
import { launch } from "./lib/flight";
import { useCollection } from "./lib/data";
import { scrollToId, startSmoothScroll } from "./lib/scroll";
import { disableWebGL, isTouch, renderTier } from "./lib/theme";

const Starfield = lazy(() => import("./components/Starfield"));

class Guard extends Component {
  state = { failed: false };
  static getDerivedStateFromError = () => ({ failed: true });
  componentDidCatch() {
    disableWebGL();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// The WebGL scene. three.js is neither downloaded nor started until the page has painted and the browser is idle;
// until then, and on devices where 3D is switched off, the static sky image behind it is what shows.
function Scene() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (renderTier() === "off") return disableWebGL();
    const stop = () => setOn(false);
    addEventListener("webgl-off", stop);
    const start = () => setOn(true);
    const id = window.requestIdleCallback ? requestIdleCallback(start, { timeout: 1500 }) : setTimeout(start, 400);
    return () => {
      removeEventListener("webgl-off", stop);
      window.cancelIdleCallback ? cancelIdleCallback(id) : clearTimeout(id);
    };
  }, []);
  if (!on) return null;
  return (
    <Guard>
      <Suspense fallback={null}>
        <Starfield />
      </Suspense>
    </Guard>
  );
}

export function Shell({ children }) {
  // Pointer effects are desktop-only: there is no cursor to follow on touch screens.
  const [pointerFx] = useState(() => !isTouch());
  return (
    <>
      <div className="sky" aria-hidden="true" />
      <Scene />
      {pointerFx && <Aurora />}
      {/* Dark scrim between the sky and all page content */}
      <div className="scrim" aria-hidden="true" />
      {pointerFx && <CursorRipple />}
      {children}
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
        <>
          {!launched && <Loader onDone={() => setLaunched(true)} />}
          {/* z-10: floats above the fixed dark scrim (z-index 0) */}
          <div className={`relative z-10 ${launched ? "transition-opacity duration-1000" : "invisible opacity-0"}`}>
          <Nav links={links} />
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
          {/* Event dossiers open once the visitor is in: a modal under the loader would lock the loader out. */}
          {launched && <Outlet context={events} />}
        </>
    </Shell>
  );
}

export function EventRoute() {
  return <EventDialog events={useOutletContext()} />;
}
