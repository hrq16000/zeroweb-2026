import portfolioCatalog from "@/config/portfolio-catalog.json";
import {
  listPublicPortfolioSeoDescriptors,
  portfolioEntityGraphSchema,
  portfolioSemanticContext,
  portfolioUniversalSeoTitle,
  relatedPortfolioSeoItems,
} from "@/lib/portfolio-seo-network";
import { portfolioPlaceHubs } from "@/lib/portfolio-places";

type CatalogItem = {
  slug: string;
  status?: string;
  live?: boolean;
  title?: string;
  summary?: string;
  segment?: string;
  city?: string;
  state?: string;
  location?: string;
  tags?: string[];
  image?: string;
  fallbackImage?: string;
};

export type PortfolioIndividualSiteFinding = {
  slug: string;
  code: string;
  detail: string;
};

export type PortfolioIndividualSiteAudit = {
  totalPublished: number;
  blockers: PortfolioIndividualSiteFinding[];
  enrichmentDebt: PortfolioIndividualSiteFinding[];
};

const PUBLIC_STATUSES = new Set(["published", "approved"]);

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function portfolioIndividualSiteAudit(): PortfolioIndividualSiteAudit {
  const publishedCatalog = (portfolioCatalog as CatalogItem[]).filter(
    (item) => PUBLIC_STATUSES.has(item.status ?? "") && item.live !== false,
  );
  const descriptors = listPublicPortfolioSeoDescriptors();
  const descriptorsBySlug = new Map(descriptors.map((item) => [item.slug, item]));
  const hubs = portfolioPlaceHubs();
  const blockers: PortfolioIndividualSiteFinding[] = [];
  const enrichmentDebt: PortfolioIndividualSiteFinding[] = [];
  const titleOwners = new Map<string, string[]>();

  for (const item of publishedCatalog) {
    const slug = clean(item.slug);
    const descriptor = descriptorsBySlug.get(slug);

    if (!descriptor) {
      blockers.push({ slug, code: "MISSING_SEO_DESCRIPTOR", detail: "Projeto publicado ausente do descritor SEO universal." });
      continue;
    }

    if (!clean(item.title)) blockers.push({ slug, code: "MISSING_TITLE", detail: "Título do negócio ausente." });
    if (clean(item.summary).length < 80) {
      blockers.push({ slug, code: "THIN_SUMMARY", detail: "Resumo canônico possui menos de 80 caracteres." });
    }
    if (!clean(item.segment)) blockers.push({ slug, code: "MISSING_SEGMENT", detail: "Segmento ausente." });
    if (!clean(item.city)) blockers.push({ slug, code: "MISSING_CITY", detail: "Cidade ausente." });
    if (!clean(item.state)) blockers.push({ slug, code: "MISSING_STATE", detail: "Estado ausente." });
    if (!clean(item.location)) blockers.push({ slug, code: "MISSING_LOCATION", detail: "Location canônico ausente." });
    if (!Array.isArray(item.tags) || item.tags.length < 2) {
      blockers.push({ slug, code: "INSUFFICIENT_TOPICS", detail: "Menos de dois temas/tags para contexto editorial." });
    }

    const title = portfolioUniversalSeoTitle(slug);
    if (!title || title.length > 65) {
      blockers.push({ slug, code: "INVALID_SEO_TITLE", detail: "Title universal ausente ou acima de 65 caracteres." });
    } else {
      const owners = titleOwners.get(title) ?? [];
      owners.push(slug);
      titleOwners.set(title, owners);
    }

    const schema = portfolioEntityGraphSchema(slug);
    const graph = schema?.["@graph"] ?? [];
    const webpage = graph.find((node: any) => node?.["@type"] === "WebPage") as any;
    const entity = graph.find((node: any) => node?.["@id"] === `https://0web.com.br/portfolio/${slug}#entity`) as any;
    const breadcrumb = graph.find((node: any) => node?.["@type"] === "BreadcrumbList") as any;

    if (!webpage || webpage.url !== `https://0web.com.br/portfolio/${slug}`) {
      blockers.push({ slug, code: "MISSING_CANONICAL_WEBPAGE", detail: "WebPage canônica individual ausente no grafo." });
    }
    if (!entity) blockers.push({ slug, code: "MISSING_PRIMARY_ENTITY", detail: "Entidade principal individual ausente." });
    if (!breadcrumb) blockers.push({ slug, code: "MISSING_BREADCRUMB", detail: "BreadcrumbList ausente." });

    const related = relatedPortfolioSeoItems(slug, undefined, 6);
    if (related.length !== 6 || new Set(related.map((candidate) => candidate.slug)).size !== 6) {
      blockers.push({ slug, code: "DISCOVERY_GRAPH_INCOMPLETE", detail: "Projeto não recebe seis relações internas únicas." });
    }

    const semantic = portfolioSemanticContext(slug);
    if (!semantic || !semantic.label) {
      blockers.push({ slug, code: "MISSING_SEMANTIC_CONTEXT", detail: "Contexto semântico individual ausente." });
    }

    const belongsToLocalHub = hubs.some((hub) => hub.projects.some((project) => project.slug === slug));
    if (belongsToLocalHub && !(semantic?.placeLinks.length)) {
      blockers.push({ slug, code: "MISSING_LOCAL_BACKLINK", detail: "Projeto local não devolve backlink para hub regional." });
    }

    if (!clean(item.image) && !clean(item.fallbackImage)) {
      enrichmentDebt.push({
        slug,
        code: "MISSING_SPECIFIC_MEDIA",
        detail: "Projeto publicado ainda depende de mídia resolvida fora do catálogo; priorizar imagem/OG específica.",
      });
    }
  }

  for (const [title, owners] of titleOwners) {
    if (owners.length > 1) {
      for (const slug of owners) {
        blockers.push({ slug, code: "DUPLICATE_SEO_TITLE", detail: `Title duplicado entre: ${owners.join(", ")} (${title})` });
      }
    }
  }

  return {
    totalPublished: publishedCatalog.length,
    blockers,
    enrichmentDebt,
  };
}
