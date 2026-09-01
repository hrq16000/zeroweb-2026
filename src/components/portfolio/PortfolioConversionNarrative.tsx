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
  "salao-da-marcia": { title: "Seu tempo de autocuidado merece um horário bem escolhido.", step: "Conte o serviço de cabelo, depilação ou beleza que procura.", cta: "Reservar horário", theme: "pink" },
  "studio-de-cilios": { title: "Seu olhar pode ter um acabamento pensado para você.", step: "Escolha um estilo ou conte o efeito que deseja alcançar.", cta: "Escolher estilo", theme: "pink" },
  "renata-beauty": { title: "Um momento de beleza começa com cuidado na escolha.", step: "Veja os procedimentos e indique o cuidado que procura.", cta: "Ver procedimentos", theme: "pink" },
  "r_beauty": { title: "Autocuidado também pode ser uma pausa bem escolhida.", step: "Conte o que deseja cuidar e encontre uma orientação inicial.", cta: "Conhecer cuidados", theme: "pink" },
  "marido-de-aluguel": { title: "Resolver a casa não precisa virar uma lista sem fim.", step: "Explique o reparo, a montagem ou a instalação que precisa fazer.", cta: "Descrever o serviço", theme: "navy" },
  "dyzpromo": { title: "Uma ação em campo começa com planejamento que aparece.", step: "Conte o objetivo, a região e o momento da sua campanha.", cta: "Planejar uma ação", theme: "gold" },
  "emporio-lelecute": { title: "Pequenos detalhes podem guardar grandes memórias.", step: "Conte a ocasião, o estilo e a lembrança que quer criar.", cta: "Escolher lembrancinha", theme: "pink" },
  "rm-fretes": { title: "Um bom transporte começa com um trajeto bem explicado.", step: "Informe origem, destino, itens e a data que precisa atender.", cta: "Organizar meu frete", theme: "navy" },
  "rj-servicos-drywall": { title: "Um ambiente novo começa com uma boa estrutura.", step: "Conte o espaço, o acabamento desejado e a etapa da obra.", cta: "Avaliar ambiente", theme: "navy" },
  "clinica-integrada": { title: "Cuidado em saúde começa com informação clara.", step: "Indique a especialidade ou a orientação que procura.", cta: "Conhecer atendimento", theme: "navy" },
  "almeida-torres": { title: "Decisões jurídicas pedem orientação bem apresentada.", step: "Descreva o assunto para entender a melhor forma de iniciar.", cta: "Solicitar orientação", theme: "navy" },
  "casa-nativa": { title: "Uma boa experiência à mesa começa antes da reserva.", step: "Conheça o ambiente e planeje sua próxima visita.", cta: "Conhecer o bistrô", theme: "gold" },
  "refrigeracao-maresia": { title: "Quando o equipamento para, o diagnóstico precisa ser objetivo.", step: "Informe o equipamento, o sintoma e o momento mais adequado.", cta: "Relatar o problema", theme: "navy" },
  "lk-alvenaria": { title: "Cada etapa de obra pede um combinado bem feito.", step: "Conte a fase da construção ou reforma que quer avaliar.", cta: "Avaliar minha obra", theme: "gold" },
  "lucas-arruma-maquina-lavar": { title: "Uma lavadora com problema pede diagnóstico antes de qualquer solução.", step: "Informe o modelo, o sintoma e quando o problema começou.", cta: "Pedir diagnóstico", theme: "navy" },
  "paulo-mestre-de-obras": { title: "Da fundação ao acabamento, a obra começa no planejamento.", step: "Conte o que deseja construir, reformar ou reparar.", cta: "Planejar minha obra", theme: "gold" },
  "ecommerce-on": { title: "Crescimento digital começa com uma estratégia que cabe no negócio.", step: "Conte o desafio de marca, conteúdo ou vendas que quer resolver.", cta: "Conversar sobre estratégia", theme: "navy" },
  "espaco-cih-luh": { title: "Mãos e pés bem cuidados começam com a escolha do tratamento.", step: "Indique o cuidado que procura e a preferência de horário.", cta: "Escolher atendimento", theme: "pink" },
  "diego-montador-moveis": { title: "Móvel bem montado deixa a casa pronta para viver.", step: "Conte o móvel, a instalação ou o reparo que precisa realizar.", cta: "Organizar montagem", theme: "navy" },
  "aguia-sul-sinalizacao": { title: "Segurança também se constrói com sinalização bem feita.", step: "Descreva o espaço, a demarcação e o objetivo do projeto.", cta: "Avaliar sinalização", theme: "gold" },
  "eletrovale-eletromecanica": { title: "Operação parada pede uma avaliação técnica cuidadosa.", step: "Informe o equipamento e o tipo de manutenção necessária.", cta: "Solicitar suporte técnico", theme: "navy" },
  "eletro-solucoes-eficazes": { title: "Energia e automação começam em uma solução bem dimensionada.", step: "Conte o ambiente, a instalação e o resultado que procura.", cta: "Avaliar solução elétrica", theme: "navy" },
  "eisenfer-tubos-acos": { title: "Material certo dá estrutura a cada etapa da obra.", step: "Conte o projeto e os materiais que precisa cotar.", cta: "Solicitar cotação", theme: "gold" },
  "jkl-marcenaria": { title: "Móveis sob medida começam entendendo como você vive o espaço.", step: "Conte o ambiente, as medidas e a ideia que quer realizar.", cta: "Planejar móvel", theme: "gold" },
  "santos-montador-de-moveis": { title: "A casa funciona melhor quando cada detalhe fica no lugar.", step: "Conte o que precisa montar, instalar, pintar ou reparar.", cta: "Organizar serviço", theme: "navy" },
  "marmitaria-dom-diego": { title: "Almoço gostoso começa com uma escolha simples.", step: "Conte o que procura no cardápio e como prefere fazer o pedido.", cta: "Conhecer cardápio", theme: "gold" },
  "beto-pasteis": { title: "Um pastel bem escolhido muda o ritmo do dia.", step: "Escolha a ocasião e conte o que gostaria de encontrar no menu.", cta: "Conhecer sabores", theme: "gold" },
  "woodhouse-hamburgueres": { title: "Uma noite especial começa no primeiro pedido.", step: "Conte se procura hambúrguer, petisco ou uma experiência para compartilhar.", cta: "Conhecer a Woodhouse", theme: "navy" },
  "dlara-pizzaria": { title: "Seu próximo pedido merece um cardápio fácil de explorar.", step: "Escolha pizza, esfiha ou lanche e indique a ocasião do pedido.", cta: "Explorar opções", theme: "gold" },
  "toquinho-de-gente-brecho": { title: "Garimpar também pode ser uma forma de cuidar do planeta.", step: "Conte o que procura e descubra como organizar seu próximo garimpo.", cta: "Conhecer o conceito", theme: "pink" },
  "reuse-house-brecho": { title: "Uma peça especial pode ganhar uma nova história.", step: "Escolha seu estilo e veja como a curadoria pode aparecer na vitrine.", cta: "Explorar o conceito", theme: "navy" },
  "brecho-sao-francisco": { title: "Roupas com história merecem uma descoberta cuidadosa.", step: "Conte o tipo de peça que procura e encontre seu próximo garimpo.", cta: "Conhecer o conceito", theme: "gold" },
  "angel-mix-brecho": { title: "Moda acessível começa com um garimpo que combina com você.", step: "Indique seu estilo e descubra como organizar as peças da vitrine.", cta: "Explorar o conceito", theme: "pink" },
  "guaratuba-sabores-da-baia": { title: "Uma experiência caiçara começa pelo próximo sabor.", step: "Conte se procura almoço, frutos do mar ou uma ocasião para compartilhar.", cta: "Explorar o conceito", theme: "gold" },
  "guaratuba-oficina-nautica": { title: "Cuidar da embarcação começa com diagnóstico organizado.", step: "Conte o tipo de embarcação e o cuidado náutico que deseja avaliar.", cta: "Avaliar o conceito", theme: "navy" },
  "guaratuba-atelie-presentes": { title: "Um presente com identidade começa na escolha do detalhe.", step: "Conte a ocasião, o estilo e a lembrança que deseja criar.", cta: "Explorar o conceito", theme: "pink" },
  "guaratuba-reparos-residenciais": { title: "Pequenos reparos ficam mais simples quando o escopo é claro.", step: "Descreva o ambiente e o reparo que precisa organizar.", cta: "Avaliar o conceito", theme: "navy" },
  "mirassol-delicias-caseiras": { title: "Uma comemoração gostosa começa com a encomenda certa.", step: "Conte a data, o número de pessoas e o tipo de doce que procura.", cta: "Explorar o conceito", theme: "pink" },
  "mirassol-conserta-celular": { title: "Tecnologia parada pede um diagnóstico fácil de entender.", step: "Informe o aparelho, o sintoma e quando o problema começou.", cta: "Avaliar o conceito", theme: "navy" },
  "bh-barreiro-marmitas": { title: "Uma semana mais prática começa com almoço planejado.", step: "Conte sua rotina e o tipo de refeição que deseja encontrar.", cta: "Explorar o conceito", theme: "gold" },
  "uberlandia-eletrica-residencial": { title: "Segurança elétrica começa com uma avaliação bem explicada.", step: "Descreva o ambiente e a instalação que precisa revisar.", cta: "Avaliar o conceito", theme: "navy" },
  "lolipa-arte-em-festas": { title: "A memória da festa começa no cenário que você imagina.", step: "Conte o tema, a ocasião e os detalhes que gostaria de transformar em decoração.", cta: "Planejar minha festa", theme: "pink" },
  "confeitaria-sabor-da-realeza": { title: "Seu momento especial merece um sabor à altura.", step: "Conte a data, a ocasião e o que deseja encomendar para sua celebração.", cta: "Planejar encomenda", theme: "pink" },
  "premium-envelopamentos": { title: "Seu ambiente pode ganhar outra leitura sem reforma.", step: "Conte qual móvel, geladeira ou superfície você quer transformar e qual estilo imagina.", cta: "Planejar transformação", theme: "navy" },
  "miro-tech": { title: "Seu equipamento em boas mãos começa com um diagnóstico claro.", step: "Informe qual equipamento apresentou problema e o tipo de atendimento que deseja avaliar.", cta: "Solicitar avaliação", theme: "navy" },
  "galileu-locacao-brinquedos": { title: "A diversão da festa começa escolhendo as atrações certas.", step: "Conte a data, o local e o perfil da comemoração para montar seu pedido.", cta: "Planejar diversão", theme: "navy" },
  "lj-cleaning": { title: "Seu conforto merece um cuidado completo.", step: "Informe o item, o tamanho e o tipo de higienização que deseja avaliar.", cta: "Solicitar orçamento", theme: "navy" },
  "manu-pasteis": { title: "Seu pastel da noite começa no cardápio certo.", step: "Escolha seus sabores no menu online e, se precisar, fale com a loja para tirar dúvidas.", cta: "Abrir cardápio", theme: "gold" },
  "liz-moraes-nail-designer": { title: "Seu momento de beleza começa com uma escolha feita para você.", step: "Indique o cuidado, acabamento ou molde F1 que deseja e escolha o melhor período para agendar.", cta: "Agendar meu horário", theme: "pink" },
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
