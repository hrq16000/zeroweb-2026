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
  ".agents/skills/lobehub-skills-search-engine/SKILL.md",
  "docs/AGENT_SKILLS_GOVERNANCE.md",
  "docs/EXPERIENCE_DESIGN_MAX_STANDARD.md",
  "docs/LAYOUT_ENGINEERING_STANDARD.md",
  "docs/SKILL_MARKETPLACE_DISCOVERY_STANDARD.md",
  "docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md",
  "docs/skills/REGISTRY.md",
  "src/config/experience-capabilities.json",
  "src/config/skill-marketplace-catalog.json",
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
  const layoutStandard = read("docs/LAYOUT_ENGINEERING_STANDARD.md");
  const marketplaceStandard = read("docs/SKILL_MARKETPLACE_DISCOVERY_STANDARD.md");
  const config = JSON.parse(read("src/config/experience-capabilities.json"));
  const marketplace = JSON.parse(read("src/config/skill-marketplace-catalog.json"));

  const mustMention = [
    ["AGENTS.md", agents, "0web-experience-design-max"],
    ["router", router, "0web-experience-design-max"],
    ["router", router, "Maximum relevant skills"],
    ["discovery", discovery, "LobeHub"],
    ["discovery", discovery, "AwesomeSkill"],
    ["discovery", discovery, "awesomeskill.ai/search"],
    ["governance", governance, "UI/UX Pro Max"],
    ["registry", registry, "nextlevelbuilder/ui-ux-pro-max-skill@7f69fed6a2717900085f1bc3b263721f8ba025e2"],
    ["registry", registry, "lobehub-skills-search-engine"],
    ["standard", standard, "Máximo de skills relevantes"],
    ["layout", layoutStandard, "Flexbox"],
    ["layout", layoutStandard, "main axis"],
    ["marketplace", marketplaceStandard, "awesomeskill.ai/search"],
    ["marketplace", marketplaceStandard, "@lobehub/market-cli"],
  ];

  for (const [label, text, needle] of mustMention) {
    if (!text.includes(needle)) fail.push(`${label}:missing:${needle}`);
  }

  if (config.version < 3) fail.push("experience-capabilities:version<3");
  if (config.mandatorySkill !== ".agents/skills/0web-experience-design-max/SKILL.md") {
    fail.push("experience-capabilities:mandatorySkill");
  }
  if (config.maximumRelevantSkillsPolicy?.mode !== "MAXIMUM_RELEVANT_NON_REDUNDANT") {
    fail.push("experience-capabilities:maximumRelevantSkillsPolicy");
  }
  if (!config.maximumRelevantSkillsPolicy?.searchOnNewProject) {
    fail.push("experience-capabilities:searchOnNewProject");
  }
  if (!config.maximumRelevantSkillsPolicy?.searchOnMaterialMaintenance) {
    fail.push("experience-capabilities:searchOnMaterialMaintenance");
  }

  const expectedLayout = ["flexbox", "css-grid", "intrinsic-sizing", "responsive-flow"];
  const actualLayout = (config.layoutCapabilityMatrix?.capabilities ?? []).map((x) => x.id);
  const missingLayout = expectedLayout.filter((id) => !actualLayout.includes(id));
  if (!config.layoutCapabilityMatrix?.requiredAssessment) {
    fail.push("experience-capabilities:layoutCapabilityMatrix.requiredAssessment");
  }
  if (missingLayout.length) fail.push(`layout-matrix:missing:${missingLayout.join(",")}`);

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
  for (const state of config.layoutCapabilityMatrix?.states ?? []) {
    if (!allowedStates.has(state)) fail.push(`layout-matrix:invalid-state:${state}`);
  }

  if (!marketplace.rules?.searchOnNewProject) fail.push("marketplace:searchOnNewProject");
  if (!marketplace.rules?.searchOnMaterialMaintenance) fail.push("marketplace:searchOnMaterialMaintenance");
  if (!marketplace.rules?.securityReviewBeforeExecution) fail.push("marketplace:securityReviewBeforeExecution");

  const requiredSkills = [
    "lobehub-skills-search-engine",
    "find-skills",
    "agent-browser",
    "web-design-guidelines",
    "react-best-practices",
    "ui-ux-pro-max",
    "frontend-design",
    "planning-with-files",
    "content-research-writer",
    "remotion-best-practices",
    "seo-review",
    "canvas-design",
    "skill-creator",
    "brainstorming",
    "theme-factory",
    "using-superpowers",
    "notebooklm",
  ];
  const skillIds = new Set((marketplace.skills ?? []).map((x) => x.id));
  const missingSkills = requiredSkills.filter((id) => !skillIds.has(id));
  if (missingSkills.length) fail.push(`marketplace:missing-skills:${missingSkills.join(",")}`);
}

if (fail.length) {
  console.error("[experience-skill-policy] FAIL");
  for (const item of fail) console.error(` - ${item}`);
  process.exit(1);
}

console.log("[experience-skill-policy] PASS");
console.log(" - mandatory skill: 0web-experience-design-max");
console.log(" - external discovery: official sources + LobeHub + AwesomeSkill search");
console.log(" - marketplace catalog: required for new projects and material maintenance");
console.log(" - layout matrix: Flexbox + Grid + intrinsic sizing + responsive flow");
console.log(" - motion matrix: 14/14 capabilities registered");
console.log(" - policy: maximum relevant non-redundant skills");
