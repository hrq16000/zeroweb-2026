/**
 * Admin dos projetos de /portfolio/:slug.
 *
 * Reutiliza a tabela já existente public.portfolio_client_settings (mesma que
 * alimenta /app/metadados e o sitemap) — nenhuma segunda fonte de verdade é
 * criada. O seed versionado (src/config/portfolio-admin-seed.json) fornece a
 * estrutura e os valores herdados; o banco guarda apenas o que foi editado.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  ADMIN_EDITABLE_FIELDS,
  SEED_PROJECTS,
  containsPublicContact,
  diffAgainstSeed,
  isSafeAssetPath,
  mergeProject,
  seedBySlug,
  UPLOAD_PUBLIC_PREFIX,
  type AdminOverrides,
  type MergedProject,
} from "@/lib/portfolio-admin";

/* eslint-disable @typescript-eslint/no-explicit-any */

const BUCKET = "portfolio-admin";

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" }),
    supabaseAdmin.rpc("is_super_admin", { _uid: userId }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Acesso restrito a administradores.");
  return supabaseAdmin as any;
}

async function loadRows(admin: any): Promise<Map<string, AdminOverrides>> {
  const { data, error } = await admin
    .from("portfolio_client_settings")
    .select("*")
    .limit(500);
  if (error) throw new Error(error.message);
  const map = new Map<string, AdminOverrides>();
  for (const row of (data ?? []) as any[]) map.set(row.slug || row.client_key, row);
  return map;
}

function mergeAll(rows: Map<string, AdminOverrides>): MergedProject[] {
  return SEED_PROJECTS.map((seed) => mergeProject(seed, rows.get(seed.slug) ?? null));
}

/** Lista os 68 projetos com conformidade, estado e divergência em relação ao seed. */
export const listPortfolioAdminProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await assertAdmin(context.userId);
    const rows = await loadRows(admin);
    const projects = mergeAll(rows).map((p) => ({
      ...p,
      driftFromSeed: diffAgainstSeed(seedBySlug(p.slug)!, p),
    }));
    return {
      projects,
      summary: {
        total: projects.length,
        complete: projects.filter((p) => p.conformance.status === "COMPLETE").length,
        partial: projects.filter((p) => p.conformance.status === "PARTIAL").length,
        legacy: projects.filter((p) => p.conformance.status === "LEGACY").length,
        imported: projects.filter((p) => p.imported).length,
        archived: projects.filter((p) => p.lifecycleStatus === "archived").length,
      },
    };
  });

/** Detalhe de um projeto + histórico auditável. */
export const getPortfolioAdminProject = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ slug: z.string().trim().min(1).max(120) }).parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const seed = seedBySlug(data.slug);
    if (!seed) throw new Error("Projeto inexistente no registry.");
    const { data: row } = await admin
      .from("portfolio_client_settings")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    const { data: history } = await admin
      .from("portfolio_client_settings_history")
      .select("id, client_key, field, old_value, new_value, created_at")
      .eq("client_key", seed.clientKey)
      .order("created_at", { ascending: false })
      .limit(60);
    const project = mergeProject(seed, row ?? null);
    return {
      project,
      seed,
      driftFromSeed: diffAgainstSeed(seed, project),
      history: (history ?? []) as any[],
    };
  });

/**
 * Importa os projetos dos registries para o banco (idempotente).
 * Só grava linhas que ainda não existem; nunca sobrescreve edição feita no admin.
 */
export const importPortfolioAdminProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await assertAdmin(context.userId);
    const rows = await loadRows(admin);
    const created: string[] = [];
    const skipped: string[] = [];

    for (const seed of SEED_PROJECTS) {
      if (rows.has(seed.slug)) {
        skipped.push(seed.slug);
        continue;
      }
      const { error } = await admin.from("portfolio_client_settings").upsert(
        {
          client_key: seed.clientKey,
          slug: seed.slug,
          display_name: seed.title,
          segment: seed.segment,
          city: seed.city,
          state: seed.state,
          summary: seed.summary,
          seo_title: seed.title,
          seo_description: seed.summary,
          canonical_url: `https://0web.com.br/portfolio/${seed.slug}`,
          logo_url: seed.icon,
          hero_image_url: seed.image,
          social_image_url: seed.socialImage,
          social_version: seed.socialVersion,
          share_copy: seed.shareCopy,
          gallery: seed.gallery,
          published: seed.published,
          lifecycle_status: seed.published ? "published" : "imported",
          source_snapshot: seed,
          updated_by: context.userId,
        },
        { onConflict: "client_key" },
      );
      if (error) throw new Error(`${seed.slug}: ${error.message}`);
      created.push(seed.slug);
    }

    const after = await loadRows(admin);
    const merged = mergeAll(after);
    const drift = merged
      .map((p) => ({ slug: p.slug, diffs: diffAgainstSeed(seedBySlug(p.slug)!, p) }))
      .filter((d) => d.diffs.length > 0);

    return { created, skipped, total: SEED_PROJECTS.length, drift };
  });

const saveSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  expectedVersion: z.number().int().min(0),
  values: z.object({
    display_name: z.string().trim().max(160).optional(),
    segment: z.string().trim().max(60).optional(),
    city: z.string().trim().max(80).optional(),
    state: z.string().trim().max(4).optional(),
    summary: z.string().trim().max(600).optional(),
    seo_title: z.string().trim().max(160).optional(),
    seo_description: z.string().trim().max(400).optional(),
    seo_keywords: z.string().trim().max(400).optional(),
    canonical_url: z.string().trim().max(300).optional(),
    logo_url: z.string().trim().max(300).optional(),
    hero_image_url: z.string().trim().max(300).optional(),
    hero_headline: z.string().trim().max(160).optional(),
    hero_subheadline: z.string().trim().max(300).optional(),
    social_image_url: z.string().trim().max(300).optional(),
    social_version: z.string().trim().max(40).optional(),
    cta_label: z.string().trim().max(60).optional(),
    share_copy: z.string().trim().max(2000).optional(),
    gallery: z.array(z.string().trim().max(300)).max(30).optional(),
    brand_colors: z.record(z.string(), z.string().trim().max(40)).optional(),
  }),
});

const ASSET_FIELDS = ["logo_url", "hero_image_url", "social_image_url"] as const;

/** Salva alterações (rascunho) com controle de concorrência e histórico campo a campo. */
export const savePortfolioAdminProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => saveSchema.parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const seed = seedBySlug(data.slug);
    if (!seed) throw new Error("Projeto inexistente no registry.");

    // Validação de segurança/privacidade antes de qualquer escrita.
    for (const [field, value] of Object.entries(data.values)) {
      if (typeof value === "string" && containsPublicContact(value)) {
        throw new Error(
          `Campo "${field}" contém contato operacional. Contatos ficam apenas no funil, no servidor.`,
        );
      }
    }
    for (const field of ASSET_FIELDS) {
      const value = data.values[field];
      if (value && !isSafeAssetPath(value)) {
        throw new Error(`Campo "${field}" deve apontar para um asset interno do projeto.`);
      }
    }
    for (const item of data.values.gallery ?? []) {
      if (!isSafeAssetPath(item)) throw new Error("Galeria só aceita assets internos.");
    }

    const { data: existing } = await admin
      .from("portfolio_client_settings")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();

    const currentVersion = Number(existing?.content_version ?? 0);
    if (existing && currentVersion !== data.expectedVersion) {
      throw new Error(
        "Este projeto foi alterado por outra pessoa. Recarregue a tela antes de salvar.",
      );
    }

    const patch: Record<string, unknown> = {
      updated_by: context.userId,
      updated_at: new Date().toISOString(),
      content_version: currentVersion + 1,
    };
    const history: Array<Record<string, unknown>> = [];

    for (const field of ADMIN_EDITABLE_FIELDS) {
      const next = (data.values as Record<string, unknown>)[field];
      if (next === undefined) continue;
      const prev = existing ? (existing as any)[field] : undefined;
      const prevText = typeof prev === "string" ? prev : JSON.stringify(prev ?? null);
      const nextText = typeof next === "string" ? next : JSON.stringify(next);
      if (prevText === nextText) continue;
      patch[field] = next;
      history.push({
        client_key: seed.clientKey,
        field,
        old_value: prev === undefined ? null : prevText.slice(0, 2000),
        new_value: nextText.slice(0, 2000),
        actor: context.userId,
      });
    }

    if (!existing) {
      patch.lifecycle_status = "draft";
      patch.published = false;
      patch.source_snapshot = seed;
    } else if (existing.lifecycle_status === "imported") {
      patch.lifecycle_status = existing.published ? "published" : "draft";
    }

    const { data: saved, error } = await admin
      .from("portfolio_client_settings")
      .upsert({ client_key: seed.clientKey, slug: seed.slug, ...patch }, { onConflict: "client_key" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    if (history.length) {
      await admin.from("portfolio_client_settings_history").insert(history);
    }

    return {
      project: mergeProject(seed, saved),
      savedFields: history.map((h) => String(h.field)),
    };
  });

/** Publica / despublica. Ação separada do salvar, com sincronização de sitemap. */
export const setPortfolioAdminPublication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ slug: z.string().trim().min(1).max(120), published: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const seed = seedBySlug(data.slug);
    if (!seed) throw new Error("Projeto inexistente no registry.");

    const { data: existing } = await admin
      .from("portfolio_client_settings")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();

    const merged = mergeProject(seed, existing ?? null);
    if (data.published && merged.conformance.blocking.length > 0) {
      throw new Error(
        `Publicação bloqueada pela conformidade: ${merged.conformance.blocking.join(", ")}`,
      );
    }
    if (existing?.lifecycle_status === "archived" && data.published) {
      throw new Error("Projeto arquivado. Restaure antes de publicar.");
    }

    const { data: saved, error } = await admin
      .from("portfolio_client_settings")
      .upsert(
        {
          client_key: seed.clientKey,
          slug: seed.slug,
          published: data.published,
          lifecycle_status: data.published ? "published" : "draft",
          content_version: Number(existing?.content_version ?? 0) + 1,
          updated_by: context.userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "client_key" },
      )
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await admin.from("portfolio_client_settings_history").insert({
      client_key: seed.clientKey,
      field: "published",
      old_value: String(Boolean(existing?.published)),
      new_value: String(data.published),
      actor: context.userId,
    });

    const { syncPortfolioSitemapAndIndexing } = await import("@/lib/portfolio-sitemap.server");
    await syncPortfolioSitemapAndIndexing(admin, data.published ? [seed.slug] : []);

    return { project: mergeProject(seed, saved) };
  });

/** Arquiva (nunca apaga) ou restaura um projeto. */
export const setPortfolioAdminArchived = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ slug: z.string().trim().min(1).max(120), archived: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const seed = seedBySlug(data.slug);
    if (!seed) throw new Error("Projeto inexistente no registry.");

    const { data: existing } = await admin
      .from("portfolio_client_settings")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();

    const { data: saved, error } = await admin
      .from("portfolio_client_settings")
      .upsert(
        {
          client_key: seed.clientKey,
          slug: seed.slug,
          lifecycle_status: data.archived ? "archived" : "draft",
          published: data.archived ? false : Boolean(existing?.published),
          archived_at: data.archived ? new Date().toISOString() : null,
          content_version: Number(existing?.content_version ?? 0) + 1,
          updated_by: context.userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "client_key" },
      )
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await admin.from("portfolio_client_settings_history").insert({
      client_key: seed.clientKey,
      field: "lifecycle_status",
      old_value: String(existing?.lifecycle_status ?? "imported"),
      new_value: data.archived ? "archived" : "draft",
      actor: context.userId,
    });

    if (data.archived) {
      const { syncPortfolioSitemapAndIndexing } = await import("@/lib/portfolio-sitemap.server");
      await syncPortfolioSitemapAndIndexing(admin, []);
    }

    return { project: mergeProject(seed, saved) };
  });

const uploadSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  kind: z.enum(["logo", "hero", "social", "gallery"]),
  fileName: z.string().trim().min(1).max(120),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"]),
  /** Conteúdo em base64 puro (sem data: prefix). Limite 4 MB. */
  base64: z.string().min(16).max(6_000_000),
});

/** Upload validado de asset do projeto. Bucket privado, servido por rota pública controlada. */
export const uploadPortfolioAdminAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => uploadSchema.parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    if (!seedBySlug(data.slug)) throw new Error("Projeto inexistente no registry.");

    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.byteLength === 0) throw new Error("Arquivo vazio.");
    if (bytes.byteLength > 4 * 1024 * 1024) throw new Error("Arquivo acima de 4 MB.");

    const ext = data.contentType.split("/")[1].replace("jpeg", "jpg");
    const safeName = data.fileName
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .slice(0, 60);
    const objectPath = `${data.slug}/${data.kind}-${Date.now()}-${safeName || "asset"}.${ext}`;

    const { error } = await admin.storage
      .from(BUCKET)
      .upload(objectPath, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);

    return { url: `${UPLOAD_PUBLIC_PREFIX}/${objectPath}`, path: objectPath };
  });
