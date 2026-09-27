#!/usr/bin/env node
/** Gate estático da malha interna universal de /portfolio. */
import { readFile } from "node:fs/promises";
const catalog=JSON.parse(await readFile("src/config/portfolio-catalog.json","utf8"));
const PUBLIC=new Set(["published","approved"]),GENERIC=new Set(["","brasil","região a confirmar","regiao a confirmar"]),LIMIT=6;
const clean=v=>typeof v==="string"?v.trim():"";
const norm=(v="")=>clean(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const useful=v=>!GENERIC.has(norm(v));
const items=catalog.filter(x=>PUBLIC.has(x.status??"")&&x.live!==false).map(x=>({slug:clean(x.slug),title:clean(x.title),segment:clean(x.segment),city:clean(x.city),state:clean(x.state),projectType:clean(x.projectType),tags:Array.isArray(x.tags)?[...new Set(x.tags.map(t=>norm(String(t??""))).filter(Boolean))]:[]}));
function score(a,b){let s=0;if(a.segment&&b.segment&&norm(a.segment)===norm(b.segment))s+=8;if(useful(a.city)&&useful(b.city)&&norm(a.city)===norm(b.city))s+=7;if(a.state&&b.state&&norm(a.state)===norm(b.state))s+=2;const at=new Set(a.tags.map(norm));s+=Math.min(8,b.tags.filter(t=>at.has(norm(t))).length*2);if(a.projectType&&b.projectType&&norm(a.projectType)===norm(b.projectType))s+=1;return s;}
function related(a){const ranked=items.filter(b=>b.slug!==a.slug).map(b=>({...b,score:score(a,b)})).sort((x,y)=>y.score-x.score||x.title.localeCompare(y.title,"pt-BR"));const strong=ranked.filter(x=>x.score>=3);if(strong.length>=LIMIT)return strong.slice(0,LIMIT);const chosen=new Map(strong.map(x=>[x.slug,x]));for(const x of ranked){if(chosen.size>=LIMIT)break;if(!chosen.has(x.slug))chosen.set(x.slug,x);}return [...chosen.values()].slice(0,LIMIT);}
const incoming=new Map(items.map(x=>[x.slug,0]));const failures=[];
if(new Set(items.map(x=>x.slug)).size!==items.length)failures.push("slugs publicados duplicados");
for(const item of items){if(!item.slug||!item.title)failures.push(`${item.slug||"<sem-slug>"}: identidade mínima ausente`);const links=related(item);if(links.length!==Math.min(LIMIT,Math.max(0,items.length-1)))failures.push(`${item.slug}: ${links.length} links de saída`);for(const link of links)incoming.set(link.slug,(incoming.get(link.slug)??0)+1);}
for(const [slug,count] of incoming)if(count===0)failures.push(`${slug}: portfolio órfão, sem backlink interno`);
console.log(`[portfolio-link-graph] ${items.length} publicados · ${[...incoming.values()].filter(x=>x===0).length} órfão(s)`);
if(failures.length){for(const f of failures)console.error(` - ${f}`);process.exit(1);}console.log("[portfolio-link-graph] OK");
