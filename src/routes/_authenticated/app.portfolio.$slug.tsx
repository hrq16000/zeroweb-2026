import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Monitor, Save, Smartphone, Upload } from "lucide-react";
import {
  getPortfolioAdminProject,
  savePortfolioAdminProject,
  setPortfolioAdminArchived,
  setPortfolioAdminPublication,
  uploadPortfolioAdminAsset,
} from "@/lib/portfolio-admin.functions";
import type { MergedProject } from "@/lib/portfolio-admin";
import {
  getVisualQuality,
  SEVERITY_STYLE,
  VISUAL_BADGE_STYLE,
} from "@/lib/portfolio-visual-quality";
import portfolioCoverPlan from "@/config/portfolio-cover-plan.json";
import {
  auditPortfolioFunnelContext,
  resolvePortfolioFunnelContext,
} from "@/lib/portfolio-funnel-context";
import { buildPortfolioQuizPreviewMessage } from "@/lib/portfolio-quiz-copy";
import portfolioVisualReview from "@/config/portfolio-visual-review.json";
import portfolioBrandReview from "@/config/portfolio-brand-review.json";
import portfolioAssets from "@/config/portfolio-assets.json";

export const Route = createFileRoute("/_authenticated/app/portfolio/$slug")({
  component: PortfolioAdminDetail,
});

type Values = {
  display_name: string;
  segment: string;
  city: string;
  state: string;
  summary: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  canonical_url: string;
  logo_url: string;
  hero_image_url: string;
  hero_headline: string;
  hero_subheadline: string;
  social_image_url: string;
  social_version: string;
  cta_label: string;
  share_copy: string;
  gallery: string[];
};

const fromProject = (p: MergedProject): Values => ({
  display_name: p.displayName,
  segment: p.segment,
  city: p.city,
  state: p.state,
  summary: p.summary,
  seo_title: p.seoTitle,
  seo_description: p.seoDescription,
  seo_keywords: p.seoKeywords,
  canonical_url: p.canonicalUrl,
  logo_url: p.logoUrl,
  hero_image_url: p.heroImageUrl,
  hero_headline: p.heroHeadline,
  hero_subheadline: p.heroSubheadline,
  social_image_url: p.socialImageUrl,
  social_version: p.socialVersion,
  cta_label: p.ctaLabel,
  share_copy: p.shareCopy,
  gallery: p.gallery,
});

const TABS = ["identidade", "seo", "assets", "divulgacao", "preview", "historico"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, string> = {
  identidade: "Identidade",
  seo: "SEO",
  assets: "Imagens",
  divulgacao: "Divulgação",
  preview: "Prévia",
  historico: "Histórico",
};

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  hint?: string;
  rows?: number;
}) {
  const id = props.label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {props.label}
      </span>
      {props.textarea ? (
        <textarea
          id={id}
          rows={props.rows ?? 4}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background p-3 text-sm"
        />
      ) : (
        <input
          id={id}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        />
      )}
      {props.hint && <span className="mt-1 block text-xs text-muted-foreground">{props.hint}</span>}
    </label>
  );
}

function PortfolioAdminDetail() {
  const { slug } = Route.useParams();
  const load = useServerFn(getPortfolioAdminProject);
  const save = useServerFn(savePortfolioAdminProject);
  const publish = useServerFn(setPortfolioAdminPublication);
  const archive = useServerFn(setPortfolioAdminArchived);
  const upload = useServerFn(uploadPortfolioAdminAsset);

  const [project, setProject] = useState<MergedProject | null>(null);
  const [history, setHistory] = useState<Array<Record<string, string>>>([]);
  const [values, setValues] = useState<Values | null>(null);
  const [tab, setTab] = useState<Tab>("identidade");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const res = await load({ data: { slug } });
      setProject(res.project as MergedProject);
      setValues(fromProject(res.project as MergedProject));
      setHistory(res.history as unknown as Array<Record<string, string>>);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar projeto");
    }
  }, [load, slug]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const dirty = useMemo(
    () => (project && values ? JSON.stringify(fromProject(project)) !== JSON.stringify(values) : false),
    [project, values],
  );

  const set = (key: keyof Values) => (v: string) =>
    setValues((prev) => (prev ? { ...prev, [key]: v } : prev));

  const onSave = async () => {
    if (!project || !values) return;
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const res = await save({
        data: { slug, expectedVersion: project.contentVersion, values },
      });
      setProject(res.project as MergedProject);
      setValues(fromProject(res.project as MergedProject));
      setMessage(
        res.savedFields.length
          ? `Rascunho salvo: ${res.savedFields.join(", ")}.`
          : "Nada mudou — nada foi gravado.",
      );
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao salvar");
    } finally {
      setBusy(false);
    }
  };

  const onPublish = async (next: boolean) => {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const res = await publish({ data: { slug, published: next } });
      setProject(res.project as MergedProject);
      setMessage(next ? "Projeto publicado." : "Projeto despublicado.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao alterar publicação");
    } finally {
      setBusy(false);
    }
  };

  const onArchive = async (next: boolean) => {
    setBusy(true);
    try {
      const res = await archive({ data: { slug, archived: next } });
      setProject(res.project as MergedProject);
      setMessage(next ? "Projeto arquivado (nada foi apagado)." : "Projeto restaurado.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao arquivar");
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (kind: "logo" | "hero" | "social" | "gallery", file: File) => {
    setBusy(true);
    setError(null);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      let binary = "";
      for (const byte of buf) binary += String.fromCharCode(byte);
      const res = await upload({
        data: {
          slug,
          kind,
          fileName: file.name,
          contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/avif",
          base64: btoa(binary),
        },
      });
      setValues((prev) => {
        if (!prev) return prev;
        if (kind === "logo") return { ...prev, logo_url: res.url };
        if (kind === "hero") return { ...prev, hero_image_url: res.url };
        if (kind === "social") return { ...prev, social_image_url: res.url };
        return { ...prev, gallery: [...prev.gallery, res.url] };
      });
      setMessage("Imagem enviada. Salve para aplicar.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha no envio da imagem");
    } finally {
      setBusy(false);
    }
  };

  if (error && !project) {
    return (
      <div className="max-w-3xl">
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error}
        </p>
      </div>
    );
  }
  if (!project || !values) return <p className="text-sm text-muted-foreground">Carregando…</p>;

  return (
    <div className="max-w-5xl">
      <Link to="/app/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar aos projetos
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">{project.displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            /portfolio/{project.slug} · versão {project.contentVersion} · {project.lifecycleStatus}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy || !dirty}
            onClick={() => void onSave()}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Save className="h-4 w-4" aria-hidden="true" /> Salvar rascunho
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onPublish(!project.published)}
            className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-medium disabled:opacity-50"
          >
            {project.published ? "Despublicar" : "Publicar"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onArchive(project.lifecycleStatus !== "archived")}
            className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-medium disabled:opacity-50"
          >
            {project.lifecycleStatus === "archived" ? "Restaurar" : "Arquivar"}
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4 text-sm">
        <p>
          Conformidade:{" "}
          <strong>{project.conformance.status}</strong>
          {project.conformance.issues.length > 0 && ` — ${project.conformance.issues.join(", ")}`}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Estrutura protegida: componente <code>{project.structure.componentFile || "—"}</code>, CTA{" "}
          {project.structure.hasCta ? "detectado" : "ausente"}. Slug, rota e componente não são
          editáveis por aqui.
        </p>
      </div>

      {message && <p className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm">{message}</p>}
      {error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t}
            className={`min-h-11 rounded-md px-3 text-sm font-medium ${tab === t ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {tab === "identidade" && (
          <>
            <Field label="Nome exibido" value={values.display_name} onChange={set("display_name")} />
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Segmento" value={values.segment} onChange={set("segment")} />
              <Field label="Cidade" value={values.city} onChange={set("city")} />
              <Field label="UF" value={values.state} onChange={set("state")} />
            </div>
            <Field label="Resumo" value={values.summary} onChange={set("summary")} textarea />
            <Field label="Título do herói" value={values.hero_headline} onChange={set("hero_headline")} />
            <Field
              label="Subtítulo do herói"
              value={values.hero_subheadline}
              onChange={set("hero_subheadline")}
            />
            <Field
              label="Texto do botão principal"
              value={values.cta_label}
              onChange={set("cta_label")}
              hint="O destinatário do funil continua no servidor; aqui só o texto do botão."
            />
          </>
        )}

        {tab === "seo" && (
          <>
            <Field label="Título SEO" value={values.seo_title} onChange={set("seo_title")} />
            <Field
              label="Descrição SEO"
              value={values.seo_description}
              onChange={set("seo_description")}
              textarea
              hint="Mínimo recomendado de 80 caracteres para passar na conformidade."
            />
            <Field label="Palavras-chave" value={values.seo_keywords} onChange={set("seo_keywords")} />
            <Field
              label="URL canônica"
              value={values.canonical_url}
              onChange={set("canonical_url")}
              hint="Alterar a canônica de um projeto publicado impacta indexação."
            />
          </>
        )}

        {tab === "assets" && (
          <>
            {(
              [
                ["logo", "Logo", values.logo_url, set("logo_url")],
                ["hero", "Imagem principal", values.hero_image_url, set("hero_image_url")],
                ["social", "Imagem social (1200×630)", values.social_image_url, set("social_image_url")],
              ] as const
            ).map(([kind, label, value, onChange]) => (
              <div key={kind} className="rounded-lg border border-border p-4">
                <Field label={label} value={value} onChange={onChange} />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm">
                    <Upload className="h-4 w-4" aria-hidden="true" /> Enviar imagem
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void onUpload(kind, f);
                      }}
                    />
                  </label>
                  {value && (
                    <img src={value} alt={`Prévia — ${label}`} className="h-16 w-auto rounded border border-border" loading="lazy" />
                  )}
                </div>
              </div>
            ))}

            <div className="rounded-lg border border-border p-4">
              <h2 className="text-sm font-semibold">Galeria ({values.gallery.length})</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {values.gallery.map((src) => (
                  <div key={src} className="w-28">
                    <img src={src} alt="" className="h-20 w-full rounded border border-border object-cover" loading="lazy" />
                    <button
                      type="button"
                      onClick={() =>
                        setValues((prev) =>
                          prev ? { ...prev, gallery: prev.gallery.filter((g) => g !== src) } : prev,
                        )
                      }
                      className="mt-1 w-full text-xs text-muted-foreground underline"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm">
                <Upload className="h-4 w-4" aria-hidden="true" /> Adicionar à galeria
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onUpload("gallery", f);
                  }}
                />
              </label>
            </div>

            <Field
              label="Versão da imagem social"
              value={values.social_version}
              onChange={set("social_version")}
              hint="Altere para forçar novo cache de prévia no WhatsApp/Facebook/X."
            />
          </>
        )}

        {tab === "divulgacao" && (
          <Field
            label="Texto de divulgação"
            value={values.share_copy}
            onChange={set("share_copy")}
            textarea
            rows={10}
            hint="Usado pelo botão “Copiar divulgação”. Deve conter a URL canônica do projeto."
          />
        )}

        {tab === "preview" && (
          <div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm ${device === "desktop" ? "bg-primary/10 text-primary" : ""}`}
              >
                <Monitor className="h-4 w-4" aria-hidden="true" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm ${device === "mobile" ? "bg-primary/10 text-primary" : ""}`}
              >
                <Smartphone className="h-4 w-4" aria-hidden="true" /> Mobile
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <iframe
                title={`Prévia de ${project.displayName}`}
                src={`/portfolio/${project.slug}`}
                className="block bg-background"
                style={{ width: device === "mobile" ? 390 : "100%", height: 720, margin: "0 auto" }}
              />
            </div>
          </div>
        )}

        {tab === "historico" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2">Quando</th>
                  <th className="py-2">Campo</th>
                  <th className="py-2">Antes</th>
                  <th className="py-2">Depois</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-t border-border align-top">
                    <td className="py-2 whitespace-nowrap">
                      {new Date(h.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="py-2">{h.field}</td>
                    <td className="py-2 max-w-[220px] truncate text-muted-foreground">{h.old_value ?? "—"}</td>
                    <td className="py-2 max-w-[220px] truncate">{h.new_value ?? "—"}</td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-muted-foreground">
                      Nenhuma alteração registrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CoverReviewPanel slug={project.slug} name={project.displayName} />
      <BrandReviewPanel slug={project.slug} name={project.displayName} />

      <FunnelContextPanel slug={project.slug} name={project.displayName} />

      <VisualQualityPanel slug={project.slug} />
    </div>
  );
}

const COVER_PLAN = (portfolioCoverPlan as {
  projects: Record<
    string,
    { source: string; focal?: { x: number; y: number }; mode?: string; issues?: string[] }
  >;
}).projects;

const COVER_REVIEW = portfolioVisualReview as Record<
  string,
  { coverReview?: string; coverDecision?: string; notes?: string }
>;

/**
 * Revisão de capa: mostra exatamente o que o catálogo /portfolio renderiza
 * (card desktop e card mobile, proporção 16:10 com focal point) ao lado do
 * asset original do cliente, mais a decisão registrada em governança.
 */
/**
 * Funil / próximo passo: mostra a intenção comercial resolvida para o projeto,
 * o texto exibido na página, o CTA e a mensagem que chega ao WhatsApp do
 * cliente — sem expor número, sempre com a origem do contrato.
 */
function FunnelContextPanel({ slug, name }: { slug: string; name: string }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const context = resolvePortfolioFunnelContext(slug);
  const audit = auditPortfolioFunnelContext(slug);
  const message = buildPortfolioQuizPreviewMessage({
    studioName: name,
    recipientName: name,
    answers: { service: "", experience: "", period: "", timing: "", note: "" },
    mode: context.quizMode,
    proposalKind: context.proposalKind,
    funnelContext: context,
  });

  return (
    <section aria-labelledby="funnel-context" className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="funnel-context" className="font-display text-lg font-semibold">
          Funil / Próximo passo
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="rounded bg-muted px-2 py-1">{context.intent}</span>
          <span className="rounded bg-muted px-2 py-1">{context.source}</span>
          <span className="rounded bg-muted px-2 py-1">{audit.status}</span>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-muted-foreground">Título exibido</dt>
          <dd className="mt-1">{context.nextStepTitle}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-foreground">Descrição</dt>
          <dd className="mt-1">{context.nextStepBody}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-foreground">CTA</dt>
          <dd className="mt-1">{context.primaryCtaLabel}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-foreground">Modo do funil</dt>
          <dd className="mt-1">{context.quizMode}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-2">
        {(["desktop", "mobile"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setDevice(value)}
            className={`rounded border px-3 py-1 text-xs font-semibold ${device === value ? "border-primary bg-primary/10" : "border-border"}`}
          >
            {value === "desktop" ? "Desktop" : "Mobile"}
          </button>
        ))}
      </div>

      <div className={`mt-3 rounded-lg border border-border bg-muted/40 p-4 ${device === "mobile" ? "max-w-[390px]" : ""}`}>
        <p className="font-display text-base font-semibold">{context.nextStepTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{context.nextStepBody}</p>
        <span className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
          {context.primaryCtaLabel}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase text-muted-foreground">Mensagem enviada ao cliente</p>
        <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-xs">{message}</pre>
      </div>

      {audit.issues.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-destructive">
          {audit.issues.map((issue) => (
            <li key={issue.code}>
              {issue.code}: {issue.detail}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CoverReviewPanel({ slug, name }: { slug: string; name: string }) {
  const planned = COVER_PLAN[slug];
  const review = COVER_REVIEW[slug] ?? {};
  const vq = getVisualQuality(slug);
  const focal = planned?.focal ?? { x: 0.5, y: 0.5 };
  const objectPosition = `${Math.round(focal.x * 100)}% ${Math.round(focal.y * 100)}%`;
  const cover = planned ? `/images/${slug}/capa-card.jpg` : null;
  const original = planned ? `/${planned.source.replace(/^public\//, "")}` : null;
  const state = review.coverReview ?? vq?.coverReview ?? "UNREVIEWED";

  return (
    <section aria-labelledby="cover-review" className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="cover-review" className="font-display text-lg font-semibold">
          Revisão de capa
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="rounded bg-muted px-2 py-1">{state}</span>
          {review.coverDecision && (
            <span className="rounded bg-muted px-2 py-1">{review.coverDecision}</span>
          )}
        </div>
      </div>

      {cover ? (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <figure>
            <figcaption className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Card desktop
            </figcaption>
            <div className="aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={cover}
                alt={`Capa do card de ${name} no catálogo`}
                style={{ objectPosition }}
                className="h-full w-full object-cover"
              />
            </div>
          </figure>
          <figure>
            <figcaption className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Card mobile (390px)
            </figcaption>
            <div className="mx-auto aspect-[16/10] w-[280px] overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={cover}
                alt={`Capa do card de ${name} em telas pequenas`}
                style={{ objectPosition }}
                className="h-full w-full object-cover"
              />
            </div>
          </figure>
          <figure>
            <figcaption className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Asset original
            </figcaption>
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              {original && (
                <img src={original} alt={`Asset original de ${name}`} className="h-full w-full object-contain" />
              )}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Focal point {objectPosition} · fonte {planned?.source}
            </p>
          </figure>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Sem capa dedicada gerada. O card usa o fallback do catálogo.
        </p>
      )}

      {review.notes && <p className="mt-3 text-xs text-muted-foreground">{review.notes}</p>}
      <p className="mt-3 text-xs text-muted-foreground">
        Decisões ficam em <code>src/config/portfolio-visual-review.json</code>; as capas são geradas
        por <code>bun scripts/build-portfolio-covers.mjs</code> a partir de assets do próprio cliente.
      </p>
    </section>
  );
}

const BRAND_REVIEW = (portfolioBrandReview as {
  projects: Record<
    string,
    {
      brandOrigin?: string;
      brandReview?: string;
      classification?: string;
      logo?: string;
      notes?: string;
      direction?: {
        concept?: string;
        personality?: string;
        shapeLanguage?: string;
        typography?: string;
        colors?: string[];
      };
    }
  >;
}).projects;

const BRAND_ASSETS = (portfolioAssets as {
  clients: Record<string, { icon?: string; socialImage?: string }>;
}).clients;

/**
 * Revisão de marca: mostra a logo aplicada (fundo claro e escuro, desktop e
 * mobile), a prévia social e a origem/estado declarados em governança.
 */
function BrandReviewPanel({ slug, name }: { slug: string; name: string }) {
  const review = BRAND_REVIEW[slug] ?? {};
  const asset = BRAND_ASSETS[slug] ?? {};
  const logo = review.logo ?? asset.icon ?? null;
  const social = asset.socialImage ?? null;
  const origin = review.brandOrigin ?? "UNKNOWN";
  const state = review.brandReview ?? "UNREVIEWED";

  return (
    <section aria-labelledby="brand-review" className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="brand-review" className="font-display text-lg font-semibold">
          Revisão de marca
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="rounded bg-muted px-2 py-1">{state}</span>
          <span className="rounded bg-muted px-2 py-1">{origin}</span>
          {review.classification && (
            <span className="rounded bg-muted px-2 py-1">{review.classification}</span>
          )}
        </div>
      </div>

      {logo ? (
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <figure>
            <figcaption className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Fundo claro
            </figcaption>
            <div className="flex h-28 items-center justify-center rounded-lg border border-border bg-white p-3">
              <img src={logo} alt={`Logo de ${name} sobre fundo claro`} className="max-h-full max-w-full object-contain" />
            </div>
          </figure>
          <figure>
            <figcaption className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Fundo escuro
            </figcaption>
            <div className="flex h-28 items-center justify-center rounded-lg border border-border bg-neutral-900 p-3">
              <img src={logo} alt={`Logo de ${name} sobre fundo escuro`} className="max-h-full max-w-full object-contain" />
            </div>
          </figure>
          <figure>
            <figcaption className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Mobile (140px)
            </figcaption>
            <div className="flex h-28 items-center justify-center rounded-lg border border-border bg-white p-3">
              <img src={logo} alt={`Logo de ${name} em tela pequena`} className="max-h-full w-[140px] object-contain" />
            </div>
          </figure>
          <figure>
            <figcaption className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Prévia social
            </figcaption>
            <div className="aspect-[1200/630] overflow-hidden rounded-lg border border-border bg-muted">
              {social && <img src={social} alt={`Prévia social de ${name}`} className="h-full w-full object-cover" />}
            </div>
          </figure>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Sem logo registrada para este projeto.</p>
      )}

      {review.direction && (
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Conceito</dt>
            <dd className="mt-1">{review.direction.concept}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Personalidade</dt>
            <dd className="mt-1">{review.direction.personality}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Formas</dt>
            <dd className="mt-1">{review.direction.shapeLanguage}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Tipografia</dt>
            <dd className="mt-1">{review.direction.typography}</dd>
          </div>
          <div className="md:col-span-2 flex flex-wrap items-center gap-2">
            {(review.direction.colors ?? []).map((color) => (
              <span key={color} className="flex items-center gap-2 rounded border border-border px-2 py-1 text-[11px]">
                <span className="h-4 w-4 rounded" style={{ backgroundColor: color }} aria-hidden />
                {color}
              </span>
            ))}
          </div>
        </dl>
      )}

      {review.notes && <p className="mt-3 text-xs text-muted-foreground">{review.notes}</p>}
      {origin === "DEMO_CREATED_BY_0WEB" && (
        <p className="mt-3 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
          Identidade demonstrativa criada pela 0WEB para este projeto de exemplo. Se o cliente
          enviar a marca oficial, substitua o arquivo e mude a origem para CLIENT_PROVIDED.
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Decisões ficam em <code>src/config/portfolio-brand-review.json</code>; marcas com{" "}
        <code>authored</code> nunca são sobrescritas por geradores automáticos.
      </p>
    </section>
  );
}

function VisualQualityPanel({ slug }: { slug: string }) {
  const vq = getVisualQuality(slug);
  if (!vq) {
    return (
      <section className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Sem auditoria de qualidade visual para este projeto. Rode{" "}
        <code>bun run check:portfolio-visual-quality</code>.
      </section>
    );
  }
  return (
    <section aria-labelledby="vq-detail" className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="vq-detail" className="font-display text-lg font-semibold">
          Qualidade visual
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className={`rounded px-2 py-1 ${VISUAL_BADGE_STYLE[vq.visual]}`}>
            {vq.visual} · {vq.score}/100
          </span>
          <span className="rounded bg-muted px-2 py-1">Originalidade {vq.originalityStatus}</span>
          <span className="rounded bg-muted px-2 py-1">Encanto {vq.charm}</span>
          <span className="rounded bg-muted px-2 py-1">
            {vq.visuallyReviewed ? "Render real inspecionado" : "Sem render real"}
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Camada independente da conformidade técnica ({vq.technical}). Só issues P0 bloqueiam o gate;
        o restante é fila de melhoria.
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
        {Object.entries(vq.groupScores).map(([group, value]) => (
          <div key={group} className="rounded-lg border border-border p-3">
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{group}</dt>
            <dd className="mt-1 text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-4 space-y-2">
        {vq.issues.map((issue) => (
          <li
            key={`${issue.code}-${issue.detail ?? ""}`}
            className="flex flex-wrap items-start gap-2 rounded-md border border-border p-3 text-sm"
          >
            <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${SEVERITY_STYLE[issue.severity]}`}>
              {issue.severity}
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-medium">{issue.label}</span>
              {issue.detail ? (
                <span className="block text-xs text-muted-foreground">{issue.detail}</span>
              ) : null}
            </span>
            <code className="text-[11px] text-muted-foreground">{issue.code}</code>
          </li>
        ))}
        {vq.issues.length === 0 && (
          <li className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
            Nenhuma issue registrada nesta auditoria.
          </li>
        )}
      </ul>
    </section>
  );
}
