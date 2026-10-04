import { useEffect, useRef } from "react";
import { m } from "motion/react";
import { registerAnchor } from "../lib/planets";

// A placeholder box: the WebGL scene draws a real planet inside it (see space/Planets.jsx).
// The scene reads this element's box and opacity every frame. Variants: earth (hero and finale), tech, nontech, workshop.
export default function Planet({ variant = "earth", className = "", style }) {
  const ref = useRef();
  useEffect(() => registerAnchor(ref.current, variant), [variant]);
  return <m.div ref={ref} className={`aspect-square ${className}`} style={style} aria-hidden="true" />;
}
