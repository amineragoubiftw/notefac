import { useEffect, useRef, useState } from "react";

/**
 * Adaptive animated background.
 *
 * Tier detection (runs once on mount):
 *   - "css"    → prefers-reduced-motion, no WebGL, mobile/coarse pointer,
 *                low core count, low deviceMemory, Safari <16, or known
 *                weak-GPU heuristics. Uses pure CSS animated gradient.
 *   - "webgl"  → modern desktop with WebGL. Loads Three.js + shader lazily.
 *
 * Both tiers share the same visual palette so the look is consistent.
 * No memory leaks: cleanup disposes renderer, geometry, material, listeners.
 */

type Tier = "css" | "webgl";

function detectTier(): Tier {
  if (typeof window === "undefined") return "css";

  // Respect reduced motion
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return "css";
  }

  // Coarse pointer = mobile/tablet → CSS
  if (window.matchMedia?.("(pointer: coarse)").matches) return "css";

  // Low CPU
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 4) return "css";

  // Low memory (Chrome only)
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem <= 4) return "css";

  // Save-data
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection;
  if (conn?.saveData) return "css";

  // WebGL capability probe
  try {
    const c = document.createElement("canvas");
    const gl =
      (c.getContext("webgl2") as WebGL2RenderingContext | null) ||
      (c.getContext("webgl") as WebGLRenderingContext | null) ||
      (c.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return "css";

    // Check for software renderer (SwiftShader, llvmpipe → very slow)
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbg) {
      const renderer = String(
        gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || ""
      ).toLowerCase();
      if (
        renderer.includes("swiftshader") ||
        renderer.includes("llvmpipe") ||
        renderer.includes("software") ||
        renderer.includes("microsoft basic")
      ) {
        return "css";
      }
    }
  } catch {
    return "css";
  }

  return "webgl";
}

export function WaterBackground() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => {
    setTier(detectTier());
  }, []);

  useEffect(() => {
    if (tier !== "webgl") return;
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    // Lazy-load Three.js so CSS-tier devices never download it
    import("three")
      .then((THREE) => {
        if (disposed || !host) return;

        let renderer: import("three").WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            premultipliedAlpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          });
        } catch {
          // WebGL init failed → silently keep CSS fallback (already rendered)
          setTier("css");
          return;
        }

        const maxDpr = 1.25;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        renderer.setClearColor(0x000000, 0);
        const canvas = renderer.domElement;
        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        host.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const uniforms = {
          u_time: { value: 0 },
          u_res: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
          u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        };

        const material = new THREE.ShaderMaterial({
          uniforms,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          vertexShader: `
            void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }
          `,
          fragmentShader: `
            precision mediump float;
            uniform float u_time;
            uniform vec2  u_res;
            uniform vec2  u_mouse;
            float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
            float noise(vec2 p){
              vec2 i=floor(p),f=fract(p);
              float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
              vec2 u=f*f*(3.0-2.0*f);
              return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
            }
            float fbm(vec2 p){
              float v=0.0,a=0.5;
              for(int i=0;i<4;i++){ v+=a*noise(p); p=mat2(1.6,1.2,-1.2,1.6)*p; a*=0.5; }
              return v;
            }
            void main(){
              vec2 uv = gl_FragCoord.xy / u_res.xy;
              vec2 p = uv; p.x *= u_res.x/u_res.y;
              float t = u_time*0.15;
              vec2 par = (u_mouse-0.5)*0.3;
              vec2 q = vec2(fbm(p*1.4+vec2(0.0,t)+par), fbm(p*1.4+vec2(5.2,-t)-par));
              vec2 r = vec2(fbm(p*2.0+3.0*q+t), fbm(p*2.0+3.0*q-t));
              float n = fbm(p*1.6+2.5*r+t*0.6);
              vec3 deep=vec3(0.03,0.05,0.12);
              vec3 blue=vec3(0.08,0.26,0.55);
              vec3 cyan=vec3(0.18,0.62,0.85);
              vec3 violet=vec3(0.42,0.28,0.78);
              vec3 col = mix(deep, blue, smoothstep(0.15,0.65,n));
              col = mix(col, violet, smoothstep(0.45,0.85,length(r)*0.65));
              col = mix(col, cyan, smoothstep(0.60,0.95,n)*0.6);
              float h = pow(smoothstep(0.74,1.0,n+0.18*r.x),2.2);
              col += vec3(0.88,0.94,1.0)*h*0.35;
              float vig = smoothstep(1.25,0.30,length(uv-0.5));
              col *= mix(0.6,1.0,vig);
              gl_FragColor = vec4(col, 0.95);
            }
          `,
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute(
          "position",
          new THREE.BufferAttribute(
            new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
            3
          )
        );
        const mesh = new THREE.Mesh(geo, material);
        mesh.frustumCulled = false;
        scene.add(mesh);

        const onResize = () => {
          renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, maxDpr)
          );
          renderer.setSize(window.innerWidth, window.innerHeight, false);
          uniforms.u_res.value.set(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize, { passive: true });

        const target = { x: 0.5, y: 0.5 };
        const onMove = (e: PointerEvent) => {
          target.x = e.clientX / window.innerWidth;
          target.y = 1 - e.clientY / window.innerHeight;
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        let raf = 0;
        let running = true;
        let last = performance.now();
        const minInterval = 1000 / 60;

        const tick = (now: number) => {
          if (!running) return;
          raf = requestAnimationFrame(tick);
          const dt = now - last;
          if (dt < minInterval) return;
          last = now;
          uniforms.u_mouse.value.x +=
            (target.x - uniforms.u_mouse.value.x) * 0.06;
          uniforms.u_mouse.value.y +=
            (target.y - uniforms.u_mouse.value.y) * 0.06;
          uniforms.u_time.value += dt / 1000;
          try {
            renderer.render(scene, camera);
          } catch {
            running = false;
          }
        };
        raf = requestAnimationFrame(tick);

        const onVis = () => {
          if (document.hidden) {
            running = false;
            cancelAnimationFrame(raf);
          } else {
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(tick);
          }
        };
        document.addEventListener("visibilitychange", onVis);

        const onLost = (e: Event) => {
          e.preventDefault();
          running = false;
          cancelAnimationFrame(raf);
          // Fallback to CSS if context cannot be restored quickly
          setTimeout(() => {
            if (!running) setTier("css");
          }, 1500);
        };
        const onRestored = () => {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(tick);
        };
        canvas.addEventListener("webglcontextlost", onLost as EventListener);
        canvas.addEventListener("webglcontextrestored", onRestored);

        cleanup = () => {
          running = false;
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
          window.removeEventListener("pointermove", onMove);
          document.removeEventListener("visibilitychange", onVis);
          canvas.removeEventListener(
            "webglcontextlost",
            onLost as EventListener
          );
          canvas.removeEventListener("webglcontextrestored", onRestored);
          geo.dispose();
          material.dispose();
          renderer.dispose();
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        };
      })
      .catch(() => {
        if (!disposed) setTier("css");
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [tier]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Always-present base layer — also acts as fallback if WebGL fails */}
      <div className="absolute inset-0 css-water-bg" />
      {tier === "webgl" && <div ref={hostRef} className="absolute inset-0" />}
    </div>
  );
}
