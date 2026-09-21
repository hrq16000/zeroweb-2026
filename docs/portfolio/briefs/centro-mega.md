# Creative brief v3 — Centro Mega Store

Contrato: v2 · Slug: `centro-mega` · Client key: `centro-mega`  
Evolução: 2026-09-21 · amostra autônoma de loja virtual

## Business truth

Centro Mega é uma operação varejista associada publicamente a celulares/tecnologia e outlet, com presença em São José dos Pinhais e frentes/unidades listadas no Linktree oficial. A amostra foi solicitada pelo responsável como **loja virtual de demonstração**, usando publicações das redes como matéria-prima para a vitrine.

A loja não presume estoque, preço atual, cor, grade, prazo ou frete. Produtos derivados de posts históricos aparecem com data e copy de transparência.

## Creative DNA

- businessTruth: varejo híbrido tech + outlet, com produtos de giro rápido e presença social ativa.
- audience: clientes que chegam por redes sociais e querem descobrir, separar e consultar produtos sem perder contexto.
- singleGoal: montar uma sacola de interesse e enviá-la pelo funil individual da Centro Mega.
- brandPersonality: energética, urbana, tecnológica, promocional, acessível.
- visualMetaphor: **feed que ganha profundidade e vira loja**.
- layoutTopology: retail-scrollytelling com hero orbital, vitrine filtrável, cards glow, outlet em drops, feed-to-store e sacola lateral.
- heroArchetype: oversized typography + produto tech abstrato + cards flutuantes de feed/outlet.
- navigationArchetype: sticky glass com vitrine/outlet/feed/lojas e sacola persistente.
- sectionRhythm: imersão escura → vitrine → outlet neon → feed/proveniência → presença física → CTA/sacola.
- typePairing: sans pesada/condensada por escala + sans de suporte.
- colorRoles: navy/black como base; ciano para tech/ação; fúcsia para outlet/drop; amarelo para oportunidade.
- imageStrategy: logo e assets existentes; produto visualizado com composição gráfica original quando mídia do post não puder ser ingerida com segurança.
- iconStrategy: Lucide em silhuetas de produto/categoria, nunca como substituto de prova documental.
- motionGrammar: orbit/spin, float, marquee, hover elevation, glow e transições de drawer; tudo fail-open/reduced-motion.
- interactionSignature: **sacola de interesse** + filtro por categoria + produto do feed com origem/data.
- conversionNarrative: feed → descoberta → seleção → sacola → funil → confirmação de disponibilidade/valor.
- proofStrategy: Linktree oficial, VHSYS público, perfil social oficial e posts públicos indexados.
- nearestPortfolioRisks: não virar catálogo genérico, assistência técnica genérica ou e-commerce fictício com preço/estoque fabricado.
- antiTemplateDecisions: hero não-split; vitrine interativa; produto sem foto real usa arte abstrata assumida; outlet por drops; cart drawer; source/freshness visíveis.
- resourceEffortLedger: ver seção abaixo.

## Produtos seedados a partir de publicações

### Poco X5 Pro · 8GB RAM · 256GB

Fonte pública indexada:  
`https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega`

Post indexado em 25/01/2024:
- modelo: Poco X5 Pro;
- 8GB RAM;
- 256GB armazenamento;
- preço histórico publicado: de R$ 2.399,00 por R$ 1.899,00.

Regra de publicação:
- pode aparecer como produto histórico/editorial;
- o preço deve ser rotulado como histórico;
- estoque e valor atuais permanecem sob consulta.

### Tênis Dunk Low Pro

Mesma fonte pública indexada.  
Posts indexados em 08/11/2023:
- produto: Tênis Dunk Low Pro;
- publicação menciona grade de tamanhos;
- publicação menciona cartões;
- publicação lista lojas físicas.

Há divergência entre duas cópias indexadas sobre a grade (34–39 vs. 34–43); por isso a landing **não publica a grade como fato atual**. Mostra apenas que houve anúncio de tamanhos e exige consulta.

## Categorias autorizadas para a amostra

Com base no pedido do responsável e na presença pública da marca:

- celulares/smartphones;
- acessórios mobile;
- tênis;
- bonés;
- calçados;
- outlet/achadinhos.

Itens sem publicação específica são exibidos como **categoria/amostra**, nunca como estoque confirmado.

## Fontes

- Linktree oficial: `https://linktr.ee/centro.mega`
- Instagram oficial: `https://www.instagram.com/centro.mega/`
- Facebook oficial: `https://www.facebook.com/CentroMega.com.br/`
- VHSYS público: `https://www.vhsys.net/centromega/contato/`
- Feed público indexado: `https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega`

O fetch automatizado não conseguiu resolver captions/mídias dos posts individuais do Instagram nesta rodada. Os URLs oficiais permanecem registrados como canais de discovery, mas nenhum produto foi inventado a partir de conteúdo não lido.

## Landing Decision Profile R3

- pageMode: `catalog_or_selection`
- trafficIntent: descoberta de produto / consulta de oferta vista em rede social
- trafficSource: social, compartilhamento, catálogo 0WEB e busca local
- offerType: varejo com disponibilidade variável
- decisionVelocity:
  - fastPathAvailable: true
  - primaryBarrier: transformar post/curiosidade em seleção consultável sem fingir estoque
  - avoidableSteps: repetir produtos já selecionados no funil
- informationScent:
  - CTAs: Explorar vitrine, Adicionar, Ver sacola, Consultar esta sacola
- selfSegmentation:
  - categorias filtráveis
  - intenção no funil: comprar/reservar, consultar valor, comparar
- contextCarryover:
  - itens selecionados → `service` + `orderContext.order_items`
  - o funil pula a etapa de serviço quando a sacola já contém itens
- commitmentLadder:
  - explorar → filtrar → adicionar → revisar sacola → consultar
- claimEvidenceGraph:
  - Poco X5 Pro + preço histórico → feed público indexado 25/01/2024
  - Dunk Low Pro → feed público indexado 08/11/2023
  - unidades/frentes → Linktree oficial
  - CNPJ/endereço/telefone → VHSYS público
- riskAdjustedPersuasion: `standard`
- actionStateModel: ARRIVAL → ORIENTED → SELF_SEGMENTED → INFORMED → QUALIFIED → COMMITTED → CONFIRMED
- humanEscalationPolicy: equipe confirma estoque, valor atual, variação, retirada/envio
- responseExpectationContract: pedido/sacola é registrado e segue ao WhatsApp do próprio client_key
- freshnessPolicy:
  - preço/estoque: sempre revalidar
  - posts históricos: manter data visível
- navigationLeakagePolicy: `selective`
- mobileDecisionBudget: marca → proposta → vitrine → add → sacola → consultar
- experimentReadiness: `hypothesis_required`

## Resource Effort Ledger

| Recurso | Estado | Evidência / decisão |
|---|---|---|
| Linktree oficial | USED | resolve frentes/unidades/canais |
| Facebook oficial | USED como fonte/canal | produto seedado via espelho público indexado; fetch direto bloqueado |
| Instagram oficial | ATTEMPTED_BLOCKED para captions | URLs públicos existem; fetch automatizado dos posts individuais falhou |
| VHSYS público | USED | CNPJ/endereço/telefone público |
| Posts indexados | USED | Poco X5 Pro e Dunk Low Pro |
| Mídia original dos posts | ATTEMPTED_BLOCKED | não ingerida com segurança nesta rodada |
| Visual abstrato de produto | USED | deixa explícito que é composição editorial |
| Filtro de categoria | USED | reduz busca visual |
| Sacola lateral | USED | preserva contexto do produto |
| Checkout transacional real | NOT_APPLICABLE | amostra em /portfolio; conversão segue funil individual |
| Preço atual | REJECTED sem evidência | somente preço histórico datado |
| Estoque atual | REJECTED sem evidência | sempre sob consulta |
| Motion expressivo | USED | hero orbit, marquee, float, hover/depth, drawer |
| 3D/WebGL | REJECTED_PERFORMANCE | valor visual obtido sem dependência pesada |
| Funil individual | USED | intent=pedido, client_key=centro-mega |
| WhatsApp público verificado | USED server-side | 41 99858-9419 validado em VHSYS + diretório público |
| Direct wa.me | REJECTED | política funnel-only |
| SEO Store | USED | Store/MobilePhoneStore + OfferCatalog sem estoque/preço inventado |
| Mobile/reduced-motion | USED | layout adaptativo + motion-reduce |

## Funil

- `clientKey=centro-mega`
- `funnelType=pedido`
- `contactMode=funnelOnly`
- produtos selecionados entram em `orderContext.order_items`
- valores entram como “sob consulta”
- sem `wa.me` público
- destino operacional exclusivo do client_key

## Definition of Done desta amostra

- [x] experiência de loja, não assistência genérica
- [x] produtos do feed com provenance/freshness
- [x] categorias adicionais marcadas como amostra
- [x] filtro de categoria
- [x] sacola persistente
- [x] context carryover para funil
- [x] funil intent=pedido
- [x] destino individual verificado
- [x] schema Store sem preço/estoque inventado
- [x] motion expressivo com reduced-motion
- [ ] preview/browser QA final
- [ ] gates/build final
