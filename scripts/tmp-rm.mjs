import { chromium } from "playwright";
import { readdirSync } from "node:fs";
const exe = readdirSync("/opt/ms-playwright").filter(n=>n.startsWith("chromium-")&&!n.includes("headless")).map(n=>`/opt/ms-playwright/${n}/chrome-linux/chrome`)[0];
const slugs = process.argv.slice(2);
const b = await chromium.launch({ headless: true, executablePath: exe });
for (const slug of slugs) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1800 } });
  const p = await ctx.newPage();
  await p.goto(`https://0web.com.br/portfolio/${slug}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(2500);
  const cta = p.getByRole("button", { name: /or(ç|c)amento|frete|mudan|solicitar|atendimento|pedido|encomenda|agendar|servi/i });
  for (let i = 0; i < await cta.count(); i++) {
    await cta.nth(i).click({ force: true }).catch(()=>{});
    await p.waitForTimeout(1200);
    if (await p.locator("div[role='dialog'] button:visible").count()) break;
  }
  for (let i = 0; i < 14; i++) {
    const ready = p.locator("div[role='dialog'] button:visible").filter({ hasText: /mensagem pronta/i });
    if (await ready.count()) { const ta = p.locator("div[role='dialog'] textarea:visible").first(); if (await ta.count()) await ta.fill("QA rollout"); await ready.first().click({force:true}); await p.waitForTimeout(2000); break; }
    const opts = p.locator("div[role='dialog'] button:visible").filter({ hasNotText: /voltar|continuar|agora n|quero meu site|fechar/i });
    const inp = p.locator("div[role='dialog'] input:visible, div[role='dialog'] textarea:visible").first();
    if (await opts.count()) await opts.first().click({force:true}).catch(()=>{});
    else {
      if (await inp.count()) await inp.fill("QA rollout").catch(()=>{});
      const cont = p.locator("div[role='dialog'] button:visible").filter({hasText:/continuar|avan|enviar|finalizar/i}).last();
      if (await cont.count()) await cont.click({force:true}).catch(()=>{});
    }
    await p.waitForTimeout(900);
  }
  console.log(slug, "recovery:", await p.locator("#portfolio-quiz-recovery").count(), "|", (await p.locator("div[role='dialog'] button:visible").allInnerTexts()).join(" / ").slice(0,140));
  await ctx.close();
}
await b.close();
