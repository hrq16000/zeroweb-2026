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
  { slug: "confeitaria-chyrley", vertical: "restaurantes", siteName: "Chyrley Doces & Festas · Rio Bonito", kind: "prototype", indexable: true },
  { slug: "mp-festas-eventos", vertical: "comercios", siteName: "MP Festas e Eventos · Araucária", kind: "prototype", indexable: true },
  { slug: "studio-de-cilios", vertical: "beleza", siteName: "Studio de Cílios · Extensão personalizada", kind: "prototype", indexable: true },
  { slug: "refrigeracao-maresia", vertical: "prestadores-de-servicos", siteName: "Refrigeração Maresia · Curitiba e Região", kind: "prototype", indexable: true },
  { slug: "ag-electrical-services", vertical: "prestadores-de-servicos", siteName: "A&G Electrical Services · Elétrica e Redes", kind: "prototype", indexable: true },
  { slug: "vila-da-capivara", vertical: "restaurantes", siteName: "Vila da Capivara · Kits Festa em Curitiba", kind: "prototype", indexable: true },
  { slug: "lk-alvenaria", vertical: "prestadores-de-servicos", siteName: "LK Alvenaria · Construção e Acabamento", kind: "prototype", indexable: true },
  { slug: "lucas-arruma-maquina-lavar", vertical: "prestadores-de-servicos", siteName: "Lucas Arruma Máquina de Lavar · Assistência", kind: "prototype", indexable: true },
]; 

export function findPortfolioPrototype(slug: string) {
  return PORTFOLIO_PROTOTYPES.find((site) => site.slug === slug);
}
