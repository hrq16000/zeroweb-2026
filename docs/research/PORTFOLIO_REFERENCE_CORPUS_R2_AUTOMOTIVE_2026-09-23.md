# 0WEB — Reference Corpus R2 · automotivo, oficina e decisão técnica

Status: **research ledger oficial / aditivo**  
Data: **2026-09-23**  
Escopo: ampliar a biblioteca de referências para novas `/portfolio/:slug` sem criar um template de oficina.

Este documento soma ao R1 e preserva a regra:

> **ABSORB GRAMMAR — NEVER COPY SILHOUETTE.**

## 1. Fontes auditadas nesta rodada

1. https://mecanicabeto.com.br/
2. https://mecanicabeto.com.br/agendamento/
3. https://mecanicabeto.com.br/gnv/
4. https://mecanicabeto.com.br/adaptacoes-veiculares/
5. https://impactoprime.com.br/
6. https://impactoprime.com.br/espaco-mulher
7. https://www.azmotorsoficina.com.br/
8. https://proautoservice.com.br/
9. https://centroautomotivofera.com.br/
10. https://lp.centroautomotivofera.com.br/ — `ATTEMPTED_BLOCKED` na coleta pública desta rodada.

A LP da Fera não foi inferida a partir do domínio. Sem conteúdo acessível, nenhum
padrão visual ou estrutural foi atribuído a ela.

## 2. O que esta família acrescenta ao repertório

Os sites automotivos mostram que “oficina” não é um único tipo de landing.
Existem pelo menos sete modos de decisão diferentes:

- selecionar produto compatível com o veículo;
- agendar uma inspeção/check-up;
- decidir se uma conversão/adaptação compensa;
- escolher uma linha de adaptação por necessidade;
- confiar em especialista de um único sistema;
- acompanhar/documentar o que está sendo feito;
- escolher loja/unidade e modalidade de atendimento.

Logo, um novo portfolio automotivo não pode nascer de:

`hero com carro → 6 cards de serviço → diferenciais → depoimentos → mapa → CTA`.

## 3. AUTOMOTIVE_DECISION_MATRIX

| Fonte/rota | Job real do visitante | Estrutura observada | Princípio transferível | Classe |
|---|---|---|---|---|
| Mecânica Beto · home | escolher entre mecânica, GNV, adaptação PCD e check-up | home multioferta com rotas especializadas e autoridade histórica | quando ofertas têm decisões diferentes, separar journeys antes de detalhar serviços | USE |
| Mecânica Beto · check-up | garantir segurança antes de autorizar reparo | agendamento → itens inspecionados → acompanhamento → relatório → autorização posterior | inspeção pode ser produto próprio; relatório e autorização são parte da experiência | USE |
| Mecânica Beto · GNV | saber se vale converter e qual solução escolher | autoridade → calculadora de economia → manutenção/conversão/Tetrafuel | ROI/economia pode virar decision aid, não copy persuasiva abstrata | USE |
| Mecânica Beto · PCD | escolher adaptação adequada à necessidade | entrada por Linha Direção ou Linha Transporte | acessibilidade pede auto-segmentação por necessidade funcional, não por card genérico | USE |
| Impacto Prime | encontrar produto compatível e loja | garantias/rede → seletor de pneu em 5 passos → marcas → loja mais próxima → segmentos | compatibilidade técnica deve ser configurável quando o catálogo depende do veículo | USE |
| Impacto Prime · Espaço Mulher | receber atendimento adequado ao contexto | proposta específica → explicação detalhada → agendamento → loja próxima → seletor | uma audiência com barreira real pode ganhar jornada própria sem duplicar todo o site | ADAPT |
| AZ Motors | confiar em especialista de câmbio | especialidade no hero → serviços foco → transparência/documentação → estrutura física | especialização estreita permite reduzir catálogo e aumentar prova de processo/ofício | USE |
| Pro Auto | agendar atendimento em oficina ampla | formulário muito cedo + catálogo amplo + serviços + clientes/logos + formulário final | captura antecipada pode funcionar em tráfego quente, mas precisa contexto e não duplicação | ADAPT |
| Fera Auto Center | entender cobertura local e variedade | localização/horário cedo → catálogo profundo → garantia/processo → história → reviews Google | localização + catálogo podem liderar quando a escolha é “resolve meu problema perto de mim?” | USE |

## 4. Novos clusters oficiais

### `VEHICLE_CONFIGURATOR_LED`

Use quando compatibilidade depende de marca/modelo/ano/versão/medida ou outro
atributo do veículo.

Exemplo de gramática:

`vehicle identity → compatible option → constraint/availability → next action`.

Não transformar em formulário longo se dois ou três atributos bastarem.

### `INSPECTION_REPORT_LED`

Use quando o valor comercial começa por diagnóstico/check-up e o cliente precisa
entender o estado antes de aprovar execução.

Possíveis componentes:

- checklist visual;
- etapas do diagnóstico;
- evidência/foto/vídeo real;
- resumo do laudo;
- autorização posterior;
- carryover dos achados para o funil.

### `PROCESS_TRANSPARENCY_LED`

Use quando “não quero caixa-preta” é uma objeção relevante.

A prova pode ser:

- registro fotográfico;
- vídeo do serviço;
- status por etapa;
- orçamento antes de execução;
- peça/tarefa identificada;
- histórico de autorização.

A transparência precisa ser operacional, não apenas a palavra “transparência”.

### `CALCULATOR_DECISION_LED`

Use quando uma conta real muda a decisão: economia, custo-benefício, quantidade,
dimensionamento ou viabilidade.

Requisitos:

- fórmula explicável;
- inputs mínimos;
- resultado não apresentado como garantia;
- freshness para preços/tarifas variáveis;
- fallback se dado atual não estiver disponível.

### `APPOINTMENT_LED`

Use quando horário/reserva é parte do valor: check-up, inspeção, serviço rápido,
atendimento prioritário.

A página pode ter narrativa:

`por que agendar → o que acontece → duração/escopo factual → escolha de horário → preparação`.

### `AUDIENCE_CONTEXT_LED`

Use somente quando um público enfrenta barreira/necessidade material diferente,
não para criar segmentação decorativa.

Exemplos da rodada:

- PCD/adaptação funcional;
- consultoria especializada para público feminino;
- B2B/frota/empresa.

### `COMMERCE_SERVICE_HYBRID`

Use quando a empresa realmente combina produto compatível + instalação/serviço,
como pneu/peça/equipamento + oficina.

A jornada pode começar no produto ou no problema; não forçar ambos ao mesmo
skeleton.

### `LEGACY_AUTHORITY_LED`

Use quando tempo de atuação é verificável e explica confiança, método, acervo ou
especialização.

Tempo de mercado sozinho não substitui prova. A composição deve mostrar o que a
experiência acumulada muda para o cliente.

## 5. Novos papéis de mídia/prova

### `PROCESS_DOCUMENTATION`

Foto/vídeo/registro real da execução usado para tornar a prestação auditável.

### `INSPECTION_EVIDENCE`

Mídia ou dados associados a um item verificado no diagnóstico.

### `VEHICLE_FITMENT_CONTEXT`

Visual que ajuda a confirmar aplicação/compatibilidade sem fingir estoque atual.

### `ACCESSIBILITY_USE_CASE`

Mídia real ou diagrama explicando uma necessidade funcional e a solução
correspondente.

### `VERIFIED_REVIEW_SOURCE`

Prova social só recebe este papel quando há origem observável: Google, provider
autorizado ou provenance equivalente. O corpus R2 encontrou exemplos com
Trustindex apontando explicitamente para Google.

### `PHYSICAL_WORKSHOP_PROOF`

Fachada, box, bancada, elevador, ferramental ou ambiente real quando isso prova
capacidade/localidade.

## 6. Interações adicionadas à palette

- seletor marca/modelo/ano/medida;
- agendamento/check-up;
- calculadora de economia/viabilidade;
- escolha de linha por necessidade funcional;
- checklist/relatório progressivo;
- approval step após diagnóstico;
- unidade mais próxima;
- caminho B2C/B2B/frota;
- produto + instalação/serviço.

Cada interação deve carregar contexto para o funil; não pedir ao usuário para
repetir o que acabou de selecionar.

## 7. Motion candidates derivados — não alegações sobre os sites

Como no R1, HTML/crawl não prova coreografia visual.

Candidatos 0WEB:

- `vehicle-fitment-progress` — progressão clara entre atributos do veículo;
- `inspection-check-reveal` — item validado entrando no relatório;
- `diagnostic-evidence-drawer` — evidência técnica revelada sob demanda;
- `work-order-timeline` — mudança de estado do serviço;
- `route-to-nearest-unit` — foco progressivo em localidade;
- `before-authorization-lock` — diferencia visualmente diagnóstico de execução;
- `calculator-result-transition` — feedback do cálculo sem teatralidade;
- `craft-detail-focus` — aproximação de detalhe técnico real.

Todos exigem `prefers-reduced-motion` e alternativa sem animação.

## 8. Anti-padrões encontrados e rejeitados

### `DUPLICATED_CONVERSION_FORM`

O mesmo formulário aparece repetido sem nova informação/estado. Rejeitar; usar
CTA contextual ou preservar estado do primeiro formulário.

### `UNVERIFIED_VOLUME_CLAIM`

“Mais de X carros/clientes” sem fonte/provenance não entra como prova.

### `UNVERIFIED_CLIENT_LOGO_WALL`

Logos de clientes/órgãos públicos precisam de evidência e direito de uso antes
de virar prova.

### `ZERO_STATE_COUNTER_AS_PROOF`

Contadores que renderizam `0` ou `+0` são falha, não efeito visual.

### `FLAT_SERVICE_CATALOG`

Dezenas de serviços com a mesma card family criam catálogo pesado e indistinto.
Agrupar por problema, sistema, decisão ou prioridade.

### `CLAIMED_TRANSPARENCY_WITHOUT_MECHANISM`

Escrever “transparência” sem mostrar diagnóstico, orçamento, documentação,
autorização ou acompanhamento não conta como proof strategy.

### `UNSOURCED_RATING`

Nota numérica (ex.: 5.0) sem fonte ligada ao claim não é aceita.

### `FRESHNESSLESS_PROMOTION`

Preço/promoção “a partir de” ou condição mensal precisa de fonte, data,
`staleAfter` e fallback. Sites de rede mostram por que promoções variáveis
não podem ser copiadas como conteúdo permanente.

## 9. Matriz de escolha para futuros portfolios automotivos

Antes de layout, responder:

`vehicleCompatibilityNeeded | inspectionBeforeQuote | appointmentValue |
processTransparencyNeed | physicalWorkshopStrength | multiLocation |
productPlusService | accessibilityNeed | b2bFleetNeed | calculatorPotential |
verifiedLegacyAuthority | verifiedReviewSource`

Exemplos:

- oficina especialista em câmbio:
  `SPECIALIST_SINGLE_JOB + PROCESS_TRANSPARENCY_LED + PHYSICAL_PROOF_LED`;
- centro de pneus:
  `VEHICLE_CONFIGURATOR_LED + COMMERCE_SERVICE_HYBRID + MULTI_LOCATION_LED`;
- check-up preventivo:
  `INSPECTION_REPORT_LED + APPOINTMENT_LED + PROCESS_TRANSPARENCY_LED`;
- adaptação PCD:
  `AUDIENCE_CONTEXT_LED + DIAGNOSTIC_LED + PHYSICAL_PROOF_LED`.

## 10. Skill translation R2

- configurador por veículo → form/state + domain modeling + funnel carryover +
  accessibility + analytics;
- check-up/laudo → research intelligence + structured content + evidence +
  privacy;
- calculadora → domain logic + truth/freshness + testing;
- transparência processual → media provenance + status/timeline UX;
- multi-location → entity enrichment + local SEO + location UX;
- público PCD → accessibility-first UX + factual scope;
- produto + serviço → commerce + service funnel + inventory freshness;
- prova de oficina → public media ingestion + physical brand coherence.

## 11. Resultado da micro-rodada

O corpus automotivo adiciona **novos mecanismos de decisão**, não “layouts de
oficina”.

Regra resultante:

> Quando o negócio possui uma operação que pode ser selecionada, calculada,
> agendada, inspecionada ou acompanhada, a landing deve avaliar transformar essa
> operação em experiência — antes de recorrer a mais cards, badges ou
> depoimentos.
