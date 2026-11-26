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
  { slug: "cantinho-da-tia-mari", vertical: "comercios", siteName: "Cantinho da Tia Mari · Jardim Itália, São José dos Pinhais", kind: "prototype", indexable: true },
  { slug: "agropet-filt", vertical: "comercios", siteName: "Aviário Agropet Filt · Pinhais — PR", kind: "prototype", indexable: true },
  { slug: "arildo-madeiras", vertical: "comercios", siteName: "Arildo Madeiras · Pinhais — PR", kind: "prototype", indexable: true },
  { slug: "dona-garimpeira-brecho", vertical: "comercios", siteName: "Dona Garimpeira · Brechó em São José dos Pinhais — PR", kind: "prototype", indexable: true },
  { slug: "autoescola-aptos", vertical: "prestadores-de-servicos", siteName: "Autoescola APTOS · São José dos Pinhais", kind: "prototype", indexable: true },
  { slug: "cris-presentes-colonia-rio-grande", vertical: "comercios", siteName: "Cris Presentes · Colônia Rio Grande · São José dos Pinhais", kind: "prototype", indexable: true },
  {
    slug: "adhonep-curitiba",
    vertical: "prestadores-de-servicos",
    siteName: "ADHONEP Curitiba · Reunião sema���q�^