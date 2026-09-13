#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const fail = [];

const requiredFiles = [
  "AGENTS.md",
  ".agents/skills/0web-skill-router/SKILL.md",
  ".agents/skills/0web-skill-discovery/SKILL.md",
  ".agents/skills/0web-experience-design-max/SKILL.md",
  "docs/AGENT_SKILLS_GOVERNANCE.md",
  "docs/EXPERIENCE_DESIGN_MAX_STANDARD.md",
  "docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md",
  "docs/skills/REGISTRY.md",
  "src/config/experience-capabilities.json",
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) fail.push(`missing:${file}`);
}

if (fail.length === 0) {
  const agents = read("AGENTS.md");
  const router = read(".agents/skills/0web-skill-router/SKILL.md");
  const discovery = read(".agents/skills/0web-skill-discovery/SKILL.md");
  const governance = read("docs/AGENT_SKILLS_GOVERNANCE.md");
  const registry = read("docs/skills/REGISTRY.md");
  const standard = read("docs/EXPERIENCE_DESIGN_MAX_STANDARD.md");
  const config = JSON.parse(read("src/config/experience-capabilities.json"));

  const mustMention = [
    ["AGENTS.md", agents, "0web-experience-design-max"],
    ["router", router, "0web-experience-design-max"],
    ["router", router, "MAXIMUM_RELEVANT_NON_REDUNDANT".toLowerCase().includes("never") ? "__never__" : "Maximum relevant skills"],
    ["discovery", discovery, "LobeHub"],
    ["discovery", discovery, "AwesomeSkill"],
    ["governance", governance, "UI/UX Pro Max"],
    ["registry", registry, "nextlevelbuilder/ui-ux-pro-max-skill@7f69fed6a2717900085f1bc3b263721f8ba025e2"],
    ["registry", registry, "lobehub-skills-search-engine"],
    ["standard", standard, "Máximo de skills relevantes"],
  ];

  for (const [label, text, needle] of mustMention) {
    if (!text.includes(needle)) fail.push(`${label}:missing:${needle}`);
  }

  if (config.version < 2) fail.push("experience-capabilities:version<2");
  if (config.mandatorySkill !== ".agents/skills/0web-experience-design-max/SKILL.md") {
    fail.push("experience-capabilities:mandatorySkill");
  }
  if (config.maximumRelevantSkillsPolicy?.mode !== "MAXIMUM_RELEVANT_NON_REDUNDANT") {
    fail.push("experience-capabilities:maximumRelevantSkillsPolicy");
  }

  const expectedMotion = [
    "fade-up",
    "fade-left/right",
    "blur-in",
    "scale-in",
    "stagger-up",
    "image-reveal",
    "clip-reveal",
    "parallax",
    "marquee",
    "float",
    "header-scroll",
    "menu-reveal",
    "text-line-reveal",
    "progress-line",
  ];
  const actualMotion = (config.motionCapabilityMatrix?.capabilities ?? []).map((x) => x.id);
  const missingMotion = expectedMotion.filter((id) => !actualMotion.includes(id));
  const duplicateMotion = actualMotion.filter((id, index) => actualMotion.indexOf(id) !== index);

  if (!config.motionCapabilityMatrix?.requiredAssessment) {
    fail.push("experience-capabilities:motionCapabilityMatrix.requiredAssessment");
  }
  if (missingMotion.length) fail.push(`motion-matrix:missing:${missingMotion.join(",")}`);
  if (duplicateMotion.length) fail.push(`motion-matrix:duplicates:${[...new Set(duplicateMotion)].join(",")}`);

  const allowedStates = new Set(["REQUIRED", "OPTIONAL", "NOT_APPLICABLE"]);
  for (const state of config.motionCapabilityMatrix?.states ?? []) {
    if (!allowedStates.has(state)) fail.push(`motion-matrix:invalid-state:${state}`);
  }
}

if (fail.length) {
  console.error("[experience-skill-policy] FAIL");
  for (const item of fail) console.error(` - ${item}`);
  process.exit(1);
}

console.log("[experience-skill-policy] PASS");
console.log(" - mandatory skill: 0web-experience-design-max");
console.log(" - external discovery: LobeHub + AwesomeSkill + original sources");
console.log(" - motion matrix: 14/14 capabilities registered");
console.log(" - policy: maximum relevant non-redundant skills");
