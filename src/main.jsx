import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Link, Navigate, RouterProvider } from "react-router";
import Home, { EventRoute, Shell } from "./Home";
import { launch } from "./lib/flight";
import "./index.css";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

function NotFound() {
  useEffect(launch, []);
  return (
    <Shell>
      <main className="grid min-h-[100svh] place-items-center px-4 text-center">
        <div>
          <h1 className="gold-text font-display text-5xl sm:text-6xl">Lost in space</h1>
          <p className="mt-4 text-muted">This page doesn’t exist.</p>
          <Link to="/" className="mt-8 inline-block rounded-full bg-gold px-7 py-3 text-sm font-semibold text-on-gold">
            Back to Resonance ’26
          </Link>
        </div>
      </main>
    </Shell>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <Home />, children: [{ path: "events/:id", element: <EventRoute /> }] },
  // Links from the previous site
  ...["techevents", "nontechevents", "workshop"].map((p) => ({ path: p, element: <Navigate to="/#worlds" replace /> })),
  { path: "sponsors", element: <Navigate to="/#sponsors" replace /> },
  ...(ADMIN_PATH ? [{ path: ADMIN_PATH, hydrateFallbackElement: null, lazy: async () => ({ Component: (await import("./admin/Admin")).default }) }] : []),
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
