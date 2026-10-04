import { driveImg } from "../lib/drive";

export default function Poster({ src, alt, width = 600, className = "" }) {
  const url = driveImg(src, width);
  return (
    <div className={`relative overflow-hidden bg-surface-solid ${className}`}>
      {url && (
        <>
          {/* Blurred copy fills the frame so square and portrait posters both sit uncropped. */}
          <img src={driveImg(src, 60)} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-125 object-cover opacity-60 blur-2xl" />
          <img src={url} alt={alt} loading="lazy" decoding="async" className="relative size-full object-contain transition duration-700 group-hover:scale-[1.03]" />
        </>
      )}
    </div>
  );
}
