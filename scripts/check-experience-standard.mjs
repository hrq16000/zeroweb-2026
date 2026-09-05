#!/usr/bin/env node
// ============================================================================
// Gate da NORMA GLOBAL DE EXPERIÊNCIA (docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md).
//
// Report-only por padrão. Com --enforce, bloqueia SOMENTE falhas objetivas:
//   MOTION_CAUSES_LAYOUT_SHIFT  (animação de propriedade de layout)
//   REDUCED_MOTION_BROKEN       (loop infinito sem guarda de reduced motion)
//   INVALID_MOTION_PROFILE      (perfil fora do schema publicado)
//
// Nunca bloqueia por gosto: "estático" e "sem assinatura" saem como WARNING.
// Uso: node scripts/check-experience-standard.mjs [--enforce] [--json]
// ============================================================================
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enforce = process.argv.includes("--enforce");
const asJson = process.argv.includes("--json");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const readJson = (p) => JSON.parse(read(p));

const capabilities = readJson("src/config/experience-capabilities.json");
const profiles = readJson("src/config/portfolio-motion-profiles.json");

const errors = [];
const warnings = [];

// 1. Primitives precisam existir de fato.
const primitivesPath = capabilities.primitives.module;
if (!fs.existsSync(path.join(root, primitivesPath))) {
  errors.push({ code: "MOTION_SYSTEM_MISSING", detail: primitivesPath });
} else {
  const src = read(primitivesPath);
  for (const name of capabilities.primitives.available) {
    if (!new RegExp(`export function ${name}\\b|export function use${name}\\b`).test(src) &&
        !new RegExp(`function ${name}\\b`).test(src)) {
      errors.push({ code: "MOTION_PRIMITIVE_MISSING", detail: name });
    }
  }
  if (!/prefers-reduced-motion/.test(src)) {
    errors.push({ code: "REDUCED_MOTION_BROKEN", detail: `${primitivesPath}: sem guarda de reduced motion` });
  }
}

// 2. Perfis declarados precisam respeitar o schema publicado.
const schema = capabilities.motionProfileSchema;
const allowed = Object.fromEntries(
  Object.entries(schema).map(([k, v]) => [k, v.includes("|") ? v.split("|").map((s) => s.trim()) : null]),
);
const validateProfile = (scope, key, profile) => {
  for (const [field, value] of Object.entries(profile)) {
    if (!(field in schema)) {
      errors.push({ code: "INVALID_MOTION_PROFILE", detail: `${scope}.${key}: campo desconhecido "${field}"` });
      continue;
    }
    const options = allowed[field];
    if (options && !options.includes(String(value))) {
      errors.push({
        code: "INVALID_MOTION_PROFILE",
        detail: `${scope}.${key}.${field}: "${value}" fora de [${options.join(", ")}]`,
      });
    }
  }
};
for (const [key, profile] of Object.entries(profiles.defaultsBySegment ?? {}))
  validateProfile("defaultsBySegment", key, profile);
for (const [key, profile] of Object.entries(profiles.overrides ?? {}))
  validateProfile("overrides", key, profile);

// 3. Varredura das páginas de projeto.
const dir = "src/components/site";
const files = fs.readdirSync(path.join(root, dir)).filter((f) => /Page\.tsx$/.test(f));
const forbidden = capabilities.performanceBudget.forbiddenAnimatedProperties;
const pages = [];

for (const file of files) {
  const rel = `${dir}/${file}`;
  const src = read(rel);
  const count = (re) => (src.match(re) || []).length;

  // Animação de propriedade de layout: objetivamente causa reflow/CLS.
  for (const prop of forbidden) {
    const re = new RegExp(`transition(?:-\\[|:\\s*)[^;"'\\]]*\\b${prop}\\b`, "i");
    if (re.test(src)) {
      const finding = { code: "MOTION_CAUSES_LAYOUT_SHIFT", detail: `${rel}: anima "${prop}"` };
      errors.push(finding);
    }
  }

  // Loop infinito sem guarda de reduced motion no próprio arquivo.
  if (/animation:[^;]*infinite/i.test(src) && !/prefers-reduced-motion/.test(src)) {
    errors.push({ code: "REDUCED_MOTION_BROKEN", detail: `${rel}: animação infinita sem guarda` });
  }

  const signals = {
    primitives: count(/Motion(?:Reveal|Stagger|TextReveal|ImageReveal|Counter|Scope)\b/g),
    transitions: count(/transition-/g),
    hover: count(/(?:group-)?hover:/g),
    animate: count(/\banimate-/g),
  };
  const score =
    signals.primitives * 4 + signals.transitions + signals.hover + signals.animate * 2;
  const level = score >= 12 ? "PREMIUM" : score >= 4 ? "BASELINE" : "STATIC";
  if (level === "STATIC") warnings.push({ code: "EXPERIENCE_STATIC", detail: rel });
  pages.push({ file: rel, score, level, signals });
}

const summary = {
  generatedAt: new Date().toISOString(),
  totalPages: pages.length,
  premium: pages.filter((p) => p.level === "PREMIUM").length,
  baseline: pages.filter((p) => p.level === "BASELINE").length,
  static: pages.filter((p) => p.level === "STATIC").length,
  errors,
  warnings,
  pages: pages.sort((a, b) => a.score - b.score),
};

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(
  path.join(root, "reports/experience-standard.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);

if (asJson) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(
    `[experience] ${summary.totalPages} páginas — PREMIUM ${summary.premium} · BASELINE ${summary.baseline} · STATIC ${summary.static}`,
  );
  for (const w of warnings.slice(0, 10)) console.log(`  WARNING ${w.code} ${w.detail}`);
  if (warnings.length > 10) console.log(`  ... +${warnings.length - 10} warnings (reports/experience-standard.json)`);
  for (const e of errors) console.log(`  FAIL ${e.code} ${e.detail}`);
}

if (enforce && errors.length) {
  console.error(`\n[experience] FAIL — ${errors.length} bloqueante(s) objetivo(s)`);
  process.exit(1);
}
console.log("[experience] OK");
