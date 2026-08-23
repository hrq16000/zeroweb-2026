/** IndexNow (Bing/Yandex/Seznam) — submissão de URLs com log e alerta em falhas. */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? "0web7f3c1a92b64d4e8fa15c0d2e6b8a7c3";
const SITE_URL = "https://0web.com.br";
const HOST = "0web.com.br";
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function sitemapUrls(): Promise<string[]> {
  const { SITEMAPS } = await import("@/lib/gsc-sync.server");
  const urls = new Set<string>();
  for (const file of SITEMAPS) {
    if (file === "sitemap.xml") continue;
    try {
      const res = await fetch(`${SITE_URL}/${file}`);
      if (!res.ok) continue;
      const xml = await res.text();
      for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1].trim());
    } catch {
      /* ignora sitemap indisponível */
    }
  }
  return [...urls];
}

export async function submitToIndexNow(supabase: any, inputUrls?: string[]) {
  const urls = (inputUrls?.length ? inputUrls : await sitemapUrls())
    .filter((u) => u.startsWith(SITE_URL))
    .slice(0, 10000);

  if (urls.length === 0) return { submitted: 0, status: "no_urls" as const };

  let responseCode = 0;
  let errorMessage: string | null = null;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    responseCode = res.status;
    if (!res.ok) errorMessage = (await res.text()).slice(0, 500);
  } catch (e) {
    errorMessage = (e as Error).message;
  }

  const ok = responseCode >= 200 && responseCode < 300;
  const rows = urls.slice(0, 500).map((url) => ({
    url,
    engine: "indexnow",
    status: ok ? "ok" : "error",
    response_code: responseCode || null,
    error_message: errorMessage,
  }));
  await supabase.from("indexnow_submissions").insert(rows);

  if (!ok) {
    await supabase.from("seo_alerts").insert({
      alert_type: "indexnow_failure",
      severity: "critical",
      url: urls[0],
      title: `Envio IndexNow falhou (HTTP ${responseCode || "sem resposta"}) para ${urls.length} URLs`,
      probable_cause: errorMessage ?? "Endpoint IndexNow indisponível ou chave inválida.",
      suggested_fix: `Confirme que ${SITE_URL}/${INDEXNOW_KEY}.txt está publicado e contém exatamente a chave.`,
      fix_link: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    });
    const { notifyPendingSeoAlerts } = await import("@/lib/seo-alerts.server");
    await notifyPendingSeoAlerts(supabase).catch(() => null);
  }

  return { submitted: urls.length, status: ok ? ("ok" as const) : ("error" as const), responseCode, errorMessage };
}
