import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

test("public root defers cart, auth, debug, error and 404-only modules", () => {
  const root = read("src/routes/__root.tsx");
  for (const path of [
    "components/site/CartDrawer",
    "components/site/AuthErrorGuard",
    "components/site/SpacingDebugOverlay",
    "components/site/ErrorState",
    "components/site/NotFoundPage",
  ]) {
    expect(root).not.toContain(`from "../${path}"`);
  }
  expect(root).toContain('pathname.startsWith("/app") || pathname.startsWith("/painel")');
  expect(root).toContain('new URLSearchParams(searchStr ?? "").get("debug") === "spacing"');
  expect(root).toContain("<CartDrawerGate />");
});

test("the cart opens after its lazy chunk installs listeners, without losing the first click", () => {
  const gate = read("src/components/site/CartDrawerGate.tsx");
  const drawer = read("src/components/site/CartDrawer.tsx");
  expect(gate).toContain('import("@/components/site/CartDrawer")');
  expect(gate).toContain('window.addEventListener("0web:cart-open", onOpen)');
  expect(gate).toContain('window.dispatchEvent(new Event("0web:cart-open"))');
  expect(drawer).toContain("onReady?.()");
});

test("the contact funnel shell is deferred until the visitor opens the funnel", () => {
  const funnel = read("src/components/site/WaFunnelModal.tsx");
  expect(funnel).toContain('import("@/components/funnel/FunnelModalWrapper")');
  expect(funnel).toContain("const [hasOpened, setHasOpened] = useState(false)");
  expect(funnel).toContain("{hasOpened ? (");
  expect(funnel).toContain("<Suspense fallback={null}>");
});

test("the route loader only downloads the brand logo for a visible slow navigation", () => {
  const loader = read("src/components/site/RouteLoader.tsx");
  expect(loader).toContain('import("@/components/site/BrandLogo")');
  expect(loader).toContain("{visible && shouldShowOverlay ? (");
});
