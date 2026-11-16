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
export function normalizePortfolioShareMessage(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function isValidPortfolioShareMessage(slug: string, value: string) {
  const message = normalizePortfolioShareMessage(value);
  const canonicalUrl = `https://0web.com.br/portfolio/${slug}`;
  const urls = message.match(/https?:\/\/[^\s]+/g) ?? [];
  const hashtags = message.match(/#[A-Za-z0-9_]+/g) ?? [];

  return (
    message.length >= 120 &&
    message.includes("\n\n") &&
    urls.length === 1 &&
    urls[0] === canonicalUrl &&
    message.split("\n").some((line) => line.trim() === canonicalUrl) &&
    hashtags.length > 0 &&
    hashtags.at(-1) === "#0WEB" &&
    !/\[[^\]]+\]\(https?:\/\//.test(message)
  );
}

export function buildPortfolioShareMessage(
  slug: string,
  siteName?: string,
  runtimeCopy?: string,
) {
  const item = findCatalogItem(slug);
  const canonicalSlug = item?.slug ?? slug;

  if (runtimeCopy) {
    const normalizedRuntimeCopy = normalizePortfolioShareMessage(runtimeCopy);
    if (isValidPortfolioShareMessage(canonicalSlug, normalizedRuntimeCopy)) {
      return normalizedRuntimeCopy;
    }
  }

  const approvedCopy = portfolioShareCopy[slug as keyof typeof portfolioShareCopy]
    ?? (item ? portfolioShareCopy[item.slug as keyof typeof portfolioShareCopy] : undefined);
  if (approvedCopy) {
    const normalizedApprovedCopy = normalizePortfolioShareMessage(approvedCopy);
    if (isValidPortfolioShareMessage(canonicalSlug, normalizedApprovedCopy)) {
      return normalizedApprovedCopy;
    }
  }

  // Proteção para rascunhos locais ainda fora do catálogo oficial. Projetos
  // publicados são obrigatoriamente cobertos pelo validador de copy individual.
  const name = siteName ?? item?.title ?? "Este negócio";
  const detail = item?.summary ?? item?.subtitle ?? "Conheça os serviços e a experiência digital da empresa.";
  const tags = [hashtag(name), ...(item?.tags ?? []).slice(0, 4).map(hashtag), "#SiteProfissional", "#0WEB"];
  const url = `https://0web.com.br/portfolio/${canonicalSlug}`;

  return `⚡ ${name} está de site novo!

Agora ficou ainda mais fácil conhecer os serviços, entender como a empresa trabalha e entrar em contato com a equipe.

${detail}

🌐 Confira:
${url}

📲 Entre em contato e solicite seu orçamento.

Projeto digital desenvolvido pela 0WEB — presença profissional para empresas que querem crescer e se destacar.

${tags.join(" ")}`;
}
