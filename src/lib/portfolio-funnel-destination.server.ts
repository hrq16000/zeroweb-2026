/**
 * FUNNEL_DESTINATION — auditoria server-only do destino operacional.
 *
 * Fonte canônica ÚNICA do destino continua sendo
 * `whatsapp-redirect.server.ts` (segredo operacional do projeto → configuração
 * privada do cliente). Este módulo não cria uma segunda fonte de verdade: ele
 * observa a mesma resolução, cruza com o livro-razão de proveniência
 * (`portfolio-funnel-destinations.json`) e devolve uma matriz auditável e
 * mascarada.
 */
if (typeof window !== "undefined") {
  throw new Error("portfolio-funnel-destination.server.ts imported from client code");
}

import catalog from "@/config/portfolio-catalog.json";
import ledger from "@/config/portfolio-funnel-destinations.json";
import { resolvePortfolioFunnelContext } from "@/lib/portfolio-funnel-context";
import {
  compareByOperationalRisk,
  computeDestinationPriority,
  EMPTY_TELEMETRY,
  maskWhatsAppDigits,
  type DestinationRow,
  type DestinationSource,
  type DestinationStatus,
  type DestinationTelemetry,
} from "@/lib/portfolio-funnel-destination";

type LedgerEntry = {
  status?: string;
  source?: string;
  confidence?: number;
  verifiedAt?: string | null;
  evidence?: string[];
  conflict?: string;
  humanDecision?: string;
};


const LEDGER = (ledger as { entries?: Record<string, LedgerEntry> }).entries ?? {};

type CatalogRow = {
  slug: string;
  clientKey?: string;
  title?: string;
  status?: string;
  live?: boolean;
  projectType?: string;
};

const CATALOG = catalog as CatalogRow[];

function publicStateOf(row: CatalogRow): DestinationRow["publicState"] {
  if (row.status === "published") return "published";
  if (row.status === "draft") return "draft";
  return "offline";
}

/**
 * Telemetria já existente do portal (analytics_events + dynamic_form_leads),
 * agregada por slug/clientKey. Nenhum analytics paralelo é criado.
 */
async function loadTelemetry(): Promise<{
  bySlug: Map<string, DestinationTelemetry>;
  leadsByClientKey: Map<string, number>;
}> {
  const bySlug = new Map<string, DestinationTelemetry>();
  const leadsByClientKey = new Map<string, number>();
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since90 = new Date(Date.now() - 90 * 864e5).toISOString();
    const since30 = new Date(Date.now() - 30 * 864e5).toISOString();

    const EVENTS = [
      "page_view",
      "portfolio_view",
      "funnel_open",
      "wa_funnel_open",
      "funnel_complete",
      "wa_funnel_complete",
    ];

    // A Data API pagina em blocos; sem isso a agregação leria só a primeira página.
    const PAGE = 1000;
    for (let from = 0; from < 200000; from += PAGE) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: events } = await (supabaseAdmin as any)
        .from("analytics_events")
        .select("path, event_name, created_at")
        .like("path", "/portfolio/%")
        .in("event_name", EVENTS)
        .gte("created_at", since90)
        .order("created_at", { ascending: true })
        .range(from, from + PAGE - 1);

      const page = (events ?? []) as { path: string; event_name: string; created_at: string }[];
      for (const e of page) {
        const slug = (e.path ?? "").split("?")[0].split("/")[2];
        if (!slug) continue;
        const t = bySlug.get(slug) ?? { ...EMPTY_TELEMETRY };
        if (e.event_name === "page_view" || e.event_name === "portfolio_view") {
          t.views90 += 1;
          if (e.created_at >= since30) t.views30 += 1;
        }
        if (e.event_name === "funnel_open" || e.event_name === "wa_funnel_open") t.funnelOpens90 += 1;
        if (e.event_name === "funnel_complete" || e.event_name === "wa_funnel_complete") {
          t.funnelCompletes90 += 1;
        }
        if (!t.lastActivityAt || e.created_at > t.lastActivityAt) t.lastActivityAt = e.created_at;
        bySlug.set(slug, t);
      }
      if (page.length < PAGE) break;
    }

    for (let from = 0; from < 50000; from += PAGE) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: leads } = await (supabaseAdmin as any)
        .from("dynamic_form_leads")
        .select("metadata_json, created_at")
        .gte("created_at", since90)
        .order("created_at", { ascending: true })
        .range(from, from + PAGE - 1);
      const page = (leads ?? []) as { metadata_json: Record<string, unknown> | null }[];
      for (const l of page) {
        const key = l.metadata_json?.["client_key"];
        if (typeof key !== "string") continue;
        leadsByClientKey.set(key, (leadsByClientKey.get(key) ?? 0) + 1);
      }
      if (page.length < PAGE) break;
    }

  } catch {
    /* telemetria é observacional: sua ausência nunca derruba a auditoria */
  }
  return { bySlug, leadsByClientKey };
}

/** Resolve a matriz completa. Server-only; nunca devolve número inteiro. */
export async function auditPortfolioDestinations(): Promise<DestinationRow[]> {
  const {
    resolvePortfolioWhatsAppContact,
    resolvePortfolioWhatsAppContactAsync,
  } = await import("@/lib/whatsapp-redirect.server");

  const { bySlug, leadsByClientKey } = await loadTelemetry();
  const { loadDestinationRevisions } = await import("@/lib/portfolio-destination-confirm.server");
  const revisions = await loadDestinationRevisions();
  const rows: DestinationRow[] = [];

  for (const project of CATALOG) {
    const clientKey = project.clientKey ?? project.slug;
    const context = resolvePortfolioFunnelContext(project.slug);
    // Confirmação administrativa é a evidência mais recente e vence o
    // livro-razão versionado; ausência dela preserva o estado atual.
    const revision = revisions.get(clientKey);
    const entry: LedgerEntry | undefined = revision
      ? {
          status: revision.status,
          source: revision.source,
          confidence: revision.status === "VERIFIED" ? 100 : 60,
          verifiedAt: revision.verifiedAt,
          evidence: revision.evidence ? [revision.evidence] : [],
        }
      : (LEDGER[clientKey] ?? LEDGER[project.slug]);

    const fromSecret = resolvePortfolioWhatsAppContact(clientKey);
    const contact = fromSecret ?? (await resolvePortfolioWhatsAppContactAsync(clientKey));
    const source: DestinationSource = fromSecret
      ? "OPERATIONAL_SECRET"
      : contact
        ? "CLIENT_SETTINGS"
        : "NONE";

    let status: DestinationStatus;
    let note: string | null = null;

    if (entry?.conflict) {
      status = "CONFLICT";
      note = entry.conflict;
    } else if (!contact) {
      status = "UNRESOLVED";
      note = "Sem destino operacional cadastrado: o funil termina apenas em protocolo.";
    } else if (entry?.status === "VERIFIED") {
      status = "VERIFIED";
    } else if (entry?.status === "AUTO_RESOLVED") {
      status = "AUTO_RESOLVED";
    } else if (entry?.status === "CHANGE_PENDING") {
      status = "CHANGE_PENDING";
      note = "Troca de destino aguardando confirmação explícita do administrador.";
    } else if (entry?.status === "CONFIGURATION_ERROR") {
      status = "CONFIGURATION_ERROR";
      note = "Destino gravado, mas o teste de validação falhou.";
    } else if (entry?.status === "INSUFFICIENT_EVIDENCE") {
      status = "INSUFFICIENT_EVIDENCE";
      note =
        entry.evidence?.[0] ??
        "Destino configurado, sem evidência local de que ainda pertence ao negócio.";
    } else {
      status = "CONFIGURED_UNVERIFIED";
      note = "Destino configurado, mas sem evidência de origem registrada.";
    }

    const telemetry = bySlug.get(project.slug) ?? { ...EMPTY_TELEMETRY };
    telemetry.leads90 = leadsByClientKey.get(clientKey) ?? 0;
    const priority = computeDestinationPriority(status, telemetry);
    // Conclusão de funil OU lead registrado sem destino = lead salvo, não entregue.
    const concluded = Math.max(telemetry.funnelCompletes90, telemetry.leads90);
    const conversionsAtRisk = contact ? 0 : concluded;
    const deliveryNotConfigured = conversionsAtRisk > 0;

    rows.push({
      slug: project.slug,
      projectName: project.title ?? project.slug,
      clientKey,
      funnelType: context.quizMode === "booking" ? "booking" : `proposal:${context.proposalKind}`,
      contactMode: "funnelOnly",
      destinationStatus: status,
      destinationSource: source,
      destinationValueMasked: contact ? maskWhatsAppDigits(contact.digits) : null,
      evidenceSource: entry?.source ?? null,
      confidence: entry?.confidence ?? (contact ? 50 : 0),
      lastVerifiedAt: entry?.verifiedAt ?? null,
      publicState: publicStateOf(project),
      note,
      telemetry,
      priority,
      deliveryNotConfigured,
      conversionsAtRisk,
    });
  }

  return rows.sort(compareByOperationalRisk);
}

/** Resumo por estado, para painel e gate. */
export function summarizeDestinations(rows: DestinationRow[]) {
  const counts: Record<string, number> = {};
  const priorities: Record<string, number> = {};
  for (const row of rows) {
    counts[row.destinationStatus] = (counts[row.destinationStatus] ?? 0) + 1;
    priorities[row.priority] = (priorities[row.priority] ?? 0) + 1;
  }
  return {
    total: rows.length,
    published: rows.filter((r) => r.publicState === "published").length,
    counts,
    priorities,
    conversionsAtRisk: rows.reduce((n, r) => n + r.conversionsAtRisk, 0),
    projectsWithDeliveryNotConfigured: rows.filter((r) => r.deliveryNotConfigured).length,
  };
}

