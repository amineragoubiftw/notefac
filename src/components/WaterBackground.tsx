import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Animated liquid water background — Three.js + custom GLSL shader.
 *
 * Tech:
 *  - Three.js WebGLRenderer (GPU-accelerated)
 *  - Fullscreen plane + ShaderMaterial (custom fragment shader)
 *  - Procedural multi-octave domain-warped fbm noise → non-repeating motion
 *  - Continuous requestAnimationFrame loop driving u_time
 *
 * Performance:
 *  - DPR clamped (1.5 desktop / 1 on coarse-pointer or <=4 cores)
 *  - On low-perf devices, render loop throttled to ~45 FPS
 *  - Pauses when document is hidden
 *  - Honors prefers-reduced-motion (single static frame)
 *  - Listens for THREE webglcontextlost to restart cleanly
 *
 * SSR-safe: canvas mounts only after client hydration.
 */
export function WaterBackground() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const lowPerf =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      window.matchMedia("(pointer: coarse)").matches;
    const maxDpr = lowPerf ? 1 : 1.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
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
      u_ripple: { value: new THREE.Vector3(0.5, 0.5, 999) }, // x,y,age
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        uniform float u_time;
        uniform vec2  u_res;
        uniform vec2  u_mouse;
        uniform vec3  u_ripple;

        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f*f*(3.0 - 2.0*f);
          return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
        }
        float fbm(vec2 p){
          float v = 0.0;
          float a = 0.5;
          for (int i=0; i<5; i++) {
            v += a * noise(p);
            p = mat2(1.6, 1.2, -1.2, 1.6) * p;
            a *= 0.5;
          }
          return v;
        }

        void main(){
          vec2 uv = vUv;
          vec2 p  = uv;
          p.x *= u_res.x / u_res.y;

          float t = u_time * 0.18;
          vec2 par = (u_mouse - 0.5) * 0.35;

          // domain warping → liquid currents
          vec2 q = vec2(
            fbm(p * 1.4 + vec2(0.0, t) + par),
            fbm(p * 1.4 + vec2(5.2, -t) - par)
          );
          vec2 r = vec2(
            fbm(p * 2.2 + 4.0 * q + vec2(1.7, 9.2) + t * 1.1),
            fbm(p * 2.2 + 4.0 * q + vec2(8.3, 2.8) - t * 0.9)
          );
          float n = fbm(p * 1.8 + 3.0 * r + t * 0.7);

          // palette: deep indigo → blue → cyan, violet currents, white caustics
          vec3 deep   = vec3(0.03, 0.05, 0.12);
          vec3 blue   = vec3(0.08, 0.26, 0.55);
          vec3 cyan   = vec3(0.18, 0.62, 0.85);
          vec3 violet = vec3(0.42, 0.28, 0.78);
          vec3 white  = vec3(0.88, 0.94, 1.00);

          vec3 col = mix(deep, blue, smoothstep(0.15, 0.65, n));
          col = mix(col, violet, smoothstep(0.45, 0.85, length(r) * 0.65));
          col = mix(col, cyan,   smoothstep(0.60, 0.95, n) * 0.7);

          // caustics-like highlights
          float h = pow(smoothstep(0.74, 1.0, n + 0.18 * r.x), 2.2);
          col += white * h * 0.45;

          // pointer ripple
          vec2 mp = u_ripple.xy;
          mp.x *= u_res.x / u_res.y;
          float d   = distance(p, mp);
          float age = max(u_ripple.z, 0.0);
          float ring = sin(d * 38.0 - age * 7.0) * exp(-d * 5.5) * exp(-age * 1.3);
          col += vec3(0.30, 0.60, 0.95) * ring * 0.18;

          // vignette
          float vig = smoothstep(1.25, 0.30, length(uv - 0.5));
          col *= mix(0.55, 1.0, vig);

          gl_FragColor = vec4(col, 0.95);
        }
      `,
    });

    // Fullscreen triangle (more efficient than a quad)
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)
    );
    geo.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2)
    );
    const mesh = new THREE.Mesh(geo, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const onResize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.u_res.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const target = new THREE.Vector2(0.5, 0.5);
    let lastRipple = 0;
    const onMove = (e: PointerEvent) => {
      target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
      const now = performance.now();
      if (now - lastRipple > 220) {
        uniforms.u_ripple.value.set(target.x, target.y, 0);
        lastRipple = now;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const clock = new THREE.Clock();
    const frameInterval = lowPerf ? 1 / 45 : 0;
    let acc = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      acc += dt;
      if (frameInterval && acc < frameInterval) return;
      acc = 0;

      // ease parallax
      uniforms.u_mouse.value.lerp(target, 0.06);
      uniforms.u_ripple.value.z += dt;
      uniforms.u_time.value += dt;
      renderer.render(scene, camera);
    };

    if (reduceMotion) {
      uniforms.u_time.value = 0;
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduceMotion) {
        running = true;
        clock.getDelta(); // reset
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
    };
    const onRestored = () => {
      if (!reduceMotion) raf = requestAnimationFrame(tick);
    };
    canvas.addEventListener("webglcontextlost", onLost as EventListener);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost as EventListener);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      geo.dispose();
      material.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [mounted]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* SSR / fallback gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.18_0.08_280)_0%,oklch(0.08_0.03_280)_60%,oklch(0.06_0.02_280)_100%)]" />
      <div ref={hostRef} className="absolute inset-0" />
    </div>
  );
}
