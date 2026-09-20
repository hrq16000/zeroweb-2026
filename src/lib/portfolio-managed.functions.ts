import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import { PORTFOLIO_PROTOTYPES } from "@/lib/portfolio-site-registry";
import {
  MANAGED_DELIVERY_MODES,
  MANAGED_LIFECYCLES,
  MANAGED_PRESETS,
  RESERVED_SLUGS,
  SLUG_RE,
  buildManagedRow,
  canTransition,
  managedStatus,
  sanitizeManagedProject,
  type ManagedLifecycle,
  type ManagedProject,
} from "@/lib/portfolio-managed";
import { PORTFOLIO_FUNNEL_INTENTS } from "@/lib/portfolio-funnel-context";
import { UPLOAD_PUBLIC_PREFIX } from "@/lib/portfolio-admin";

export const MANAGED_COLUMNS = [
  "client_key",
  "slug",
  "project_kind",
  "preset",
  "display_name",
  "segment",
  "funnel_enabled",
  "funnel_recipient",
  "source_snapshot",
  "city",
  "state",
  "summary",
  "seo_title",
  "seo_description",
  "seo_keywords",
  "canonical_url",
  "logo_url",
  "hero_image_url",
  "hero_focal",
  "hero_headline",
  "hero_subheadline",
  "catalog_cover_url",
  "cover_focal",
  "social_image_url",
  "social_version",
  "cta_label",
  "share_copy",
  "services",
  "gallery_items",
  "content_blocks",
  "brand_colors",
  "lifecycle_status",
  "published",
  "content_version",
  "archived_at",
  "ready_at",
  "updated_at",
].join(",");

/** Slugs já ocupados por projetos legados/registries — o wizard não pode colidir. */
export function isSlugTaken(slug: string): boolean {
  if (RESERVED_SLUGS.has(slug)) return true;
  if ((portfolioCatalog as Array<{ slug: string }>).some((item) => item.slug === slug)) return true;
  return PORTFOLIO_PROTOTYPES.some((site) => site.slug === slug);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

async function assertAdmin(userId: string) {
  const admin = await adminClient();
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    admin.rpc("has_role", { _user_id: userId, _role: "admin" }),
    admin.rpc("is_super_admin", { _uid: userId }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Acesso restrito a administradores.");
  return admin;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeWhatsApp(value: unknown): string {
  const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
  return digits.length >= 10 && digits.length <= 15 ? digits : "";
}

async function syncManagedFunnelForm(
  admin: any,
  input: {
    clientKey: string;
    displayName: string;
    intent: string | null;
    published: boolean;
  },
) {
  const slug = `portfolio-${input.clientKey}`;
  const { data: existing } = await admin
    .from("dynamic_forms")
    .select("id, config_json")
    .eq("slug", slug)
    .maybeSingle();
  const existingConfig = record(existing?.config_json);
  if (existing && existingConfig.portfolio_managed !== true) {
    throw new Error("Já existe um funil não gerenciado usando este identificador.");
  }
  const { error } = await admin.from("dynamic_forms").upsert(
    {
      slug,
      name: input.displayName || input.clientKey,
      description: `Funil individual do portfolio ${input.clientKey}`,
      status: input.published ? "published" : "draft",
      config_json: {
        ...existingConfig,
        portfolio_managed: true,
        client_key: input.clientKey,
        funnel_intent: input.intent,
      },
    },
    { onConflict: "slug" },
  );
  if (error) throw new Error(error.message);
}

async function logHistory(
  admin: any,
  clientKey: string,
  actor: string,
  entries: Array<{ field: string; old_value: string | null; new_value: string | null }>,
) {
  if (!entries.length) return;
  await admin.from("portfolio_client_settings_history").insert(
    entries.map((entry) => ({ client_key: clientKey, actor, ...entry })),
  );
}

/**
 * Leitura pública de um projeto Managed. Só devolve conteúdo quando o projeto
 * está PUBLISHED — rascunhos, prontos e arquivados não existem para o público.
 */
export const getManagedProject = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().trim().min(1).max(120) }).parse(data))
  .handler(async ({ data }): Promise<ManagedProject | null> => {
    if (!SLUG_RE.test(data.slug)) return null;
    try {
      const admin = await adminClient();
      const { data: row, error } = await admin
        .from("portfolio_client_settings")
        .select(MANAGED_COLUMNS)
        .eq("slug", data.slug)
        .eq("project_kind", "managed")
        .maybeSingle();
      if (error || !row) return null;
      const project = sanitizeManagedProject(row);
      if (!project || project.lifecycle !== "published" || !project.published) return null;
      return project;
    } catch {
      return null;
    }
  });

/** Cartões do catálogo público (somente projetos Managed publicados). */
export const listPublishedManagedProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<ManagedProject[]> => {
    try {
      const admin = await adminClient();
      const { data, error } = await admin
        .from("portfolio_client_settings")
        .select(MANAGED_COLUMNS)
        .eq("project_kind", "managed")
        .eq("lifecycle_status", "published")
        .eq("published", true)
        .limit(500);
      if (error) return [];
      return (data ?? [])
        .map(sanitizeManagedProject)
        .filter((project: ManagedProject | null): project is ManagedProject => Boolean(project));
    } catch {
      return [];
    }
  },
);


const managedAssetUploadSchema = z.object({
  slug: z.string().trim().min(3).max(80),
  kind: z.enum(["logo", "hero", "cover", "social", "gallery"]),
  fileName: z.string().trim().min(1).max(120),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"]),
  base64: z.string().min(16).max(6_000_000),
});

/**
 * Upload de asset para projeto Managed.
 *
 * Exige que o rascunho já exista como project_kind=managed; nunca reutiliza
 * registry legado e nunca escreve URL externa. O bucket continua privado e
 * a página pública recebe somente a rota controlada de leitura.
 */
export const uploadManagedPortfolioAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => managedAssetUploadSchema.parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const slug = data.slug.toLowerCase();
    if (!SLUG_RE.test(slug)) throw new Error("Projeto inválido.");

    const { data: project } = await admin
      .from("portfolio_client_settings")
      .select("client_key, project_kind")
      .eq("slug", slug)
      .maybeSingle();
    if (!project || project.project_kind !== "managed") {
      throw new Error("Salve o rascunho Managed antes de enviar imagens.");
    }

    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.byteLength === 0) throw new Error("Arquivo vazio.");
    if (bytes.byteLength > 4 * 1024 * 1024) throw new Error("Arquivo acima de 4 MB.");

    const ext = data.contentType.split("/")[1].replace("jpeg", "jpg");
    const safeName = data.fileName
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .slice(0, 60);
    const objectPath = `${slug}/${data.kind}-${Date.now()}-${safeName || "asset"}.${ext}`;

    const { error } = await admin.storage
      .from("portfolio-admin")
      .upload(objectPath, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);

    await logHistory(admin, String(project.client_key ?? slug), context.userId, [
      { field: `managed_asset_${data.kind}`, old_value: null, new_value: objectPath },
    ]);

    return { url: `${UPLOAD_PUBLIC_PREFIX}/${objectPath}`, path: objectPath };
  });

const wizardSchema = z.object({
  slug: z.string().trim().min(3).max(80),
  clientKey: z.string().trim().min(2).max(80).optional(),
  displayName: z.string().trim().max(160).optional(),
  segment: z.string().trim().max(60).optional(),
  city: z.string().trim().max(80).optional(),
  state: z.string().trim().max(4).optional(),
  summary: z.string().trim().max(300).optional(),
  preset: z.enum(MANAGED_PRESETS).optional(),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(400).optional(),
  seoKeywords: z.string().trim().max(400).optional(),
  logoUrl: z.string().trim().max(300).optional(),
  heroImageUrl: z.string().trim().max(300).optional(),
  heroFocal: z.object({ x: z.number(), y: z.number() }).optional(),
  heroHeadline: z.string().trim().max(160).optional(),
  heroSubheadline: z.string().trim().max(300).optional(),
  catalogCoverUrl: z.string().trim().max(300).optional(),
  coverFocal: z.object({ x: z.number(), y: z.number() }).optional(),
  socialImageUrl: z.string().trim().max(300).optional(),
  socialVersion: z.string().trim().max(40).optional(),
  ctaLabel: z.string().trim().max(80).optional(),
  shareCopy: z.string().trim().max(2000).optional(),
  funnelIntent: z.union([z.enum(PORTFOLIO_FUNNEL_INTENTS), z.literal("")]).optional(),
  funnelDeliveryMode: z.union([z.enum(MANAGED_DELIVERY_MODES), z.literal("")]).optional(),
  funnelRecipient: z.string().trim().max(40).optional(),
  services: z.array(z.object({ title: z.string(), description: z.string().optional() })).optional(),
  gallery: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string().optional(),
        focal: z.object({ x: z.number(), y: z.number() }).optional(),
      }),
    )
    .optional(),
  content: z
    .object({
      about: z.string().optional(),
      differentials: z.array(z.string()).optional(),
      steps: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    })
    .optional(),
  brandColors: z.record(z.string(), z.string()).optional(),
  expectedVersion: z.number().int().optional(),
});

export type ManagedSaveResult = {
  project: ManagedProject;
  issues: ReturnType<typeof managedStatus>["issues"];
  canBeReady: boolean;
};

/** Cria ou atualiza um projeto Managed (wizard do painel). Nunca toca em legados. */
export const saveManagedProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => wizardSchema.parse(data))
  .handler(async ({ data, context }): Promise<ManagedSaveResult> => {
    const admin = await assertAdmin(context.userId);
    const slug = data.slug.toLowerCase();
    if (!SLUG_RE.test(slug)) throw new Error("Endereço inválido: use apenas letras minúsculas, números e hífen.");

    const { data: existing } = await admin
      .from("portfolio_client_settings")
      .select(MANAGED_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();

    if (!existing && isSlugTaken(slug)) {
      throw new Error("Este endereço já pertence a um projeto existente.");
    }
    if (existing && existing.project_kind !== "managed") {
      throw new Error("Este endereço pertence a um projeto legado e não pode ser editado aqui.");
    }
    if (
      existing &&
      data.expectedVersion !== undefined &&
      Number(existing.content_version ?? 1) !== data.expectedVersion
    ) {
      throw new Error("Outro editor salvou este projeto. Recarregue antes de continuar.");
    }

    const existingSnapshot = record(existing?.source_snapshot);
    const existingFunnel = record(existingSnapshot.managed_funnel);
    const effectiveIntent =
      data.funnelIntent || (typeof existingFunnel.intent === "string" ? existingFunnel.intent : "");
    const effectiveDeliveryMode =
      data.funnelDeliveryMode ||
      (typeof existingFunnel.delivery_mode === "string" ? existingFunnel.delivery_mode : "");
    const row = buildManagedRow({
      ...data,
      slug,
      clientKey: data.clientKey ?? slug,
      funnelIntent: effectiveIntent,
      funnelDeliveryMode: effectiveDeliveryMode,
    });
    const requestedRecipient = normalizeWhatsApp(data.funnelRecipient);
    const existingRecipient = normalizeWhatsApp(existing?.funnel_recipient);
    const funnelRecipient =
      effectiveDeliveryMode === "whatsapp" ? requestedRecipient || existingRecipient : "";
    const funnelEnabled = effectiveDeliveryMode === "whatsapp" && Boolean(funnelRecipient);
    const sourceSnapshot = {
      ...existingSnapshot,
      ...record(row.source_snapshot),
    };

    await syncManagedFunnelForm(admin, {
      clientKey: row.client_key,
      displayName: row.display_name || slug,
      intent: effectiveIntent || null,
      published: existing?.lifecycle_status === "published" && Boolean(existing?.published),
    });

    const patch = {
      ...row,
      source_snapshot: sourceSnapshot,
      funnel_enabled: funnelEnabled,
      funnel_recipient: funnelRecipient,
      lifecycle_status: existing?.lifecycle_status ?? "draft",
      published: Boolean(existing?.published) && existing?.lifecycle_status === "published",
      content_version: Number(existing?.content_version ?? 0) + 1,
      updated_by: context.userId,
      updated_at: new Date().toISOString(),
    };

    const { data: saved, error } = await admin
      .from("portfolio_client_settings")
      .upsert(patch, { onConflict: "client_key" })
      .select(MANAGED_COLUMNS)
      .single();
    if (error) throw new Error(error.message);

    await logHistory(admin, patch.client_key, context.userId, [
      {
        field: existing ? "managed_update" : "managed_create",
        old_value: existing ? String(existing.content_version ?? 1) : null,
        new_value: String(patch.content_version),
      },
      {
        field: "managed_funnel",
        old_value: existing
          ? `${String(existingFunnel.intent ?? "unset")}:${String(existingFunnel.delivery_mode ?? "unset")}`
          : null,
        new_value: `${effectiveIntent || "unset"}:${effectiveDeliveryMode || "unset"}`,
      },
      {
        field: "managed_destination",
        old_value: existing?.funnel_enabled ? "configured" : "lead_only_or_unset",
        new_value: funnelEnabled ? "configured" : "lead_only_or_unset",
      },
    ]);

    const project = sanitizeManagedProject(saved)!;
    const status = managedStatus(project);
    return { project, issues: status.issues, canBeReady: status.canBeReady };
  });

/** Lista os projetos Managed com conformidade calculada (painel). */
export const listManagedProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await assertAdmin(context.userId);
    const { data, error } = await admin
      .from("portfolio_client_settings")
      .select(MANAGED_COLUMNS)
      .eq("project_kind", "managed")
      .order("updated_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return {
      rows: (data ?? [])
        .map(sanitizeManagedProject)
        .filter((p: ManagedProject | null): p is ManagedProject => Boolean(p))
        .map((project: ManagedProject) => ({ project, ...managedStatus(project) })),
    };
  });

/** Um projeto Managed em qualquer etapa — usado pelo editor e pelo preview. */
export const getManagedProjectAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ slug: z.string().trim().max(120) }).parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const { data: row } = await admin
      .from("portfolio_client_settings")
      .select(MANAGED_COLUMNS)
      .eq("slug", data.slug)
      .eq("project_kind", "managed")
      .maybeSingle();
    const project = sanitizeManagedProject(row);
    if (!project) return { project: null, issues: [], canBeReady: false };
    return { project, ...managedStatus(project) };
  });

/** Transição de ciclo de vida com gate de conformidade e histórico auditável. */
export const setManagedLifecycle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ slug: z.string().trim().max(120), to: z.enum(MANAGED_LIFECYCLES) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const { data: row } = await admin
      .from("portfolio_client_settings")
      .select(MANAGED_COLUMNS)
      .eq("slug", data.slug)
      .eq("project_kind", "managed")
      .maybeSingle();
    const project = sanitizeManagedProject(row);
    if (!project) throw new Error("Projeto não encontrado.");

    const from = project.lifecycle;
    const to = data.to as ManagedLifecycle;
    if (!canTransition(from, to)) throw new Error(`Transição ${from} → ${to} não permitida.`);
    if ((to === "ready" || to === "published") && !managedStatus(project).canBeReady) {
      throw new Error("Existem pendências de conformidade bloqueando esta etapa.");
    }

    const now = new Date().toISOString();
    if (to === "published") {
      await syncManagedFunnelForm(admin, {
        clientKey: project.clientKey,
        displayName: project.displayName,
        intent: project.funnelIntent,
        published: true,
      });
    }
    const patch: Record<string, unknown> = {
      lifecycle_status: to,
      published: to === "published",
      updated_by: context.userId,
      updated_at: now,
      archived_at: to === "archived" ? now : null,
    };
    if (to === "ready") patch.ready_at = now;

    const { data: saved, error } = await admin
      .from("portfolio_client_settings")
      .update(patch)
      .eq("slug", data.slug)
      .select(MANAGED_COLUMNS)
      .single();
    if (error) throw new Error(error.message);

    if (to !== "published") {
      await syncManagedFunnelForm(admin, {
        clientKey: project.clientKey,
        displayName: project.displayName,
        intent: project.funnelIntent,
        published: false,
      });
    }

    await logHistory(admin, project.clientKey, context.userId, [
      { field: "lifecycle_status", old_value: from, new_value: to },
    ]);

    // Publicar/arquivar reflete imediatamente no sitemap e no IndexNow.
    if (to === "published" || from === "published") {
      try {
        const { syncPortfolioSitemapAndIndexing } = await import("@/lib/portfolio-sitemap.server");
        await syncPortfolioSitemapAndIndexing(admin, [data.slug]);
      } catch {
        /* indexação externa nunca desfaz a transição */
      }
    }

    return { project: sanitizeManagedProject(saved)! };
  });
