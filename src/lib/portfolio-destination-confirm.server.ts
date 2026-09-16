/**
 * DESTINATION INTAKE — confirmação administrativa do destino operacional.
 *
 * A fonte canônica do número é `src/config/portfolio-whatsapp.json`, versionada
 * junto do próprio portfolio. Este módulo valida o valor já versionado e grava
 * apenas proveniência/histórico mascarado. Ele nunca grava número em cofre,
 * env ou tabela privada.
 */
if (typeof window !== "undefined") {
  throw new Error("portfolio-destination-confirm.server.ts imported from client code");
}

import { createHash } from "node:crypto";
import catalog from "@/config/portfolio-catalog.json";
import {
  maskWhatsAppDigits,
  normalizeBrWhatsApp,
  type DestinationProvenanceSource,
} from "@/lib/portfolio-funnel-destination";

type CatalogRow = { slug: string; clientKey?: string; title?: string };
const CATALOG = catalog as CatalogRow[];

export type ConfirmDestinationInput = {
  slug: string;
  whatsapp: string;
  provenanceSource: DestinationProvenanceSource;
  evidence: string;
  acknowledgeShared?: boolean;
  acknowledgeChange?: boolean;
  /** @deprecated mantido por compatibilidade; fixo/celular não é mais critério de bloqueio. */
  acknowledgeLandline?: boolean;
};

export type ConfirmDestinationResult = {
  ok: boolean;
  status:
    | "VERIFIED"
    | "CHANGE_PENDING"
    | "CONFIGURATION_ERROR"
    | "REJECTED";
  reason?:
    | "UNKNOWN_PROJECT"
    | "INVALID_NUMBER"
    | "INSTITUTIONAL_FORBIDDEN"
    | "SHARED_DESTINATION_REQUIRES_ACK"
    | "CHANGE_REQUIRES_ACK"
    | "VALIDATION_FAILED"
    | "PERSIST_FAILED";
  message: string;
  masked: string | null;
  sharedWith?: string[];
};

function fingerprint(digits: string): string {
  const salt = process.env.IP_HASH_SALT ?? "0web-default-salt";
  return createHash("sha256").update(`${salt}:wa:${digits}`).digest("hex").slice(0, 32);
}

function resolveProject(slug: string): { slug: string; clientKey: string } | null {
  const row = CATALOG.find((c) => c.slug === slug);
  if (!row) return null;
  return { slug: row.slug, clientKey: row.clientKey ?? row.slug };
}

/** Projetos cujo dado versionado já usa exatamente este número. */
async function findProjectsUsingDigits(digits: string, exceptKey: string): Promise<string[]> {
  const used = new Set<string>();
  const { resolvePortfolioWhatsAppContact } = await import("@/lib/whatsapp-redirect.server");
  for (const row of CATALOG) {
    const key = row.clientKey ?? row.slug;
    if (key === exceptKey) continue;
    if (resolvePortfolioWhatsAppContact(key)?.digits === digits) used.add(row.slug);
  }
  return [...used].sort();
}

/** Estado atual (mascarado) vindo exclusivamente do dado versionado. */
export async function currentDestination(clientKey: string) {
  const { resolvePortfolioWhatsAppContact } = await import("@/lib/whatsapp-redirect.server");
  const contact = resolvePortfolioWhatsAppContact(clientKey);
  return {
    digits: contact?.digits ?? null,
    masked: contact ? maskWhatsAppDigits(contact.digits) : null,
    // Campo legado preservado para consumidores antigos; não existe mais secret.
    fromSecret: false,
    source: contact ? ("PORTFOLIO_DATA" as const) : ("NONE" as const),
  };
}

async function latestRevision(clientKey: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabaseAdmin as any)
    .from("portfolio_destination_revisions")
    .select("new_status, provenance_source, confirmed_at, validated_at")
    .eq("client_key", clientKey)
    .order("confirmed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data ?? null) as
    | { new_status: string; provenance_source: string; confirmed_at: string; validated_at: string | null }
    | null;
}

async function writeRevision(row: {
  clientKey: string;
  slug: string;
  previousStatus: string | null;
  newStatus: string;
  provenanceSource: string;
  evidence: string;
  digits: string;
  sharedAck: boolean;
  userId: string;
  validationResult: string | null;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabaseAdmin as any).from("portfolio_destination_revisions").insert({
    client_key: row.clientKey,
    slug: row.slug,
    previous_status: row.previousStatus,
    new_status: row.newStatus,
    provenance_source: row.provenanceSource,
    evidence: row.evidence.slice(0, 500),
    destination_masked: maskWhatsAppDigits(row.digits),
    destination_fingerprint: fingerprint(row.digits),
    shared_with_ack: row.sharedAck,
    confirmed_by: row.userId,
    validated_at: row.validationResult === "PASS" ? new Date().toISOString() : null,
    validation_result: row.validationResult,
  });
}

/**
 * Teste de destino: resolve pelo mesmo dado versionado usado no runtime e
 * confere que a URL final de WhatsApp é válida. Nenhuma mensagem é enviada.
 */
export async function validateDestination(slug: string, expectedDigits?: string) {
  const project = resolveProject(slug);
  if (!project) return { ok: false, result: "UNKNOWN_PROJECT", masked: null as string | null };
  const { digits } = await currentDestination(project.clientKey);
  if (!digits) return { ok: false, result: "NO_DESTINATION", masked: null };
  if (expectedDigits && digits !== expectedDigits) {
    return { ok: false, result: "RESOLVER_MISMATCH", masked: maskWhatsAppDigits(digits) };
  }
  const { assembleWaMeUrl } = await import("@/lib/whatsapp-redirect.server");
  const url = assembleWaMeUrl(digits, `Teste interno 0WEB — ${project.slug}`);
  const valid = /^https:\/\/wa\.me\/\d{10,15}\?text=/.test(url);
  return {
    ok: valid,
    result: valid ? "PASS" : "INVALID_URL",
    masked: maskWhatsAppDigits(digits),
  };
}

/**
 * Confirmação administrativa.
 *
 * Este endpoint NÃO altera o número operacional em runtime. Se o valor digitado
 * difere do dado versionado, registra somente uma revisão mascarada como
 * CHANGE_PENDING. A mudança real deve ser feita no cadastro versionado do
 * portfolio e publicada por Git/PR. Quando o valor já coincide com o cadastro,
 * este fluxo valida e registra a proveniência como VERIFIED.
 */
export async function confirmDestination(
  input: ConfirmDestinationInput,
  userId: string,
): Promise<ConfirmDestinationResult> {
  const project = resolveProject(input.slug);
  if (!project) {
    return {
      ok: false,
      status: "REJECTED",
      reason: "UNKNOWN_PROJECT",
      message: "Projeto não encontrado no catálogo.",
      masked: null,
    };
  }

  const parsed = normalizeBrWhatsApp(input.whatsapp);
  if (!parsed.ok) {
    return {
      ok: false,
      status: "REJECTED",
      reason: "INVALID_NUMBER",
      message: parsed.message,
      masked: null,
    };
  }

  // O contato institucional da 0WEB nunca pode ser destino de portfolio.
  const { resolveOperationalWhatsAppContact } = await import("@/lib/whatsapp-redirect.server");
  const institutional = resolveOperationalWhatsAppContact()?.digits ?? null;
  if (institutional && parsed.digits === institutional) {
    return {
      ok: false,
      status: "REJECTED",
      reason: "INSTITUTIONAL_FORBIDDEN",
      message: "Este número é o contato operacional da 0WEB e nunca pode ser destino de um projeto.",
      masked: maskWhatsAppDigits(parsed.digits),
    };
  }

  const current = await currentDestination(project.clientKey);
  const previous = await latestRevision(project.clientKey);
  const previousStatus = previous?.new_status ?? (current.digits ? "CONFIGURED_UNVERIFIED" : "UNRESOLVED");

  const sharedWith = await findProjectsUsingDigits(parsed.digits, project.clientKey);
  if (sharedWith.length > 0 && !input.acknowledgeShared) {
    return {
      ok: false,
      status: "REJECTED",
      reason: "SHARED_DESTINATION_REQUIRES_ACK",
      message: "Este destino já é utilizado por outro projeto.",
      masked: maskWhatsAppDigits(parsed.digits),
      sharedWith,
    };
  }

  // Novo número ou troca: nunca grava em tabela privada. A revisão registra a
  // intenção sem persistir o número completo; a alteração operacional é Git.
  if (current.digits !== parsed.digits) {
    await writeRevision({
      clientKey: project.clientKey,
      slug: project.slug,
      previousStatus,
      newStatus: "CHANGE_PENDING",
      provenanceSource: input.provenanceSource,
      evidence: input.evidence,
      digits: parsed.digits,
      sharedAck: sharedWith.length > 0,
      userId,
      validationResult: null,
    });
    return {
      ok: false,
      status: "CHANGE_PENDING",
      reason: "CHANGE_REQUIRES_ACK",
      message:
        "Alteração registrada. Atualize o WhatsApp deste clientKey no cadastro versionado do portfolio e publique a PR; nenhum cofre ou tabela privada será usado.",
      masked: maskWhatsAppDigits(parsed.digits),
      ...(sharedWith.length > 0 ? { sharedWith } : {}),
    };
  }

  // O valor já é o dado canônico do portfolio: valida sem mutar destino.
  const validation = await validateDestination(project.slug, parsed.digits);
  const newStatus = validation.ok ? "VERIFIED" : "CONFIGURATION_ERROR";

  await writeRevision({
    clientKey: project.clientKey,
    slug: project.slug,
    previousStatus,
    newStatus,
    provenanceSource: input.provenanceSource,
    evidence: input.evidence,
    digits: parsed.digits,
    sharedAck: sharedWith.length > 0,
    userId,
    validationResult: validation.result,
  });

  return {
    ok: validation.ok,
    status: newStatus,
    reason: validation.ok ? undefined : "VALIDATION_FAILED",
    message: validation.ok
      ? "Destino versionado confirmado e validado para este portfolio."
      : "O teste do destino versionado falhou. Nenhuma fonte alternativa foi usada.",
    masked: maskWhatsAppDigits(parsed.digits),
    ...(sharedWith.length > 0 ? { sharedWith } : {}),
  };
}

/** Última revisão administrativa por client_key, para a matriz de auditoria. */
export async function loadDestinationRevisions(): Promise<
  Map<string, { status: string; source: string; verifiedAt: string | null; evidence: string | null }>
> {
  const out = new Map<string, { status: string; source: string; verifiedAt: string | null; evidence: string | null }>();
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabaseAdmin as any)
      .from("portfolio_destination_revisions")
      .select("client_key, new_status, provenance_source, evidence, confirmed_at, validated_at")
      .order("confirmed_at", { ascending: true });
    for (const r of (data ?? []) as {
      client_key: string;
      new_status: string;
      provenance_source: string;
      evidence: string | null;
      confirmed_at: string;
      validated_at: string | null;
    }[]) {
      out.set(r.client_key, {
        status: r.new_status,
        source: r.provenance_source,
        verifiedAt: r.validated_at ?? r.confirmed_at,
        evidence: r.evidence,
      });
    }
  } catch {
    /* sem revisões, o dado versionado continua sendo a fonte operacional */
  }
  return out;
}

export const __test = { fingerprint };
