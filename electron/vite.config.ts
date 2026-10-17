import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "node:path";

// This config builds only the standalone desktop client, never the hosted server.
export default defineConfig({
  root: path.resolve("electron"),
  base: "./",
  publicDir: false,
  define: { "import.meta.env.VITE_DESKTOP": JSON.stringify("true") },
  resolve: { alias: { "@": path.resolve("src") } },
  plugins: [
    react(),
    tailwind(),
    {
      name: "desktop-offline-assets",
      enforce: "pre",
      async load(id) {
        if (!id.endsWith("bg.jpg.asset.json")) return;
        const response = await fetch("https://notefac.lovable.app/__l5e/assets-v1/3f46bfd4-2e73-4cf5-98e2-245226706a7f/bg.jpg");
        if (!response.ok) throw new Error("Could not bundle the desktop background");
        const ref = this.emitFile({ type: "asset", name: "background.jpg", source: new Uint8Array(await response.arrayBuffer()) });
        return `export default {url: import.meta.ROLLUP_FILE_URL_${ref}};`;
      },
      transform(code, id) {
        // Offline desktop uses the existing system-font fallback, no remote font requests.
        if (id.endsWith("/styles.css")) return code.replace(/@font-face\s*\{[^}]*\}/g, "");
      },
    },
  ],
  build: { outDir: path.resolve("dist-desktop"), emptyOutDir: true },
});