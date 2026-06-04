import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated liquid-glass ambient background.
 * Floating blurred gradient orbs + grain overlay.
 * Respects prefers-reduced-motion.
 */
export function AmbientBackground() {
  const reduce = useReducedMotion();

  const orbs = [
    {
      className: "bg-[radial-gradient(circle_at_30%_30%,oklch(0.70_0.25_280/0.55),transparent_60%)]",
      size: 620,
      top: "-10%",
      left: "-8%",
      duration: 26,
      x: [0, 60, -30, 0],
      y: [0, 40, -20, 0],
    },
    {
      className: "bg-[radial-gradient(circle_at_60%_40%,oklch(0.65_0.22_220/0.50),transparent_60%)]",
      size: 720,
      top: "20%",
      left: "55%",
      duration: 32,
      x: [0, -80, 30, 0],
      y: [0, 50, 30, 0],
    },
    {
      className: "bg-[radial-gradient(circle_at_40%_50%,oklch(0.62_0.24_320/0.45),transparent_60%)]",
      size: 560,
      top: "60%",
      left: "10%",
      duration: 38,
      x: [0, 50, -40, 0],
      y: [0, -40, 30, 0],
    },
    {
      className: "bg-[radial-gradient(circle_at_50%_50%,oklch(0.70_0.20_180/0.35),transparent_65%)]",
      size: 480,
      top: "70%",
      left: "70%",
      duration: 30,
      x: [0, -40, 40, 0],
      y: [0, 30, -30, 0],
    },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base deep gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.18_0.08_280)_0%,oklch(0.08_0.03_280)_60%,oklch(0.06_0.02_280)_100%)]" />

      {/* floating orbs */}
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${o.className}`}
          style={{ width: o.size, height: o.size, top: o.top, left: o.left }}
          animate={
            reduce
              ? undefined
              : { x: o.x, y: o.y }
          }
          transition={{
            duration: o.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* subtle noise / vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,oklch(0_0_0/0.45)_100%)]" />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")]" />
    </div>
  );
}
