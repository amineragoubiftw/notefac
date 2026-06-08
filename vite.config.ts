// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null, // we register manually from a guarded wrapper
        filename: "sw.js",
        devOptions: { enabled: false },
        workbox: {
          navigateFallback: null, // SSR app; don't serve a cached shell
          globPatterns: ["**/*.{js,css,html,woff2,woff,ttf,svg,png,jpg,jpeg,webp,avif,ico}"],
          maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // 20 MB (bg video)
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            // Background videos and other CDN media assets (Lovable CDN)
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/__l5e/assets-v1/"),
              handler: "CacheFirst",
              options: {
                cacheName: "lovable-cdn-assets",
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
                rangeRequests: true, // required for <video> partial requests
              },
            },
            // Hashed JS/CSS chunks
            {
              urlPattern: ({ request, sameOrigin }) =>
                sameOrigin && (request.destination === "script" || request.destination === "style"),
              handler: "StaleWhileRevalidate",
              options: { cacheName: "static-assets" },
            },
            // Fonts
            {
              urlPattern: ({ request }) => request.destination === "font",
              handler: "CacheFirst",
              options: {
                cacheName: "fonts",
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // Images
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        manifest: false, // no installable PWA, just runtime caching
      }),
    ],
  },
});
