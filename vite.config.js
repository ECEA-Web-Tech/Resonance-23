import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // three.js is ~250 kB gzipped but lazy-loaded after first paint.
  build: { chunkSizeWarningLimit: 1000 },
});
