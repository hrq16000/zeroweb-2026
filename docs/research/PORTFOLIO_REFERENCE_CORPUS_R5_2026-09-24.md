# 0WEB — Reference Corpus R5 · avaliação → autorização explícita

Status: **research ledger oficial / aditivo**  
Data: **2026-09-24**  
Escopo: micro-rodada de referências para novas `/portfolio/:slug`.

Esta rodada não cria experience engine novo. Ela adiciona uma única interaction
signature quando a avaliação/diagnóstico precisa ser separada da autorização
para executar trabalho pago.

Princípio:

> **AVALIAR NÃO SIGNIFICA AUTORIZAR A EXECUÇÃO.**

## 1. Fontes inspecionadas

### Com evidência suficiente e gramática nova

1. https://mecanicabeto.com.br/agendamento/

### Não resolvida com segurança

2. https://lp.centroautomotivofera.com.br/

A LP específica continua sem crawl confiável nesta rodada. O domínio principal
`centroautomotivofera.com.br` já é conhecido, mas **não substitui** a URL da LP
como evidência. Estado: `UNRESOLVED_CURRENT_CRAWL`.

### Meta-referências — confirmam regras existentes, sem nova entrada na library

3. https://www.rdstation.com/blog/materiais-educativos/ebooks/exemplos-de-landing-pages/
4. https://br.hubspot.com/blog/marketing/exemplos-landing-page
5. https://pt.wix.com/blog/exemplos-de-landing-pages
6. https://www.edialog.com.br/exemplos-de-landing-page/

Essas quatro fontes reforçam princípios já canônicos no
`PORTFOLIO_LANDING_RESEARCH_INTELLIGENCE_STANDARD.md`: oferta/conversão
singular, fricção de formulário proporcional à intenção, preview factual,
message match, CTA coerente, mobile, prova adequada ao risco e continuidade
pós-conversão. Não criar novos nomes para regras já existentes.

## 2. Nova interaction signature

### ASSESSMENT_TO_AUTHORIZATION

Pergunta dominante:

> **O que acontece depois da avaliação e em que momento o cliente autoriza a execução?**

Aplicável quando o negócio opera em dois compromissos distintos:

1. avaliação, inspeção, diagnóstico ou check-up;
2. execução de reparo/serviço pago somente após achados, orçamento e aprovação.

Fluxo conceitual possível:

`REQUEST_ASSESSMENT → ELIGIBILITY/SCOPE → ASSESSMENT → FINDINGS/REPORT → QUOTE → EXPLICIT_APPROVAL → EXECUTION`

A assinatura não obriga um stepper visual nem formulário adicional. Ela existe
para impedir que uma CTA de diagnóstico pareça autorização automática de
reparo.

Requisitos:

- a avaliação precisa existir de verdade;
- o que é e o que não é executado nessa etapa deve ficar claro;
- achados/relatório/orçamento só podem ser prometidos quando operacionais;
- aprovação precisa ser uma mudança real de estado;
- preço, prazo e peças variáveis continuam sujeitos a freshness;
- contexto já coletado deve seguir para o funil/handoff;
- em mobile a fronteira “avaliar” versus “autorizar executar” precisa permanecer legível;
- motion é opcional e, se usado, deve apenas comunicar mudança de estado, com
  `prefers-reduced-motion`.

## 3. Evidência — Mecânica Beto

A página de check-up apresenta:

- agendamento de uma avaliação de 30 itens;
- acompanhamento do check-up;
- entrega de relatório/listagem das necessidades encontradas;
- declaração explícita de que o check-up não executa reparos;
- geração posterior de orçamento quando há necessidade;
- execução condicionada à autorização prévia do cliente;
- limites de elegibilidade do check-up.

### REFERENCE_SIGNAL_MATRIX — R5

| Fonte | Sinal útil | Assinatura | Tradução 0WEB | Classe |
|---|---|---|---|---|
| Mecânica Beto | check-up → achados/relatório → orçamento → autorização → execução | ASSESSMENT_TO_AUTHORIZATION | separar compromisso de diagnóstico do compromisso de executar; deixar escopo e limite antes da conversão | USE |
| LP Fera específica | URL não resolvida | — | não usar o domínio principal como substituto da LP | REJECT |
| RD Station | profundidade e formulário seguem oferta/estágio; thank-you pode conduzir próximo passo | — | já coberto por decision profile, form friction e post-conversion | ADAPT |
| HubSpot | preview/prova deve combinar com o tipo de oferta; medir abandono/CTA/mobile | — | já coberto por deliverable preview, proof strategy e measurement plan | ADAPT |
| Wix | continuidade entre anúncio e landing; redução de atrito; formulário conciso | — | já coberto por message match, source continuity e field purpose | ADAPT |
| E-Dialog | objetivo da LP determina estrutura e profundidade do formulário | — | já coberto por conversion goal + form friction | ADAPT |

## 4. Relação com os experience engines

`ASSESSMENT_TO_AUTHORIZATION` não é engine.

Combina principalmente com:

- `PROBLEM_TO_DIAGNOSIS`;
- `PROCESS_AND_TRANSPARENCY`;
- `EDUCATION_AND_RISK_REDUCTION`.

O engine governa a página; a assinatura deixa explícito o ponto em que avaliação
vira decisão de execução.

## 5. Composição e mídia

Possíveis traduções, sem template obrigatório:

- findings/report como artefato de decisão;
- escopo da avaliação ao lado do CTA;
- “inclui / não inclui” antes do funil;
- processo visual com fronteira clara antes da execução;
- prova de oficina/técnico junto da etapa de avaliação;
- FAQ contextual no ponto em que surge a dúvida “vão consertar sem me consultar?”.

Não exigir cards, timeline ou stepper. A forma depende do cliente.

## 6. Motion

`motionObserved = NOT_VERIFIED` para esta rodada.

Candidato próprio 0WEB, quando fizer sentido:

`DERIVED_MOTION_CANDIDATE: assessment_state → findings → approval_state`

Deve usar transição discreta de estado e ter fallback sem movimento.

## 7. Anti-padrões

- CTA de “diagnóstico” que implicitamente autoriza serviço pago;
- esconder que a avaliação não inclui reparo;
- preço/peças/prazo inventados antes da avaliação;
- aprovação pré-marcada ou presumida;
- repetir dados já coletados no funil;
- trocar a LP não resolvida da Fera pelo site principal e atribuir a ela sinais
  que não foram observados na URL original.

## 8. Resultado da micro-rodada

Delta real do corpus:

- **+1 interaction signature:** `ASSESSMENT_TO_AUTHORIZATION`;
- **+1 fonte comercial resolvida:** Mecânica Beto;
- **0 novos experience engines**;
- **0 motion observado**;
- **4 meta-referências sem expansão**, porque apenas confirmam regras existentes;
- **1 URL mantida como não resolvida**, sem substituição.

A regra continua:

> **ABSORB GRAMMAR — NEVER COPY SILHOUETTE.**
