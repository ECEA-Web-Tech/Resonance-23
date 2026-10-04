// Smoothed pointer position in -1..1 (x right, y up), shared by the WebGL scene. sx/sy are eased.
export const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

if (typeof window !== "undefined") {
  addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / innerHeight) * 2 - 1);
    },
    { passive: true }
  );
}

export function easePointer(delta) {
  const k = Math.min(1, delta * 2.5);
  pointer.sx += (pointer.x - pointer.sx) * k;
  pointer.sy += (pointer.y - pointer.sy) * k;
}
