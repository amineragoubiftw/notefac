import bgImage from "@/assets/bg.jpg.asset.json";

/**
 * Full-screen static image background.
 * Uses a single low-cost <img> so low-end phones stay smooth (no video decode,
 * no per-frame paint). The gradient underneath acts as an instant fallback
 * before the image is ready and during SSR.
 */
export function VideoBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Fallback gradient (also visible during SSR / before image loads) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.18_0.08_280)_0%,oklch(0.08_0.03_280)_60%,oklch(0.06_0.02_280)_100%)]" />
      <img
        src={bgImage.url}
        alt=""
        width={1920}
        height={1280}
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
