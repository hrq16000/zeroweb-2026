import { isIP } from 'node:net';

const SCRAPE_ENDPOINT = 'https://api.firecrawl.dev/v2/scrape';
const MAX_CONTENT_CHARS = 40_000;
const MAX_PILOT_CREDITS = 10;

/**
 * Node/server-only, opt-in Firecrawl pilot. It is deliberately NOT wired into R1,
 * the browser bundle, portfolio publishing, or any production route.
 * All content returned by the provider is UNVERIFIED research evidence.
 */
export function createFirecrawlScrapeAdapter({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  const enabled = env.FIRECRAWL_ENABLED === 'true';
  const apiKey = typeof env.FIRECRAWL_API_KEY === 'string' ? env.FIRECRAWL_API_KEY.trim() : '';
  const rawBudget = String(env.FIRECRAWL_MAX_CREDITS ?? '3');
  const maxCredits = /^\d+$/.test(rawBudget) ? Number(rawBudget) : NaN;
  const allowedHosts = new Set(
    String(env.FIRECRAWL_ALLOWED_HOSTS ?? '').split(',').map((host) => host.trim().toLowerCase()).filter(Boolean),
  );
  let reservedCredits = 0;

  function getBudget() {
    return {
      maxCredits: Number.isInteger(maxCredits) && maxCredits >= 1 && maxCredits <= MAX_PILOT_CREDITS ? maxCredits : 0,
      reservedCredits,
      // Reservations are an upper bound on requests sent by this instance,
      // NOT an authoritative measurement of the provider's account billing.
    };
  }

  async function scrape(rawUrl) {
    if (!enabled) return { status: 'disabled' };
    if (!Number.isInteger(maxCredits) || maxCredits < 1 || maxCredits > MAX_PILOT_CREDITS) {
      return { status: 'invalid_configuration' };
    }
    if (!apiKey || allowedHosts.size === 0 || typeof fetchImpl !== 'function') {
      return { status: 'not_configured' };
    }

    let url;
    try {
      if (typeof rawUrl !== 'string') return { status: 'invalid_url' };
      const parsed = new URL(rawUrl);
      const hostname = parsed.hostname.toLowerCase();
      if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port ||
          !hostname.includes('.') || isIP(hostname) ||
          /(^|\.)(localhost|local|internal|onion)$/.test(hostname)) {
        return { status: 'invalid_url' };
      }
      if (!allowedHosts.has(hostname)) return { status: 'host_not_allowed' };
      parsed.hash = '';
      url = parsed.toString();
    } catch {
      return { status: 'invalid_url' };
    }

    // Reserve synchronously BEFORE awaiting the provider to avoid parallel overspend
    // inside the same process. Failures do not refund a reservation: fail-closed.
    if (reservedCredits >= maxCredits) return { status: 'budget_exhausted' };
    reservedCredits += 1;

    try {
      const response = await fetchImpl(SCRAPE_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true }),
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) return { status: 'provider_error', httpStatus: response.status };
      const body = await response.json();
      const markdown = body?.data?.markdown;
      if (body?.success !== true || typeof markdown !== 'string' || !markdown.trim()) {
        return { status: 'invalid_response' };
      }
      const title = body.data?.metadata?.title;
      return {
        status: 'ok',
        evidence: {
          provider: 'firecrawl',
          sourceUrl: url,
          verification: 'UNVERIFIED',
          title: typeof title === 'string' ? title.slice(0, 200) : null,
          markdown: markdown.slice(0, MAX_CONTENT_CHARS),
        },
        estimatedCreditsReserved: 1,
      };
    } catch {
      // Never surface provider error bodies or messages, which may contain secrets.
      return { status: 'provider_unavailable' };
    }
  }

  return { scrape, getBudget };
}
