import { chromium } from "playwright";
const b = await chromium.launch({ headless: true, executablePath: (await import("node:fs")).readdirSync("/opt/ms-playwright").filter(n=>n.startsWith("chromium-")&&!n.includes("headless")).map(n=>`/opt/ms-playwright/${n}/chrome-linux/chrome`)[0] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1800 } });
const p = await ctx.newPage();
await p.goto("https://0web.com.br/portfolio/rm-fretes", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2500);
const cta = p.getByRole("button", { name: /or(ç|c)amento|frete|mudan|solicitar|atendimento|pedido/i });
for (let i = 0; i < await cta.count(); i++) {
  await cta.nth(i).click({ force: true }).catch(()=>{});
  await p.waitForTimeout(1200);
  if (await p.locator("div[role='dialog'] button:visible").count()) break;
}
for (let i = 0; i < 14; i++) {
  const ready = p.locator("button:visible").filter({ hasText: /mensagem pronta/i });
  if (await ready.count()) { const ta = p.locator("textarea:visible").first(); if (await ta.count()) await ta.fill("QA"); await ready.first().click({force:true}); await p.waitForTimeout(1500); break; }
  const btns = p.locator("div[role='dialog'] button:visible");
  const n = await btns.count();
  console.log(i, n, (await btns.allInnerTexts()).join(" | ").slice(0,180));
  const inp = p.locator("div[role='dialog'] input:visible, div[role='dialog'] textarea:visible").first();
  if (await inp.count()) await inp.fill("QA rollout 41999990000").catch(()=>{});
  if (!n) { await p.waitForTimeout(800); continue; }
  await btns.nth(n>1?1:0).click({force:true}).catch(()=>{});
  await p.waitForTimeout(800);
}
console.log("recovery:", await p.locator("#portfolio-quiz-recovery").count());
console.log("final buttons:", (await p.locator("div[role='dialog'] button:visible").allInnerTexts()).join(" | ").slice(0,200));
await b.close();
