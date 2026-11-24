import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

test("shared funnel wrapper defers modal implementation until first interaction", () => {
  const wrapper = read("src/components/funnel/FunnelModalWrapper.tsx");
  expect(wrapper).toContain('import("./FunnelModalContent")');
  expect(wrapper).toContain("const [hasOpened, setHasOpened] = useState(props.open)");
  expect(wrapper).toContain("if (!hasOpened && !props.open) return null;");
  expect(wrapper).toContain("<FunnelModalContent {...props} />");
  expect(wrapper).not.toContain("@radix-ui/react-dialog");
  expect(wrapper).not.toContain("@/lib/dynamic-funnel.functions");
});

test("deferred modal content keeps runner, tenant context, prefill and completion contracts", () => {
  const content = read("src/components/funnel/FunnelModalContent.tsx");
  expect(content).toContain('lazy(() => import("./FunnelRunner")');
  expect(content).toContain("!loading && !error && funnel && !completed");
  expect(content).toContain("<Suspense fallback=");
  expect(content).toContain('role="status"');
  expect(content).toContain("clientKey={intent?.companySlug}");
  expect(content).toContain("context={context}");
  expect(content).toContain("prefill={prefill}");
  expect(content).toContain("onComplete={() => setCompleted(true)}");
});

test("funnel and A/B persistence modules load only when their events occur", () => {
  const funnel = read("src/components/site/WaFunnelModal.tsx");
  const abTesting = read("src/lib/ab-testing.ts");
  expect(funnel).not.toContain('from "@/lib/persistence"');
  expect(funnel).toContain('import("@/lib/persistence")');
  expect(abTesting).not.toContain('from "./persistence"');
  expect(abTesting).toContain('import("./persistence")');
});
