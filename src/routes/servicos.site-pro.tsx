import { createFileRoute } from "@tanstack/react-router";
import { IntentLanding, buildHead } from "@/components/site/IntentLanding";
import { absUrl } from "@/lib/seo";

const URL = absUrl("/servicos/site-pro");
const TITLE = "Site Pro · 10+ páginas com SEO técnico e estratégia orgânica · 0WEB";
const DESC =
  "Site profissional com 10+ páginas custom, SEO técnico + on-page e estratégia de palavras-chave para ampliar relevância orgânica. Inclui hospedagem, SSL, proteção anti-DDoS e 6 meses de suporte.";

export const Route = createFileRoute("/servicos/site-pro")({
  head: () => buildHead({ title: TITLE, description: DESC, url: URL }),
  component: SiteProPage,
});

function SiteProPage() {
  return (
    <IntentLanding
      slug="site-pro"
      serviceSlug="site-pro"
      intent="site-pro"
      eyebrow="Plano Site Pro · a partir de R$ 7.900"
      headline="Site Pro: 10+ páginas com estratégia de crescimento orgânico"
      subheadline="Para quem quer construir presença orgânica com método. Site profissional completo, estratégia de palavras-chave, SEO técnico + on-page e acompanhamento mensal de posicionamento."
      offerSlug="site-pro"
      ctaLabel="Quero o Site Pro"
      breadcrumbName="Site Pro"
      benefits={[
        {
          title: "10+ páginas custom",
          description:
            "Cada página desenhada do zero para a sua marca — sem template, sem WordPress. Estrutura semântica, design premium e copy estratégico.",
        },
        {
          title: "Estratégia de posicionamento no Google",
          description:
            "Trabalhamos palavras-chave selecionadas em conjunto com você, acompanhando evolução, concorrência e oportunidades. Você recebe relatório mensal de posicionamento.",
        },
        {
          title: "SEO técnico + on-page incluso",
          description:
            "Schema.org, sitemap, canonicals, internal linking e meta tags, com implementação orientada a Core Web Vitals e boas práticas técnicas. Sem custo extra.",
        },
        {
          title: "Estratégia de palavras-chave",
          description:
            "Pesquisa profissional de termos, intenção de busca, cluster de conteúdo e arquitetura de informação focada em conversão.",
        },
        {
          title: "Infraestrutura empresarial",
          description:
            "Infraestrutura distribuída, SSL, proteção anti-DDoS, alta disponibilidade e backup automático.",
        },
        {
          title: "6 meses de suporte incluso",
          description:
            "Acompanhamento técnico e estratégico durante o período crítico de indexação e estabilização nos rankings.",
        },
      ]}
      faq={[
        {
          q: "Em quanto tempo posso perceber evolução no Google?",
          a: "O ranqueamento depende da concorrência, autoridade do domínio, conteúdo e intenção de busca. Definimos metas e palavras-chave realistas no kickoff e acompanhamos a evolução mensalmente, sem prometer posição específica.",
        },
        {
          q: "Qual a diferença para o Site Express (a partir de R$ 499)?",
          a: "O Site Express é a opção enxuta e turnkey, a partir de R$ 499. O Site Pro é um projeto institucional de 10+ páginas com arquitetura de conteúdo, pesquisa de palavras-chave e acompanhamento de SEO orgânico. São produtos para objetivos diferentes.",
        },
        {
          q: "O que está incluso no preço a partir de R$ 7.900?",
          a: "Design e desenvolvimento de 10+ páginas, SEO técnico + on-page, pesquisa de palavras-chave, hospedagem por 1 ano, SSL, anti-DDoS, Edge CDN, painel para você editar e 6 meses de suporte. Páginas adicionais e estratégias avançadas de link building são orçadas à parte.",
        },
        {
          q: "Vocês usam WordPress ou template?",
          a: "Não. Todo Site Pro é desenvolvido sob medida em TanStack/React e otimizado para boas práticas de performance e Core Web Vitals. Você recebe um painel próprio para editar conteúdo sem depender de plugin.",
        },
        {
          q: "Posso adicionar mais páginas depois?",
          a: "Sim. Páginas adicionais e novos clusters de conteúdo são orçados separadamente, com preço fixo por página entregue.",
        },
        {
          q: "Posso pagar parcelado?",
          a: "Sim. Aceitamos cartão em até 12x, Pix com desconto e divisão em entrada + parcelas conforme cronograma de entrega.",
        },
      ]}
      schemaService={{
        name: "Site Pro 0WEB",
        description: DESC,
        url: URL,
      }}
      relatedServicePaths={["/servicos/seo", "/servicos/site-express", "/servicos/criacao-de-sites"]}
    />
  );
}
