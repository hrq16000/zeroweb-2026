const SITE_URL = "https://0web.com.br";

export async function assertIndexWatchAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin") && !roles.includes("super_admin")) {
    throw new Error("forbidden");
  }
}

/** Lê um sitemap do próprio site e devolve as <loc> encontradas. */
export async function fetchSitemapUrls(sitemapFile: string): Promise<string[]> {
  const res = await fetch(`${SITE_URL}/${sitemapFile}`, {
    headers: { accept: "application/xml" },
  });
  if (!res.ok) throw new Error(`sitemap_fetch_failed_${res.status}`);
  const xml = await res.text();
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
  return Array.from(new Set(locs));
}
