import { useEffect } from "react";
type VitalName = "LCP" | "CLS" | "INP";
type Vital = { name: VitalName; value: number; id: string; slug: string; path: string };
function send(vital: Vital) { const body = JSON.stringify({ ...vital, ts: Date.now() }); const url = "/api/public/portfolio-vitals"; if (navigator.sendBeacon) navigator.sendBeacon(url, new Blob([body], { type: "application/json" })); else void fetch(url, { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }); }
export function PortfolioVitals({ slug }: { slug: string }) {
  useEffect(() => { if (typeof window === "undefined" || !slug) return; const path = window.location.pathname; const observers: PerformanceObserver[] = []; const seen = new Set<string>(); const emit = (name: VitalName, value: number, id: string) => { const key = `${name}:${id}`; if (seen.has(key)) return; seen.add(key); send({ name, value: Math.round(value * 100) / 100, id, slug, path }); };
    try { const o = new PerformanceObserver((list) => { const e = list.getEntries().at(-1) as (PerformanceEntry & { element?: Element }) | undefined; if (e) emit("LCP", e.startTime, e.element?.tagName ?? "lcp"); }); o.observe({ type: "largest-contentful-paint", buffered: true }); observers.push(o); } catch {}
    try { let cls = 0; const o = new PerformanceObserver((list) => { for (const e of list.getEntries() as (PerformanceEntry & { hadRecentInput?: boolean; value?: number })[]) if (!e.hadRecentInput) cls += e.value ?? 0; emit("CLS", cls, "cls"); }); o.observe({ type: "layout-shift", buffered: true }); observers.push(o); } catch {}
    try { const o = new PerformanceObserver((list) => { const e = list.getEntries().at(-1) as PerformanceEntry | undefined; if (e) emit("INP", e.duration, String((e as PerformanceEntry & { interactionId?: number }).interactionId ?? "inp")); }); o.observe({ type: "event", buffered: true, durationThreshold: 40 } as PerformanceObserverInit); observers.push(o); } catch {}
    return () => observers.forEach((o) => o.disconnect());
  }, [slug]); return null;
}
