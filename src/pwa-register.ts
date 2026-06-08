/**
 * Guarded service-worker registration.
 * Registers ONLY in production builds on real user origins.
 * Never in dev, Lovable previews, iframes, or when ?sw=off is set.
 */
const SW_URL = "/sw.js";

function shouldSkip(): boolean {
  if (typeof window === "undefined") return true;
  if (!import.meta.env.PROD) return true;
  if (window.top !== window.self) return true; // iframe (Lovable editor preview)
  const url = new URL(window.location.href);
  if (url.searchParams.get("sw") === "off") return true;
  const h = window.location.hostname;
  if (
    h.startsWith("id-preview--") ||
    h.startsWith("preview--") ||
    h === "lovableproject.com" ||
    h.endsWith(".lovableproject.com") ||
    h === "lovableproject-dev.com" ||
    h.endsWith(".lovableproject-dev.com") ||
    h === "beta.lovable.dev" ||
    h.endsWith(".beta.lovable.dev")
  ) {
    return true;
  }
  return false;
}

async function unregisterMatching() {
  if (!("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    regs
      .filter((r) => {
        const u = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
        return u.endsWith(SW_URL);
      })
      .map((r) => r.unregister()),
  );
}

export async function registerPWA() {
  if (!("serviceWorker" in navigator)) return;
  if (shouldSkip()) {
    await unregisterMatching();
    return;
  }
  try {
    await navigator.serviceWorker.register(SW_URL, { scope: "/" });
  } catch (err) {
    console.warn("[pwa] register failed", err);
  }
}
