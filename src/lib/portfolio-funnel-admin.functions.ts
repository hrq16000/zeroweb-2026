import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import catalog from "@/config/portfolio-catalog.json";
import clients from "@/config/portfolio-clients.json";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolvePortfolioFunnelConfig } from "@/lib/portfolio-funnel-config";

type CatalogRow = {
  slug: string;
  clientKey?: string;
  title: string;
  segment: string;
  status?: string;
  live?: boolean;
  projectType?: string;
};

type ClientRow = {
  slug: string;
  clientKey: string;
  contactMode?: string;
};

const CATALOG = catalog as CatalogRow[];
const CLIENTS = clients as ClientRow[];

export type PortfolioFunnelAdminRow = {
  slug: string;
  clientKey: string;
  title: string;
  projectType: string | null;
  pagePublished: boolean;
  formId: string | null;
  formSlug: string;
  formStatus: "missing" | "draft" | "published" | "archived";
  questionCount: number;
  leadCount: number;
  destinationStatus: "configured" | "lead_only";
  destinationMasked: string | null;
  contactMode: string | null;
  isAlias: boolean;
};

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" }),
    supabaseAdmin.rpc("is_super_admin", { _uid: userId }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Acesso restrito a administradores.");
  return supabaseAdmin as any;
}

export function canonicalPortfolioFunnelSlug(clientKey: string): string {
  return `funnel-${clientKey}`;
}

function legacyPortfolioFunnelSlug(clientKey: string): string {
  return `portfolio-${clientKey}`;
}

export function portfolioFunnelLookupSlugs(clientKey: string): [string, string] {
  return [canonicalPortfolioFunnelSlug(clientKey), legacyPortfolioFunnelSlug(clientKey)];
}

function safeOptionValue(label: string, index: number): string {
  const value = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
  return value || `opcao_${index + 1}`;
}

function radioOptions(values: string[] | undefined) {
  return (values ?? []).slice(0, 30).map((label, index) => ({
    value: safeOptionValue(label, index),
    label: label.slice(0, 200),
  }));
}

export function buildPortfolioProvisionQuestions(slugOrKey: string) {
  const config = resolvePortfolioFunnelConfig(slugOrKey);
  const titles = config?.stepTitles ?? {};
  const subtitles = config?.stepSubtitles ?? {};

  const questions = [
    {
      key: "servico",
      type: "radio",
      label: titles.service ?? "Como podemos ajudar?",
      hint: subtitles.service ?? null,
      placeholder: null,
      required: true,
      options_json: radioOptions(config?.services),
    },
    {
      key: "contexto",
      type: "radio",
      label: titles.experience ?? "Conte um pouco do seu caso",
      hint: subtitles.experience ?? null,
      placeholder: null,
      required: true,
      options_json: radioOptions(config?.experienceOptions),
    },
    {
      key: "local_ou_periodo",
      type: "radio",
      label: titles.period ?? "Onde ou em qual período?",
      hint: subtitles.period ?? null,
      placeholder: null,
      required: true,
      options_json: radioOptions(config?.periodOptions),
    },
    {
      key: "prazo",
      type: "radio",
      label: titles.timing ?? "Para quando?",
      hint: subtitles.timing ?? null,
      placeholder: null,
      required: true,
      options_json: radioOptions(config?.timingOptions),
    },
    {
      key: "detalhes",
      type: "long_text",
      label: titles.note ?? "Quer acrescentar algum detalhe?",
      hint: subtitles.note ?? null,
      placeholder: config?.notePlaceholder ?? "Conte aqui o que for importante para o atendimento.",
      required: false,
      options_json: [],
    },
    {
      key: "nome",
      type: "short_text",
      label: "Como podemos chamar você?",
      hint: null,
      placeholder: "Seu nome",
      required: true,
      options_json: [],
    },
    {
      key: "whatsapp",
      type: "phone",
      label: "Qual WhatsApp para retorno?",
      hint: "Use DDD + número. O dado fica no lead e não é exibido publicamente.",
      placeholder: "(41) 99999-9999",
      required: true,
      options_json: [],
    },
  ] as const;

  return questions
    .filter((question) => question.type !== "radio" || question.options_json.length > 0)
    .map((question, order_index) => ({ ...question, order_index }));
}

function findProject(clientKey: string) {
  return CATALOG.find((item) => (item.clientKey ?? item.slug) === clientKey || item.slug === clientKey);
}

export const listPortfolioFunnels = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortfolioFunnelAdminRow[]> => {
    const admin = await assertAdmin(context.userId);
    const allowedFormSlugs = CATALOG.flatMap((project) =>
      portfolioFunnelLookupSlugs(project.clientKey ?? project.slug),
    );
    const { data: forms, error } = await admin
      .from("dynamic_forms")
      .select("id, slug, name, status, created_at, updated_at")
      .in("slug", allowedFormSlugs)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);

    const relevant = forms ?? [];
    const ids = relevant.map((form: any) => form.id);

    const questionCounts = new Map<string, number>();
    const leadCounts = new Map<string, number>();
    if (ids.length) {
      const countPaged = async (
        table: "dynamic_form_questions" | "dynamic_form_leads",
        target: Map<string, number>,
      ) => {
        const pageSize = 1000;
        for (let from = 0; from < 100000; from += pageSize) {
          const { data, error: pageError } = await admin
            .from(table)
            .select("form_id")
            .in("form_id", ids)
            .range(from, from + pageSize - 1);
          if (pageError) throw new Error(pageError.message);
          const page = data ?? [];
          for (const row of page) {
            target.set(row.form_id, (target.get(row.form_id) ?? 0) + 1);
          }
          if (page.length < pageSize) break;
        }
      };
      await Promise.all([
        countPaged("dynamic_form_questions", questionCounts),
        countPaged("dynamic_form_leads", leadCounts),
      ]);
    }

    const bySlug = new Map<string, any>(relevant.map((form: any) => [form.slug, form]));
    const clientByKey = new Map(CLIENTS.map((client) => [client.clientKey, client]));
    const { resolveVersionedPortfolioWhatsApp } = await import("@/lib/portfolio-whatsapp-registry.server");
    const { maskWhatsAppDigits } = await import("@/lib/portfolio-funnel-destination");

    return CATALOG.map((project) => {
      const clientKey = project.clientKey ?? project.slug;
      const canonical = canonicalPortfolioFunnelSlug(clientKey);
      const alias = legacyPortfolioFunnelSlug(clientKey);
      const form = bySlug.get(canonical) ?? bySlug.get(alias) ?? null;
      const destination = resolveVersionedPortfolioWhatsApp(clientKey);
      const client = clientByKey.get(clientKey);

      return {
        slug: project.slug,
        clientKey,
        title: project.title,
        projectType: project.projectType ?? null,
        pagePublished: project.status === "published" || project.live === true,
        formId: form?.id ?? null,
        formSlug: form?.slug ?? canonical,
        formStatus: form ? form.status : "missing",
        questionCount: form ? questionCounts.get(form.id) ?? 0 : 0,
        leadCount: form ? leadCounts.get(form.id) ?? 0 : 0,
        destinationStatus: destination ? "configured" : "lead_only",
        destinationMasked: destination ? maskWhatsAppDigits(destination) : null,
        contactMode: client?.contactMode ?? null,
        isAlias: Boolean(form && form.slug !== canonical),
      } satisfies PortfolioFunnelAdminRow;
    }).sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  });

const provisionSchema = z.object({
  clientKey: z.string().trim().min(2).max(80).regex(/^[a-z0-9][a-z0-9-]+$/),
  publish: z.boolean().default(false),
});

export const provisionPortfolioFunnel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => provisionSchema.parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const project = findProject(data.clientKey);
    if (!project) throw new Error("Projeto não encontrado no catálogo.");

    const clientKey = project.clientKey ?? project.slug;
    const [canonical, alias] = portfolioFunnelLookupSlugs(clientKey);

    const { data: existingRows, error: existingError } = await admin
      .from("dynamic_forms")
      .select("id, slug, status")
      .in("slug", [canonical, alias]);
    if (existingError) throw new Error(existingError.message);
    const existing = (existingRows ?? []).find((row: any) => row.slug === canonical) ?? existingRows?.[0];
    if (existing) {
      return {
        id: existing.id as string,
        slug: existing.slug as string,
        status: existing.status as string,
        created: false,
      };
    }

    // Nasce sempre em draft; só publica depois de todas as perguntas existirem.
    // Isso elimina a janela transitória de um formulário publicado porém vazio.
    const status = data.publish ? "published" : "draft";
    const { data: form, error: formError } = await admin
      .from("dynamic_forms")
      .insert({
        slug: canonical,
        name: `Atendimento · ${project.title}`,
        description: `Funil individual do portfolio ${project.slug}`,
        status: "draft",
        config_json: {
          portfolio_owned: true,
          client_key: clientKey,
          source: "portfolio-funnel-dashboard",
        },
        whatsapp_config: { enabled: false },
        created_by: context.userId,
      })
      .select("id, slug, status")
      .single();
    if (formError || !form) throw new Error(formError?.message ?? "Não foi possível criar o funil.");

    const questions = buildPortfolioProvisionQuestions(project.slug).map((question) => ({
      form_id: form.id,
      ...question,
    }));

    if (!questions.length) {
      await admin.from("dynamic_forms").delete().eq("id", form.id);
      throw new Error("O projeto não possui configuração suficiente para gerar perguntas com segurança.");
    }

    const { error: questionError } = await admin.from("dynamic_form_questions").insert(questions);
    if (questionError) {
      await admin.from("dynamic_forms").delete().eq("id", form.id);
      throw new Error(`Falha ao criar perguntas; o funil foi revertido. ${questionError.message}`);
    }

    if (data.publish) {
      const { error: publishError } = await admin
        .from("dynamic_forms")
        .update({ status: "published", updated_at: new Date().toISOString() })
        .eq("id", form.id);
      if (publishError) {
        await admin.from("dynamic_forms").delete().eq("id", form.id);
        throw new Error(`Falha ao publicar; o funil foi revertido. ${publishError.message}`);
      }
    }

    return { id: form.id as string, slug: form.slug as string, status, created: true };
  });

export const setPortfolioFunnelStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z.object({
      clientKey: z.string().trim().min(2).max(80).regex(/^[a-z0-9][a-z0-9-]+$/),
      status: z.enum(["draft", "published"]),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const project = findProject(data.clientKey);
    if (!project) throw new Error("Projeto não encontrado no catálogo.");

    const clientKey = project.clientKey ?? project.slug;
    const slugs = portfolioFunnelLookupSlugs(clientKey);
    const { data: rows, error: lookupError } = await admin
      .from("dynamic_forms")
      .select("id, slug")
      .in("slug", slugs);
    if (lookupError) throw new Error(lookupError.message);
    const form = (rows ?? []).find((row: any) => row.slug === slugs[0]) ?? rows?.[0];
    if (!form) throw new Error("Crie o funil individual antes de alterar o status.");

    if (data.status === "published") {
      const { count, error: countError } = await admin
        .from("dynamic_form_questions")
        .select("id", { count: "exact", head: true })
        .eq("form_id", form.id);
      if (countError) throw new Error(countError.message);
      if (!count) {
        throw new Error("Não é possível publicar um funil sem perguntas.");
      }
    }

    const { error } = await admin
      .from("dynamic_forms")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", form.id);
    if (error) throw new Error(error.message);

    return { ok: true as const, id: form.id as string, status: data.status };
  });
