// GERADO por scripts/sync-portfolio-quiz-configs.mjs — não edite à mão.
// Registro central dos funis por cliente: garante que o CTA da página e o
// botão flutuante da casca padrão abram exatamente o mesmo funil.
import type { PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";

export const PORTFOLIO_QUIZ_CONFIGS: Record<string, PortfolioQuizConfig> = {
  "acai-total-araucaria": {
    "stepTitles": {
      "service": "Qual pedido você deseja?",
      "experience": "Conte sua preferência",
      "period": "Onde será a entrega?",
      "timing": "Quando deseja receber?",
      "note": "Observações"
    },
    "services": [
      "Copão de açaí",
      "Litrão de açaí",
      "Açaí com frutas",
      "Açaí com cremes e complementos"
    ],
    "experienceOptions": [
      "Quero experimentar",
      "Pedido para família",
      "Pedido para compartilhar",
      "Ainda estou escolhendo"
    ],
    "periodOptions": [
      "Araucária",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Quero pedir agora",
      "Hoje mais tarde",
      "Estou consultando"
    ]
  },
  "ag-electrical-services": {
    "services": [
      "Elétrica geral",
      "Infraestrutura para redes",
      "Cabeamento estruturado UTP",
      "Sistema CFTV",
      "Implantação de redes",
      "Montagem e organização de rack"
    ],
    "experienceOptions": [
      "Residencial",
      "Comercial",
      "Predial / condomínio",
      "Industrial"
    ],
    "periodOptions": [
      "Curitiba",
      "Região Metropolitana",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Preciso avaliar com urgência",
      "Nos próximos dias",
      "Estou planejando"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "Qual solução você precisa?",
      "experience": "Em qual tipo de ambiente?",
      "period": "Onde será o serviço?",
      "timing": "Quando você precisa?",
      "note": "Conte detalhes do projeto"
    },
    "notePlaceholder": "Ex.: quantidade de pontos, tamanho do rack, câmeras ou tipo de instalação."
  },
  "aguia-sul-sinalizacao": {
    "stepTitles": {
      "service": "Qual sinalização você precisa?",
      "experience": "Conte sobre o espaço",
      "period": "Onde será o serviço?",
      "timing": "Quando deseja realizar?",
      "note": "Mais detalhes"
    },
    "services": [
      "Pintura de estacionamento",
      "Demarcação de vagas PCD e idosos",
      "Faixas e setas de direcionamento",
      "Áreas de carga e descarga",
      "Pintura de paredes",
      "Galpões e estruturas industriais"
    ],
    "experienceOptions": [
      "Condomínio",
      "Comércio ou estacionamento",
      "Indústria ou galpão",
      "Empresa ou imóvel"
    ],
    "periodOptions": [
      "Curitiba e região",
      "Região metropolitana",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Preciso de orçamento em breve",
      "Estou planejando",
      "Quero uma visita técnica"
    ]
  },
  "artesanatos-darleia-oliveira": {
    "services": [
      "Coador de café 100% algodão",
      "Escolher uma estampa",
      "Presente artesanal",
      "Quero conhecer outros artesanatos"
    ],
    "experienceOptions": [
      "Para minha casa",
      "Para presentear",
      "Quero encomendar",
      "Ainda estou conhecendo"
    ],
    "periodOptions": [
      "Quero combinar a entrega",
      "Vou retirar",
      "Preciso consultar",
      "Ainda não sei"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nesta semana",
      "Estou pesquisando",
      "Quero combinar"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que você gostaria de conhecer?",
      "experience": "Como pretende usar?",
      "period": "Como prefere receber?",
      "timing": "Quando você precisa?",
      "note": "Conte os detalhes"
    },
    "notePlaceholder": "Ex.: cor, estampa, quantidade ou ocasião do presente."
  },
  "assistencia-microondas-santos": {
    "services": [
      "Conserto de micro-ondas",
      "Restauração contra ferrugem",
      "Comprar micro-ondas revisado",
      "Conserto a domicílio",
      "Quero orientação para escolher"
    ],
    "experienceOptions": [
      "Meu aparelho parou de funcionar",
      "Meu micro-ondas está enferrujado",
      "Quero comprar um modelo revisado",
      "Preciso avaliar a melhor opção"
    ],
    "periodOptions": [
      "Em casa",
      "Na assistência",
      "Quero combinar a entrega",
      "Ainda preciso de orientação"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nesta semana",
      "Estou pesquisando",
      "Quero consultar disponibilidade"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que você precisa resolver?",
      "experience": "Como está o seu micro-ondas?",
      "period": "Onde será o atendimento?",
      "timing": "Quando você precisa?",
      "note": "Conte os detalhes"
    },
    "notePlaceholder": "Ex.: marca, modelo, defeito percebido ou se procura um aparelho revisado."
  },
  "confeitaria-chyrley": {
    "services": [
      "Bolo personalizado",
      "Kit festa",
      "Salgados",
      "Copo da Felicidade",
      "Quero montar uma festa"
    ],
    "experienceOptions": [
      "Aniversário",
      "Festa em casa",
      "Presente",
      "Evento ou confraternização"
    ],
    "periodOptions": [
      "Retirar no Rio Bonito",
      "Enviar por Uber",
      "Ainda preciso combinar"
    ],
    "timingOptions": [
      "Para esta semana",
      "Para a próxima semana",
      "Estou planejando"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que você quer encomendar?",
      "experience": "Qual é a ocasião?",
      "period": "Como prefere receber?",
      "timing": "Para quando precisa?",
      "note": "Conte os detalhes da sua festa"
    },
    "notePlaceholder": "Ex.: bolo para 20 pessoas, tema Jurassic Park, salgados assados e endereço para Uber."
  },
  "denise-gomes-psicologa": {
    "services": [
      "Avaliação psicológica",
      "Ansiedade",
      "Burnout e esgotamento",
      "Relacionamentos",
      "Quero conversar sobre outra questão"
    ],
    "experienceOptions": [
      "É meu primeiro contato com psicologia",
      "Já fiz acompanhamento antes",
      "Estou buscando uma avaliação",
      "Ainda quero entender como funciona"
    ],
    "periodOptions": [
      "Manhã",
      "Tarde",
      "Noite",
      "Tenho flexibilidade"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nesta semana",
      "Na próxima semana",
      "Estou me organizando"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que motivou sua busca neste momento?",
      "experience": "Como você chega para esta conversa?",
      "period": "Qual período facilita seu atendimento?",
      "timing": "Quando gostaria de começar?",
      "note": "Se desejar, conte um pouco mais"
    },
    "stepSubtitles": {
      "service": "Escolha a opção que mais se aproxima da sua necessidade.",
      "experience": "Essa informação ajuda a organizar o primeiro contato.",
      "period": "A disponibilidade é confirmada diretamente no atendimento.",
      "timing": "Sem compromisso: este passo serve para iniciar a conversa.",
      "note": "Compartilhe somente o que se sentir confortável em registrar."
    },
    "notePlaceholder": "Ex.: o que tem sido mais difícil ou qual dúvida gostaria de esclarecer."
  },
  "diego-montador-moveis": {
    "stepTitles": {
      "service": "Qual serviço você precisa?",
      "experience": "Conte um pouco do projeto",
      "period": "Onde será o atendimento?",
      "timing": "Quando deseja realizar?",
      "note": "Mais detalhes"
    },
    "services": [
      "Montagem de móveis",
      "Desmontagem e montagem",
      "Conserto ou adaptação",
      "Troca de corrediças e regulagem",
      "Instalação de TV, persianas ou varões",
      "Tomadas, chuveiro ou torneira"
    ],
    "experienceOptions": [
      "Guarda-roupa, cama ou mesa",
      "Cozinha ou escritório",
      "Móvel novo ou seminovo",
      "Pequenos reparos"
    ],
    "periodOptions": [
      "Sítio Cercado",
      "Curitiba e região",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Preciso de atendimento em breve",
      "Estou planejando",
      "Quero uma avaliação primeiro"
    ]
  },
  "ecommerce-on": {
    "services": [
      "SEO e posicionamento",
      "Loja virtual ou site institucional",
      "Gestão de redes sociais",
      "Tráfego pago",
      "Conteúdo, vídeos e reels",
      "Estratégia e automação com IA"
    ],
    "experienceOptions": [
      "Já tenho um negócio online",
      "Estou começando agora",
      "Quero escalar vendas",
      "Preciso organizar a comunicação"
    ],
    "periodOptions": [
      "Curitiba - PR",
      "Joinville - SC",
      "Outra cidade",
      "Vou confirmar a região"
    ],
    "timingOptions": [
      "Quero começar em breve",
      "Estou planejando",
      "Quero uma análise primeiro"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "Qual frente você quer acelerar?",
      "experience": "Em que momento está seu negócio?",
      "period": "Onde sua empresa atua?",
      "timing": "Quando quer começar?",
      "note": "Conte o contexto do projeto"
    },
    "notePlaceholder": "Ex.: site atual, produto, público, meta de vendas e canais que já usa."
  },
  "eisenfer-tubos-acos": {
    "stepTitles": {
      "service": "O que você procura?",
      "experience": "Conte sobre o projeto",
      "period": "Onde será a entrega?",
      "timing": "Quando precisa?",
      "note": "Mais detalhes"
    },
    "services": [
      "Tubos quadrados ou retangulares",
      "Tubos redondos ou especiais",
      "Perfis U simples ou enrijecidos",
      "Chapas lisas ou frisadas",
      "Telha TP40 simples",
      "Telha TP40 sanduíche ou semi-sanduíche"
    ],
    "experienceOptions": [
      "Obra residencial",
      "Estrutura comercial",
      "Projeto industrial",
      "Comunicação visual"
    ],
    "periodOptions": [
      "São José dos Pinhais",
      "Curitiba e região",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Preciso de cotação em breve",
      "Estou planejando",
      "Quero consultar disponibilidade"
    ]
  },
  "eletro-solucoes-eficazes": {
    "stepTitles": {
      "service": "Qual solução você precisa?",
      "experience": "Conte sobre o projeto",
      "period": "Onde será o atendimento?",
      "timing": "Quando deseja realizar?",
      "note": "Mais detalhes"
    },
    "services": [
      "Instalação elétrica",
      "Instalação de iluminação",
      "Instalação padrão",
      "Manutenção elétrica",
      "Automação predial ou residencial",
      "Automação industrial",
      "Consultoria e projetos"
    ],
    "experienceOptions": [
      "Residência",
      "Comércio ou condomínio",
      "Empresa ou indústria",
      "Quero modernizar meu espaço"
    ],
    "periodOptions": [
      "Pinhais",
      "Curitiba e região",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Preciso de suporte em breve",
      "Estou planejando",
      "Quero uma visita técnica"
    ]
  },
  "eletrovale-eletromecanica": {
    "stepTitles": {
      "service": "Qual equipamento precisa de atenção?",
      "experience": "Conte sobre o problema",
      "period": "Onde está o equipamento?",
      "timing": "Quando deseja realizar?",
      "note": "Mais detalhes"
    },
    "services": [
      "Rebobinamento de motor",
      "Manutenção de bomba",
      "Motoredutor ou motofreio",
      "Diagnóstico eletromecânico",
      "Outro equipamento"
    ],
    "experienceOptions": [
      "Parou de funcionar",
      "Está aquecendo ou fazendo ruído",
      "Precisa de revisão preventiva",
      "Quero melhorar o desempenho"
    ],
    "periodOptions": [
      "Curitiba e região",
      "Paraná",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Preciso de atendimento em breve",
      "Estou planejando",
      "Quero uma avaliação técnica"
    ]
  },
  "espaco-cih-luh": {
    "services": [
      "Alongamento em gel",
      "Reconstrução de unhas",
      "Pedicure tradicional",
      "Pedicure em gel",
      "Cuidados podológicos",
      "Combo mãos e pés"
    ],
    "experienceOptions": [
      "Primeiro alongamento",
      "Quero fazer manutenção",
      "Estou buscando reconstrução",
      "Quero combinar cuidados"
    ],
    "periodOptions": [
      "Manaus e região",
      "Vou confirmar a cidade",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Quero agendar em breve",
      "Estou planejando",
      "Quero consultar horários"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "Qual cuidado você procura?",
      "experience": "Como podemos ajudar?",
      "period": "Onde será o atendimento?",
      "timing": "Quando prefere?",
      "note": "Conte sua preferência"
    },
    "notePlaceholder": "Ex.: formato, comprimento, cor, sensibilidade ou horário ideal."
  },
  "fernanda-amaral-drywall": {
    "proposalKind": "service",
    "services": [
      "Instalação de drywall",
      "Pinturas",
      "Reformas em geral",
      "Móveis e madeira",
      "Corte de grama",
      "Pequenos fretes"
    ],
    "experienceOptions": [
      "Minha casa",
      "Meu comércio",
      "Preciso de um reparo",
      "Ainda estou avaliando"
    ],
    "periodOptions": [
      "Quero combinar uma visita",
      "Tenho fotos e medidas",
      "Vou confirmar o endereço",
      "Ainda preciso de orientação"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nos próximos dias",
      "Ainda neste mês",
      "Estou planejando"
    ],
    "stepTitles": {
      "service": "Qual serviço você precisa?",
      "experience": "Onde será o trabalho?",
      "period": "Como podemos entender a demanda?",
      "timing": "Quando você pretende começar?",
      "note": "Conte os detalhes"
    },
    "notePlaceholder": "Ex.: ambiente, medidas aproximadas, acabamento desejado ou itens para transportar."
  },
  "hbk-iluminacao-led": {
    "proposalKind": "service",
    "services": [
      "Iluminação LED residencial",
      "Iluminação LED comercial",
      "Lâmpadas e luminárias LED",
      "Spots e perfis LED",
      "Projetos de iluminação",
      "Orientação técnica"
    ],
    "experienceOptions": [
      "Residência",
      "Condomínio",
      "Comércio",
      "Obra em andamento",
      "Outro projeto"
    ],
    "periodOptions": [
      "Sei a metragem",
      "Tenho fotos do ambiente",
      "Preciso de orientação"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nos próximos dias",
      "Ainda neste mês",
      "Estou planejando"
    ],
    "stepTitles": {
      "service": "Qual iluminação LED procura?",
      "experience": "Onde será aplicado?",
      "period": "Como podemos orientar?",
      "timing": "Quando pretende começar?"
    },
    "notePlaceholder": "Conte os ambientes, a metragem e o que deseja iluminar."
  },
  "jc-revestimentos": {
    "proposalKind": "service",
    "services": [
      "Textura projetada",
      "Grafiato",
      "Textura lisa",
      "Massa corrida",
      "Massa acrílica",
      "Massa niveladora"
    ],
    "experienceOptions": [
      "Residência",
      "Condomínio",
      "Comércio",
      "Obra em andamento",
      "Outro projeto"
    ],
    "periodOptions": [
      "Sei a metragem",
      "Tenho fotos do ambiente",
      "Preciso de orientação"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nos próximos dias",
      "Ainda neste mês",
      "Estou planejando"
    ],
    "stepTitles": {
      "service": "Qual revestimento procura?",
      "experience": "Onde será aplicado?",
      "period": "Como podemos orientar?",
      "timing": "Quando pretende começar?"
    },
    "notePlaceholder": "Conte a metragem, ambiente e acabamento desejado."
  },
  "jkl-marcenaria": {
    "stepTitles": {
      "service": "Qual ambiente você quer transformar?",
      "experience": "Conte sobre o projeto",
      "period": "Onde será a instalação?",
      "timing": "Quando deseja receber?",
      "note": "Mais detalhes"
    },
    "services": [
      "Cozinha planejada em MDF",
      "Guarda-roupa e dormitório",
      "Nichos e porta-tempero",
      "Banheiro e ambientes em geral"
    ],
    "experienceOptions": [
      "Projeto completo",
      "Móvel sob medida",
      "Cozinha infantil",
      "Quero renovar um ambiente"
    ],
    "periodOptions": [
      "Curitiba e região",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Quero aproveitar a entrega em até 20 dias",
      "Estou planejando",
      "Quero uma avaliação"
    ]
  },
  "liz-moraes-nail-designer": {
    "services": [
      "Manicure tradicional · R$ 45,00",
      "Pedicure tradicional · R$ 45,00",
      "Spa dos pés · R$ 55,00",
      "Esmaltação em gel · R$ 70,00",
      "Banho de gel · R$ 90,00",
      "Alongamento ou manutenção molde F1",
      "Quero orientação para escolher"
    ],
    "experienceOptions": [
      "Primeiro atendimento",
      "Já faço unhas em gel",
      "Quero manutenção",
      "Quero conhecer as opções"
    ],
    "periodOptions": [
      "Manhã",
      "Tarde",
      "Noite",
      "Tenho flexibilidade"
    ],
    "timingOptions": [
      "O quanto antes",
      "Ainda nesta semana",
      "Na próxima semana",
      "Estou planejando"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "Qual cuidado você deseja?",
      "experience": "Como estão suas unhas hoje?",
      "period": "Qual período combina com sua rotina?",
      "timing": "Quando gostaria de agendar?",
      "note": "Conte um pouco mais"
    },
    "notePlaceholder": "Ex.: data desejada, referência de cor ou dúvida sobre o molde F1."
  },
  "lk-alvenaria": {
    "services": [
      "Alicerce e fundação",
      "Baldrame e concretagem",
      "Alvenaria, muros e paredes",
      "Colunas, vigas e lajes",
      "Reboco, chapisco e emboço",
      "Cerâmica e porcelanato",
      "Drywall e forro PVC",
      "Calçadas e paver",
      "Reformas e reparos"
    ],
    "experienceOptions": [
      "Construção nova",
      "Reforma residencial",
      "Obra comercial ou predial",
      "Reparo ou manutenção"
    ],
    "periodOptions": [
      "Curitiba e região",
      "Vou confirmar o endereço",
      "Ainda estou definindo o local"
    ],
    "timingOptions": [
      "Preciso iniciar em breve",
      "Estou planejando",
      "Quero uma avaliação primeiro"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "Qual etapa da obra você precisa?",
      "experience": "Que tipo de projeto é?",
      "period": "Onde será a obra?",
      "timing": "Quando pretende começar?",
      "note": "Conte os detalhes da obra"
    },
    "notePlaceholder": "Ex.: metragem, etapa atual, material desejado e prazo estimado."
  },
  "lucas-arruma-maquina-lavar": {
    "services": [
      "Não liga",
      "Não lava ou não centrifuga",
      "Não drena a água",
      "Vazamento ou ruído",
      "Manutenção preventiva",
      "Ainda preciso de diagnóstico"
    ],
    "experienceOptions": [
      "Máquina de lavar",
      "Lava e seca",
      "Tanquinho",
      "Vou confirmar o equipamento"
    ],
    "periodOptions": [
      "Curitiba e região",
      "Vou confirmar o endereço",
      "Ainda estou definindo o local"
    ],
    "timingOptions": [
      "Preciso de atendimento em breve",
      "Estou planejando",
      "Quero uma avaliação primeiro"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que aconteceu com sua máquina?",
      "experience": "Qual equipamento precisa de ajuda?",
      "period": "Onde será o atendimento?",
      "timing": "Quando você precisa?",
      "note": "Conte mais sobre o problema"
    },
    "notePlaceholder": "Ex.: marca, modelo, código de erro e quando o problema começou."
  },
  "marido-de-aluguel": {
    "services": [
      "Instalação",
      "Reparo hidráulico",
      "Montagem de móvel",
      "Pintura e acabamento",
      "Vários reparos na mesma visita"
    ],
    "experienceOptions": [
      "Casa",
      "Apartamento",
      "Escritório ou comércio",
      "Imóvel para mudança ou locação"
    ],
    "periodOptions": [
      "Curitiba",
      "São José dos Pinhais",
      "Pinhais / Colombo",
      "Outra cidade da região"
    ],
    "timingOptions": [
      "Urgente",
      "Ainda nesta semana",
      "Na próxima semana",
      "Estou planejando"
    ],
    "stepTitles": {
      "service": "Qual reparo você precisa?",
      "experience": "Onde será o serviço?",
      "period": "Em qual região fica o imóvel?",
      "timing": "Quando você precisa resolver?",
      "note": "Descreva os reparos"
    },
    "notePlaceholder": "Ex.: instalar duas prateleiras e ajustar uma torneira. Apartamento com elevador."
  },
  "mary-diarista": {
    "stepTitles": {
      "service": "Qual serviço você precisa?",
      "experience": "Conte sobre o ambiente",
      "period": "Onde será o atendimento?",
      "timing": "Qual frequência prefere?",
      "note": "Mais detalhes"
    },
    "services": [
      "Diária de até 4 horas",
      "Diária de até 6 horas",
      "Diária de até 8 horas",
      "Pós-obra ou pós-mudança",
      "Personal organizer"
    ],
    "experienceOptions": [
      "Casa ou apartamento",
      "Escritório",
      "Pós-obra ou mudança",
      "Quero uma cliente fixa"
    ],
    "periodOptions": [
      "Curitiba e região",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Quintas-feiras semanais",
      "Quintas-feiras quinzenais",
      "Atendimento esporádico"
    ]
  },
  "mp-festas-eventos": {
    "services": [
      "Festa na Mesa · a partir de R$ 160",
      "Decoração Clássica · a partir de R$ 250",
      "Decoração Premium · a partir de R$ 350",
      "Casamento ou evento especial",
      "Ainda não sei — quero uma sugestão"
    ],
    "experienceOptions": [
      "Aniversário infantil",
      "Aniversário adulto",
      "Casamento ou noivado",
      "Evento corporativo / especial"
    ],
    "periodOptions": [
      "Araucária",
      "Curitiba e região",
      "Ainda vou confirmar o local"
    ],
    "timingOptions": [
      "Nos próximos 30 dias",
      "Neste semestre",
      "Estou planejando"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "Qual decoração combina com sua festa?",
      "experience": "Que momento vamos celebrar?",
      "period": "Onde será o evento?",
      "timing": "Quando é a sua data?",
      "note": "Conte um pouco mais"
    },
    "notePlaceholder": "Ex.: tema, número de convidados, cores, endereço e referências que você imagina."
  },
  "no-brilho-higienizacao": {
    "services": [
      "Sofá",
      "Colchão",
      "Cadeiras e poltronas",
      "Banco automotivo",
      "Tapete ou carpete",
      "Higienização completa"
    ],
    "experienceOptions": [
      "Residência",
      "Escritório ou comércio",
      "Veículo",
      "Outro ambiente"
    ],
    "periodOptions": [
      "São José dos Pinhais",
      "Curitiba e região",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Quero agendar em breve",
      "Estou planejando",
      "Quero uma avaliação primeiro"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que você quer higienizar?",
      "experience": "Onde será o atendimento?",
      "period": "Qual região?",
      "timing": "Quando prefere agendar?",
      "note": "Conte os detalhes"
    },
    "notePlaceholder": "Ex.: tamanho, manchas, odores ou ácaros que deseja remover."
  },
  "paulo-mestre-de-obras": {
    "services": [
      "Fundação e baldrame",
      "Alvenaria, muros e paredes",
      "Colunas, vigas e lajes",
      "Reboco e revestimentos",
      "Pisos e azulejos",
      "Reformas e pequenos reparos"
    ],
    "experienceOptions": [
      "Construção nova",
      "Reforma residencial",
      "Manutenção ou reparo",
      "Obra comercial"
    ],
    "periodOptions": [
      "Curitiba e região",
      "Vou confirmar o endereço",
      "Ainda estou definindo o local"
    ],
    "timingOptions": [
      "Preciso começar em breve",
      "Estou planejando",
      "Quero uma avaliação primeiro"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "Qual serviço você precisa?",
      "experience": "Que tipo de obra é?",
      "period": "Onde será a obra?",
      "timing": "Quando pretende começar?",
      "note": "Conte os detalhes da obra"
    },
    "notePlaceholder": "Ex.: metragem, etapa atual, acabamento desejado e prazo."
  },
  "raphael-construcoes": {
    "proposalKind": "service",
    "services": [
      "Construção",
      "Reforma",
      "Impermeabilização",
      "Hidráulica",
      "Elétrica",
      "Demolição",
      "Pintura e acabamentos",
      "Engenharia e acompanhamento"
    ],
    "experienceOptions": [
      "Casa",
      "Apartamento",
      "Comércio",
      "Condomínio",
      "Outro imóvel"
    ],
    "periodOptions": [
      "Tenho projeto ou medidas",
      "Tenho fotos do local",
      "Preciso de uma avaliação"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nos próximos meses",
      "Ainda neste ano",
      "Estou planejando"
    ],
    "stepTitles": {
      "service": "Qual etapa da obra você precisa?",
      "experience": "Onde será o serviço?",
      "period": "O que já está disponível?",
      "timing": "Quando pretende começar?"
    },
    "notePlaceholder": "Conte o tipo de obra, a região e os principais detalhes."
  },
  "refrigeracao-maresia": {
    "services": [
      "Recarga de gás",
      "Troca de motor",
      "Troca de sensor",
      "Manutenção preventiva",
      "Manutenção corretiva",
      "Ainda não sei — preciso de diagnóstico"
    ],
    "experienceOptions": [
      "Geladeira não está gelando",
      "Freezer com problema",
      "Ruído ou vazamento",
      "Quero prevenir uma falha"
    ],
    "periodOptions": [
      "Curitiba",
      "Região Metropolitana",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Atendimento o quanto antes",
      "Nos próximos dias",
      "Orçamento preventivo"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que aconteceu com seu equipamento?",
      "experience": "Qual é o sintoma principal?",
      "period": "Onde será o atendimento?",
      "timing": "Quando você precisa?",
      "note": "Conte mais detalhes"
    },
    "notePlaceholder": "Ex.: marca, modelo, quando começou e se o aparelho liga normalmente."
  },
  "rj-servicos-drywall": {
    "proposalKind": "service",
    "services": [
      "Paredes divisórias",
      "Paredes personalizadas",
      "Forros e rebaixamentos",
      "Reparos em geral"
    ],
    "experienceOptions": [
      "Tenho fotos e medidas",
      "Tenho fotos, mas não as medidas",
      "Ainda preciso avaliar o local",
      "É um reparo urgente"
    ],
    "periodOptions": [
      "Curitiba",
      "São José dos Pinhais",
      "Colombo",
      "Pinhais",
      "Outra cidade da região"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nos próximos 7 dias",
      "Ainda neste mês",
      "Estou planejando"
    ],
    "stepTitles": {
      "service": "Qual serviço você precisa?",
      "experience": "O que você já tem em mãos?",
      "period": "Onde será o serviço?",
      "timing": "Para quando você precisa?",
      "note": "Conte os detalhes da obra"
    },
    "stepSubtitles": {
      "service": "Assim Rodnei entende o tipo de execução e acabamento.",
      "experience": "Fotos e medidas ajudam a deixar a avaliação mais objetiva.",
      "period": "A localização ajuda a confirmar o atendimento.",
      "timing": "Uma previsão ajuda a organizar a agenda da obra.",
      "note": "Inclua tudo que pode ajudar na primeira avaliação."
    },
    "notePlaceholder": "Ex.: ambiente, medidas aproximadas, tipo de acabamento e melhor horário para visita."
  },
  "salao-da-marcia": {
    "services": [
      "Depilação com cera",
      "Progressiva",
      "Corte e hidratação",
      "Pé e mão",
      "Mechas e tratamento",
      "Combo de serviços"
    ],
    "experienceOptions": [
      "Quero conhecer o salão",
      "Tenho um horário em mente",
      "Preciso de uma indicação",
      "Quero combinar serviços"
    ],
    "periodOptions": [
      "Cidade Jardim · São José dos Pinhais",
      "São José dos Pinhais",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Quero agendar em breve",
      "Estou planejando",
      "Quero consultar horários"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "Qual cuidado você procura?",
      "experience": "Como podemos ajudar?",
      "period": "Onde será o atendimento?",
      "timing": "Quando prefere?",
      "note": "Conte o que você deseja"
    },
    "notePlaceholder": "Ex.: comprimento do cabelo, região da depilação e preferência de horário."
  },
  "santos-montador-de-moveis": {
    "services": [
      "Montagem ou desmontagem de móveis",
      "Pintura interna",
      "Reparo elétrico",
      "Limpeza de caixa d'água",
      "Instalação de cortina ou persiana",
      "Outro reparo residencial"
    ],
    "experienceOptions": [
      "Alphaville",
      "Curitiba",
      "Colombo",
      "Outra região"
    ],
    "periodOptions": [
      "Manhã",
      "Tarde",
      "Tenho flexibilidade"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nesta semana",
      "Estou planejando"
    ],
    "stepTitles": {
      "service": "O que você precisa resolver?",
      "experience": "Onde será o serviço?",
      "period": "Qual período funciona melhor?",
      "timing": "Quando você precisa?",
      "note": "Conte os detalhes"
    },
    "stepSubtitles": {
      "service": "Escolha a opção mais próxima.",
      "experience": "A disponibilidade é confirmada no atendimento.",
      "note": "Fotos, quantidades e medidas ajudam no orçamento."
    },
    "notePlaceholder": "Ex.: tipo de móvel, quantidade, medidas ou o reparo necessário",
    "proposalKind": "service"
  },
  "sos-presentes-cosmeticos": {
    "services": [
      "Quero uma cesta pronta",
      "Quero montar um presente",
      "Caneca ou xícara personalizada",
      "Cosméticos e acessórios",
      "Quero ajuda para escolher"
    ],
    "experienceOptions": [
      "É para aniversário",
      "É para uma data especial",
      "É para presentear alguém",
      "Quero deixar disponível para retirada"
    ],
    "periodOptions": [
      "Preciso para hoje",
      "Para os próximos dias",
      "Estou planejando com antecedência",
      "Quero consultar a entrega"
    ],
    "timingOptions": [
      "Quero falar sobre disponibilidade",
      "Quero montar meu pedido",
      "Quero personalizar uma caneca",
      "Quero conhecer a loja"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que você quer presentear?",
      "experience": "Qual é a ocasião?",
      "period": "Quando você precisa?",
      "timing": "Como podemos ajudar?",
      "note": "Conte os detalhes do presente"
    },
    "notePlaceholder": "Ex.: para quem é, cores, frase, tema, data e faixa de valor."
  },
  "studio-de-cilios": {
    "services": [
      "Mega Brasileiro · R$ 130",
      "Mega Egípcio · R$ 130",
      "Mega Fox Eyes · R$ 130",
      "Fio a Fio · R$ 100",
      "Quero ajuda para escolher"
    ],
    "experienceOptions": [
      "Primeira aplicação",
      "Já uso extensão de cílios",
      "Manutenção",
      "Quero mudar o estilo"
    ],
    "periodOptions": [
      "Tenho flexibilidade",
      "Preciso de um horário específico",
      "Quero saber os próximos horários"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nos próximos 15 dias",
      "Estou planejando"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "Qual olhar você quer criar?",
      "experience": "Como estão seus cílios hoje?",
      "period": "Que tipo de horário você procura?",
      "timing": "Quando gostaria de agendar?",
      "note": "Conte o que você imaginou"
    },
    "notePlaceholder": "Ex.: prefiro um efeito delicado, tenho uma referência ou preciso de manutenção."
  },
  "thays-camilla": {
    "services": [
      "Kit promocional: caneca + azulejo",
      "Caneca de cerâmica personalizada",
      "Azulejo personalizado 15x15 cm",
      "Quero conhecer outras opções"
    ],
    "experienceOptions": [
      "Para presentear",
      "Para minha casa",
      "Para uma data especial",
      "Ainda estou escolhendo"
    ],
    "periodOptions": [
      "Quero combinar a entrega",
      "Vou retirar",
      "Preciso consultar",
      "Ainda não sei"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nesta semana",
      "Estou pesquisando",
      "Quero combinar"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que você gostaria de personalizar?",
      "experience": "Qual é a ocasião?",
      "period": "Como prefere receber?",
      "timing": "Quando você precisa?",
      "note": "Conte os detalhes"
    },
    "notePlaceholder": "Ex.: frase, imagem, cores, quantidade ou data do presente."
  },
  "ton-e-cor": {
    "proposalKind": "service",
    "services": [
      "Pintura em geral",
      "Pequenos serviços de alvenaria",
      "Pequenos serviços hidráulicos",
      "Limpeza de telhado",
      "Reparos em geral"
    ],
    "experienceOptions": [
      "Casa",
      "Apartamento",
      "Comércio",
      "Outro espaço"
    ],
    "periodOptions": [
      "Tenho fotos do local",
      "Posso explicar o reparo",
      "Preciso de uma avaliação"
    ],
    "timingOptions": [
      "O quanto antes",
      "Nos próximos dias",
      "Ainda neste mês",
      "Estou planejando"
    ],
    "stepTitles": {
      "service": "Qual serviço você precisa?",
      "experience": "Onde será o trabalho?",
      "period": "Como podemos avaliar?",
      "timing": "Quando pretende começar?"
    },
    "notePlaceholder": "Conte quais ambientes ou reparos precisam de atenção."
  },
  "vila-da-capivara": {
    "services": [
      "Kit Festa para 10 pessoas · R$ 259,90",
      "Kit Festa para 20 pessoas · R$ 499,90",
      "Kit Festa para 50 pessoas · R$ 1.249,90",
      "Kit Festa para 70 pessoas · R$ 1.749,90",
      "Kit Festa para 100 pessoas · R$ 2.499,90",
      "Bolos, doces ou salgados avulsos"
    ],
    "experienceOptions": [
      "Aniversário",
      "Confraternização",
      "Evento corporativo",
      "Casamento ou celebração"
    ],
    "periodOptions": [
      "Campo Comprido",
      "Curitiba e região",
      "Vou confirmar o endereço"
    ],
    "timingOptions": [
      "Preciso para breve",
      "Estou planejando",
      "Quero consultar disponibilidade"
    ],
    "proposalKind": "service",
    "stepTitles": {
      "service": "O que você quer encomendar?",
      "experience": "Qual é a ocasião?",
      "period": "Onde será a entrega?",
      "timing": "Quando será a sua festa?",
      "note": "Conte os detalhes do pedido"
    },
    "notePlaceholder": "Ex.: tema do bolo, quantidade de convidados, sabores e preferência de entrega."
  },
};

export function resolvePortfolioQuizConfig(clientKey?: string): PortfolioQuizConfig | undefined {
  return clientKey ? PORTFOLIO_QUIZ_CONFIGS[clientKey] : undefined;
}
