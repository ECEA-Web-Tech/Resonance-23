import { useState } from "react";
import { media } from "../lib/media";

// Every content image on the site: a crew portrait, an event poster, a sponsor logo.
// The frame is painted at once from a tiny blurred preview that ships with the page (no request, no CSS
// filter); the real image, served from the site itself, fades in over it when it has decoded.
// fit "cover" fills the frame; "contain" shows the whole image with the preview filling the rest.
// natural: the frame takes the image's own proportions (known from the manifest), so nothing shifts on load.
export default function Picture({ src, alt, sizes, fit = "cover", eager = false, natural = false, remote, className = "", imgClassName = "", fallback = null }) {
  const [state, setState] = useState("loading");
  const m = media(src, remote);
  if (!m || state === "failed") return fallback;
  return (
    <div
      className={`relative overflow-hidden bg-surface-solid bg-cover bg-center ${className}`}
      style={{ backgroundImage: m.blur ? `url(${m.blur})` : undefined, aspectRatio: natural ? m.ratio || 1 : undefined }}
    >
      <img
        src={m.src}
        srcSet={m.srcSet}
        sizes={m.srcSet ? sizes : undefined}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        // Cached images can finish before React attaches onLoad.
        ref={(el) => el?.complete && el.naturalWidth > 0 && state === "loading" && setState("ready")}
        onLoad={() => setState("ready")}
        onError={() => setState("failed")}
        className={`size-full transition-opacity duration-500 ${fit === "contain" ? "object-contain" : "object-cover"} ${state === "ready" ? "opacity-100" : "opacity-0"} ${imgClassName}`}
      />
    </div>
  );
}
