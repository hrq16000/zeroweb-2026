import { createFileRoute, redirect } from "@tanstack/react-router";
import { absUrl, ORIGIN } from "@/lib/seo";
import { DyzPromoPage } from "@/components/site/DyzPromoPage";

export const Route = createFileRoute("/dyzpromo")({
  beforeLoad: () => {
    throw redirect({ to: "/portfolio/dyzpromo", statusCode: 301, replace: true });
  },
  head: () => {
    const title = "D.Y.Z Promo · Divulgação e panfletagem em Curitiba";
    const description =
      "Divulgação promocional em Curitiba e região: panfletagem, semáforo, mão a mão, cancela, bandeiras, faixas e entrega de brindes.";
    const url = absUrl("/dyzpromo");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: "divulgação Curitiba, panfletagem Curitiba, marketing promocional, ação promocional, entrega de brindes, DYZ Promo" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "D.Y.Z Promo" },
        { property: "og:locale", content: "pt_BR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${url}#business`,
            name: "D.Y.Z Promo",
            description,
            url,
            telephone: "+55 41 9875-5277",
            taxID: "68.500.745/0001-53",
            areaServed: { "@type": "City", name: "Curitiba" },
            parentOrganization: { "@type": "Organization", name: "0WEB", url: ORIGIN },
            serviceType: "Marketing promocional e divulgação",
          }),
        },
      ],
    };
  },
  component: DyzPromoPage,
});

