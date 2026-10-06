import { useEffect, useRef } from "react";
import { registerAnchor } from "../lib/planets";

// A placeholder box: the WebGL scene draws a real planet inside it (see space/Planets.jsx).
// The scene follows this element's box; `opacity` is an optional MotionValue it reads directly.
// Variants: earth (hero), home (finale), tech, nontech, workshop.
export default function Planet({ variant = "earth", className = "", opacity }) {
  const ref = useRef();
  useEffect(() => registerAnchor(ref.current, variant, opacity), [variant, opacity]);
  return (
    <div ref={ref} className={`aspect-square ${className}`} aria-hidden="true">
      {/* Static stand-in, shown only when WebGL is off (see index.css). */}
      <i className={`planet-fallback planet-${variant}`} />
    </div>
  );
}
