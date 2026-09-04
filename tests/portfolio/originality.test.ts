import { describe, expect, it } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import {
  REASONS,
  SIGNALS,
  STATUS,
  WEIGHTS,
  compareFingerprints,
  detectRegressions,
  fingerprintSource,
  isPlaceholderLogo,
  pairReason,
  statusFromScore,
  toBaseline,
  analyzePortfolio,
  // @ts-expect-error -- contrato em JS puro, consumido por scripts e testes
} from "../../scripts/portfolio-originality.mjs";

const root = path.resolve(import.meta.dir, "../..");

const BASE = `
export function Page() {
  return (
    <main>
      <header className="sticky top-0 flex items-center justify-between px-4">
        <img src="/images/a/logo.webp" alt="A" />
        <a href="#cta" className="rounded px-4 py-2 bg-[#0f5132] text-white">Fale conosco</a>
      </header>
      <section id="hero" className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-16">
        <h1 className="text-4xl">Titulo A</h1>
        <p>Descricao A</p>
      </section>
      <section id="servicos" className="grid grid-cols-3 gap-6 px-4 py-16">
        <div className="rounded-2xl p-6"><h3>Um</h3><p>texto</p></div>
        <div className="rounded-2xl p-6"><h3>Dois</h3><p>texto</p></div>
        <div className="rounded-2xl p-6"><h3>Tres</h3><p>texto</p></div>
      </section>
      <section id="cta" className="flex flex-col items-center py-16">
        <h2>Peça agora</h2>
        <button className="rounded px-6 py-3 bg-[#0f5132]">Pedir</button>
      </section>
      <footer className="px-4 py-8"><p>rodapé</p></footer>
    </main>
  );
}`;

const copyOnly = BASE.replace(/Titulo A/, "Titulo B").replace(/Descricao A/, "Descricao B");
const colorOnly = BASE.replace(/#0f5132/g, "#b91c1c");
const iconOnly = BASE.replace(/<img src="\/images\/a\/logo.webp" alt="A" \/>/, '<Sparkles className="h-6 w-6" />');

const DIFFERENT = `
export function Other() {
  return (
    <article>
      <nav className="absolute z-10"><ul><li><a href="/">Home</a></li></ul></nav>
      <section id="faq" className="max-w-2xl mx-auto py-24">
        <h2>Perguntas</h2>
        <ul className="space-y-4"><li>Q1</li><li>Q2</li></ul>
      </section>
      <table><tr><td>preço</td></tr></table>
    </article>
  );
}`;

const fp = (src: string) => fingerprintSource(src);

describe("fingerprint e score", () => {
  it("é determinístico entre execuções", () => {
    expect(fp(BASE)).toEqual(fp(BASE));
    expect(compareFingerprints(fp(BASE), fp(copyOnly)).score).toBe(
      compareFingerprints(fp(BASE), fp(copyOnly)).score,
    );
  });

  it("pesos somam 1 e priorizam estrutura sobre cor", () => {
    const total = Object.values(WEIGHTS as Record<string, number>).reduce((a, b) => a + b, 0);
    expect(Math.round(total * 100) / 100).toBe(1);
    expect(WEIGHTS.structure).toBeGreaterThan(WEIGHTS.identity);
    expect(WEIGHTS.sectionOrder).toBeGreaterThan(WEIGHTS.assetPattern);
  });

  it("copy diferente com mesma estrutura → alta similaridade", () => {
    const cmp = compareFingerprints(fp(BASE), fp(copyOnly));
    expect(cmp.score).toBeGreaterThanOrEqual(81);
    expect(pairReason(fp(BASE), fp(copyOnly), cmp)).toBe(REASONS.COPY_ONLY_VARIATION);
  });

  it("apenas hexadecimal diferente → alta similaridade e reason de cor", () => {
    const cmp = compareFingerprints(fp(BASE), fp(colorOnly));
    expect(cmp.score).toBeGreaterThanOrEqual(81);
    expect(pairReason(fp(BASE), fp(colorOnly), cmp)).toBe(REASONS.COLOR_ONLY_VARIATION);
  });

  it("apenas ícone diferente → alta similaridade", () => {
    const cmp = compareFingerprints(fp(BASE), fp(iconOnly));
    expect(cmp.score).toBeGreaterThanOrEqual(61);
  });

  it("layouts realmente diferentes → baixa similaridade", () => {
    const cmp = compareFingerprints(fp(BASE), fp(DIFFERENT));
    expect(cmp.score).toBeLessThan(41);
    expect(pairReason(fp(BASE), fp(DIFFERENT), cmp)).not.toBe(REASONS.IDENTICAL_COMPONENT_STRUCTURE);
  });

  it("status derivado do score", () => {
    expect(statusFromScore(10)).toBe(STATUS.ORIGINAL);
    expect(statusFromScore(30)).toBe(STATUS.ACCEPTABLE);
    expect(statusFromScore(50)).toBe(STATUS.ATTENTION);
    expect(statusFromScore(70)).toBe(STATUS.HIGH_SIMILARITY);
    expect(statusFromScore(95)).toBe(STATUS.CLONE);
    expect(statusFromScore(10, { fallback: true })).toBe(STATUS.SHARED_FALLBACK);
  });
});

describe("sinais de identidade", () => {
  it("detecta logo placeholder gerada por script", () => {
    const svg = path.join(root, "public/images/casa-nativa/logo.svg");
    if (fs.existsSync(svg)) expect(isPlaceholderLogo(svg)).toBe(true);
    expect(isPlaceholderLogo(path.join(root, "package.json"))).toBe(false);
  });
});

describe("análise do portfólio real", () => {
  const report = analyzePortfolio(root);

  it("cobre todos os projetos do catálogo", () => {
    const catalog = JSON.parse(
      fs.readFileSync(path.join(root, "src/config/portfolio-catalog.json"), "utf8"),
    );
    expect(report.projects.length).toBe(catalog.length);
  });

  it("classifica fallback de vertical com reason próprio", () => {
    const fallbacks = report.projects.filter(
      (p: { originalityStatus: string }) => p.originalityStatus === STATUS.SHARED_FALLBACK,
    );
    // Meta do CLUSTER_01: nenhum projeto deve depender da landing genérica da vertical.
    expect(fallbacks.length).toBe(0);
    for (const p of fallbacks) {
      expect(p.reasons).toContain(REASONS.SHARED_VERTICAL_FALLBACK);
      expect(p.fallbackVertical).toBeTruthy();
      expect(p.componentFile).toContain("sites.$vertical.tsx");
    }
  });


  it("sinaliza capa herdada da imagem social e capas ausentes", () => {
    const socialAsCover = report.projects.filter((p: { coverSignals: string[] }) =>
      p.coverSignals.includes(SIGNALS.COVER_IS_SOCIAL_IMAGE),
    );
    const missing = report.projects.filter((p: { coverSignals: string[] }) =>
      p.coverSignals.includes(SIGNALS.COVER_MISSING),
    );
    expect(socialAsCover.length + missing.length).toBeGreaterThan(0);
  });

  it("sinaliza logos placeholder", () => {
    expect(report.summary.placeholderLogos).toBeGreaterThan(0);
  });

  it("é determinístico", () => {
    const again = analyzePortfolio(root);
    expect(again.summary).toEqual(report.summary);
    expect(again.projects.map((p: { score: number }) => p.score)).toEqual(
      report.projects.map((p: { score: number }) => p.score),
    );
  });

  it("a baseline versionada reflete o relatório atual", () => {
    const baselinePath = path.join(root, "reports/portfolio-originality.baseline.json");
    expect(fs.existsSync(baselinePath)).toBe(true);
    const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
    expect(detectRegressions(report, baseline).verdict).toBe("PASS");
  });
});

describe("não regressão", () => {
  const report = analyzePortfolio(root);
  const baseline = toBaseline(report);

  it("baseline + novo clone → FAIL", () => {
    const worse = JSON.parse(JSON.stringify(report));
    worse.summary.clone += 1;
    worse.projects.push({
      slug: "projeto-novo-clone",
      score: 97,
      originalityStatus: STATUS.CLONE,
      nearestMatch: worse.projects[0].slug,
      reasons: [REASONS.COPY_ONLY_VARIATION],
      coverSignals: [],
      logoSignals: [],
      fallbackVertical: null,
    });
    const res = detectRegressions(worse, baseline);
    expect(res.verdict).toBe("FAIL");
    expect(res.regressions.some((r: { kind: string }) => r.kind === "NEW_PROJECT")).toBe(true);
  });

  it("baseline + projeto que piorou de status → FAIL", () => {
    const worse = JSON.parse(JSON.stringify(report));
    const target = worse.projects.find(
      (p: { originalityStatus: string }) => p.originalityStatus === STATUS.ATTENTION,
    );
    if (!target) return;
    target.originalityStatus = STATUS.CLONE;
    worse.summary.clone += 1;
    const res = detectRegressions(worse, baseline);
    expect(res.verdict).toBe("FAIL");
  });

  it("baseline + redução de clones → PASS", () => {
    const better = JSON.parse(JSON.stringify(report));
    const target = better.projects.find(
      (p: { originalityStatus: string }) => p.originalityStatus === STATUS.CLONE,
    );
    if (target) {
      target.originalityStatus = STATUS.ATTENTION;
      target.score = 55;
      better.summary.clone -= 1;
      better.summary.attention += 1;
    }
    const res = detectRegressions(better, baseline);
    expect(res.verdict).toBe("PASS");
  });

  it("estado inalterado → PASS", () => {
    expect(detectRegressions(report, baseline).verdict).toBe("PASS");
  });
});
