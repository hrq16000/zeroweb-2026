/**
 * Issue #510 — OFFLINE feasibility probe for Crawlee-style source discovery.
 *
 * Takes pre-supplied HTML snapshots; NEVER makes network calls or executes JS.
 * Nothing imports this module into the 0WEB runtime. Not a scraper or R1 provider.
 * Its limited HTML matching intentionally supports only static test fixtures.
 */
import { createHash } from "node:crypto";
import { isIP } from "node:net";

const LIMITS = Object.freeze({ maxPages: 3, maxDepth: 1, concurrency: 1, networkRequests: 0 });
const MAX_HTML_CHARS = 100_000;
const DISALLOWED_PATH = /(?:^|\/)(?:admin|login|signin|signup|auth|account|checkout|cart|wp-admin|wp-login\.php)(?:\/|$)/i;

function normalizedUrl(raw, base, allowedHosts) {
  try {
    const u = new URL(raw, base);
    const host = u.hostname.toLowerCase();
    if (
      u.protocol !== "https:" || u.port || u.username || u.password ||
      isIP(host) || !host.includes(".") ||
      /(?:^|\.)(?:localhost|local|internal|onion|test)$/.test(host) ||
      !allowedHosts.has(host) || DISALLOWED_PATH.test(u.pathname)
    ) return null;
    u.hash = "";
    u.search = ""; // Query strings may carry tokens and duplicate content.
    return u.toString();
  } catch {
    return null;
  }
}

function textInTag(html, tag) {
  const match = html.match(new RegExp("<" + tag + "\\b[^>]*>([\\s\\S]*?)<\\/" + tag + "\\s*>", "i"));
  return match ? match[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 180) : null;
}

function description(html) {
  const match = html.match(/<meta\b(?=[^>]*\bname\s*=\s*["']description["'])(?=[^>]*\bcontent\s*=\s*["']([^"']*)["'])[^>]*>/i);
  return match?.[1]?.trim().slice(0, 320) || null;
}

function outgoingLinks(html, base, allowedHosts) {
  const links = [];
  const regex = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(regex)) {
    const normalized = normalizedUrl(match[1], base, allowedHosts);
    if (normalized && !links.includes(normalized)) links.push(normalized);
    if (links.length >= 20) break;
  }
  return links;
}

/**
 * No network / no secrets / no publishing. Caller supplies exact snapshot URLs.
 * For an actual online implementation: add DNS + redirect SSRF validation,
 * robots/terms enforcement and durable cross-process quotas in a separate PR.
 */
export function probeOfflinePortfolioSite({
  enabled = false,
  clientKey,
  seedUrl,
  allowedHosts = [],
  snapshots = {},
  retrievedAt = new Date().toISOString(),
} = {}) {
  const empty = (status) => ({ status, pages: [], visited: 0, limits: LIMITS });
  if (!enabled) return empty("disabled");
  if (typeof clientKey !== "string" || !/^[a-z0-9][a-z0-9_-]{0,80}$/i.test(clientKey)) return empty("invalid_client");
  if (!Array.isArray(allowedHosts) || !allowedHosts.length || allowedHosts.length > 3) return empty("invalid_allowlist");
  if (typeof retrievedAt !== "string" || !Number.isFinite(Date.parse(retrievedAt))) return empty("invalid_date");
  const hosts = new Set();
  for (const raw of allowedHosts) {
    if (typeof raw !== "string" || !/^[a-z0-9.-]+$/i.test(raw) || !raw.includes(".") ||
        isIP(raw) || /(?:^|\.)(?:localhost|local|internal|onion|test)$/.test(raw)) return empty("invalid_allowlist");
    hosts.add(raw.toLowerCase());
  }
  const seed = normalizedUrl(seedUrl, undefined, hosts);
  if (!seed) return empty("invalid_seed");

  // Ignore inherited keys, functions and unusual objects in fixture maps.
  if (!snapshots || typeof snapshots !== "object" || Array.isArray(snapshots)) return empty("invalid_snapshots");
  const queue = [{ url: seed, depth: 0 }];
  const queued = new Set([seed]);
  const pages = [];
  let visited = 0;
  while (queue.length && visited < LIMITS.maxPages) {
    const { url, depth } = queue.shift();
    visited += 1; // Missing snapshots consume a unit, preventing unbounded attempts.
    const html = Object.hasOwn(snapshots, url) ? snapshots[url] : null;
    if (typeof html !== "string" || html.length > MAX_HTML_CHARS) {
      pages.push({ sourceUrl: url, depth, status: "snapshot_missing_or_oversize" });
      continue;
    }
    const links = depth < LIMITS.maxDepth ? outgoingLinks(html, url, hosts) : [];
    pages.push({
      sourceUrl: url,
      depth,
      status: "candidate_unverified",
      clientKey,
      verification: "UNVERIFIED",
      usageRights: "UNKNOWN",
      retrievedAt,
      contentSha256: createHash("sha256").update(html, "utf8").digest("hex"),
      title: textInTag(html, "title"),
      description: description(html),
      discoveredLinks: links.slice(0, LIMITS.maxPages),
    });
    for (const next of links) {
      if (queued.size >= LIMITS.maxPages || depth >= LIMITS.maxDepth) break;
      if (!queued.has(next)) {
        queue.push({ url: next, depth: depth + 1 });
        queued.add(next);
      }
    }
  }
  return { status: "offline_only", pages, visited, limits: LIMITS };
}
