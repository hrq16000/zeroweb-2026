# Creative brief — Centro Mega · Store Concept

Contrato: v2 · Slug: `centro-mega` · Client key: `centro-mega`

> Evolução material de 21/09/2026: a presença deixa de ser apenas assistência/acessórios e passa a funcionar como **amostra de loja virtual social-commerce**, sem assumir estoque, preço ou disponibilidade atuais sem evidência.

## Business truth

A Centro Mega mantém presença pública associada a celulares/eletrônicos e outlet. O Linktree oficial `@centro.mega` concentra SAC, Outlet São José dos Pinhais, Galeria Di Brunno, Shopping Cidade, Pinheirinho e Instagram. Uma loja/contato VHSYS vinculada ao CNPJ 17.991.627/0001-54 também está pública.

Postagens públicas indexadas encontradas:

- 25/01/2024 — Poco X5 Pro, 8 GB RAM / 256 GB; publicação exibia de R$ 2.399,00 por R$ 1.899,00;
- 08/11/2023 — Tênis Dunk Low Pro; espelhos públicos mostram faixas de tamanho conflitantes (34–39 e 34–43), portanto a landing não transforma nenhuma delas em estoque atual.

O responsável da 0WEB informou também mix de bonés, calçados, tênis e outros itens de outlet publicados diretamente nas redes. Esses itens entram como **categorias demonstrativas**, não como produtos com preço/estoque inventado.

## Creative DNA

- businessTruth: tecnologia + celulares + acessórios + outlet de giro rápido alimentado por redes sociais.
- audience: pessoas que descobrem ofertas no Facebook/Instagram e querem consultar produto, preço, estoque, tamanho, retirada ou entrega com menos atrito.
- singleGoal: transformar interesse em produto/categoria numa solicitação de compra contextualizada pelo funil da Centro Mega.
- brandPersonality: energética, tecnológica, varejista, rápida, popular-premium, visualmente ousada.
- visualMetaphor: **feed social se transformando em loja neon navegável**.
- layoutTopology: macrocomposição de social-commerce com hero imersivo, vitrine pesquisável, categorias, outlet mode, feed de fontes, mapa de canais e sacola demonstrativa.
- heroArchetype: monolítico tipográfico + mockup de produtos em neon; sem hero split institucional.
- navigationArchetype: sticky commerce bar com Vitrine / Outlet / Redes / Lojas e contador de seleção.
- sectionRhythm: impacto escuro → vitrine → atmosfera outlet → social feed → presença multicanal → sacola/CTA.
- typePairing: sans pesada de varejo tecnológico para títulos + sans legível para suporte.
- colorRoles: ink quase preto, ciano elétrico para ação, violeta para profundidade, lime para seleção, pink para outlet/social.
- imageStrategy: mídia real pública do próprio negócio/produto em primeiro lugar — Instagram/Facebook oficiais, seller/marketplace e demais fontes resolvidas; assets acessíveis são versionados com provenance. CSS/DOM e geração ficam como apoio/fallback, nunca como desculpa para ignorar foto real disponível.
- iconStrategy: Lucide como glyph funcional e fallback explícito apenas para item/categoria ainda sem mídia real resolvida; produto concreto com foto pública disponível usa a foto real.
- motionGrammar: `IMMERSIVE` com layered hero, stagger, hover depth, glows e crossing depth; sempre fail-open e reduzido em mobile/reduced-motion.
- interactionSignature: filtros de categoria + busca + sacola demonstrativa + carryover dos itens selecionados para o funil.
- conversionNarrative: post social → produto/categoria → seleção → consulta → confirmação de preço/estoque → atendimento.
- proofStrategy: Linktree oficial, loja/contato pública, postagens públicas indexadas e links sociais já versionados.
- nearestPortfolioRisks: evitar parecer assistência técnica, marketplace genérico, dashboard ou clone de e-commerce institucional.
- antiTemplateDecisions: nenhum hero institucional split, nenhuma grade branca genérica, nenhuma estrela/rating, nenhum preço atual inferido, nenhum checkout falso.

## Landing Decision Profile R3

- pageMode: `catalog_or_selection`
- trafficIntent: descoberta de produto/oferta + consulta de compra
- offerType: mix de varejo com alta volatilidade de estoque/preço
- primaryDecisionBarrier: posts isolados não organizam comparação, categoria, seleção nem continuidade para atendimento
- decisionVelocity: fast path por “consultar disponibilidade”; caminho assistido por filtros/busca/sacola
- informationScent: “Ver vitrine”, “Quero este”, “Consultar minha seleção”, “Abrir fonte”
- selfSegmentation: categoria + busca + seleção de itens
- contextCarryover: produtos escolhidos seguem em `initialAnswers.service` e `orderContext.order_items`
- commitmentLadder: explorar → filtrar → selecionar → consultar
- claimEvidenceGraph:
  - Poco X5 Pro / 8GB / 256GB / preço histórico → postagem pública indexada de 25/01/2024
  - Tênis Dunk Low Pro → postagem pública indexada de 08/11/2023
  - unidades/canais → Linktree oficial e loja/contato pública
  - bonés/calçados/outlet → mix informado pelo responsável; sem preço/estoque
- riskAdjustedPersuasion: `standard`; sem urgência artificial, contadores falsos ou estoque fabricado
- humanEscalationPolicy: preço, estoque, cor, tamanho, entrega e condição final exigem confirmação
- responseExpectationContract: seleção é salva no funil; canal final depende do destino operacional vigente
- freshnessPolicy:
  - preço de postagem histórica → sempre rotulado histórico / confirmar atual
  - estoque/tamanho → nunca afirmar atual sem revalidação
  - canais/unidades → revalidar em manutenção material
- navigationLeakagePolicy: `selective`; links sociais/oficiais existem como evidência e descoberta
- mobileDecisionBudget: identidade → vitrine → filtro → produto → seleção → CTA
- experimentReadiness: `hypothesis_required`

## Action State Model

`ARRIVAL → ORIENTED → SELF_SEGMENTED → INFORMED → QUALIFIED → COMMITTED → CONFIRMED`

A seleção de produto altera o funil de verdade; não é interação decorativa.

## Resource Effort Ledger

Regra de mídia desta revisão: `docs/PORTFOLIO_PUBLIC_MEDIA_INGESTION_STANDARD.md`. Bloqueio de fetch direto de rede social não autoriza concluir “sem imagens”; a pesquisa continua por embeds públicos, marketplace/seller, busca e mirrors/indexadores.

| Recurso | Estado | Evidência / decisão |
|---|---|---|
| Linktree oficial | USED | `https://linktr.ee/centro.mega` |
| Instagram oficial | USED | `https://www.instagram.com/centro.mega/` e links já versionados |
| Facebook oficial | USED | `https://www.facebook.com/CentroMega.com.br/` |
| Loja/contato VHSYS | USED | CNPJ/endereço/canais públicos |
| Post Poco X5 Pro | USED | indexação pública; preço sempre histórico |
| Post Dunk Low Pro | USED | indexação pública; tamanhos conflitantes tratados como “consultar” |
| Posts/reels Instagram | USED_AS_PUBLIC_EMBED | URLs oficiais incorporadas como mídia viva; produto não é inferido sem evidência factual |
| Fotos reais de produtos | USED | catálogo público do seller Centro Mega no Magalu pesquisado; Mi Box S, Earbuds Basic 2 e Renux 5203 têm mídia real versionada em CDN com provenance |
| Bonés/calçados/outlet | USED_AS_CATEGORY | fornecido pelo responsável; sem SKU/preço inventado |
| Busca e filtros | USED | reduz custo de descobrir produto |
| Sacola demonstrativa | USED | lista de interesse, não checkout |
| Checkout/pagamento real | REJECTED | amostra não possui catálogo/estoque/preço transacional confiável |
| Countdown/urgência | REJECTED | não há condição temporal comprovada |
| Ratings/depoimentos | REJECTED | não necessários e não há prova canônica |
| Motion imersivo | USED | serve à metáfora feed → commerce; primitives existentes |
| 3D/WebGL pesado | REJECTED | custo não justificado para demonstrar a loja |
| Funil individual | USED | `clientKey=centro-mega`, intent `pedido` |
| WhatsApp direto público | REJECTED | mantém política de funil; destino operacional está configurado server-side por `client_key=centro-mega` e não é exposto no bundle |
| Browser/runtime QA | PENDING_PREVIEW | obrigatório antes do merge |

## Produto social x produto atual

A página usa **produto social como evidência de mix**, não como promessa de estoque.

Regras:

1. preço antigo só aparece como “preço da postagem histórica”;
2. estoque, tamanho e cor são sempre “consultar”;
3. posts não legíveis não viram SKU inventado;
4. categorias informadas podem aparecer como amostra, claramente classificadas;
5. uma futura loja real pode substituir esse dataset por catálogo/estoque/checkout.

## Conversão

- `ctaMode = ordering`
- `funnelType = pedido`
- `contactMode = funnelOnly`
- itens selecionados seguem em `orderContext.order_items`
- nenhum número de outro cliente ou 0WEB entra como fallback
- destino operacional próprio da Centro Mega revalidado e versionado exclusivamente por `client_key=centro-mega`; nenhum fallback cross-client

## SEO / entity

A landing deve se posicionar como amostra de loja virtual da Centro Mega em São José dos Pinhais / Curitiba e região, sem inventar estoque, preço, endereço adicional, review ou disponibilidade.

## Fontes públicas consultadas em 21/09/2026

- https://linktr.ee/centro.mega
- https://www.instagram.com/centro.mega/
- https://www.facebook.com/CentroMega.com.br/
- https://www.vhsys.net/centromega/contato/
- https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega
- https://www.magazineluiza.com.br/lojista/centromega/ — seller público Centro Mega; fonte de produtos e mídia real de catálogo

## Critério visual

A amostra pode ser deliberadamente mais exuberante que uma landing institucional, porque seu objetivo é vender a visão de uma loja virtual. O exagero visual só passa se:

- continuar legível;
- não esconder CTA;
- não quebrar mobile;
- não comprometer reduced-motion;
- não piorar performance sem função;
- não criar urgência/prova/estoque falsos.
