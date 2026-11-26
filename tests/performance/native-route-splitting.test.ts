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
    expect(src).toMatch(/lazyRouteComponent\(\s*\(\)\s*=>\s*import\("@\/components\/.+?"\)\s*,\s*".+?"\s*,?\s*\)/s);
    expect(src).toContain(`import("@/components/${modulePath}")`);
    expect(src).toContain(`"${component}"`);
    expect(src).not.toContain(`from "@/components/${modulePath}"`);
    expect(src).toContain("head:");
    expect(src).toContain("noindex");
    const executable = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    if (["painel", "painel-crm", "checkout"].includes(slug)) expect(executable).toMatch(/\bssr\s*:\s*false\b/);
    else expect(executable).not.toMatch(/\bssr\s*:\s*false\b/);
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
  const headingIndex = src.indexOf("<h1");
  const sectionStart = src.lastIndexOf("<section", headingIndex);
  const heroPrelude = src.slice(sectionStart, headingIndex);

  expect(headingIndex).toBeGreaterThan(-1);
  expect(sectionStart).toBeGreaterThan(-1);
  expect(heroPrelude).not.toContain("<motion.div");
  expect(heroPrelude).not.toContain("initial={{ opacity: 0");
  expect(src).toContain("useReducedMotion()");
});