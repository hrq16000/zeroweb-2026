import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCcw } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PainelGate } from "@/components/site/PainelGate";
import clients from "@/config/portfolio-clients.json";

export const Route = createFileRoute("/painel-metadados")({
  head: () => ({
    meta: [
      { title: "Painel · Auditoria de metadados · 0WEB" },
      {
        name: "description",
        content:
          "Auditoria por projeto dos metadados de prévia social: título, descrição, og:image, twitter:image, apple-touch-icon e favicon.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <PainelGate>
      <MetadataAuditPanel />
    </PainelGate>
  ),
  ssr: false,
});

type ImageInfo = { url: string; ok: boolean; width?: number; height?: number; format?: string };

type RowState = {
  slug: string;
  name: string;
  status: "loading" | "ok" | "error";
  title?: string;
  description?: string;
  ogImage?: ImageInfo;
  twitterImage?: ImageInfo;
  appleTouchIcon?: ImageInfo;
  favicon?: ImageInfo;
  problems: string[];
};

const formatOf = (url: string) => {
  const clean = url.split("?")[0]?.toLowerCase() ?? "";
  const ext = clean.slice(clean.lastIndexOf(".") + 1);
  return ext.length <= 5 ? ext : "—";
};

function probeImage(url?: string | null): Promise<ImageInfo | undefined> {
  if (!url) return Promise.resolve(undefined);
  return new Promise((done) => {
    const img = new Image();
    img.onload = () =>
      done({ url, ok: true, width: img.naturalWidth, height: img.naturalHeight, format: formatOf(url) });
    img.onerror = () => done({ url, ok: false, format: formatOf(url) });
    img.src = url;
  });
}

async function auditSlug(slug: string, name: string): Promise<RowState> {
  const problems: string[] = [];
  try {
    const res = await fetch(`/portfolio/${slug}`, { headers: { Accept: "text/html" } });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const attr = (sel: string, key = "content") =>
      doc.querySelector(sel)?.getAttribute(key) ?? undefined;

    const title = doc.querySelector("title")?.textContent ?? undefined;
    const description = attr('meta[name="description"]');
    const og = attr('meta[property="og:image"]');
    const tw = attr('meta[name="twitter:image"]');
    const apple = attr('link[rel="apple-touch-icon"]', "href");
    const favicon = attr('link[rel="icon"]', "href");

    const [ogImage, twitterImage, appleTouchIcon, faviconInfo] = await Promise.all([
      probeImage(og),
      probeImage(tw),
      probeImage(apple),
      probeImage(favicon),
    ]);

    if (!title) problems.push("sem <title>");
    if (!description) problems.push("sem meta description");
    if (!og) problems.push("sem og:image");
    if (!tw) problems.push("sem twitter:image");
    if (!apple) problems.push("sem apple-touch-icon");
    if (!favicon) problems.push("sem favicon");
    if (og && /\.webp(\?|$)/i.test(og)) problems.push("og:image em WebP (não renderiza no WhatsApp)");
    if (og && !/[?&]v=/.test(og)) problems.push("og:image sem cache-busting (?v=)");
    if (ogImage?.ok === false) problems.push("og:image não carrega");
    if (ogImage?.width && (ogImage.width < 600 || ogImage.height! < 315))
      problems.push("og:image menor que 600x315");

    return {
      slug,
      name,
      status: "ok",
      title,
      description,
      ogImage,
      twitterImage,
      appleTouchIcon,
      favicon: faviconInfo,
      problems,
    };
  } catch (err) {
    return {
      slug,
      name,
      status: "error",
      problems: [err instanceof Error ? err.message : "falha ao carregar a rota"],
    };
  }
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="truncate text-sm text-foreground" title={value ?? "—"}>
        {value ?? "—"}
      </p>
    </div>
  );
}

function ImageField({ label, info }: { label: string; info?: ImageInfo }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      {info ? (
        <div className="flex items-center gap-2">
          <img
            src={info.url}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-10 w-10 shrink-0 rounded border border-border object-cover"
          />
          <span className="truncate text-xs text-muted-foreground" title={info.url}>
            {info.ok ? `${info.width}×${info.height} · ${info.format}` : "não carrega"}
          </span>
        </div>
      ) : (
        <p className="text-sm text-destructive">ausente</p>
      )}
    </div>
  );
}

function MetadataAuditPanel() {
  const list = (clients as Array<{ slug: string; name?: string; displayName?: string }>).map((c) => ({
    slug: c.slug,
    name: c.displayName ?? c.name ?? c.slug,
  }));
  const [rows, setRows] = useState<RowState[]>([]);
  const [running, setRunning] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenMsg, setRegenMsg] = useState<string | null>(null);

  const regenerate = useCallback(async () => {
    setRegenerating(true);
    setRegenMsg(null);
    try {
      const { regenerateSocialAssets } = await import("@/lib/social-regeneration.functions");
      const r = await regenerateSocialAssets({ data: {} });
      if (r.skipped) setRegenMsg(`Execução ignorada (${r.skipped}).`);
      else if (!r.ok) setRegenMsg(`Falhou: ${r.error ?? "erro desconhecido"}`);
      else
        setRegenMsg(
          `Verificação concluída · ${r.checked ?? 0} projeto(s) conferido(s)` +
            (r.problems && r.problems.length > 0
              ? ` · ${r.problems.length} pendência(s). A regeneração das imagens é feita pelo worker "node scripts/regenerate-social-images.mjs".`
              : ". Nenhuma imagem foi reprocessada: esta ação apenas confere os assets publicados."),
        );
    } catch {
      setRegenMsg("Falha ao solicitar a verificação (é necessário estar logado como admin).");
    } finally {
      setRegenerating(false);
    }
  }, []);


  const run = useCallback(async () => {
    setRunning(true);
    setRows(list.map((c) => ({ ...c, status: "loading" as const, problems: [] })));
    const results: RowState[] = [];
    for (const c of list) {
      // Sequencial: evita disparar dezenas de requisições de SSR ao mesmo tempo.
      const row = await auditSlug(c.slug, c.name);
      results.push(row);
      setRows([...results, ...list.slice(results.length).map((r) => ({ ...r, status: "loading" as const, problems: [] }))]);
    }
    setRunning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void run();
  }, [run]);

  const withProblems = rows.filter((r) => r.problems.length > 0).length;

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Auditoria de metadados</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Título, descrição, prévia social e ícones lidos diretamente do HTML de cada
              <span className="font-mono"> /portfolio/&lt;slug&gt;</span>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void run()}
              disabled={running}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold transition hover:bg-muted disabled:opacity-60"
            >
              <RefreshCcw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} aria-hidden="true" />
              {running ? "Auditando…" : "Reexecutar"}
            </button>
            <button
              type="button"
              onClick={() => void regenerate()}
              disabled={regenerating}
              title="Confere se cada projeto tem imagem social, ícone e versão de cache publicados. A regeneração dos arquivos é feita pelo worker de imagens."
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              <RefreshCcw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} aria-hidden="true" />
              {regenerating ? "Verificando…" : "Verificar imagens sociais"}
            </button>

          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground" role="status">
          {running
            ? `Analisando ${rows.filter((r) => r.status !== "loading").length}/${list.length} projetos…`
            : `${list.length} projetos analisados · ${withProblems} com pendências.`}
        </p>

        {regenMsg && (
          <p className="mt-2 text-sm text-muted-foreground" role="status">
            {regenMsg} · histórico em <a className="underline" href="/painel/historico-jobs">/painel/historico-jobs</a>
          </p>
        )}


        <div className="mt-6 space-y-3">
          {rows.map((row) => (
            <article key={row.slug} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">{row.name}</h2>
                  <p className="font-mono text-xs text-muted-foreground">/portfolio/{row.slug}</p>
                </div>
                {row.status === "loading" ? (
                  <span className="text-xs text-muted-foreground">carregando…</span>
                ) : row.problems.length === 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> conforme
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" /> {row.problems.length} pendência(s)
                  </span>
                )}
              </div>

              {row.status !== "loading" && (
                <>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="title" value={row.title} />
                    <Field label="description" value={row.description} />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ImageField label="og:image" info={row.ogImage} />
                    <ImageField label="twitter:image" info={row.twitterImage} />
                    <ImageField label="apple-touch-icon" info={row.appleTouchIcon} />
                    <ImageField label="favicon" info={row.favicon} />
                  </div>
                  {row.problems.length > 0 && (
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-destructive">
                      {row.problems.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
