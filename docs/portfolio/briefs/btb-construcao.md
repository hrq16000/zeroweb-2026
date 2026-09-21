# Creative brief — BTB Construção

Contrato: v2 · Slug: `btb-construcao` · Client key: `btb-construcao`

> Brief concluído antes da publicação da composição autoral.

- businessTruth: Reformas internas e acabamentos em Curitiba e região, da pintura à iluminação LED.
- audience: Pessoas e pequenos negócios que adiaram uma reforma e querem uma equipe para executar com clareza.
- singleGoal: Receber um pedido de orçamento qualificado pelo funil.
- brandPersonality: energética, direta, corajosa, prática e responsável.
- visualMetaphor: a parede que se abre para revelar um ambiente melhor.
- layoutTopology: narrativa de escopo em grande tipografia, interação "Mapa da Reforma", camadas construtivas e processo — sem repetir hero split + cards.
- heroArchetype: manifesto tipográfico em escala arquitetônica, com mídia contextual deslocada e CTA para construção do escopo.
- navigationArchetype: âncoras curtas orientadas a mapa da reforma, frentes, etapas e orçamento.
- sectionRhythm: manifesto → seletor de escopo → camadas da obra → processo → envio do escopo.
- typePairing: display condensado e pesado para manchetes + sans-serif legível para escopo.
- colorRoles: carvão como base, amarelo de segurança como ação e orientação, magenta como assinatura de energia, papel claro para leitura.
- imageStrategy: arte de marca gerada a partir do flyer recebido, sem pessoas, texto, logo ou promessa factual; flyer original arquivado apenas como referência.
- iconStrategy: ícones lineares Lucide para comunicar cada frente de obra sem competir com a marca.
- motionGrammar: entradas curtas e firmes; deslocamento mínimo e respeito a prefers-reduced-motion.
- interactionSignature: "Mapa da Reforma" permite combinar frentes antes do funil; a seleção é carregada como contexto para evitar perguntar o serviço novamente.
- conversionNarrative: ideia difusa → escopo inicial → camadas relacionadas → contexto da obra → orçamento organizado.
- proofStrategy: garantia de 90 dias e processo explícito, ambos fornecidos pelo cliente; sem depoimentos inventados.
- nearestPortfolioRisks: parecer apenas mais uma página de construção dourada ou catálogo de serviços.
- antiTemplateDecisions: remover a antiga macroestrutura hero split → cards → processo; não usar galeria inventada; usar manifesto tipográfico, seletor multi-frente, camadas da obra e contexto persistente.

## Assets oficiais recebidos

Flyer oficial BTB recebido em docs/portfolio/source-materials/btb-construcao/flyer-reference.png; hero gerada em public/images/btb-construcao/hero.png como arte de marca não documental.

## Skills selecionadas

0web-skill-router, 0web-skill-discovery, 0web-portfolio-art-direction, 0web-design-system, 0web-ui-quality-gates, imagegen.

## Skills rejeitadas e motivo

Landing/CRO genérica rejeitada: não impõe uma quantidade fixa de seções e não representa a metáfora de demolição/transformação.

## Validação final

- [x] identidade escopada ao cliente
- [x] override de motion próprio
- [x] hero/composição distintos dos portfolios mais próximos
- [x] imagens classificadas corretamente
- [x] funil individual funcional
- [ ] secret server-side configurado quando houver contato oficial
- [ ] mobile/desktop/teclado/reduced-motion
- [ ] originality + a11y + performance + privacy + build


## Landing Intent + Decision Profile R3

- pageMode: `local_service`
- trafficIntent: orçamento de reforma / descoberta de prestador local
- trafficSource: orgânico, catálogo 0WEB, compartilhamento e campanhas futuras; não presumir uma única origem
- offerType: serviço consultivo multi-frente
- primaryDecisionBarrier: visitante muitas vezes sabe o ambiente/problema, mas não sabe traduzir a reforma em um escopo organizado
- decisionVelocity: fast path disponível pelo CTA direto; caminho assistido pelo Mapa da Reforma para quem precisa organizar frentes
- informationScent: CTAs nomeiam ação real ("Montar meu escopo", "Continuar com este escopo", "Solicitar orçamento")
- selfSegmentation: por frentes de reforma e contexto do imóvel; altera o conteúdo enviado ao funil
- contextCarryover: frentes escolhidas na landing viram `service` pré-preenchido e a etapa de serviço é pulada no funil
- commitmentLadder: leitura → seleção de frentes → funil qualificado → lead → WhatsApp do próprio `client_key`
- claimEvidenceGraph:
  - serviços → flyer/dados versionados do cliente
  - área Curitiba/RMC → dados versionados do cliente
  - garantia 90 dias → material fornecido pelo cliente/brief versionado
  - preço/parcelamento/desconto → não publicar sem nova evidência
- riskAdjustedPersuasion: `standard`; sem urgência artificial, sem cálculo de preço inventado
- humanEscalationPolicy: orçamento final e detalhes técnicos exigem avaliação da equipe
- responseExpectationContract: funil organiza escopo e encaminha ao canal oficial; prazo de retorno não é prometido
- freshnessPolicy: condições comerciais, disponibilidade, preço e prazo exigem revalidação antes de publicação
- navigationLeakagePolicy: `focused`
- mobileDecisionBudget: identidade → proposta → ação → mapa da reforma → escopo selecionado → processo
- experimentReadiness: `hypothesis_required`

## Action State Model

`ARRIVAL → ORIENTED → SELF_SEGMENTED → INFORMED → QUALIFIED → COMMITTED → CONFIRMED`

O estado `SELF_SEGMENTED` é implementado pelo Mapa da Reforma. A seleção não é decorativa: segue para o funil.

## Resource Effort Ledger

| Recurso | Estado | Motivo / evidência | Fallback / decisão |
|---|---|---|---|
| Flyer do cliente | USED | fonte arquivada em `docs/portfolio/source-materials/btb-construcao/` | base factual da oferta |
| Busca web atual | USED | pesquisa 2026-09-21 encontrou homônimos, sem resolução segura da entidade local | manter owner evidence; não associar homônimo |
| Google/Maps local | ATTEMPTED_BLOCKED | sem entidade BTB inequívoca em Curitiba | não inventar Place ID/endereço |
| Site oficial | REJECTED | `btbconstrucoes.com.br` corresponde a empresa de Goiânia/GO | registrar conflito e não usar |
| Instagram/Facebook oficial | ATTEMPTED_BLOCKED | não resolvidos com segurança | nenhum link social publicado |
| Fotos reais de obras/equipe | ATTEMPTED_BLOCKED | nenhuma mídia pública atribuível com segurança | hero contextual gerado e explicitamente não documental |
| Logo oficial vetorial | ATTEMPTED_BLOCKED | não confirmado como asset oficial independente | `logo.svg` tratado como `GENERATED_BRAND_ASSET` |
| Mapa da Reforma | USED | reduz barreira de explicar obra multi-frente | seletor multi-frente acessível |
| Context carryover | USED | seleção de escopo é reaproveitada no funil | nova opção `skipServiceWhenPrefilled` |
| Calculadora de preço | REJECTED | não existe tabela verificável para estimativa responsável | orçamento consultivo |
| Before/after | REJECTED | não há prova documental segura | narrativa de processo/camadas |
| Motion contextual | USED | reforça leitura em camadas sem depender do efeito | reduced-motion permanece suportado pelas primitives |
| SEO/entity | USED | metadata própria e schema específico de reforma/BTB | sem telefone/endereço inventado |
| Funil individual | USED | `clientKey=btb-construcao`, destino isolado | nenhum fallback cross-client |
| Mobile/a11y | USED | multi-select usa `aria-pressed`, foco visível e targets adequados | composição empilha sem esconder ação |
| Analytics | USED via infraestrutura canônica | CTA/funil continuam em `PortfolioCTAQuiz` | nenhuma nova coleta de PII |
| Browser/runtime QA | PENDING_PREVIEW | executar após preview | bloqueia merge se regressão |

## Freshness / claims removidos nesta evolução

A versão anterior mostrava desconto à vista e parcelamento em até 12x. Esses claims não permanecem na nova composição porque não há evidência canônica suficiente nesta rodada para confirmar validade atual.

## Pesquisa pública 2026-09-21

A busca externa encontrou `btbconstrucoes.com.br`, empresa sediada em Goiânia/GO e focada em infraestrutura/pavimentação. Ela é uma homônima e **não** foi usada como fonte da BTB Construção deste portfolio. Busca local também não resolveu uma ficha inequívoca em Curitiba.
