import portfolioCatalog from "@/config/portfolio-catalog.json";
import portfolioShareCopy from "@/config/portfolio-share-copy.json";


type PortfolioCatalogItem = {
  slug: string;
  clientKey: string;
  title: string;
  tags: string[];
  summary?: string;
  subtitle?: string;
};

const CATALOG = portfolioCatalog as PortfolioCatalogItem[];

function hashtag(value: string) {
  return `#${value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}`;
}

function findCatalogItem(slug: string): PortfolioCatalogItem | undefined {
  return CATALOG.find((item) => item.slug === slug || item.clientKey === slug);
}

/**
 * Texto de divulgação pronto para WhatsApp, Instagram e e-mail.
 * A fonte é o catálogo canônico: um novo cliente recebe a mesma estrutura
 * sem duplicar copy no componente da página.
 */
export function buildPortfolioShareMessage(slug: string, siteName?: string) {
  const item = findCatalogItem(slug);
  const approvedCopy = portfolioShareCopy[slug as keyof typeof portfolioShareCopy]
    ?? (item ? portfolioShareCopy[item.slug as keyof typeof portfolioShareCopy] : undefined);
  if (approvedCopy) return approvedCopy;

  // Proteção para rascunhos locais ainda fora do catálogo oficial. Projetos
  // publicados são obrigatoriamente cobertos pelo validador de copy individual.
  const name = siteName ?? item?.title ?? "Este negócio";
  const detail = item?.summary ?? item?.subtitle ?? "Conheça os serviços e a experiência digital da empresa.";
  const tags = [hashtag(name), ...(item?.tags ?? []).slice(0, 4).map(hashtag), "#SiteProfissional", "#0WEB"];
  const url = `https://0web.com.br/portfolio/${item?.slug ?? slug}`;

  return `⚡ ${name} está de site novo!

Agora ficou ainda mais fácil conhecer os serviços, entender como a empresa trabalha e entrar em contato com a equipe.

${detail}

🌐 Confira:
${url}

📲 Entre em contato e solicite seu orçamento.

Projeto digital desenvolvido pela 0WEB — presença profissional para empresas que querem crescer e se destacar.

${tags.join(" ")}`;
}
