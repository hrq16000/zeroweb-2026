/** Registro único das páginas demonstrativas dentro de /portfolio/.
 * Novos protótipos entram aqui uma única vez; rota, SEO e sitemap consomem
 * a mesma fonte para evitar correções duplicadas.
 */
export type PortfolioPrototype = {
  slug: string;
  vertical: string;
  siteName: string;
  kind: "prototype";
  indexable: boolean;
};

export const PORTFOLIO_PROTOTYPES: readonly PortfolioPrototype[] = [
  { slug: "marido-de-aluguel", vertical: "prestadores-de-servicos", siteName: "Marido de Aluguel · Serviços Residenciais", kind: "prototype", indexable: true },
  { slug: "clinica-integrada", vertical: "clinicas", siteName: "Clínica Integrada de Saúde", kind: "prototype", indexable: true },
  { slug: "almeida-torres", vertical: "advocacia", siteName: "Almeida Torres Advocacia", kind: "prototype", indexable: true },
  { slug: "casa-nativa", vertical: "restaurantes", siteName: "Casa Nativa Bistrô", kind: "prototype", indexable: true },
  { slug: "emporio-lelecute", vertical: "comercios", siteName: "Empório LeleCute · Lembrancinhas Artesanais", kind: "prototype", indexable: true },
  { slug: "paraiso-do-hot-dog", vertical: "restaurantes", siteName: "Paraíso do Hot Dog · Cardápio Online", kind: "prototype", indexable: true },
  { slug: "rm-fretes", vertical: "prestadores-de-servicos", siteName: "RM Fretes · Frete Rápido em Curitiba", kind: "prototype", indexable: true },
  { slug: "rj-servicos-drywall", vertical: "prestadores-de-servicos", siteName: "RJ Serviços de Drywall · Curitiba", kind: "prototype", indexable: true },
]; 

export function findPortfolioPrototype(slug: string) {
  return PORTFOLIO_PROTOTYPES.find((site) => site.slug === slug);
}
