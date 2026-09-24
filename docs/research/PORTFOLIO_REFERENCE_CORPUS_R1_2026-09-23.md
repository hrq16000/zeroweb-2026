# 0WEB — Reference Corpus R1 · assistência local + landing systems

Status: **research ledger oficial / aditivo**  
Data: **2026-09-23**  
Escopo: referências fornecidas pelo responsável para elevar a qualidade de novas `/portfolio/:slug`.

Este documento não cria template visual. Ele amplia o repertório de gramáticas de
composição, decisão, prova, mídia e interação disponíveis para direção criativa.

Princípio canônico:

> **ABSORB GRAMMAR — NEVER COPY SILHOUETTE.**

## 1. Método desta rodada

Fontes auditadas nesta R1:

1. https://ffix.com.br/
2. https://assistenciatecnicasantos.com.br/
3. https://www.especell.com.br/
4. https://tecnicahouse.my.canva.site/
5. https://serviceonesjp.com.br/
6. https://gruposmarttv.com.br/
7. https://www.linkinformaticasjp.com.br/
8. https://speedcellsjp.com/
9. https://profitize.com.br/
10. https://henriquefigueiroa.com.br/
11. https://henriquefigueiroa.com.br/dentistas
12. https://ffjuris.com.br/
13. https://soumoratta.com.br/

Também foram lidas rotas internas relevantes da FFIX, Especell e Service One.

### Limite da evidência

Esta rodada usa crawl público de HTML/texto e estrutura navegável. Interações
declaradas no DOM, formulários, seletores, carrosséis e fluxos são evidência
válida de **interação**.

Animação visual, easing, duração, parallax, clip-path, sticky choreography e
microtransições **não são afirmados como observados** sem render/browser visual.
Quando uma ideia de motion é proposta abaixo, ela recebe
`DERIVED_MOTION_CANDIDATE`, nunca `OBSERVED_MOTION`.

Isso evita inventar comportamento da referência.

## 2. Nova classificação: USE / ADAPT / REJECT

Toda descoberta de referência recebe uma das classes:

- `USE` — princípio diretamente transferível para a 0WEB;
- `ADAPT` — princípio útil, mas precisa de tradução por contexto, factualidade,
  acessibilidade, stack ou privacidade;
- `REJECT` — não copiar; usar apenas como anti-padrão ou alerta.

Uma mesma referência pode conter itens nas três classes.

## 3. REFERENCE_SIGNAL_MATRIX

Campos oficiais desta biblioteca:

`source | route | sourceClass | businessMode | visitorJob | compositionSignal |
mediaSignal | interactionSignal | proofSignal | localitySignal | motionEvidence |
useClass | transferablePrinciple | antiPattern | confidence`

### 3.1 Assistência técnica / serviço local

| Fonte | Sinal estrutural | Sinal de mídia/prova | Interação/decisão | Classe | Tradução 0WEB |
|---|---|---|---|---|---|
| FFIX · home | home multioferta com orçamento cedo, serviços, oficina, usados, processo, marcas, cobertura, diagnóstico e status | oficina/loja/produto cumprem papéis diferentes | configurador de orçamento, diagnóstico rápido, consulta de status | USE | landing pode misturar utilidade + prova física + oferta sem virar sequência de cards |
| FFIX · TV | problema específico domina; “consertar ou trocar?” entra no meio da decisão | bancada + taxonomia de defeitos | decision aid contextual | USE | objeção material pode virar módulo decisório, não só FAQ |
| FFIX · notebook | oferta é qualificada por limites explícitos do que NÃO é feito | prova técnica perto do escopo | upgrade vs comprar novo | USE | limites reais podem mudar a arquitetura e aumentar confiança |
| Especell | rede física de 5 unidades; métricas, serviços, processo e bloco de lojas | unidade física + localização + avaliações Google | escolha da loja/rota mais próxima | USE | multi-location deve ser location-led, com cards/rotas por unidade e não uma única seção “contato” |
| Service One · home | três negócios convivem: assistência, loja, curso + B2B lojistas | fachada, microscópio, laboratório, bancadas | múltiplos CTAs por intenção | USE | quando há ofertas realmente distintas, a arquitetura pode separar “mundos” com mídia própria |
| Service One · campanha tela/bateria | campanha reduz drasticamente o escopo: sintoma → marca → prazo/garantia → loja → CTA | prova de localidade e marca | fast path de orçamento | USE | página de campanha não deve herdar a home; intenção específica pede caminho curto |
| Grupo Smart TV | especialização única: problema → processo → diferenciais → busca/entrega → laboratório → B2B | laboratório e logística são prova operacional | retirada/entrega como parte da jornada | USE | conveniência operacional pode ser capítulo narrativo, não bullet secundário |
| Link Informática | categoria ampla, serviços, credenciais técnicas, resultados, depoimentos, FAQ de prazos | muitas imagens e sinais técnicos | navegação por tipo de aparelho | ADAPT | usar amplitude/categoria e linguagem de performance; não importar métricas/reviews sem fonte |
| Speed Cell | voz de técnico individual + serviços + planos recorrentes + processo + parceiros | marca pessoal/técnico + oferta de assinatura | seletor CPF/PJ e planos | ADAPT | assinatura/planos podem transformar uma assistência em experiência de produto recorrente |
| Técnica House | fundador explica motivo de existir; manutenção + venda + empresas + busca/entrega + região | história pessoal e loja local | CTAs de venda/manutenção/entrega | ADAPT | founder-story pode ser prova quando o negócio depende da pessoa; escopo/região precisam ficar explícitos |
| Assistência Técnica Santos | site atualmente apresenta consultoria de marketing/desenvolvimento, apesar do domínio sugerir assistência | mídia genérica | CTA telefone/WhatsApp | REJECT para assistência | checar sempre coerência domínio↔entidade↔conteúdo; não usar nome do domínio como evidência de segmento |

### 3.2 Landing systems / direção autoral / produto

| Fonte | Sinal estrutural | Interação | Classe | Tradução 0WEB |
|---|---|---|---|---|
| Profitize | editorial enxuto: manifesto → visibility problem → projetos → processo → preço/configuração → FAQ fundador | alternância Google/ChatGPT; planos com adicionais; processo 01/04 | USE | preço, processo e escopo podem ser componentes de decisão interativos em vez de texto estático |
| Henrique Figueirôa · home | fundador como accountability; nichos, portfólio em slides, pacotes, processo, pessoa, FAQ, briefing | portfólio 01/04; briefing 9 passos; bônus flip; QR de continuidade | USE | formulário/funil pode ser uma experiência progressiva e memorável, não um modal genérico |
| Henrique Figueirôa · dentistas | a arquitetura muda com o nicho: urgência → localização → contato; compliance entra no FAQ | barra de ação persistente descrita; caminho de 3 toques | USE | páginas por segmento precisam mudar jornada e prioridade, não apenas copy/cores |
| FFJuris | credencial/OAB no hero; áreas jurídicas detalhadas; perfis das advogadas; perguntas de risco; contato por profissional | seleção por área e contato contextual | USE | em serviços de alta confiança, pessoa/credencial pode substituir “depoimentos” como prova principal |
| Moratta | demonstra produto antes de explicar tudo; dor real encenada → solução → UI real → recursos por job | tabs, app mockups, countdown/leilão, estados de produto | USE | mostrar “como funciona na prática” pode substituir seções abstratas de benefícios |

## 4. CLUSTER_MATRIX — famílias de experiência

A biblioteca não deve selecionar referência por segmento apenas. Deve selecionar
por **modo de decisão**.

| Cluster | Quando usar | Exemplos do corpus | Risco a evitar |
|---|---|---|---|
| `DIAGNOSTIC_LED` | visitante chega com sintoma/problema incerto | FFIX, Grupo Smart TV | virar FAQ gigante sem interação |
| `PHYSICAL_PROOF_LED` | oficina, laboratório, loja, equipe e equipamento são vantagem | Service One, FFIX, Especell | usar stock no lugar da prova real |
| `MULTI_LOCATION_LED` | unidades diferentes afetam decisão | Especell | esconder lojas num rodapé |
| `SPECIALIST_SINGLE_JOB` | serviço muito específico | Grupo Smart TV, campanhas Service One | carregar home inteira para campanha |
| `FOUNDER_LED` | confiança depende diretamente do profissional | Técnica House, Speed Cell, Henrique Figueirôa | autobiografia longa sem efeito na decisão |
| `PRODUCTIZED_SERVICE` | planos/pacotes/preço/escopo são centrais | Profitize, Speed Cell | cards de preço sem seleção/contexto |
| `PROFESSION_RISK_LED` | confiança, credencial e regra profissional dominam | FFJuris, dentistas | prova social fabricada ou claims agressivos |
| `PRODUCT_DEMO_LED` | valor só fica claro vendo o produto/fluxo | Moratta | explicar recurso sem demonstrar estado real |
| `MULTI_OFFER_ECOSYSTEM` | negócio tem ofertas realmente diferentes | Service One, FFIX | seção “serviços” genérica com oito cards iguais |

## 5. INTERACTION_SIGNATURE_MATRIX

Interação só entra se resolver uma decisão real.

| Job | Padrão observado no corpus | Candidato 0WEB | Skills/capacidades |
|---|---|---|---|
| descobrir provável serviço | diagnóstico/sintoma | symptom triage com carryover para funil | art-direction + CRO + funnel + analytics + a11y |
| escolher unidade | rede de lojas | location selector/nearest-unit path | local SEO + entity enrichment + location UX |
| configurar proposta | orçamento/planos/adicionais | configurador de escopo/preço quando factual | CRO + form state + freshness + commerce |
| escolher caminho | CPF/PJ, marca, tipo de aparelho | self-segmentation curta | UX + conversion + accessible controls |
| entender produto | UI demonstrada | interactive product demo / before-state→after-state | product storytelling + frontend + performance |
| reduzir risco | repair-vs-replace, upgrade-vs-new | decision aid/comparison | research intelligence + truth + content |
| continuar conversa | briefing multi-step/QR | funnel progressivo com resumo/carryover | funnel + privacy + analytics |

## 6. MOTION_EVIDENCE_MATRIX

Campos obrigatórios para referências futuras:

`source | observationMode | interactionObserved | motionObserved |
derivedMotionCandidate | narrativeJob | implementationPrimitive |
reducedMotionFallback | confidence`

### Regra

- crawl/HTML pode confirmar interação e estado;
- não pode confirmar easing, duração, parallax ou coreografia visual;
- `motionObserved` fica `NOT_VERIFIED` até browser/render;
- `derivedMotionCandidate` é inspiração 0WEB, não alegação sobre a referência.

### Candidatos derivados desta R1

- diagnóstico técnico → `scan-line / staged reveal / progress-state`;
- laboratório/microscopia → `focus reveal / macro crop transition`;
- rede de lojas → `route/map focus / location handoff`;
- processo 01/04 → `progress-line / chapter snap`;
- product demo → `state transition / device frame reveal`;
- portfólio horizontal → `horizontal rail / masked slide`;
- founder-led → `portrait-to-proof reveal`;
- plano/configurador → `selection emphasis / price recalculation transition`.

Implementar com primitives locais e `motion/react` quando necessário; não
instalar GSAP/AOS/Three.js só porque uma referência usa ou parece usar.

## 7. MEDIA_ROLE_MATRIX ampliada

A R1 adiciona papéis mais específicos:

- `CRAFT_MACRO` — microscópio, bancada, detalhe técnico;
- `PLACE_CONFIRMATION` — fachada/loja/endereço como prova de presença;
- `NETWORK_LOCATION` — unidade específica com horário/rota;
- `PRODUCT_UI` — tela real do produto/sistema;
- `FOUNDER_ACCOUNTABILITY` — pessoa que executa/assina o serviço;
- `LOGISTICS_PROOF` — veículo, retirada, entrega, rota;
- `OFFER_CONFIGURATION` — visual de plano, pacote, opções;
- `RISK_EXPLANATION` — mídia/diagrama que esclarece decisão;
- `SOCIAL_SOURCE_PROOF` — avaliação somente quando fonte/proveniência existe.

## 8. Anti-padrões encontrados e oficialmente rejeitados

A biblioteca também aprende com o que **não** deve ser copiado.

- contadores que aparecem como `0` no conteúdo público/crawler;
- “centenas de clientes”, ratings ou depoimentos sem provenance verificável;
- depoimentos com nomes genéricos usados como decoração;
- prazo/preço/estoque muito específico sem freshness;
- longa sequência `service cards → benefits cards → testimonials → FAQ` sem
  mudança perceptiva;
- domínio/brand naming que não coincide com o conteúdo real sem resolução de
  entidade;
- CTA direto como única interação quando o visitante precisa de diagnóstico;
- motion ornamental repetido em toda seção;
- slider/carrossel usado só para esconder excesso de cards.

Esses sinais entram como `REJECT`, mesmo quando o site visualmente parece bom.

## 9. REFERENCE_SELECTION_MATRIX — como escolher referências para um cliente

Antes do creative brief, pontuar qualitativamente:

`offerMode | decisionVelocity | decisionRisk | physicalProofStrength |
mediaSupply | locationComplexity | catalogComplexity | humanTrustNeed |
diagnosticNeed | priceTransparency | recurringOffer | b2bNeed |
productDemoNeed`

Selecionar **2 a 4 referências complementares**, nunca uma única referência para
copiar.

Exemplo:

- assistência pequena com técnico conhecido + busca/entrega + sem estoque:
  `FOUNDER_LED + DIAGNOSTIC_LED + LOGISTICS_PROOF`;
- rede de assistência com várias unidades:
  `MULTI_LOCATION_LED + PHYSICAL_PROOF_LED + DIAGNOSTIC_LED`;
- oficina com plano de manutenção:
  `SPECIALIST_SINGLE_JOB + PRODUCTIZED_SERVICE + PHYSICAL_PROOF_LED`.

## 10. Skill translation

Ao selecionar padrões deste corpus, o agente deve montar skill stack específico:

- composição/silhueta → `0web-portfolio-art-direction` + layout engineering;
- prova física → entity enrichment + public media ingestion + provenance;
- diagnóstico/comparison → research intelligence + CRO + funnel carryover;
- planos/preço → truth/freshness + commerce/form state;
- multi-location → local SEO + entity/location research;
- product demo → interaction/frontend + performance;
- motion → experience-design-max + motion + reduced-motion;
- founder/credencial → content/proof strategy sem inventar social proof;
- QA → UI quality gates + browser + mobile + a11y + performance.

## 11. Resultado desta micro-rodada

Esta R1 amplia o repertório sem criar novo skeleton.

Nova regra operacional:

> **A landing começa escolhendo um modo de decisão e uma combinação de
> gramáticas; nunca escolhendo “qual template de assistência / advogado /
> dentista usar”.**

As próximas rodadas devem ampliar este corpus com:

- assistência/refrigeração/eletrônica restantes;
- oficinas/automotivo;
- plataformas de landing pages e galerias editoriais;
- diretórios/local marketplaces;
- artigos de referência (RD Station, HubSpot, Wix, Unbounce, Hotmart etc.) como
  fonte de princípios, não como prova visual de um cliente.

## 11. Normalização machine-readable de experience engines — 2026-09-24

A introdução posterior da `EXPERIENCE_ENGINE_MATRIX` no R2 deixou as fontes
originais deste ledger com clusters/sinais ricos, mas sem `experienceEngine`
explícito na biblioteca JSON. A tabela abaixo normaliza esse gap sem alterar a
evidência original e sem criar motores novos.

A ordem é `primary → counterpoint`. O mapeamento é por **modo de decisão
observado**, nunca pelo segmento.

| Fonte | Primary engine | Counterpoint | Evidência decisiva do R1 |
|---|---|---|---|
| FFIX | PROBLEM_TO_DIAGNOSIS | CRAFT_AND_PHYSICAL_PROOF | sintoma/diagnóstico + oficina/prova física |
| Especell | LOCATION_AND_NETWORK | CRAFT_AND_PHYSICAL_PROOF | rede de unidades + presença física |
| Service One | PRODUCT_OR_SERVICE_FINDER | CRAFT_AND_PHYSICAL_PROOF | ofertas/mundos distintos + laboratório/fachada |
| Grupo Smart TV | PROBLEM_TO_DIAGNOSIS | CRAFT_AND_PHYSICAL_PROOF | problema específico + laboratório/logística |
| Link Informática | PRODUCT_OR_SERVICE_FINDER | CRAFT_AND_PHYSICAL_PROOF | navegação por categoria/aparelho + credenciais técnicas |
| Speed Cell | FOUNDER_OR_SPECIALIST_TRUST | PLAN_OR_SCOPE_CONFIGURATION | técnico individual + planos recorrentes |
| Técnica House | FOUNDER_OR_SPECIALIST_TRUST | PRODUCT_OR_SERVICE_FINDER | founder-story + manutenção/venda/B2B |
| Profitize | PLAN_OR_SCOPE_CONFIGURATION | FOUNDER_OR_SPECIALIST_TRUST | preço/add-ons/configuração + FAQ fundador |
| Henrique Figueirôa · home | FOUNDER_OR_SPECIALIST_TRUST | PLAN_OR_SCOPE_CONFIGURATION | accountability pessoal + pacotes/briefing |
| Henrique Figueirôa · dentistas | URGENT_FAST_PATH | EDUCATION_AND_RISK_REDUCTION | caminho curto de decisão + compliance/FAQ |
| FFJuris | FOUNDER_OR_SPECIALIST_TRUST | EDUCATION_AND_RISK_REDUCTION | credencial/pessoa + dúvidas de risco |
| Moratta | EDUCATION_AND_RISK_REDUCTION | PROCESS_AND_TRANSPARENCY | UI real demonstra valor + estados/workflow do produto |

Regras da normalização:

- máximo de dois engines fortes por fonte;
- `REJECT` pode ficar sem engine;
- fonte marcada como evidência insuficiente pode ficar sem engine;
- não promover cluster a engine automaticamente;
- não criar interaction signature só porque há uma interação superficial;
- motion continua `NOT_VERIFIED` quando não houve inspeção visual/browser.

Essa normalização existe para que a seleção automática consiga usar as primeiras
fontes do corpus com a mesma precisão machine-readable das rodadas posteriores.

