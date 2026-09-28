import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TrustStrip } from "@/components/site/TrustStrip";
import { absUrl } from "@/lib/seo";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";

export type VerticalConfig = {
  slug: string;
  name: string;
  hero: string;
  subheadline: string;
  painPoints: string[];
  services: { title: string; desc: string; to: string }[];
  keywords: string;
};

export const VERTICALS: Record<string, VerticalConfig> = {
  restaurantes: {
    slug: "restaurantes",
    name: "Restaurantes e Food Service",
    hero: "Site para restaurantes com cardápio, reservas e presença local",
    subheadline:
      "Cardápio digital, reservas, horários, localização, fotos e canais de contato em uma página rápida, fácil de atualizar e preparada para busca local.",
    painPoints: [
      "Cliente não acha seu cardápio atualizado no Google",
      "Reserva por WhatsApp some no meio das mensagens",
      "Concorrente aparece primeiro mesmo sendo pior",
      "Fotos do iFood não vendem o ticket que você quer",
    ],
    services: [
      { title: "Site Express (cardápio + reservas)", desc: "Landing com cardápio, informações do salão e botão de reserva.", to: "/servicos/site-express" },
      { title: "Google Meu Negócio", desc: "Otimização do GMB para aparecer no mapa local.", to: "/servicos/google-meu-negocio" },
      { title: "Tráfego pago local", desc: "Campanhas geolocalizadas para captar demanda na região atendida.", to: "/servicos/trafego-pago-local" },
    ],
    keywords: "site para restaurante, cardápio digital, reserva online restaurante",
  },
  advocacia: {
    slug: "advocacia",
    name: "Advocacia e Escritórios Jurídicos",
    hero: "Site institucional para escritórios de advocacia",
    subheadline:
      "Página institucional com áreas de atuação, equipe, conteúdo informativo e canais de contato, estruturada para comunicação profissional e presença orgânica.",
    painPoints: [
      "Site genérico que parece de 2010 e afasta cliente",
      "Não aparece no Google quando buscam sua especialidade",
      "Formulário de contato chega sem informação útil",
      "Concorrente com escritório menor capta mais",
    ],
    services: [
      { title: "Site Pro (10+ páginas)", desc: "Site institucional com áreas de atuação, equipe, conteúdo e SEO técnico.", to: "/servicos/site-pro" },
      { title: "Presença digital", desc: "Google, redes sociais e reputação cuidadas em pacote.", to: "/servicos/presenca-digital" },
      { title: "Consultoria estratégica", desc: "Planejamento de presença digital com revisão das regras aplicáveis ao escritório.", to: "/servicos/consultoria" },
    ],
    keywords: "site para advogado, marketing jurídico, site escritório de advocacia",
  },
  imobiliarias: {
    slug: "imobiliarias",
    name: "Imobiliárias e Corretores",
    hero: "Site para imobiliárias com catálogo, filtros e captação de contatos",
    subheadline:
      "Catálogo de imóveis, filtros por bairro/valor/tipo, integração com CRM e WhatsApp. Captura lead enquanto o cliente ainda está navegando.",
    painPoints: [
      "Catálogo desatualizado afasta o cliente",
      "Lead que veio do anúncio se perde antes de virar visita",
      "Não aparece nas buscas por bairro específico",
      "Concorrente grande domina o Google da sua região",
    ],
    services: [
      { title: "Site Pro (10+ páginas)", desc: "Site com catálogo, busca e CRM integrado.", to: "/servicos/site-pro" },
      { title: "Tráfego pago local", desc: "Anúncios por bairro com captura de WhatsApp.", to: "/servicos/trafego-pago-local" },
      { title: "Google Meu Negócio", desc: "Mapa, fotos da loja e reviews ativos.", to: "/servicos/google-meu-negocio" },
    ],
    keywords: "site para imobiliária, site corretor de imóveis, catálogo de imóveis online",
  },
  clinicas: {
    slug: "clinicas",
    name: "Clínicas e Consultórios",
    hero: "Site para clínicas com especialidades, equipe e agendamento",
    subheadline:
      "Agendamento, especialidades, equipe, convênios, localização e conteúdo institucional com cuidado especial para privacidade e dados sensíveis.",
    painPoints: [
      "Paciente liga, secretária ocupada, ele desiste",
      "Não aparece no Google ao buscar 'especialidade + cidade'",
      "Site não passa confiança nem mostra a equipe",
      "Convênios listados em PDF que ninguém lê",
    ],
    services: [
      { title: "Site Pro (10+ páginas)", desc: "Especialidades, equipe, convênios e blog otimizado.", to: "/servicos/site-pro" },
      { title: "Google Meu Negócio", desc: "Reviews, fotos e horários atualizados no mapa.", to: "/servicos/google-meu-negocio" },
      { title: "Presença digital", desc: "Pacote completo de presença online da clínica.", to: "/servicos/presenca-digital" },
    ],
    keywords: "site para clínica, site para consultório médico, agendamento online clínica",
  },
  oficinas: {
    slug: "oficinas",
    name: "Oficinas Mecânicas e Auto Center",
    hero: "Site para oficinas com serviços, localização e contato rápido",
    subheadline:
      "Serviços, tipos de veículo atendidos, localização, horários e contato direto em uma página preparada para buscas locais e acesso pelo celular.",
    painPoints: [
      "Cliente em emergência acha concorrente primeiro",
      "Não mostra os serviços que você cobra mais caro",
      "Sem reviews no Google é desconfiança imediata",
      "WhatsApp escondido, cliente desiste",
    ],
    services: [
      { title: "Site Express", desc: "Landing com serviços, fotos e WhatsApp em destaque.", to: "/servicos/site-express" },
      { title: "Google Meu Negócio", desc: "Mapa, horário, reviews e fotos da oficina.", to: "/servicos/google-meu-negocio" },
      { title: "Tráfego pago local", desc: "Anúncios para 'oficina perto de mim' no seu raio.", to: "/servicos/trafego-pago-local" },
    ],
    keywords: "site para oficina mecânica, site auto center, oficina perto de mim",
  },
  lojas: {
    slug: "lojas",
    name: "Lojas e Comércio Físico",
    hero: "Site para lojas físicas com vitrine, localização e contato",
    subheadline:
      "Vitrine digital de produtos, localização, horários, WhatsApp e integração com redes sociais para organizar a presença da loja na web.",
    painPoints: [
      "Cliente passa na frente mas não conhece a loja",
      "Não aparece no Google Maps quando deveria",
      "Instagram tem público mas não converte em visita",
      "Sem site, parece pequeno demais para confiar",
    ],
    services: [
      { title: "Site Express", desc: "Vitrine, contato e localização em 24h.", to: "/servicos/site-express" },
      { title: "Google Meu Negócio", desc: "Apareça no mapa quando alguém buscar produto.", to: "/servicos/google-meu-negocio" },
      { title: "Gestão de redes sociais", desc: "Conteúdo que vira visita na loja física.", to: "/servicos/gestao-redes-sociais" },
    ],
    keywords: "site para loja, site comércio local, presença digital lojista",
  },
  comercios: {
    slug: "comercios",
    name: "Comércios e Pequenos Negócios",
    hero: "Site para comércio local com presença no Google e canais de contato",
    subheadline:
      "Presença profissional para padarias, mercados, pet shops, papelarias e outros comércios: informações consistentes, localização, produtos e contato.",
    painPoints: [
      "Sem site, cliente acha que você fechou",
      "Concorrente com loja igual aparece sempre primeiro",
      "WhatsApp lota e você perde pedido por desorganização",
      "Não consegue mostrar promoções que faz",
    ],
    services: [
      { title: "Site Express", desc: "Site enxuto, rápido e pronto para vender.", to: "/servicos/site-express" },
      { title: "Presença digital", desc: "Google, redes sociais e site em um pacote.", to: "/servicos/presenca-digital" },
      { title: "Tráfego pago local", desc: "Anúncios direcionados ao seu bairro.", to: "/servicos/trafego-pago-local" },
    ],
    keywords: "site para comércio, site pequeno negócio, presença digital comércio local",
  },
  beleza: {
    slug: "beleza",
    name: "Beleza e Estética",
    hero: "Site para profissionais de beleza com serviços, portfólio e agenda",
    subheadline: "Apresente serviços, portfólio, horários, localização e formas de agendamento em uma página rápida e preparada para busca local.",
    painPoints: [
      "Cliente não encontra seus serviços no Google",
      "Instagram não explica preços, localização e agenda",
      "Mensagens chegam sem contexto e dificultam o atendimento",
      "Concorrentes parecem mais profissionais online",
    ],
    services: [
      { title: "Site Express", desc: "Landing com serviços, resultados e agendamento.", to: "/servicos/site-express" },
      { title: "Google Meu Negócio", desc: "Mais descobertas no mapa e nas buscas locais.", to: "/servicos/google-meu-negocio" },
      { title: "Presença digital", desc: "Site, redes e conteúdo em uma experiência coerente.", to: "/servicos/presenca-digital" },
    ],
    keywords: "site para salão de beleza, site para esteticista, extensão de cílios Curitiba, agenda online beleza",
  },
  "prestadores-de-servicos": {
    slug: "prestadores-de-servicos",
    name: "Prestadores de Serviços",
    hero: "Site para prestadores de serviço com portfólio e orçamento",
    subheadline:
      "Eletricistas, encanadores, dedetizadoras, jardineiros, marceneiros e outros profissionais podem organizar serviços, portfólio, área atendida e contato em uma página própria.",
    painPoints: [
      "Cliente urgente busca no Google e acha outro",
      "Sem portfólio visual, perde para concorrente com Insta forte",
      "Orçamento por WhatsApp some no fim do dia",
      "Não cobra o que vale porque parece amador",
    ],
    services: [
      { title: "Site Express", desc: "Landing com serviços, portfólio e WhatsApp.", to: "/servicos/site-express" },
      { title: "Tráfego pago local", desc: "Anúncios geo para sua área de atendimento.", to: "/servicos/trafego-pago-local" },
      { title: "Google Meu Negócio", desc: "Apareça no mapa local com fotos e reviews.", to: "/servicos/google-meu-negocio" },
    ],
    keywords: "site para prestador de serviço, site eletricista encanador, site para autônomo",
  },
};


type VerticalGuide = {
  intro: string;
  focus: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
};

const VERTICAL_GUIDES: Record<string, VerticalGuide> = {
  restaurantes: {
    intro: "Para restaurantes, o site precisa reduzir fricção entre a busca e a decisão: cardápio legível no celular, horários corretos, endereço, formas de reserva e contato. A página também deve facilitar atualizações sem depender de peças estáticas espalhadas por redes sociais.",
    focus: [
      { title: "Cardápio e informação operacional", desc: "Organize itens, faixas de preço, horários, endereço, reservas e canais de pedido em uma estrutura que continue útil fora das redes sociais." },
      { title: "Busca local", desc: "Conecte a página ao Google Business Profile e use conteúdo coerente com a região realmente atendida, sem criar páginas locais artificiais." },
      { title: "Conversão no celular", desc: "Priorize leitura rápida, botão de reserva ou contato e carregamento leve, porque grande parte das pesquisas acontece durante a decisão de onde comer." },
    ],
    faq: [
      { q: "Preciso publicar o cardápio inteiro no site?", a: "Não necessariamente. O importante é manter uma versão atualizável com categorias, principais itens, preços quando fizer sentido e um caminho claro para o cardápio completo ou pedido." },
      { q: "O site substitui o iFood ou o Instagram?", a: "Não. Ele funciona como base própria da marca e pode conectar delivery, redes sociais, reservas e Google sem depender de um único canal." },
      { q: "Vale criar páginas para cada bairro?", a: "Só quando existe atendimento ou relevância real naquele local e conteúdo específico suficiente para justificar uma página própria." },
    ],
  },
  advocacia: {
    intro: "Para escritórios de advocacia, o papel do site é apresentar áreas de atuação, equipe, experiência e formas de contato com clareza. O conteúdo precisa ser informativo e só deve publicar alegações, resultados ou comparações que possam ser sustentados e que respeitem as regras profissionais aplicáveis.",
    focus: [
      { title: "Áreas de atuação bem explicadas", desc: "Separe temas jurídicos por intenção de busca e explique quando cada serviço costuma ser necessário, evitando linguagem sensacionalista." },
      { title: "Autoridade editorial", desc: "Artigos, perguntas frequentes e páginas de serviço podem demonstrar conhecimento sem prometer resultado jurídico ou criar urgência artificial." },
      { title: "Contato com contexto", desc: "Formulários e funis curtos ajudam o escritório a receber o assunto inicial da consulta antes do atendimento humano." },
    ],
    faq: [
      { q: "Um escritório precisa de uma página para cada área do Direito?", a: "Quando a área é realmente atendida e existe conteúdo próprio, sim. Isso melhora organização e permite responder intenções de busca diferentes sem duplicar texto." },
      { q: "O site pode prometer resultado de processo?", a: "Não é uma prática responsável. O conteúdo deve informar serviços e experiência sem garantir desfechos que dependem de fatos e decisões externas." },
      { q: "Blog jurídico ajuda no SEO?", a: "Ajuda quando publica conteúdo original, atualizado e ligado às áreas realmente atendidas pelo escritório." },
    ],
  },
  imobiliarias: {
    intro: "Em imobiliárias, o site precisa conectar catálogo e intenção de busca. Imóveis mudam rapidamente, por isso filtros, disponibilidade, bairro, faixa de valor e canal de atendimento devem ser fáceis de atualizar e não depender de páginas abandonadas.",
    focus: [
      { title: "Catálogo estruturado", desc: "Cada imóvel deve ter dados consistentes, imagens próprias, localização útil, características e status de disponibilidade." },
      { title: "Busca por intenção", desc: "Filtros por tipo, bairro e faixa de preço ajudam o usuário e criam uma arquitetura mais compreensível para mecanismos de busca." },
      { title: "Captação sem perder contexto", desc: "O contato deve carregar qual imóvel ou filtro originou a conversa, reduzindo retrabalho no atendimento." },
    ],
    faq: [
      { q: "É melhor integrar o CRM ou cadastrar imóveis manualmente?", a: "Quando o CRM oferece integração confiável, sincronizar reduz duplicidade e imóveis desatualizados. Caso contrário, um painel próprio pode ser mais seguro." },
      { q: "Páginas por bairro ajudam?", a: "Sim, quando existe estoque real e conteúdo útil para aquele bairro. Páginas vazias ou clonadas devem ficar fora do índice." },
      { q: "Preciso mostrar o endereço exato do imóvel?", a: "Depende da estratégia comercial e de privacidade. É possível trabalhar com bairro ou região e liberar detalhes no atendimento." },
    ],
  },
  clinicas: {
    intro: "Para clínicas e consultórios, a página precisa explicar especialidades, equipe, localização, formas de agendamento e orientações iniciais sem transformar conteúdo de saúde em promessa de resultado. Privacidade e tratamento responsável de dados são requisitos do projeto.",
    focus: [
      { title: "Especialidades e equipe", desc: "Estruture páginas claras por especialidade e profissional quando houver informação real suficiente para cada uma." },
      { title: "Agendamento e privacidade", desc: "Colete apenas os dados necessários para o primeiro contato e evite pedir informações clínicas sensíveis em formulários comuns." },
      { title: "Conteúdo de orientação", desc: "Perguntas frequentes e artigos podem ajudar o paciente a entender serviços, preparo e fluxo de atendimento sem substituir avaliação profissional." },
    ],
    faq: [
      { q: "O site precisa ter agendamento online?", a: "Não é obrigatório, mas deve haver um caminho claro para solicitar horário. A integração depende da agenda e do processo real da clínica." },
      { q: "Posso publicar antes e depois de pacientes?", a: "Esse tipo de conteúdo exige avaliação das regras profissionais e de consentimento aplicáveis. O site não deve assumir autorização automaticamente." },
      { q: "Vale criar página para cada especialidade?", a: "Sim, quando a clínica realmente oferece a especialidade e consegue manter conteúdo próprio, equipe e informações atualizadas." },
    ],
  },
  oficinas: {
    intro: "Para oficinas e auto centers, o site precisa responder rapidamente o que é atendido, onde fica a oficina, em quais horários funciona e como pedir avaliação. A intenção de busca costuma ser prática e local, então informação operacional vale mais que texto promocional genérico.",
    focus: [
      { title: "Serviços e veículos atendidos", desc: "Separe manutenção preventiva, diagnóstico e reparos conforme o que a oficina realmente executa." },
      { title: "Localização e horários", desc: "Mantenha endereço, telefone, rotas e horários consistentes entre site e perfil da empresa no Google." },
      { title: "Prova visual real", desc: "Fotos próprias da oficina, equipamentos e serviços autorizados ajudam mais do que imagens genéricas de banco." },
    ],
    faq: [
      { q: "Preciso listar todos os serviços da oficina?", a: "Liste os serviços que realmente são executados e agrupe variações semelhantes. Isso facilita leitura e evita páginas quase vazias." },
      { q: "O site ajuda em buscas perto de mim?", a: "Uma presença local consistente ajuda o Google a entender o negócio, mas posição depende também de proximidade, relevância, reputação e concorrência." },
      { q: "Vale oferecer orçamento pelo site?", a: "Sim, desde que o formulário deixe claro quando o valor depende de diagnóstico presencial ou de informações adicionais." },
    ],
  },
  lojas: {
    intro: "Para lojas físicas, o site funciona como uma vitrine própria: mostra linhas de produto, endereço, horários, canais de atendimento e campanhas atuais. Ele complementa redes sociais e marketplaces sem depender do alcance de terceiros.",
    focus: [
      { title: "Vitrine organizada", desc: "Use categorias e destaques reais para mostrar o que a loja vende, evitando catálogo abandonado ou produtos sem disponibilidade." },
      { title: "Informação local consistente", desc: "Endereço, horários, telefone e links para rotas precisam coincidir com o perfil da empresa no Google." },
      { title: "Integração com atendimento", desc: "O usuário deve conseguir sair do produto ou categoria para um canal de consulta sem perder o contexto." },
    ],
    faq: [
      { q: "Preciso ter e-commerce para ter site?", a: "Não. Uma vitrine institucional com catálogo, localização e contato já pode organizar a presença digital da loja." },
      { q: "Posso integrar produtos do Instagram?", a: "Sim, desde que a integração use conteúdo oficial e mantenha links ou mídia de forma confiável." },
      { q: "Quando vale criar loja virtual completa?", a: "Quando existe processo para preço, estoque, pagamento, entrega e atendimento pós-venda. Sem isso, catálogo e consulta podem ser mais adequados." },
    ],
  },
  comercios: {
    intro: "Pequenos comércios precisam de uma fonte oficial que concentre nome, produtos ou serviços, localização, horários e contato. Isso reduz dependência de postagens antigas e ajuda clientes a confirmar rapidamente se o negócio atende ao que procuram.",
    focus: [
      { title: "Informação básica impecável", desc: "Nome, endereço, telefone, horários e formas de atendimento precisam estar atualizados em todos os canais." },
      { title: "Produtos e diferenciais reais", desc: "Explique categorias, marcas ou serviços que o comércio realmente oferece, sem exagerar estoque ou disponibilidade." },
      { title: "Presença local conectada", desc: "Site, Google Business Profile e redes sociais devem apontar para a mesma identidade e os mesmos dados essenciais." },
    ],
    faq: [
      { q: "Um comércio pequeno precisa mesmo de site?", a: "O site é útil quando centraliza informação que hoje está espalhada e cria uma página própria para o Google e para clientes consultarem." },
      { q: "É melhor site ou rede social?", a: "Os canais têm funções diferentes. Redes ajudam na distribuição; o site funciona como base própria e pesquisável." },
      { q: "Posso começar com uma página simples?", a: "Sim. O importante é publicar informação suficiente, correta e fácil de manter antes de adicionar recursos mais complexos." },
    ],
  },
  beleza: {
    intro: "Profissionais de beleza e estética precisam transformar portfólio visual em informação que o cliente consiga usar: serviços, localização, agenda, duração aproximada quando aplicável, cuidados e forma de contato. Fotos próprias e autorização de uso são especialmente importantes.",
    focus: [
      { title: "Serviços claros", desc: "Organize técnicas e procedimentos pelo nome usado pelos clientes e explique o que está incluído sem prometer resultados individuais." },
      { title: "Portfólio autorizado", desc: "Use imagens reais do trabalho apenas quando houver autorização e contexto suficiente para não induzir expectativa irreal." },
      { title: "Agendamento com contexto", desc: "Leve serviço, profissional e origem da página para a conversa de atendimento sempre que o processo permitir." },
    ],
    faq: [
      { q: "Instagram substitui um site de beleza?", a: "Não completamente. O site organiza serviços, localização e contato em uma estrutura própria; o Instagram continua importante para conteúdo e relacionamento." },
      { q: "Preciso colocar preços?", a: "Quando os valores são estáveis, isso ajuda a qualificar contatos. Serviços variáveis podem usar faixa ou explicar os fatores do orçamento." },
      { q: "Posso usar fotos de clientes?", a: "Somente com autorização adequada. O projeto deve privilegiar mídia própria e consentida." },
    ],
  },
  "prestadores-de-servicos": {
    intro: "Para prestadores, o site precisa explicar rapidamente o que é feito, em que região o serviço realmente é atendido, como funciona o orçamento e quais trabalhos podem ser mostrados como prova. A página deve diminuir perguntas repetitivas antes do contato.",
    focus: [
      { title: "Escopo do serviço", desc: "Descreva tarefas atendidas, limites, materiais ou condições que alteram o orçamento e o que não faz parte do serviço." },
      { title: "Área atendida real", desc: "Use cidades e bairros apenas quando houver atendimento verdadeiro. Evite páginas locais criadas só para ampliar palavras-chave." },
      { title: "Portfólio e contato", desc: "Fotos próprias, exemplos de trabalho e um funil curto ajudam o cliente a enviar contexto suficiente para uma primeira resposta." },
    ],
    faq: [
      { q: "Vale criar uma página para cada serviço?", a: "Sim quando cada serviço tem escopo e conteúdo próprios. Variações muito parecidas podem ser agrupadas para evitar páginas repetidas." },
      { q: "Como trabalhar SEO local sem inventar endereço?", a: "Informe área de atendimento real e use provas de atuação. Não é necessário fingir uma sede física em cada cidade." },
      { q: "O site pode gerar orçamento automático?", a: "Alguns serviços permitem estimativas; outros exigem fotos, medidas ou visita técnica. O site deve deixar essa diferença explícita." },
    ],
  },
};

export const Route = createFileRoute("/sites/$vertical")({
  loader: ({ params }) => {
    const v = VERTICALS[params.vertical];
    if (!v) throw notFound();
    return { vertical: v };
  },
  head: ({ loaderData }) => {
    const v = loaderData?.vertical;
    if (!v) return { meta: [{ title: "Site por segmento · 0WEB" }] };
    const url = absUrl(`/sites/${v.slug}`);
    const title = `${v.hero} · 0WEB`;
    const desc = v.subheadline;
    const guide = VERTICAL_GUIDES[v.slug];
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: v.keywords },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: absUrl("/") },
              { "@type": "ListItem", position: 2, name: "Sites por segmento", item: absUrl("/sites") },
              { "@type": "ListItem", position: 3, name: v.name, item: url },
            ],
          }),
        },
        ...(guide
          ? [{
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: guide.faq.map((item) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: { "@type": "Answer", text: item.a },
                })),
              }),
            }]
          : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-bold">Segmento não encontrado</h1>
        <p className="text-muted-foreground mt-2">Veja todos os segmentos disponíveis.</p>
        <Link to="/sites" className="mt-4 inline-block text-primary underline">
          Ver todos os segmentos
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-bold">Erro ao carregar segmento</h1>
        <button onClick={reset} className="mt-4 text-primary underline">Tentar novamente</button>
      </div>
    </div>
  ),
  component: VerticalHub,
});

function VerticalHub() {
  const { vertical: v } = Route.useLoaderData();
  const guide = VERTICAL_GUIDES[v.slug];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="pt-page pb-12">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Sites por segmento · {v.name}
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold leading-tight">{v.hero}</h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-3xl">{v.subheadline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <FunnelCTAButton
                intent={{ purpose: "diagnosis", source: `sites_${v.slug}_hero_diag`, pagePath: `/sites/${v.slug}`, placement: "hero", serviceSlug: "criacao-de-sites" }}
                label="Solicitar diagnóstico grátis"
                location={`sites_${v.slug}_hero_diag`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3 shadow-glow-primary uppercase text-sm tracking-wide"
              />
              <FunnelCTAButton
                intent={{ purpose: "proposal", source: `sites_${v.slug}_hero`, pagePath: `/sites/${v.slug}`, placement: "hero", serviceSlug: "criacao-de-sites" }}
                label="Falar com especialista"
                location={`sites_${v.slug}_hero`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background hover:border-primary font-semibold px-6 py-3 text-sm uppercase tracking-wide"
              />
            </div>
          </div>
        </section>

        <TrustStrip variant="compact" />

        {guide ? (
          <section className="py-16">
            <div className="mx-auto max-w-5xl px-5 lg:px-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-bold">O que um site precisa resolver para {v.name}</h2>
                <p className="mt-4 text-muted-foreground leading-7">{guide.intro}</p>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {guide.focus.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold">O que costuma travar nesse segmento</h2>
            <ul className="mt-6 grid sm:grid-cols-2 gap-4">
              {v.painPoints.map((p: string) => (
                <li key={p} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Serviços recomendados para {v.name}</h2>
            <div className="mt-8 grid md:grid-cols-3 gap-5">
              {v.services.map((s: { title: string; desc: string; to: string }) => (
                <Link
                  key={s.to}
                  to={s.to as any}
                  className="group rounded-2xl border border-border bg-card p-6 hover:border-primary hover:shadow-elegant transition"
                >
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Ver serviço <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {guide ? (
          <section className="py-16">
            <div className="mx-auto max-w-5xl px-5 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Perguntas frequentes sobre site para {v.name}</h2>
              <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
                {guide.faq.map((item) => (
                  <details key={item.q} className="p-5">
                    <summary className="cursor-pointer font-semibold">{item.q}</summary>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-5 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Quer organizar a presença digital do seu segmento?
            </h2>
            <p className="mt-4 text-muted-foreground">
              O diagnóstico inicial identifica estrutura, conteúdo, descoberta no Google e caminho de contato sem prometer posição ou prazo de ranking.
            </p>
            <FunnelCTAButton
              intent={{ purpose: "diagnosis", source: `sites_${v.slug}_footer`, pagePath: `/sites/${v.slug}`, placement: "footer", serviceSlug: "criacao-de-sites" }}
              label="Solicitar diagnóstico grátis"
              location={`sites_${v.slug}_footer`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-7 py-3.5 shadow-glow-primary uppercase text-sm tracking-wide"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export const VERTICAL_SLUGS = Object.keys(VERTICALS);
export const VERTICAL_LIST = Object.values(VERTICALS).map((v) => ({
  slug: v.slug,
  name: v.name,
  hero: v.hero,
  subheadline: v.subheadline,
}));
