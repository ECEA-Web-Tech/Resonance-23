import { useState } from "react";
import { driveImg } from "../lib/drive";

// Drive-hosted posters come in any size we ask for, so the browser picks one that fits the slot.
const WIDTHS = [320, 640, 1000];

export default function Poster({ src, alt, sizes = "(min-width: 1024px) 360px, (min-width: 640px) 46vw, 120px", className = "" }) {
  const [failed, setFailed] = useState(false);
  const url = driveImg(src, 640);
  const resizable = url && url !== src;
  return (
    <div className={`relative overflow-hidden bg-surface-solid ${className}`}>
      {/* A poster that can't be fetched leaves a quiet labelled frame, never a broken-image icon. */}
      {failed && <span className="micro absolute inset-0 grid place-items-center p-3 text-center text-muted">{alt}</span>}
      {url && !failed && (
        <>
          {/* A tiny copy, scaled up, fills the frame so square and portrait posters both sit uncropped. */}
          <img
            src={driveImg(src, 48)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-xl"
          />
          <img
            src={url}
            srcSet={resizable ? WIDTHS.map((w) => `${driveImg(src, w)} ${w}w`).join(", ") : undefined}
            sizes={resizable ? sizes : undefined}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="relative size-full object-contain transition duration-700 group-hover:scale-[1.03]"
          />
        </>
      )}
    </div>
  );
}
