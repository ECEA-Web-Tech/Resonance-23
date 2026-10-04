import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#05060d" : "#eef0f7");
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = () => matchMedia("(pointer: coarse)").matches;
