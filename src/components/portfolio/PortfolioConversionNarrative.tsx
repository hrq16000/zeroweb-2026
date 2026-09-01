import portfolioCatalog from "@/config/portfolio-catalog.json";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { resolvePortfolioClientKey } from "@/lib/portfolio-global-config";

type Item = { slug: string; title: string; city: string; state: string; tags: string[]; summary?: string; subtitle?: string };
const catalog = portfolioCatalog as Item[];

const narrativeBySlug: Record<string, { title: string; step: string; cta: string; theme: "pink" | "gold" | "navy" }> = {
  "sos-presentes-cosmeticos": { title: "Uma surpresa começa por uma escolha com significado.", step: "Conte a ocasião, a ideia e quando você precisa do presente.", cta: "Montar um presente", theme: "pink" },
  "ag-electrical-services": { title: "Infraestrutura clara antes de qualquer instalação.", step: "Descreva o ambiente e a solução técnica que precisa avaliar.", cta: "Solicitar avaliação", theme: "navy" },
  "confeitaria-chyrley": { title: "Sua celebração começa na encomenda certa.", step: "Conte a data, o tipo de comemoração e o que imagina servir.", cta: "Planejar minha festa", theme: "pink" },
  "mp-festas-eventos": { title: "A memória da festa começa no cenário.", step: "Conte o tema, a data e o formato que combina com sua celebração.", cta: "Planejar decoração", theme: "pink" },
  "vila-da-capivara": { title: "Festa boa tem sabor, afeto e organização.", step: "Escolha a ocasião e conte quantas pessoas quer receber.", cta: "Montar meu kit", theme: "pink" },
  "paraiso-do-hot-dog": { title: "Escolher o próximo lanche pode ser simples.", step: "Veja as combinações e monte um pedido de acordo com sua fome.", cta: "Montar pedido", theme: "gold" },
  "acai-total-araucaria": { title: "Seu açaí, do jeito que o dia pede.", step: "Escolha o tamanho, os cremes e os complementos que mais gosta.", cta: "Escolher meu açaí", theme: "gold" },
  "mary-diarista": { title: "Uma rotina mais leve começa com a agenda certa.", step: "Conte o tipo de limpeza, a frequência e o melhor dia para você.", cta: "Consultar agenda", theme: "pink" },
  "no-brilho-higienizacao": { title: "Cuidado profissional para o que acompanha sua rotina.", step: "Informe a peça, a necessidade e a região do atendimento.", cta: "Agendar higienização", theme: "navy" },
  "studio-de-cilios": { title: "Seu olhar pode ter um acabamento pensado para você.", step: "Escolha um estilo ou conte o efeito que deseja alcançar.", cta: "Escolher estilo", theme: "pink" },
  "renata-beauty": { title: "Um momento de beleza começa com cuidado na escolha.", step: "Veja os procedimentos e indique o cuidado que procura.", cta: "Ver procedimentos", theme: "pink" },
  "r_beauty": { title: "Autocuidado também pode ser uma pausa bem escolhida.", step: "Conte o que deseja cuidar e encontre uma orientação inicial.", cta: "Conhecer cuidados", theme: "pink" },
};

export function PortfolioConversionNarrative({ slug }: { slug: string }) {
  const item = catalog.find((entry) => entry.slug === slug);
  const clientKey = resolvePortfolioClientKey(slug);
  if (!item || !clientKey) return null;
  const services = item.tags.slice(0, 4).map((tag) => tag.replace(/-/g, " "));
  const description = item.summary ?? item.subtitle ?? `Conheça os serviços de ${item.title} em ${item.city}.`;
  const narrative = narrativeBySlug[slug] ?? { title: `Entenda como ${item.title} pode ajudar no seu momento.`, step: `Conte sua necessidade e os detalhes importantes para ${item.title}.`, cta: "Iniciar atendimento", theme: "navy" as const };
  return <section aria-labelledby={`about-${slug}`} className="border-t border-border bg-card px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Sobre o projeto</p><h2 id={`about-${slug}`} className="mt-3 font-display text-3xl font-bold text-foreground">{narrative.title}</h2><p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p><p className="mt-4 text-sm font-semibold text-foreground">Atendimento em {item.city} — {item.state}.</p></div><div className="rounded-2xl border border-border bg-background p-6"><h3 className="font-display text-xl font-bold text-foreground">Como começar</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{narrative.step}</p><ul className="mt-5 flex flex-wrap gap-2">{services.map((service) => <li key={service} className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">{service}</li>)}</ul><PortfolioCTAQuiz clientKey={clientKey} studioName={item.title} recipientName={item.title} theme={narrative.theme} mode="proposal" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-current px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{narrative.cta}</PortfolioCTAQuiz></div></div></section>;
}
