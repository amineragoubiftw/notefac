import { useEffect, useRef, useState } from "react";

/**
 * GPU-accelerated "liquid water behind frosted glass" background.
 * - Fullscreen WebGL fragment shader (no deps)
 * - Multi-octave flow noise for organic motion
 * - Cursor parallax + ripple
 * - Respects prefers-reduced-motion
 * - DPR clamped on low-perf devices
 * - Client-only mount (avoids SSR hydration mismatch)
 */
export function WaterBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true }) as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true }) as WebGLRenderingContext | null);
    if (!gl) return;

    const isWebGL2 = "drawBuffers" in gl;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Low-perf heuristic: small CPU count or coarse pointer (mobile) → cap quality
    const lowPerf =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      window.matchMedia("(pointer: coarse)").matches;

    const maxDpr = lowPerf ? 1 : 1.5;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    // Flow-noise water shader. Keeps colors subtle (blue/cyan/violet/white).
    const frag = `
      precision highp float;
      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_mouse;     // 0..1
      uniform vec2  u_ripple;    // 0..1
      uniform float u_rippleAge; // seconds since last ripple
      uniform float u_quality;   // 0..1

      // hash / noise / fbm
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p){
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p  = uv;
        p.x *= u_res.x / u_res.y;

        float t = u_time * 0.06;

        // parallax warp follows cursor gently
        vec2 par = (u_mouse - 0.5) * 0.25;

        // domain-warped flow noise → liquid feel
        vec2 q = vec2(
          fbm(p * 1.6 + vec2(0.0, t) + par),
          fbm(p * 1.6 + vec2(5.2, -t) - par)
        );
        vec2 r = vec2(
          fbm(p * 2.4 + 4.0 * q + vec2(1.7, 9.2) + t * 0.8),
          fbm(p * 2.4 + 4.0 * q + vec2(8.3, 2.8) - t * 0.7)
        );
        float n = fbm(p * 2.0 + 3.0 * r + t);

        // base deep palette (blue → violet)
        vec3 deep   = vec3(0.04, 0.06, 0.12);
        vec3 blue   = vec3(0.10, 0.28, 0.55);
        vec3 cyan   = vec3(0.20, 0.65, 0.85);
        vec3 violet = vec3(0.45, 0.30, 0.75);
        vec3 white  = vec3(0.85, 0.92, 1.00);

        vec3 col = mix(deep, blue, smoothstep(0.20, 0.60, n));
        col = mix(col, violet, smoothstep(0.55, 0.85, length(r) * 0.6));
        col = mix(col, cyan,   smoothstep(0.65, 0.95, n) * 0.6);

        // specular-like highlights (caustics feel)
        float h = pow(smoothstep(0.78, 1.0, n + 0.15 * r.x), 2.0);
        col += white * h * 0.35;

        // mouse ripple — radial wave decaying with age
        vec2 mp = u_ripple;
        mp.x *= u_res.x / u_res.y;
        float d = distance(p, mp);
        float age = max(u_rippleAge, 0.0);
        float ring = sin(d * 36.0 - age * 6.0) * exp(-d * 6.0) * exp(-age * 1.4);
        col += vec3(0.25, 0.55, 0.95) * ring * 0.12;

        // vignette + alpha (blend on top of dark page)
        float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
        col *= mix(0.55, 1.0, vig);

        // overall opacity tuned to sit behind glass
        float alpha = 0.92;
        gl_FragColor = vec4(col, alpha);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uRipple = gl.getUniformLocation(prog, "u_ripple");
    const uRippleAge = gl.getUniformLocation(prog, "u_rippleAge");
    const uQuality = gl.getUniformLocation(prog, "u_quality");

    gl.uniform1f(uQuality, lowPerf ? 0.6 : 1.0);

    // state
    const target = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    let ripple = { x: 0.5, y: 0.5, t: 999 };
    let lastRippleStamp = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
      const now = performance.now();
      if (now - lastRippleStamp > 220) {
        ripple = { x: target.x, y: target.y, t: 0 };
        lastRippleStamp = now;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    const start = last;
    // Cap to ~45fps on low-perf to save battery
    const frameInterval = lowPerf ? 1000 / 45 : 0;
    let acc = 0;

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      const dt = now - last;
      last = now;
      acc += dt;
      if (frameInterval && acc < frameInterval) return;
      acc = 0;

      // ease parallax
      smooth.x += (target.x - smooth.x) * 0.06;
      smooth.y += (target.y - smooth.y) * 0.06;
      ripple.t += dt / 1000;

      const t = reduceMotion ? 0 : (now - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, smooth.x, smooth.y);
      gl.uniform2f(uRipple, ripple.x, ripple.y);
      gl.uniform1f(uRippleAge, ripple.t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduceMotion) {
      // single frame, no animation
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uMouse, 0.5, 0.5);
      gl.uniform2f(uRipple, 0.5, 0.5);
      gl.uniform1f(uRippleAge, 999);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(render);
    }

    // pause when tab hidden
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduceMotion) {
        last = performance.now();
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // mark to satisfy linter for isWebGL2 var
    void isWebGL2;

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [mounted]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* dark fallback for SSR + reduced-motion + non-WebGL */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.18_0.08_280)_0%,oklch(0.08_0.03_280)_60%,oklch(0.06_0.02_280)_100%)]" />
      {mounted && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ display: "block" }}
        />
      )}
      {/* soft frosted overlay for "behind glass" feel */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.08_0.03_280/0.25),oklch(0.06_0.02_280/0.45))]" />
    </div>
  );
}
