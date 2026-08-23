/**
 * Builders de Schema.org para o silo de portfólio:
 * Organization, LocalBusiness, Service, ItemList e BreadcrumbList.
 */
import type { PortfolioPlace, PortfolioSegment } from "@/lib/portfolio-clusters";

export const SITE_URL = "https://0web.com.br";

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "0WEB",
    url: SITE_URL,
    description:
      "Agência de criação de sites, landing pages de alta conversão, SEO local e marketing digital para pequenos e médios negócios no Brasil.",
    areaServed: "BR",
    knowsAbout: [
      "criação de sites",
      "landing pages de conversão",
      "SEO local",
      "Google Meu Negócio",
      "Google Ads",
      "gestão de redes sociais",
    ],
  };
}

export function localBusinessNode(place?: PortfolioPlace) {
  return {
    "@type": "ProfessionalService",
    "@id": place ? `${SITE_URL}/#local-${place.slug}` : `${SITE_URL}/#local`,
    name: place ? `0WEB — Criação de Sites em ${place.name}` : "0WEB — Criação de Sites",
    url: place ? `${SITE_URL}/bairros-${place.state === "PR" ? "cwb" : "bh"}/${place.slug}` : SITE_URL,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: place?.city ?? "Curitiba",
      addressRegion: place?.state ?? "PR",
      addressCountry: "BR",
    },
    ...(place
      ? {
          geo: { "@type": "GeoCoordinates", latitude: place.geo[0], longitude: place.geo[1] },
          areaServed: { "@type": "City", name: place.city },
        }
      : {}),
  };
}

export function serviceNode(segment: PortfolioSegment, place?: PortfolioPlace) {
  const name = place
    ? `${segment.name} — Criação de Sites em ${place.name}, ${place.city}`
    : `${segment.name} — Criação de Sites`;
  return {
    "@type": "Service",
    "@id": place
      ? `${SITE_URL}/portfolio/${segment.slug}/${place.slug}#service`
      : `${SITE_URL}/portfolio#service-${segment.slug}`,
    name,
    serviceType: segment.keyword,
    provider: { "@id": `${SITE_URL}/#organization` },
    ...(place ? { areaServed: { "@type": "City", name: place.city } } : { areaServed: "BR" }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Entregáveis — ${segment.name}`,
      itemListElement: segment.deliverables.map((d, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: d },
      })),
    },
  };
}

export function itemListNode(
  id: string,
  name: string,
  items: { url: string; name: string }[],
) {
  return {
    "@type": "ItemList",
    "@id": id,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: it.url,
      name: it.name,
    })),
  };
}

export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}

export function graph(nodes: unknown[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
