export type PortfolioVital = { name: "LCP" | "CLS" | "INP"; value: number; id: string; slug: string; path: string };
const samples: Array<PortfolioVital & { at: string }> = [];
export function recordPortfolioVital(vital: PortfolioVital) { samples.unshift({ ...vital, at: new Date().toISOString() }); if (samples.length > 5000) samples.length = 5000; }
export function portfolioVitalsSnapshot() { return { generatedAt: new Date().toISOString(), total: samples.length, samples: [...samples] }; }
