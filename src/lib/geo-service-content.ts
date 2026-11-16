import type { ServiceData } from "./services-data";

type GeoServiceEditorial = {
  needs: readonly string[];
  scope: readonly string[];
};

const GEO_SERVICE_EDITORIAL: Record<string, GeoServiceEditorial> = {
  "criacao-de-sites": {
    needs: [
      "A empresa precisa organizar sua apresentação institucional em um endereço próprio.",
      "O site atual está desatualizado, incompleto ou difícil de usar no celular.",
      "Produtos, serviços, diferenciais e formas de contato estão dispersos em vários canais.",
      "Há necessidade de uma base técnica preparada para conteúdo, analytics e evolução de SEO.",
    ],
    scope: [
      "Arquitetura das páginas e organização do conteúdo institucional.",
      "Interface responsiva para desktop e dispositivos móveis.",
      "Configuração técnica de metadados, analytics e itens de publicação previstos no escopo.",
      "Integrações e canais de contato definidos na proposta do projeto.",
    ],
  },
  "landing-pages": {
    needs: [
      "Uma campanha ou oferta precisa de uma página com objetivo único e mensagem concentrada.",
      "O tráfego pago está sendo enviado para páginas genéricas, sem contexto específico da campanha.",
      "É necessário separar oferta, prova, formulário e chamada para ação em uma jornada mensurável.",
      "A equipe precisa de uma página independente para testar uma nova oferta ou captação.",
    ],
    scope: [
      "Estrutura da oferta, hierarquia de informação e chamada para ação.",
      "Página responsiva com conteúdo e elementos definidos no briefing.",
      "Instrumentação de eventos e integrações previstas no escopo.",
      "Publicação e revisão técnica antes de iniciar a campanha.",
    ],
  },
  "loja-virtual": {
    needs: [
      "O negócio precisa apresentar produtos em catálogo próprio na internet.",
      "Pedidos, preços ou disponibilidade estão sendo administrados apenas por mensagens ou redes sociais.",
      "Há necessidade de organizar categorias, detalhes de produto e etapas de compra.",
      "O projeto exige integração com meios de pagamento, frete ou outros sistemas previstos no escopo.",
    ],
    scope: [
      "Estrutura de catálogo, categorias e páginas de produto.",
      "Configuração das etapas de compra definidas para o projeto.",
      "Integrações de pagamento, frete ou atendimento quando contratadas.",
      "Configuração técnica de publicação, medição e operação prevista no escopo.",
    ],
  },
  seo: {
    needs: [
      "Páginas importantes não estão sendo encontradas ou compreendidas adequadamente pelos buscadores.",
      "O site precisa de organização técnica para rastreamento, indexação e conteúdo.",
      "Há conteúdo relevante, mas faltam arquitetura, interligações e sinais claros de contexto.",
      "A equipe precisa medir consultas, páginas e oportunidades de busca com dados próprios.",
    ],
    scope: [
      "Diagnóstico técnico de rastreamento, indexação, metadados e arquitetura.",
      "Planejamento de conteúdo e interligações conforme os temas reais do negócio.",
      "Correções e recomendações priorizadas pelo impacto técnico e editorial.",
      "Acompanhamento por dados disponíveis em Search Console, analytics e outras fontes contratadas.",
    ],
  },
  "marketing-digital": {
    needs: [
      "Canais digitais estão sendo usados sem um plano comum de oferta, público e mensuração.",
      "A empresa precisa organizar campanhas, conteúdo e pontos de conversão em uma mesma estratégia.",
      "As decisões dependem de dados espalhados entre diferentes plataformas.",
      "É necessário definir responsabilidades, calendário e critérios de acompanhamento.",
    ],
    scope: [
      "Planejamento de canais, públicos, ofertas e ativos digitais previstos no projeto.",
      "Configuração de campanhas e conteúdo quando incluídos na contratação.",
      "Definição de eventos, fontes de dados e indicadores de acompanhamento.",
      "Rotina de revisão e ajustes conforme dados disponíveis e escopo contratado.",
    ],
  },
  "automacao-com-ia": {
    needs: [
      "Tarefas repetitivas consomem tempo e seguem regras que podem ser documentadas.",
      "Informações precisam ser copiadas manualmente entre formulários, planilhas, sistemas ou mensagens.",
      "A equipe precisa classificar, resumir ou encaminhar dados com critérios consistentes.",
      "Existe oportunidade de integrar etapas de um processo antes executadas separadamente.",
    ],
    scope: [
      "Mapeamento do processo, entradas, regras, exceções e responsáveis.",
      "Definição do fluxo automatizado e dos pontos que continuam sob revisão humana.",
      "Integrações técnicas previstas no escopo e permitidas pelos sistemas envolvidos.",
      "Testes, documentação e critérios de acompanhamento da automação implantada.",
    ],
  },
  "chatbot-whatsapp": {
    needs: [
      "O atendimento inicial recebe perguntas repetitivas que podem ser organizadas em uma triagem.",
      "Leads precisam ser encaminhados para fluxos diferentes conforme o assunto informado.",
      "A equipe quer coletar dados iniciais antes do atendimento humano.",
      "É necessário registrar contexto de atendimento sem depender de perguntas manuais repetidas.",
    ],
    scope: [
      "Desenho das perguntas, respostas, critérios de encaminhamento e pontos de saída.",
      "Integração com WhatsApp ou provedores compatíveis previstos no projeto.",
      "Registro dos dados necessários ao funil e encaminhamento para atendimento humano.",
      "Testes dos fluxos, mensagens e exceções antes da publicação.",
    ],
  },
  "gestao-redes-sociais": {
    needs: [
      "A publicação de conteúdo ocorre sem calendário ou responsabilidades claramente definidas.",
      "A marca precisa organizar temas, formatos e frequência de comunicação.",
      "Aprovações e arquivos estão dispersos entre diferentes canais.",
      "A equipe precisa acompanhar o que foi publicado e os dados disponíveis de cada plataforma.",
    ],
    scope: [
      "Planejamento editorial e definição de temas conforme o posicionamento do negócio.",
      "Organização de calendário, formatos e fluxo de aprovação quando contratados.",
      "Produção ou adaptação de peças previstas no escopo.",
      "Acompanhamento de publicações e métricas disponíveis nas plataformas utilizadas.",
    ],
  },
};

const GENERIC_EDITORIAL: GeoServiceEditorial = {
  needs: [
    "O negócio identificou uma necessidade digital que precisa ser transformada em escopo.",
    "Há informações, tarefas ou canais que precisam ser organizados antes da implementação.",
    "A equipe precisa documentar requisitos, prioridades e integrações envolvidas.",
    "É necessário definir entregáveis verificáveis antes de iniciar a execução.",
  ],
  scope: [
    "Briefing e definição do objetivo do projeto.",
    "Escopo, entregáveis e integrações documentados na proposta.",
    "Execução conforme requisitos aprovados.",
    "Revisão e publicação ou entrega conforme o tipo de serviço contratado.",
  ],
};

export function geoNeedSignals(service: ServiceData): readonly string[] {
  return (GEO_SERVICE_EDITORIAL[service.slug] ?? GENERIC_EDITORIAL).needs;
}

export function geoScopeItems(service: ServiceData): readonly string[] {
  return (GEO_SERVICE_EDITORIAL[service.slug] ?? GENERIC_EDITORIAL).scope;
}

export function geoDeliveryProcess(service: ServiceData) {
  return [
    {
      step: "Briefing",
      desc: `Entender o objetivo de ${service.name.toLowerCase()}, o contexto do negócio e as restrições do projeto.`,
    },
    {
      step: "Proposta",
      desc: "Documentar escopo, entregáveis, integrações, responsabilidades e condições antes da execução.",
    },
    {
      step: "Execução",
      desc: "Implementar somente o que foi aprovado, com validações intermediárias quando o projeto exigir.",
    },
    {
      step: "Validação",
      desc: "Revisar os entregáveis e concluir publicação, entrega ou próximos passos conforme o escopo contratado.",
    },
  ] as const;
}
