import type { PortfolioPlaceHub } from "@/lib/portfolio-places";

const SEGMENT_LABELS: Record<string, string> = {
  agencias: "Agências e digital",
  beleza: "Beleza e cuidados",
  comercios: "Comércios",
  construcao: "Construção e materiais",
  juridico: "Serviços jurídicos",
  "prestadores-de-servicos": "Prestadores de serviços",
  restaurantes: "Alimentação e gastronomia",
  saude: "Saúde",
  servicos: "Serviços",
};

function cleanSegment(value?: string) {
  return (value ?? "").trim();
}

export type PortfolioPlaceDirectoryGroup = {
  key: string;
  label: string;
  projects: PortfolioPlaceHub["projects"];
};

export function portfolioPlaceDirectoryGroups(hub: PortfolioPlaceHub): PortfolioPlaceDirectoryGroup[] {
  const groups = new Map<string, PortfolioPlaceHub["projects"]>();

  for (const project of hub.projects) {
    const key = cleanSegment(project.segment) || "outros";
    const items = groups.get(key) ?? [];
    items.push(project);
    groups.set(key, items);
  }

  return [...groups.entries()]
    .map(([key, projects]) => ({
      key,
      label: SEGMENT_LABELS[key] ?? key.replace(/-/g, " ").replace(/^./, (char) => char.toUpperCase()),
      projects: [...projects].sort((a, b) => a.title.localeCompare(b.title, "pt-BR")),
    }))
    .sort((a, b) => b.projects.length - a.projects.length || a.label.localeCompare(b.label, "pt-BR"));
}

export function portfolioPlaceDirectoryTitle(hub: PortfolioPlaceHub): string {
  if (hub.kind === "neighborhood") {
    return `Negócios em ${hub.name}, ${hub.city} | Guia 0WEB`;
  }
  return `Negócios em ${hub.city}, ${hub.state} | Guia 0WEB`;
}

export function portfolioPlaceDirectoryDescription(hub: PortfolioPlaceHub): string {
  const groups = portfolioPlaceDirectoryGroups(hub);
  const categories = groups.slice(0, 3).map((group) => group.label.toLowerCase());
  const place =
    hub.kind === "neighborhood"
      ? `${hub.name}, ${hub.city}`
      : `${hub.city}, ${hub.state}`;
  const categoryText = categories.length ? ` em ${categories.join(", ")}` : "";
  return `Explore ${hub.projects.length} negócios e prestadores publicados em ${place}${categoryText}. Abra cada página, conheça a oferta e siga pelo atendimento.`;
}

export function portfolioPlaceDirectoryIntro(hub: PortfolioPlaceHub): string {
  const place =
    hub.kind === "neighborhood"
      ? `${hub.name}, ${hub.city}`
      : `${hub.city}, ${hub.state}`;
  return `Este guia comercial reúne ${hub.projects.length} negócios e prestadores com presença publicada em ${place}. As páginas abaixo preservam a identidade e o conteúdo de cada negócio e ajudam a descobrir opções por localidade e categoria.`;
}
