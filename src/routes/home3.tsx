import { createFileRoute } from "@tanstack/react-router";
import { Home3MixExperience } from "@/components/site/Home3MixExperience";

const TITLE = "Landing Pages Autorais para Conversão e Campanhas | 0WEB";
const DESC =
  "Landing pages autorais para SEO, Google Ads e campanhas: mensagem, prova, performance, funil e conversão conectados a uma intenção real.";

const FAQ = [
  {
    q: "Qual é a diferença entre uma landing page e a home institucional?",
    a: "A home apresenta a empresa de forma ampla. Uma landing page trabalha uma oferta, campanha ou intenção principal com caminho de decisão mais curto e conteúdo específico.",
  },
  {
    q: "A mesma landing page serve para SEO e anúncios?",
    a: "Pode servir quando a intenção é compatível. Em campanhas diferentes, muitas vezes vale separar mensagem, prova e CTA.",
  },
  {
    q: "Toda landing page precisa ser curta?",
    a: "Não. O tamanho depende do que o visitante precisa entender antes de agir.",
  },
  {
    q: "A 0WEB garante primeira posição ou conversão específica?",
    a: "Não. Ranking e conversão dependem de concorrência, oferta, autoridade, mídia e comportamento do público.",
  },
];

export const Route = createFileRoute("/home3")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://0web.com.br/home3" },
      { property: "og:image", content: "https://0web.com.br/og-default.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "https://0web.com.br/home3" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://0web.com.br/home3#webpage",
              url: "https://0web.com.br/home3",
              name: TITLE,
              description: DESC,
              inLanguage: "pt-BR",
              isPartOf: { "@id": "https://0web.com.br/#website" },
              about: [
                { "@type": "Thing", name: "Landing pages" },
                { "@type": "Thing", name: "Conversão" },
                { "@type": "Thing", name: "SEO" },
                { "@type": "Thing", name: "Google Ads" }
              ]
            },
            {
              "@type": "FAQPage",
              "@id": "https://0web.com.br/home3#faq",
              mainEntity: FAQ.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a }
              }))
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "https://0web.com.br/" },
                { "@type": "ListItem", position: 2, name: "Landing pages autorais", item: "https://0web.com.br/home3" }
              ]
            }
          ]
        })
      }
    ]
  }),
  component: Home3MixExperience,
});
