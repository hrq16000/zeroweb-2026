import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, Monitor, Save, Smartphone } from "lucide-react";
import {
  getManagedProjectAdmin,
  listManagedProjects,
  saveManagedProject,
  setManagedLifecycle,
} from "@/lib/portfolio-managed.functions";
import {
  MANAGED_PRESETS,
  sanitizeManagedProject,
  type ManagedLifecycle,
  type ManagedPreset,
  type ManagedProject,
} from "@/lib/portfolio-managed";
import { PortfolioManagedView } from "@/components/portfolio/PortfolioManagedView";

export const Route = createFileRoute("/_authenticated/app/portfolio/novo")({
  validateSearch: (search: Record<string, unknown>) => ({
    slug: typeof search.slug === "string" ? search.slug : undefined,
  }),
  component: PortfolioWizard,
});

type Draft = {
  slug: string;
  displayName: string;
  segment: string;
  city: string;
  state: string;
  summary: string;
  preset: ManagedPreset;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  logoUrl: string;
  heroImageUrl: string;
  heroFocal: { x: number; y: number };
  heroHeadline: string;
  heroSubheadline: string;
  catalogCoverUrl: string;
  coverFocal: { x: number; y: number };
  socialImageUrl: string;
  socialVersion: string;
  ctaLabel: string;
  shareCopy: string;
  services: Array<{ title: string; description: string }>;
  gallery: Array<{ url: string; alt: string; focal: { x: number; y: number } }>;
  content: {
    about: string;
    differentials: string[];
    steps: Array<{ title: string; description: string }>;
    faq: Array<{ q: string; a: string }>;
  };
  brandColors: Record<string, string>;
};

const EMPTY: Draft = {
  slug: "",
  displayName: "",
  segment: "servicos",
  city: "",
  state: "",
  summary: "",
  preset: "editorial",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  logoUrl: "",
  heroImageUrl: "",
  heroFocal: { x: 50, y: 50 },
  heroHeadline: "",
  heroSubheadline: "",
  catalogCoverUrl: "",
  coverFocal: { x: 50, y: 50 },
  socialImageUrl: "",
  socialVersion: "",
  ctaLabel: "Falar com a equipe",
  shareCopy: "",
  services: [{ title: "", description: "" }],
  gallery: [],
  content: { about: "", differentials: [], steps: [], faq: [] },
  brandColors: { primary: "#0f172a", accent: "#f97316", surface: "#ffffff", ink: "#0b1220" },
};

const STEPS = [
  "Identificação",
  "Composição",
  "Identidade",
  "Capa & destaque",
  "Serviços",
  "Conteúdo",
  "SEO & divulgação",
  "Publicação",
] as const;

function fromProject(project: ManagedProject): Draft {
  return {
    slug: project.slug,
    displayName: project.displayName,
    segment: project.segment,
    city: project.city,
    state: project.state,
    summary: project.summary,
    preset: project.preset,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
    seoKeywords: project.seoKeywords,
    logoUrl: project.logoUrl,
    heroImageUrl: project.heroImageUrl,
    heroFocal: project.heroFocal,
    heroHeadline: project.heroHeadline,
    heroSubheadline: project.heroSubheadline,
    catalogCoverUrl: project.catalogCoverUrl,
    coverFocal: project.coverFocal,
    socialImageUrl: project.socialImage.split("?")[0] ?? "",
    socialVersion: project.socialVersion,
    ctaLabel: project.ctaLabel,
    shareCopy: project.shareCopy,
    services: project.services.length ? project.services : EMPTY.services,
    gallery: project.gallery,
    content: project.content,
    brandColors: { ...EMPTY.brandColors, ...project.brandColors },
  };
}

const field =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground";

function Text({
  label,
  value,
  onChange,
  hint,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea className={`${field} min-h-24`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={field} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ? <span className="block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function PortfolioWizard() {
  const search = Route.useSearch();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [step, setStep] = useState(0);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<{
    project: ManagedProject;
    issues: Array<{ code: string; level: string; message: string }>;
    canBeReady: boolean;
  } | null>(null);
  const [projects, setProjects] = useState<Array<{ project: ManagedProject }>>([]);

  const save = useServerFn(saveManagedProject);
  const transition = useServerFn(setManagedLifecycle);
  const load = useServerFn(getManagedProjectAdmin);
  const list = useServerFn(listManagedProjects);

  useEffect(() => {
    list({})
      .then((res) => setProjects(res.rows))
      .catch(() => setProjects([]));
  }, [list]);

  useEffect(() => {
    if (!search.slug) return;
    load({ data: { slug: search.slug } })
      .then((res) => {
        if (res.project) {
          setDraft(fromProject(res.project));
          setSaved(res as never);
        }
      })
      .catch(() => setMessage("Não foi possível carregar o projeto."));
  }, [load, search.slug]);

  const set = useCallback(<K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  /** Pré-visualização local: mesmo componente que o público recebe. */
  const preview = useMemo(
    () =>
      sanitizeManagedProject({
        slug: draft.slug || "preview",
        client_key: draft.slug || "preview",
        display_name: draft.displayName,
        segment: draft.segment,
        city: draft.city,
        state: draft.state,
        summary: draft.summary,
        preset: draft.preset,
        seo_title: draft.seoTitle,
        seo_description: draft.seoDescription,
        seo_keywords: draft.seoKeywords,
        logo_url: draft.logoUrl,
        hero_image_url: draft.heroImageUrl,
        hero_focal: draft.heroFocal,
        hero_headline: draft.heroHeadline,
        hero_subheadline: draft.heroSubheadline,
        catalog_cover_url: draft.catalogCoverUrl,
        cover_focal: draft.coverFocal,
        social_image_url: draft.socialImageUrl,
        social_version: draft.socialVersion,
        cta_label: draft.ctaLabel,
        share_copy: draft.shareCopy,
        services: draft.services,
        gallery_items: draft.gallery,
        content_blocks: draft.content,
        brand_colors: draft.brandColors,
        lifecycle_status: saved?.project.lifecycle ?? "draft",
        published: false,
      }),
    [draft, saved],
  );

  async function handleSave() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await save({
        data: {
          ...draft,
          slug: draft.slug.trim().toLowerCase(),
          expectedVersion: saved?.project.contentVersion,
        },
      });
      setSaved(res as never);
      setMessage("Rascunho salvo.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao salvar.");
    } finally {
      setBusy(false);
    }
  }

  async function handleTransition(to: ManagedLifecycle) {
    if (!saved?.project.slug) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await transition({ data: { slug: saved.project.slug, to } });
      setSaved((prev) => (prev ? { ...prev, project: res.project } : prev));
      setMessage(`Projeto agora está em: ${to}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Transição não permitida.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <Link to="/app/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Projetos do portfólio
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDevice(device === "desktop" ? "mobile" : "desktop")}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
          >
            {device === "desktop" ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            {device === "desktop" ? "Desktop" : "Mobile"}
          </button>
          <button
            type="button"
            disabled={busy || !draft.slug}
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> Salvar
          </button>
        </div>
      </div>

      <h1 className="mt-4 font-display text-2xl font-black text-foreground">
        {search.slug ? `Editar projeto · ${draft.displayName || search.slug}` : "Novo projeto do portfólio"}
      </h1>
      {message ? <p className="mt-2 text-sm text-primary">{message}</p> : null}

      <nav className="mt-5 flex flex-wrap gap-2">
        {STEPS.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              index === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}. {label}
          </button>
        ))}
      </nav>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          {step === 0 ? (
            <>
              <Text
                label="Endereço público (slug)"
                value={draft.slug}
                onChange={(v) => set("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                hint="Fica em /portfolio/<slug>. Não pode colidir com projeto existente."
              />
              <Text label="Nome comercial" value={draft.displayName} onChange={(v) => set("displayName", v)} />
              <Text label="Segmento" value={draft.segment} onChange={(v) => set("segment", v)} />
              <div className="grid grid-cols-[1fr_90px] gap-3">
                <Text label="Cidade" value={draft.city} onChange={(v) => set("city", v)} />
                <Text label="UF" value={draft.state} onChange={(v) => set("state", v)} />
              </div>
              <Text label="Resumo" value={draft.summary} onChange={(v) => set("summary", v)} textarea />
            </>
          ) : null}

          {step === 1 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Composição visual</p>
              {MANAGED_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => set("preset", preset)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${
                    draft.preset === preset ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  <span className="font-semibold capitalize">{preset.replace("_", " ")}</span>
                  {draft.preset === preset ? <Check className="h-4 w-4 text-primary" /> : null}
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <>
              <Text label="Logo (caminho interno)" value={draft.logoUrl} onChange={(v) => set("logoUrl", v)} />
              {(["primary", "accent", "surface", "ink"] as const).map((key) => (
                <label key={key} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{key}</span>
                  <input
                    type="color"
                    value={draft.brandColors[key] ?? "#000000"}
                    onChange={(e) => set("brandColors", { ...draft.brandColors, [key]: e.target.value })}
                    className="h-9 w-16 rounded border border-border"
                  />
                </label>
              ))}
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Text label="Imagem de destaque" value={draft.heroImageUrl} onChange={(v) => set("heroImageUrl", v)} />
              <div className="grid grid-cols-2 gap-3">
                <Text
                  label="Foco destaque X (%)"
                  value={String(draft.heroFocal.x)}
                  onChange={(v) => set("heroFocal", { ...draft.heroFocal, x: Number(v) || 0 })}
                />
                <Text
                  label="Foco destaque Y (%)"
                  value={String(draft.heroFocal.y)}
                  onChange={(v) => set("heroFocal", { ...draft.heroFocal, y: Number(v) || 0 })}
                />
              </div>
              <Text label="Título principal" value={draft.heroHeadline} onChange={(v) => set("heroHeadline", v)} />
              <Text
                label="Subtítulo"
                value={draft.heroSubheadline}
                onChange={(v) => set("heroSubheadline", v)}
                textarea
              />
              <Text
                label="Capa do catálogo"
                value={draft.catalogCoverUrl}
                onChange={(v) => set("catalogCoverUrl", v)}
                hint="Imagem própria do cliente exibida em /portfolio."
              />
              <div className="grid grid-cols-2 gap-3">
                <Text
                  label="Foco capa X (%)"
                  value={String(draft.coverFocal.x)}
                  onChange={(v) => set("coverFocal", { ...draft.coverFocal, x: Number(v) || 0 })}
                />
                <Text
                  label="Foco capa Y (%)"
                  value={String(draft.coverFocal.y)}
                  onChange={(v) => set("coverFocal", { ...draft.coverFocal, y: Number(v) || 0 })}
                />
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <div className="space-y-3">
              {draft.services.map((service, index) => (
                <div key={index} className="space-y-2 rounded-xl border border-border p-3">
                  <Text
                    label={`Serviço ${index + 1}`}
                    value={service.title}
                    onChange={(v) =>
                      set(
                        "services",
                        draft.services.map((item, i) => (i === index ? { ...item, title: v } : item)),
                      )
                    }
                  />
                  <Text
                    label="Descrição"
                    value={service.description}
                    onChange={(v) =>
                      set(
                        "services",
                        draft.services.map((item, i) => (i === index ? { ...item, description: v } : item)),
                      )
                    }
                    textarea
                  />
                  <button
                    type="button"
                    className="text-xs text-destructive"
                    onClick={() => set("services", draft.services.filter((_, i) => i !== index))}
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-2 text-sm"
                onClick={() => set("services", [...draft.services, { title: "", description: "" }])}
              >
                Adicionar serviço
              </button>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-3">
              <Text
                label="Sobre o negócio"
                value={draft.content.about}
                onChange={(v) => set("content", { ...draft.content, about: v })}
                textarea
              />
              <Text
                label="Diferenciais (um por linha)"
                value={draft.content.differentials.join("\n")}
                onChange={(v) =>
                  set("content", {
                    ...draft.content,
                    differentials: v.split("\n").map((s) => s.trim()).filter(Boolean),
                  })
                }
                textarea
              />
              <Text
                label="Galeria (um caminho por linha)"
                value={draft.gallery.map((item) => item.url).join("\n")}
                onChange={(v) =>
                  set(
                    "gallery",
                    v
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((url, index) => ({
                        url,
                        alt: draft.gallery[index]?.alt ?? "",
                        focal: draft.gallery[index]?.focal ?? { x: 50, y: 50 },
                      })),
                  )
                }
                textarea
              />
            </div>
          ) : null}

          {step === 6 ? (
            <>
              <Text label="Título SEO" value={draft.seoTitle} onChange={(v) => set("seoTitle", v)} />
              <Text
                label="Descrição SEO"
                value={draft.seoDescription}
                onChange={(v) => set("seoDescription", v)}
                textarea
              />
              <Text label="Palavras-chave" value={draft.seoKeywords} onChange={(v) => set("seoKeywords", v)} />
              <Text
                label="Imagem social (1200x630)"
                value={draft.socialImageUrl}
                onChange={(v) => set("socialImageUrl", v)}
              />
              <Text label="Versão da imagem social" value={draft.socialVersion} onChange={(v) => set("socialVersion", v)} />
              <Text label="Texto do botão de contato" value={draft.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
              <Text
                label="Copy de divulgação"
                value={draft.shareCopy}
                onChange={(v) => set("shareCopy", v)}
                textarea
                hint="Sem telefone, e-mail ou link externo: o funil resolve o contato no servidor."
              />
            </>
          ) : null}

          {step === 7 ? (
            <div className="space-y-3 text-sm">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Etapa atual: {saved?.project.lifecycle ?? "não salvo"}
              </p>
              <ul className="space-y-2">
                {(saved?.issues ?? []).map((issue) => (
                  <li
                    key={issue.code}
                    className={`rounded-lg px-3 py-2 text-xs ${
                      issue.level === "blocker"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <strong>{issue.code}</strong> — {issue.message}
                  </li>
                ))}
                {saved && saved.issues.length === 0 ? (
                  <li className="rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
                    Nenhuma pendência de conformidade.
                  </li>
                ) : null}
              </ul>
              <div className="flex flex-wrap gap-2">
                {(["ready", "published", "draft", "archived"] as ManagedLifecycle[]).map((to) => (
                  <button
                    key={to}
                    type="button"
                    disabled={busy || !saved}
                    onClick={() => handleTransition(to)}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold disabled:opacity-50"
                  >
                    {to}
                  </button>
                ))}
              </div>
              {saved?.project.lifecycle === "published" ? (
                <a
                  href={`/portfolio/${saved.project.slug}`}
                  className="inline-block text-xs font-semibold text-primary underline"
                >
                  Abrir página pública
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-muted/30 p-4">
          <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            Pré-visualização ({device})
          </p>
          <div
            className="mx-auto max-h-[70vh] overflow-y-auto rounded-xl bg-background"
            style={{ width: device === "mobile" ? 390 : "100%" }}
          >
            {preview ? <PortfolioManagedView project={preview} /> : null}
          </div>
        </div>
      </div>

      {projects.length ? (
        <section className="mt-8">
          <h2 className="text-sm font-bold text-foreground">Projetos criados pelo painel</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(({ project }) => (
              <li key={project.slug} className="rounded-xl border border-border px-3 py-2 text-sm">
                <Link to="/app/portfolio/novo" search={{ slug: project.slug }} className="font-semibold">
                  {project.displayName}
                </Link>
                <span className="ml-2 text-xs text-muted-foreground">{project.lifecycle}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
