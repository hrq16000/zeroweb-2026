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
  maskWhatsAppDigits,
  type DestinationRow,
  type DestinationSource,
  type DestinationStatus,
} from "@/lib/portfolio-funnel-destination";

type LedgerEntry = {
  status?: string;
  source?: string;
  confidence?: number;
  verifiedAt?: string;
  evidence?: string[];
  conflict?: string;
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

/** Resolve a matriz completa. Server-only; nunca devolve número inteiro. */
export async function auditPortfolioDestinations(): Promise<DestinationRow[]> {
  const {
    resolvePortfolioWhatsAppContact,
    resolvePortfolioWhatsAppContactAsync,
  } = await import("@/lib/whatsapp-redirect.server");

  const rows: DestinationRow[] = [];

  for (const project of CATALOG) {
    const clientKey = project.clientKey ?? project.slug;
    const context = resolvePortfolioFunnelContext(project.slug);
    const entry = LEDGER[clientKey] ?? LEDGER[project.slug];

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
    } else {
      status = "CONFIGURED_UNVERIFIED";
      note = "Destino configurado, mas sem evidência de origem registrada.";
    }

    rows.push({
      slug: project.slug,
      projectName: project.title ?? project.slug,
      clientKey,
      funnelType: context.quizMode === "booking" ? "booking" : `proposal:${context.proposalKind}`,
      contactMode: "funnelOnly",
      destinationStatus: status,
      destinationSource: source,
      destinationValueMasked: contact ? maskWhatsAppDigits(contact.digits) : null,
      confidence: entry?.confidence ?? (contact ? 50 : 0),
      lastVerifiedAt: entry?.verifiedAt ?? null,
      publicState: publicStateOf(project),
      note,
    });
  }

  return rows.sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Resumo por estado, para painel e gate. */
export function summarizeDestinations(rows: DestinationRow[]) {
  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.destinationStatus] = (counts[row.destinationStatus] ?? 0) + 1;
  return {
    total: rows.length,
    published: rows.filter((r) => r.publicState === "published").length,
    counts,
  };
}
