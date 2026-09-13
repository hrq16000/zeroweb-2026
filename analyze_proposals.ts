import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import catalog from "./src/config/portfolio-catalog.json";

const CACHE_DIR = "docs/portfolio/enrichment/serpapi/destination";
const ZEROWEB_DIGITS = "5541997452053";

function mask(phone: string) {
  if (!phone) return "—";
  const d = phone.replace(/\D/g, "");
  if (d.length < 4) return "****";
  return d.substring(0, d.length - 4) + "****";
}

const CATALOG = catalog as any[];

const files = readdirSync(CACHE_DIR).filter(f => f.endsWith(".json"));

const allProposals: any[] = [];
const phoneToSlugs: Record<string, string[]> = {};

for (const file of files) {
  const slug = file.replace(".json", "");
  const project = CATALOG.find(p => p.slug === slug);
  if (!project) continue;

  let content;
  try {
    content = JSON.parse(readFileSync(path.join(CACHE_DIR, file), "utf8"));
  } catch (e) {
    continue;
  }
  const candidates = content.candidates || [];

  for (const cand of candidates) {
    const candName = (cand.name || "").trim();
    const candAddress = (cand.address || "").trim();
    const candPhone = (cand.phone || "").replace(/\D/g, "");
    const digits = candPhone.startsWith("55") ? candPhone : (candPhone ? "55" + candPhone : "");

    if (!digits) continue;
    if (digits === ZEROWEB_DIGITS) continue;

    if (!phoneToSlugs[digits]) phoneToSlugs[digits] = [];
    if (!phoneToSlugs[digits].includes(slug)) phoneToSlugs[digits].push(slug);

    allProposals.push({
      slug,
      clientKey: project.clientKey || slug,
      projectTitle: project.title,
      projectCity: project.city,
      candName,
      candAddress,
      digits,
      masked: mask(digits)
    });
  }
}

const results = allProposals.filter(p => {
  // Unequivocally identical name (case-insensitive)
  const nameMatch = p.candName.toLowerCase() === p.projectTitle.toLowerCase();
  
  // City match
  const cityMatch = p.candAddress.toLowerCase().includes(p.projectCity.toLowerCase());

  // Exclude conflicts (same number for multiple slugs)
  const isConflicted = phoneToSlugs[p.digits].length > 1;

  return nameMatch && cityMatch && !isConflicted;
});

console.log(JSON.stringify(results.map(r => ({
  client_key: r.clientKey,
  evidence: `${r.candName} | ${r.candAddress} | ${r.masked}`
})), null, 2));
