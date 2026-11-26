import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

test("heavy route modules use native lazyRouteComponent without changing route metadata", () => {
  const routes = [
    ["painel", "route-pages/PainelGated", "PainelGated"],
    ["painel-crm", "route-pages/CrmGatedPage", "CrmGatedPage"],
    ["checkout", "route-pages/CheckoutPage", "CheckoutPage"],
    ["home2", "site/Home2PersonalityExperience", "Home2PersonalityExperience"],
    ["home3", "site/Home3MixExperience", "Home3MixExperience"],
  ];
  for (const [slug, modulePath, component] of routes) {
    const src = read(`src/routes/${slug}.tsx`);
    expect(src).toContain(`createFileRoute("/${slug}")`);
    expect(src).toContain(`lazyRouteComponent(() => import("@/components/${modulePath}"), "${component}")`);
    expect(src).not.toContain(`from "@/components/${modulePath}"`);
    expect(src).toContain("head:");
    expect(src).toContain("noindex");
    if (["painel", "painel-crm", "checkout"].includes(slug)) expect(src).toContain("ssr: false");
    else expect(src).not.toContain("ssr: false");
  }
});

test("admin authorization and checkout search contract remain at their respective boundaries", () => {
  for (const name of ["PainelGated", "CrmGatedPage"]) {
    const page = read(`src/components/route-pages/${name}.tsx`);
    expect(page).toContain("<PainelGate>");
  }
  const route = read("src/routes/checkout.tsx");
  const checkout = read("src/components/route-pages/CheckoutPage.tsx");
  expect(route).toContain("validateSearch:");
  expect(route).toContain("ORDER_ID_RE.test(raw.order_id)");
  expect(checkout).toContain('getRouteApi("/checkout")');
  expect(checkout).toContain("routeApi.useSearch()");
  expect(checkout).toContain("createStripeCheckoutSession");
  expect(checkout).toContain("markOrderAssistedHandoff");
});

test("R_Beauty critical hero is visible in SSR and on first paint", () => {
  const src = read("src/components/site/RBeautyEditorialView.tsx");
  const hero = src.split("{/* H1 da primeira dobra")[1]?.split("{/* Hero Visual Card */}")[0] ?? "";
  expect(hero).toContain('<div className="lg:col-span-7 space-y-6">');
  expect(hero).not.toContain("<motion.div");
  expect(hero).not.toContain("initial={{ opacity: 0");
  expect(src).toContain("useReducedMotion()");
  expect(src).toContain("duration: reduceMotion ? 0 : 0.35");
});
