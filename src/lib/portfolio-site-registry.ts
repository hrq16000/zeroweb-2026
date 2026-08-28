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
  { slug: "paulo-mestre-de-obras", vertical: "prestadores-de-servicos", siteName: "Paulo Mestre de Obras · Construção Civil", kind: "prototype", indexable: true },
  { slug: "ecommerce-on", vertical: "comercios", siteName: "Ecommerce On · Agência Digital", kind: "prototype", indexable: true },
  { slug: "no-brilho-higienizacao", vertical: "prestadores-de-servicos", siteName: "No Brilho Higienização · São José dos Pinhais", kind: "prototype", indexable: true },
  { slug: "salao-da-marcia", vertical: "beleza", siteName: "Salão da Marcia · Cidade Jardim", kind: "prototype", indexable: true },
  { slug: "espaco-cih-luh", vertical: "beleza", siteName: "Espaço CIH & LUH · O Casal das Unhas", kind: "prototype", indexable: true },
  { slug: "diego-montador-moveis", vertical: "prestadores-de-servicos", siteName: "Diego Montador de Móveis · Sítio Cercado", kind: "prototype", indexable: true },
  { slug: "aguia-sul-sinalizacao", vertical: "prestadores-de-servicos", siteName: "Águia Sul Sinalização · Pintura e Segurança", kind: "prototype", indexable: true },
  { slug: "eletrovale-eletromecanica", vertical: "prestadores-de-servicos", siteName: "Eletrovale Eletromecânica · Curitiba", kind: "prototype", indexable: true },
  { slug: "eletro-solucoes-eficazes", vertical: "prestadores-de-servicos", siteName: "Eletro Soluções Eficazes · Pinhais", kind: "prototype", indexable: true },
  { slug: "eisenfer-tubos-acos", vertical: "prestadores-de-servicos", siteName: "Eisenfer Tubos e Aços · São José dos Pinhais", kind: "prototype", indexable: true },
  { slug: "mary-diarista", vertical: "prestadores-de-servicos", siteName: "Mary Diarista · Curitiba", kind: "prototype", indexable: true },
  { slug: "acai-total-araucaria", vertical: "restaurantes", siteName: "Açaí Total · Araucária", kind: "prototype", indexable: true },
  { slug: "jkl-marcenaria", vertical: "prestadores-de-servicos", siteName: "JKL Marcenaria · Móveis sob medida", kind: "prototype", indexable: true },
]; 

export function findPortfolioPrototype(slug: string) {
  return PORTFOLIO_PROTOTYPES.find((site) => site.slug === slug);
}
