/**
 * Clusters de conteúdo do portfólio: segmentos × bairros/cidades.
 * Base para SEO programático (/portfolio/$segmento/$bairro) e para a
 * automação de links internos (âncoras contextuais entre portfólio,
 * hubs de serviço, bairros e blog).
 */
import { CWB_NEIGHBORHOODS, type CWBNeighborhood } from "@/lib/curitiba-neighborhoods";
import { BH_NEIGHBORHOODS, type BHNeighborhood } from "@/lib/bh-neighborhoods";
import portfolioCatalog from "@/config/portfolio-catalog.json";

export type PortfolioSegment = {
  slug: string;
  name: string;
  /** Termo usado no H1 programático. */
  keyword: string;
  intent: string;
  /** Serviços do catálogo relacionados (paths internos). */
  services: string[];
  /** Hubs/artigos relacionados. */
  hubs: string[];
  /** Cases reais do portfólio. */
  showcases: { path: string; label: string }[];
  deliverables: string[];
};

export const PORTFOLIO_SEGMENTS: PortfolioSegment[] = [
  {
    slug: "beleza-estetica",
    name: "Beleza & Estética",
    keyword: "criação de site para salão, studio de beleza e estética",
    intent: "agenda cheia com agendamento direto no WhatsApp",
    services: ["/servicos/google-ads-299", "/servicos/presenca-digital-google"],
    hubs: ["/sites-robustos", "/areas-de-atendimento"],
    showcases: [
      { path: "/portfolio/renata-beauty", label: "Renata Beauty Studio" },
      { path: "/portfolio/r_beauty", label: "R_Beauty Studio & Spa" },
    ],
    deliverables: [
      "Catálogo de procedimentos com fotos reais",
      "Agendamento direto pelo WhatsApp",
      "Ficha do Google Meu Negócio otimizada",
      "Galeria antes e depois",
    ],
  },
  {
    slug: "saude-clinicas",
    name: "Saúde & Clínicas",
    keyword: "site para clínica, consultório e profissionais de saúde",
    intent: "captação de pacientes de alto ticket pelo Google",
    services: ["/servicos/presenca-digital-google", "/servicos/google-ads-299"],
    hubs: ["/sites-robustos", "/areas-de-atendimento"],
    showcases: [{ path: "/sites/clinicas", label: "Clínica Integrada de Saúde" }],
    deliverables: [
      "Páginas por procedimento (SEO)",
      "Agendamento e triagem online",
      "Depoimentos e provas sociais",
      "Conformidade com conselhos de classe",
    ],
  },
  {
    slug: "advocacia-consultoria",
    name: "Advocacia & Consultoria",
    keyword: "site para advogado, escritório e consultoria",
    intent: "autoridade técnica e consultas qualificadas",
    services: ["/servicos/presenca-digital-google"],
    hubs: ["/sites-robustos", "/blog"],
    showcases: [{ path: "/sites/advocacia", label: "Escritório de Advocacia" }],
    deliverables: [
      "Conformidade com o Provimento 205 da OAB",
      "Artigos jurídicos que ranqueiam",
      "Formulário com aviso LGPD",
      "Páginas por área de atuação",
    ],
  },
  {
    slug: "servicos-locais",
    name: "Serviços & Negócios Locais",
    keyword: "site para comércio, restaurante e prestador de serviço local",
    intent: "mais pedidos diretos, sem pagar comissão de marketplace",
    services: ["/servicos/google-ads-299", "/servicos/presenca-digital-google"],
    hubs: ["/areas-de-atendimento", "/sites-robustos"],
    showcases: [{ path: "/sites/restaurantes", label: "Bistrô & Gastronomia" }],
    deliverables: [
      "Cardápio/catálogo digital em QR Code",
      "Pedidos diretos no WhatsApp",
      "Mapa e rota no Google Maps",
      "Carregamento em menos de 1 segundo",
    ],
  },
  {
    slug: "marido-de-aluguel",
    name: "Marido de Aluguel",
    keyword: "marido de aluguel, reparos residenciais e manutenção residencial",
    intent: "resolver pequenos reparos com orçamento claro e atendimento local",
    services: ["/portfolio/marido-de-aluguel", "/servicos/presenca-digital-google"],
    hubs: ["/areas-de-atendimento", "/portfolio"],
    showcases: [{ path: "/portfolio/marido-de-aluguel", label: "Serviços de marido de aluguel" }],
    deliverables: ["Instalações e montagens", "Reparos hidráulicos simples", "Pintura e acabamento", "Manutenção preventiva"],
  },
];

export function findPortfolioSegment(slug: string) {
  return PORTFOLIO_SEGMENTS.find((s) => s.slug === slug);
}

export type PortfolioPlace = {
  slug: string;
  name: string;
  city: string;
  state: "PR" | "MG";
  region: string;
  vibe: string;
  typicalBusinesses: string[];
  geo: [number, number];
  /** Página de bairro do silo já existente. */
  hubPath: string;
};

function fromCWB(n: CWBNeighborhood): PortfolioPlace {
  return {
    slug: n.slug,
    name: n.name,
    city: n.city,
    state: "PR",
    region: n.region,
    vibe: n.vibe,
    typicalBusinesses: n.typicalBusinesses,
    geo: n.geo,
    hubPath: `/bairros-cwb/${n.slug}`,
  };
}

function fromBH(n: BHNeighborhood): PortfolioPlace {
  return {
    slug: n.slug,
    name: n.name,
    city: "Belo Horizonte",
    state: "MG",
    region: n.region,
    vibe: n.vibe,
    typicalBusinesses: n.typicalBusinesses,
    geo: n.geo,
    hubPath: `/bairros-bh/${n.slug}`,
  };
}

export const PORTFOLIO_PLACES: PortfolioPlace[] = [
  ...CWB_NEIGHBORHOODS.map(fromCWB),
  ...BH_NEIGHBORHOODS.map(fromBH),
];

export function findPortfolioPlace(slug: string) {
  return PORTFOLIO_PLACES.find((p) => p.slug === slug);
}

/** Bairros priorizados por segmento — mantém o volume de páginas sob controle. */
export function placesForSegment(segment: PortfolioSegment, limit = 12): PortfolioPlace[] {
  const cwb = PORTFOLIO_PLACES.filter((p) => p.state === "PR");
  const bh = PORTFOLIO_PLACES.filter((p) => p.state === "MG");
  const interleaved: PortfolioPlace[] = [];
  const max = Math.max(cwb.length, bh.length);
  for (let i = 0; i < max && interleaved.length < limit; i++) {
    if (cwb[i]) interleaved.push(cwb[i]);
    if (bh[i] && interleaved.length < limit) interleaved.push(bh[i]);
  }
  // sufixo determinístico por segmento para variar o conjunto entre segmentos
  const offset = PORTFOLIO_SEGMENTS.findIndex((s) => s.slug === segment.slug);
  const regional = interleaved.filter((place) => place.city === "São José dos Pinhais");
  return regional.concat(interleaved.slice(0).concat(interleaved.slice(0, offset))).filter((place, index, all) => all.findIndex((p) => p.slug === place.slug) === index).slice(0, limit);
}

/** Projetos canônicos associados ao bairro/cidade, usados nos guias regionais. */
export function portfolioProjectsAtPlace(place: PortfolioPlace) {
  return (portfolioCatalog as Array<{ slug: string; title: string; city: string; state: string; location?: string; status?: string; segment?: string }>).filter(
    (item) => item.city === place.city && item.state === place.state && item.location?.toLowerCase().includes(place.name.toLowerCase()),
  );
}

/** Todas as combinações publicadas (usadas no sitemap programático). */
export function allPortfolioCombos(): { segment: PortfolioSegment; place: PortfolioPlace }[] {
  return PORTFOLIO_SEGMENTS.flatMap((segment) =>
    placesForSegment(segment).map((place) => ({ segment, place })),
  );
}

export function portfolioComboPath(segmentSlug: string, placeSlug: string) {
  return `/portfolio/${segmentSlug}/${placeSlug}`;
}

export type ClusterLink = { href: string; label: string; kind: string; title?: string };

/**
 * Motor de links internos do portfólio: mistura cases, bairros vizinhos,
 * hubs e serviços, sempre com âncora descritiva (nunca "clique aqui").
 */
export function portfolioClusterLinks(opts: {
  segmentSlug?: string;
  placeSlug?: string;
  limit?: number;
}): ClusterLink[] {
  const limit = opts.limit ?? 10;
  const segment = opts.segmentSlug ? findPortfolioSegment(opts.segmentSlug) : undefined;
  const place = opts.placeSlug ? findPortfolioPlace(opts.placeSlug) : undefined;
  const links: ClusterLink[] = [];

  if (segment) {
    for (const s of segment.showcases) {
      links.push({ href: s.path, label: `Case: ${s.label}`, kind: "case" });
    }
    for (const s of segment.services) {
      links.push({
        href: s,
        label: `Serviço: ${s.split("/").pop()!.replace(/-/g, " ")}`,
        kind: "service",
      });
    }
    for (const h of segment.hubs) {
      links.push({ href: h, label: `Guia: ${h.replace("/", "").replace(/-/g, " ")}`, kind: "hub" });
    }
  }

  if (place) {
    links.push({
      href: place.hubPath,
      label: `Criação de sites em ${place.name} — ${place.city}`,
      kind: "place",
    });
    const neighbors = PORTFOLIO_PLACES.filter(
      (p) => p.city === place.city && p.slug !== place.slug,
    ).slice(0, 4);
    for (const n of neighbors) {
      links.push({
        href: segment ? portfolioComboPath(segment.slug, n.slug) : n.hubPath,
        label: segment
          ? `${segment.name} em ${n.name}`
          : `Sites em ${n.name} — ${n.city}`,
        kind: "nearby",
      });
    }
  }

  // Outros segmentos no mesmo bairro (cluster cruzado)
  if (place) {
    for (const s of PORTFOLIO_SEGMENTS) {
      if (s.slug === segment?.slug) continue;
      links.push({
        href: portfolioComboPath(s.slug, place.slug),
        label: `${s.name} em ${place.name}`,
        kind: "cross",
      });
    }
  }

  links.push({ href: "/portfolio", label: "Portfólio completo da 0WEB", kind: "hub" });
  links.push({ href: "/areas-de-atendimento", label: "Áreas de atendimento", kind: "hub" });

  const seen = new Set<string>();
  return links.filter((l) => (seen.has(l.href) ? false : (seen.add(l.href), true))).slice(0, limit);
}
