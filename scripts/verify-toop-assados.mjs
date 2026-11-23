#!/usr/bin/env node
/**
 * Toop Assados: evidência REAL de navegação e 390/768/1440 + NO-BRAND.
 * Não cria baseline automaticamente, não declara unicidade/perceptual PASS,
 * não recolhe nem envia dados pessoais, não autentica em sites de terceiros.
 */
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";

const base = process.env.E2E_BASE_URL || "http://127.0.0.1:8080";
const dest = "seo-reports/toop-assados-visual";
mkdirSync(dest, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const viewports = [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}];
const failures = [];
const report = [];
// Os bytes são impressos em blocos pequenos para uma revisão visual real,
// sem inventar prova baseada apenas em dimensões ou no nome do arquivo.
function printEvidence(name, file) {
  const data = readFileSync(file).toString("base64");
  const chunks = data.match(/.{1,20000}/g) || [];
  console.log("TOOP_IMAGE_BEGIN:" + name + ":" + chunks.length);
  chunks.forEach((chunk,i)=>console.log("TOOP_IMAGE_PART:" + name + ":" + i + ":" + chunk));
  console.log("TOOP_IMAGE_END:" + name);
}
const anonymize = `
  html {filter:grayscale(1) !important}
  img, svg, video, canvas {visibility:hidden !important}
  h1,h2,h3,h4,p,a,button,span,li,small,strong,em,label,legend {
    color:transparent !important;text-shadow:none !important;
  }
`;
try {
  for(const vp of viewports) {
    const context=await browser.newContext({viewport:vp,reducedMotion:"reduce",deviceScaleFactor:1});
    const page=await context.newPage();
    const errors=[];page.on("pageerror",err=>errors.push(err.message));
    const name="toop-"+vp.width;
    try {
      const response=await page.goto(base+"/portfolio/toop-assados?0web_preview=1",{waitUntil:"domcontentloaded",timeout:45000});
      assert.equal(response?.status(),200,"GET /portfolio/toop-assados must be 200");
      await page.getByRole("heading",{level:1}).waitFor({timeout:20000});
      assert.match(await page.getByRole("heading",{level:1}).innerText(),/Da brasa/i);
      assert.match(await page.locator("title").innerText(),/Toop Assados/i);
      const canonical=await page.locator('link[rel="canonical"]').getAttribute("href");
      assert.equal(canonical,"https://0web.com.br/portfolio/toop-assados");
      await page.evaluate(()=>document.fonts.ready);
      const overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-window.innerWidth));
      assert.ok(overflow<=2,"horizontal overflow="+overflow);
      assert.equal(await page.locator('a[href^="https://wa.me"]').count(),0,"no direct WhatsApp");
      const html=await page.locator("body").innerText();
      assert.match(html,/não é (?:o )?(?:atendimento|canal|site) oficial/i,"explicit independent-project disclosure");
      const png=dest+"/"+name+".png";
      await page.screenshot({path:png,fullPage:true,animations:"disabled",timeout:45000});
      printEvidence(name,png);
      await page.getByRole("button",{name:/Simular interesse em Costela na brasa/}).click();
      await page.getByRole("button",{name:"Visualizar resumo demonstrativo"}).click();
      const action=page.locator('a[data-funnel-provider="jotform"][data-client-key="toop-assados"]');
      await action.waitFor({state:"visible"});
      assert.equal(await action.getAttribute("href"),"https://form.jotform.com/263260727590056");
      assert.equal(await page.getByText("Nenhum pedido foi realizado.", { exact: true }).count(),1,"simulated summary did not create an order");
      assert.equal(errors.length,0,"JavaScript errors: "+errors.join("; "));
      if(vp.width!==768) {
        await page.addStyleTag({content:anonymize});
        const noBrand=dest+"/toop-no-brand-"+vp.width+".png";
        await page.screenshot({path:noBrand,fullPage:true,animations:"disabled",timeout:45000});
        printEvidence("toop-no-brand-"+vp.width,noBrand);
      }
      report.push({width:vp.width,status:"PASS_FUNCTIONAL",overflow,canonical,errors:errors.length});
      console.log("[toop-qa] PASS functional "+vp.width+" (not a perceptual approval)");
    } catch(e) {
      failures.push({view:vp.width,error:String(e)});
      console.error("[toop-qa] FAIL "+vp.width+": "+String(e));
      await page.screenshot({path:dest+"/"+name+"-failure.png",fullPage:true}).catch(()=>{});
    }finally{await context.close();}
  }
  for(const width of [390,1440]){
    const ctx=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:"reduce",deviceScaleFactor:1});
    const page=await ctx.newPage();
    try{
      const response=await page.goto(base+"/portfolio/your-brutus-burguer?0web_preview=1",{waitUntil:"domcontentloaded",timeout:45000});
      assert.equal(response?.status(),200,"comparison restaurant 200");
      await page.evaluate(()=>document.fonts.ready);
      await page.addStyleTag({content:anonymize});
      const file=dest+"/brutus-no-brand-"+width+".png";
      await page.screenshot({path:file,fullPage:true,animations:"disabled",timeout:45000});
      printEvidence("brutus-no-brand-"+width,file);
      console.log("[toop-qa] restaurant comparison artifact "+width+" captured; NO-BRAND verdict pending HUMAN review");
    }catch(e){failures.push({view:"compare-"+width,error:String(e)});console.error("[toop-qa] comparison FAIL "+width+": "+e);}
    finally{await ctx.close();}
  }
}finally{await browser.close();}
console.log("TOOP_QA_RESULT_JSON:"+JSON.stringify({report,failures,perceptualReview:"NOT_REVIEWED",baselineStatus:"NOT_VERSIONED"}));
process.exit(failures.length?1:0);
