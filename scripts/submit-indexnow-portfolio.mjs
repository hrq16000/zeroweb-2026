#!/usr/bin/env node
/** Notify IndexNow only after proving the portfolio is indexable on its canonical host. */
import { readFile } from "node:fs/promises";

const origin = "https://0web.com.br";
const slug = process.argv[2];
const checkOnly = process.argv.includes("--check-only");
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid portfolio slug");

const key = (await readFile(new URL("../public/0web7f3c1a92b64d4e8fa15c0d2e6b8a7c3.txt", import.meta.url), "utf8")).trim();
if (!/^[a-zA-Z0-9_-]{8,128}$/.test(key)) throw new Error("Invalid IndexNow key");
const url = origin + "/portfolio/" + slug;
const keyUrl = origin + "/" + key + ".txt";

async function getVerified(address) {
  let error;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(address, {
        headers: { "User-Agent": "0WEB-indexnow-publication-gate/1.0", "Cache-Control": "no-cache" },
        redirect: "follow",
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      if (new URL(response.url).origin !== origin) throw new Error("Redirect outside canonical host");
      return { body: await response.text(), headers: response.headers };
    } catch (e) {
      error = e;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }
  throw new Error("Cannot verify " + address + ": " + String(error));
}

function attribute(tag, name) {
  return tag.match(new RegExp("\\b" + name + "\\s*=\\s*([\"'])(.*?)\\1", "i"))?.[2] || "";
}
function findTag(html, kind, name, value) {
  return [...html.matchAll(new RegExp("<" + kind + "\\b[^>]*>", "gi"))]
    .map((m) => m[0])
    .find((tag) => attribute(tag, name).toLowerCase() === value) || "";
}

const [page, robots, sitemap, keyFile] = await Promise.all([
  getVerified(url), getVerified(origin + "/robots.txt"),
  getVerified(origin + "/sitemap-portfolio.xml"), getVerified(keyUrl),
]);

if (keyFile.body.trim() !== key) throw new Error("The public IndexNow key file does not match");
if (!/^\s*User-agent:\s*\*/im.test(robots.body)) throw new Error("Missing public robots group");
if (/^\s*Disallow:\s*\/portfolio(?:\/|\s|$)/im.test(robots.body)) throw new Error("Portfolio is blocked by robots.txt");
if (!/<urlset(?:\s|>)/i.test(sitemap.body)) throw new Error("Invalid sitemap");
if (!sitemap.body.includes("<loc>" + url + "</loc>")) throw new Error("Canonical URL is missing from live sitemap");

const robotsTag = findTag(page.body, "meta", "name", "robots");
const metaRobots = attribute(robotsTag, "content").toLowerCase();
const xRobots = (page.headers.get("x-robots-tag") || "").toLowerCase();
if (!/(?:^|[,;\s])index(?:[,;\s]|$)/.test(metaRobots) || /noindex/.test(metaRobots + " " + xRobots)) {
  throw new Error("Portfolio cannot be indexed: " + metaRobots + " / X-Robots " + xRobots);
}
const canonical = attribute(findTag(page.body, "link", "rel", "canonical"), "href");
if (canonical !== url) throw new Error("Canonical does not match: " + canonical);
if (!/<title[\s>]/i.test(page.body)) throw new Error("Page title missing");
if (slug === "agropet-filt" && !/Agropet Filt/i.test(page.body)) throw new Error("Live commercial page missing");

console.log("[indexability] PASS · " + url + " · HTTP 200 · index · canonical · sitemap · IndexNow key");
if (checkOnly) {
  console.log("[indexnow] CHECK_ONLY: no submission was sent");
} else {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: "0web.com.br", key, keyLocation: keyUrl, urlList: [url] }),
    signal: AbortSignal.timeout(20000),
  });
  const details = (await response.text()).slice(0, 400);
  if (![200, 202].includes(response.status)) {
    throw new Error("IndexNow returned HTTP " + response.status + " " + details);
  }
  console.log("[indexnow] HTTP " + response.status + " · submitted " + url + " (receipt, not indexing guarantee)");
}
