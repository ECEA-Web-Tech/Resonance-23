// CSS-only planets: lit sphere, drifting surface texture, terminator shadow, atmosphere and optional ring.
// Variants give each event world its own identity without shipping images.
export default function Planet({ variant = "hero", className = "", style }) {
  return (
    <div className={`planet planet-${variant} ${className}`} style={style} aria-hidden="true">
      <div className="planet-ring planet-ring-back" />
      <div className="planet-body">
        <div className="planet-surface" />
        <div className="planet-shade" />
      </div>
      <div className="planet-ring planet-ring-front" />
    </div>
  );
}
