import portfolioCatalog from "@/config/portfolio-catalog.json";
import { type Capital } from "@/lib/capitais";

type CatalogProject = {
  slug: string;
  title: string;
  city?: string;
  state?: string;
  status?: string;
  live?: boolean;
  projectType?: string;
};

export function institutionalProjectsForCapital(capital: Capital) {
  return (portfolioCatalog as CatalogProject[])
    .filter((project) => project.status === "published" && project.live !== false)
    .filter((project) => project.projectType === "institutional")
    .filter((project) => project.city === capital.name && project.state === capital.uf)
    .map((project) => ({ slug: project.slug, title: project.title }));
}

export function institutionalCapitalHasEvidence(capital: Capital) {
  return institutionalProjectsForCapital(capital).length > 0;
}
