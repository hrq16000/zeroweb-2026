/**
 * DESTINATION INTAKE — confirmação administrativa do destino operacional.
 *
 * Não cria uma segunda fonte de destino: o número continua vivendo apenas no
 * mecanismo canônico privado (segredo operacional do projeto ou
 * `portfolio_client_settings.funnel_recipient`). Aqui ficam a validação, a
 * detecção de destino compartilhado, o teste de resolução e o histórico de
 * proveniência (sem número).
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
    | "LANDLINE_REQUIRES_ACK"
    | "SHARED_DESTINATION_REQUIRES_ACK"
    | "CHANGE_REQUIRES_ACK"
    | "VALIDATION_FAILED"
    | "PERSIST_FAILED";
  message: string;
  masked: string | null;
  sharedWith?: string[];
};

export type DestinationRevisionState = {
  status: string;
  source: string;
  verifiedAt: string | null;
  evidence: string | null;
  destinationFingerprint: string | null;
  validationResult: string | null;
};

/**
 * Fingerprint canônico do destino. O número nunca precisa sair do servidor
 * para provar que uma revisão VERIFIED ainda corresponde ao destino atual.
 */
export function fingerprintDestination(digits: string): string {
  const salt = process.env.IP_HASH_SALT ?? "0web-default-salt";
  return createHash("sha256").update(`${salt}:wa:${digits}`).digest("hex").slice(0, 32);
}

export function revisionMatchesCurrentDestination(
  revision: Pick<DestinationRevisionState, "status" | "destinationFingerprint" | "validationResult"> | null,
  digits: string | null | undefined,
): boolean {
  if (!revision || !digits) return false;
  return (
    revision.status === "VERIFIED" &&
    revision.validationResult === "PASS" &&
    Boolean(revision.destinationFingerprint) &&
    revision.destinationFingerprint === fingerprintDestination(digits)
  );
}

function resolveProject(slug: string): { slug: string; clientKey: string } | null {
  const row = CATALOG.find((c) => c.slug === slug);
  if (!row) return null;
  return { slug: row.slug, clientKey: row.clientKey ?? row.slug };
}

/** Projetos que já usam exatamente este número (segredo ou configuração). */
async function findProjectsUsingDigits(digits: string, exceptKey: string): Promise<string[]> {
  const used = new Set<string>();
  const { resolvePortfolioWhatsAppContact } = await import("@/lib/whatsapp-redirect.server");
  for (const row of CATALOG) {
    const key = row.clientKey ?? row.slug;
    if (key === exceptKey) continue;
    if (resolvePortfolioWhatsAppContact(key)?.digits === digits) used.add(row.slug);
  }
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabaseAdmin as any)
      .from("portfolio_client_settings")
      .select("slug, client_key, funnel_recipient");
    for (const r of (data ?? []) as {
      slug: string;
      client_key: string;
      funnel_recipient: string | null;
    }[]) {
      if (r.client_key === exceptKey) continue;
      if (String(r.funnel_recipient ?? "").replace(/\D/g, "") === digits) used.add(r.slug);
    }
  } catch {
    /* ausência de leitura nunca inventa isolamento: apenas não amplia a lista */
  }
  return [...used].sort();
}

/** Estado atual (mascarado) do destino de um projeto. */
export async function currentDestination(clientKey: string) {
  const { resolvePortfolioWhatsAppContact, resolvePortfolioWhatsAppContactAsync } = await import(
    "@/lib/whatsapp-redirect.server"
  );
  const fromSecret = resolvePortfolioWhatsAppContact(clientKey);
  const contact = fromSecret ?? (await resolvePortfolioWhatsAppContactAsync(clientKey));
  return {
    digits: contact?.digits ?? null,
    masked: contact ? maskWhatsAppDigits(contact.digits) : null,
    fromSecret: Boolean(fromSecret),
  };
}

async function latestRevision(clientKey: string): Promise<DestinationRevisionState | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabaseAdmin as any)
    .from("portfolio_destination_revisions")
    .select(
      "new_status, provenance_source, evidence, confirmed_at, validated_at, destination_fingerprint, validation_result",
    )
    .eq("client_key", clientKey)
    .order("confirmed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  const row = data as {
    new_status: string;
    provenance_source: string;
    evidence: string | null;
    confirmed_at: string;
    validated_at: string | null;
    destination_fingerprint: string | null;
    validation_result: string | null;
  };
  return {
    status: row.new_status,
    source: row.provenance_source,
    evidence: row.evidence,
    verifiedAt: row.validated_at ?? row.confirmed_at,
    destinationFingerprint: row.destination_fingerprint,
    validationResult: row.validation_result,
  };
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
    destination_fingerprint: fingerprintDestination(row.digits),
    shared_with_ack: row.sharedAck,
    confirmed_by: row.userId,
    validated_at: row.validationResult === "PASS" ? new Date().toISOString() : null,
    validation_result: row.validationResult,
  });
}

/**
 * Teste de destino: resolve pelo mesmo caminho do runtime e confere que a URL
 * final de WhatsApp é válida. Nenhuma mensagem é enviada.
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

/** Confirmação administrativa: grava no mecanismo canônico e valida. */
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
    return { ok: false, status: "REJECTED", reason: "INVALID_NUMBER", message: parsed.message, masked: null };
  }
  if (parsed.looksLikeLandline && !input.acknowledgeLandline) {
    return {
      ok: false,
      status: "REJECTED",
      reason: "LANDLINE_REQUIRES_ACK",
      message:
        "Número parece ser telefone fixo. Confirme explicitamente que ele atende no WhatsApp — telefone fixo não vira WhatsApp por suposição.",
      masked: maskWhatsAppDigits(parsed.digits),
    };
  }

  const current = await currentDestination(project.clientKey);
  const previous = await latestRevision(project.clientKey);
  const previousStatus = revisionMatchesCurrentDestination(previous, current.digits)
    ? "VERIFIED"
    : previous?.status === "VERIFIED"
      ? (current.digits ? "CONFIGURED_UNVERIFIED" : "UNRESOLVED")
      : (previous?.status ?? (current.digits ? "CONFIGURED_UNVERIFIED" : "UNRESOLVED"));

  // Troca do MESMO destino atualmente verificado exige confirmação explícita.
  if (previousStatus === "VERIFIED" && current.digits && current.digits !== parsed.digits && !input.acknowledgeChange) {
    await writeRevision({
      clientKey: project.clientKey,
      slug: project.slug,
      previousStatus,
      newStatus: "CHANGE_PENDING",
      provenanceSource: input.provenanceSource,
      evidence: input.evidence,
      digits: parsed.digits,
      sharedAck: Boolean(input.acknowledgeShared),
      userId,
      validationResult: null,
    });
    return {
      ok: false,
      status: "CHANGE_PENDING",
      reason: "CHANGE_REQUIRES_ACK",
      message:
        "Este projeto já tem destino verificado. Confirme explicitamente a troca de número para concluir.",
      masked: maskWhatsAppDigits(parsed.digits),
    };
  }

  // Destino compartilhado por outro projeto exige decisão humana explícita.
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

  // Fonte única: grava no mecanismo canônico privado.
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = supabaseAdmin as any;
  const { data: existing } = await admin
    .from("portfolio_client_settings")
    .select("id")
    .eq("client_key", project.clientKey)
    .maybeSingle();

  const write = existing?.id
    ? await admin
        .from("portfolio_client_settings")
        .update({ funnel_recipient: parsed.digits, funnel_enabled: true, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
    : await admin.from("portfolio_client_settings").insert({
        client_key: project.clientKey,
        slug: project.slug,
        funnel_recipient: parsed.digits,
        funnel_enabled: true,
      });

  if (write.error) {
    return {
      ok: false,
      status: "CONFIGURATION_ERROR",
      reason: "PERSIST_FAILED",
      message: "Não foi possível gravar o destino operacional.",
      masked: maskWhatsAppDigits(parsed.digits),
    };
  }

  // Teste automático logo após salvar, pelo MESMO resolver do runtime.
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
      ? "Destino confirmado e validado: novos leads passam a ser entregues diretamente."
      : validation.result === "RESOLVER_MISMATCH"
        ? "O resolver ainda devolve outro número (segredo operacional tem precedência). Destino não promovido."
        : "O teste de destino falhou. Estado mantido como CONFIGURATION_ERROR.",
    masked: maskWhatsAppDigits(parsed.digits),
    ...(sharedWith.length > 0 ? { sharedWith } : {}),
  };
}

/** Última revisão administrativa por client_key, para a matriz de auditoria. */
export async function loadDestinationRevisions(): Promise<Map<string, DestinationRevisionState>> {
  const out = new Map<string, DestinationRevisionState>();
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabaseAdmin as any)
      .from("portfolio_destination_revisions")
      .select(
        "client_key, new_status, provenance_source, evidence, confirmed_at, validated_at, destination_fingerprint, validation_result",
      )
      .order("confirmed_at", { ascending: true });
    for (const r of (data ?? []) as {
      client_key: string;
      new_status: string;
      provenance_source: string;
      evidence: string | null;
      confirmed_at: string;
      validated_at: string | null;
      destination_fingerprint: string | null;
      validation_result: string | null;
    }[]) {
      out.set(r.client_key, {
        status: r.new_status,
        source: r.provenance_source,
        verifiedAt: r.validated_at ?? r.confirmed_at,
        evidence: r.evidence,
        destinationFingerprint: r.destination_fingerprint,
        validationResult: r.validation_result,
      });
    }
  } catch {
    /* sem revisões o livro-razão versionado continua valendo */
  }
  return out;
}

export const __test = { fingerprintDestination, revisionMatchesCurrentDestination };
