import { useEffect, useState } from "react";
import bgVideo from "@/assets/bg-water.mp4.asset.json";

/**
 * Full-screen looping video background.
 * Renders only after client hydration to avoid SSR mismatch.
 */
export function VideoBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Fallback gradient (also shown during SSR) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.18_0.08_280)_0%,oklch(0.08_0.03_280)_60%,oklch(0.06_0.02_280)_100%)]" />
      {mounted && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={bgVideo.url}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      )}
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
