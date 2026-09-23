# 0WEB — Reference Corpus R2 · automotivo, refrigeração e landing systems

Status: **research ledger oficial / aditivo**  
Data: **2026-09-23**  
Escopo: segunda micro-rodada do corpus de referências para novas `/portfolio/:slug`.

Este documento amplia o R1. Não cria template, skeleton ou família visual fixa.

Princípio:

> **SELECIONAR MOTOR DE EXPERIÊNCIA POR DECISÃO, NÃO POR SEGMENTO.**

## 1. Fontes desta micro-rodada

Auditadas por crawl público/HTML navegável:

1. https://www.4irefrigeracao.com.br/
2. https://proautoservice.com.br/
3. https://centroautomotivofera.com.br/
4. https://impactoprime.com.br/
5. https://www.azmotorsoficina.com.br/
6. https://www.rdstation.com/blog/marketing/exemplos-de-landing-pages/
7. https://unbounce.com/landing-page-examples/best-landing-page-examples/
8. https://www.hostinger.com/br/criador-de-sites-com-ia

Tentativas sem evidência suficiente nesta rodada:
- https://mecanicabeto.com.br/ — fetch indisponível;
- https://lp.centroautomotivofera.com.br/ — cache/fetch indisponível;
- https://flamepages.com/pt — fetch indisponível.

## 2. Limite de evidência

A R2 confirma estrutura textual, navegação, formulários, seletores, taxonomias,
ofertas e papéis de mídia expostos no HTML.

Não afirmar easing, parallax, sticky choreography, stagger, clip reveal,
transições ou microanimações como observadas sem browser/render visual.
Qualquer motion abaixo é `DERIVED_MOTION_CANDIDATE`.

## 3. REFERENCE_SIGNAL_MATRIX — R2

| Fonte | Motor observado | Sinal estrutural | Decisão/Interação | Tradução 0WEB | Classe |
|---|---|---|---|---|---|
| 4I Refrigeração | autorização + amplitude técnica | hero direto → autorização → marcas → catálogo técnico extenso | agendamento/contato por necessidade | quando autorização e capacidade técnica são centrais, credencial e taxonomia podem dominar; não precisa copiar sequência | ADAPT |
| Pro Auto | agendamento + especialização | proposta + formulário cedo → serviços → especialidades técnicas → história/equipe | formulário de agendamento antes da exploração completa | intenção quente pode pedir conversão precoce; especialidade deve decidir o conteúdo que aparece depois | ADAPT |
| Fera Auto Center | localidade + catálogo de manutenção | localização/horário cedo → serviços organizados por sistemas do carro → garantia/rapidez | navegação por necessidade automotiva | para negócio local amplo, localidade e mapa mental dos serviços podem ser o primeiro filtro | USE |
| Impacto Prime | finder + rede | loja mais próxima → benefícios operacionais → seletor de pneu em 5 passos → rede → conteúdo/franquia | product finder e location finder | quando compatibilidade importa, finder é arquitetura principal; rede física vira função, não rodapé | USE |
| AZ Motors | especialista + transparência de processo | problema de alto risco → serviços foco → especialização → vídeos/relato do processo → estrutura física | CTA especialista repetido contextualmente | serviço técnico de alto risco pode ser `SPECIALIST_TRUST + PROCESS_TRANSPARENCY`, sem grid genérico de benefícios | USE |
| RD Station examples | conversão por intenção | tipo/profundidade da LP varia conforme oferta, estágio e ação | formulário proporcional ao objetivo | conteúdo e fricção do formulário dependem do job e estágio; não existe anatomia universal | USE |
| Unbounce examples | mecanismo dominante | exemplos valorizam formulário curto, pessoas vs produto, jump links e estatística quando material | cada página enfatiza o elemento que move aquela decisão | escolher um mecanismo dominante é mais útil que empilhar todas as boas práticas | USE |
| Hostinger AI Builder | productized platform | promessa clara → classes de uso → planos → comparação extensa de capacidades | escolha de plano e comparação | produto complexo pode ser guiado por escolha/configuração, mas não transplantar pricing tables para serviço local sem razão | ADAPT |

## 4. EXPERIENCE_ENGINE_MATRIX

A nova landing deve declarar um motor principal. O motor é a lógica que organiza
a experiência e dá peso desigual aos capítulos.

Campos:

`primaryEngine | counterpointEngine | visitorJob | decisiveUncertainty |
evidence | compositionConsequence | mediaAnchor | interactionLocus |
motionCandidate | mobileExpression | rejectedEngines | reason`

### Motores disponíveis no corpus

- `PROBLEM_TO_DIAGNOSIS` — sintoma/incerteza guia a página;
- `CRAFT_AND_PHYSICAL_PROOF` — laboratório, oficina, equipe, equipamento ou execução real sustentam confiança;
- `LOCATION_AND_NETWORK` — unidade, cobertura, rota ou logística definem viabilidade;
- `PRODUCT_OR_SERVICE_FINDER` — seleção/compatibilidade precede persuasão;
- `PROCESS_AND_TRANSPARENCY` — orçamento, etapas, acompanhamento e limites reduzem risco;
- `PLAN_OR_SCOPE_CONFIGURATION` — preço/pacote/opções são parte da decisão;
- `FOUNDER_OR_SPECIALIST_TRUST` — confiança depende da pessoa/especialista;
- `INVENTORY_OR_PRODUCT_BROWSING` — catálogo/estoque conduz a jornada;
- `URGENT_FAST_PATH` — intenção quente pede caminho curto até ação;
- `EDUCATION_AND_RISK_REDUCTION` — decisão exige entendimento antes de CTA.

Esses motores são **gramáticas**, não templates.

## 5. Regra PRIMARY + COUNTERPOINT

Para novos projetos:

1. escolher **um** `primaryEngine`;
2. escolher no máximo **um** `counterpointEngine` forte quando ele realmente
   melhora a decisão;
3. outros recursos entram como capacidades subordinadas, não como motores com o
   mesmo peso;
4. o motor precisa mudar composição, mídia, interação e ordem narrativa;
5. não escolher motor apenas porque o segmento é “assistência”, “oficina”,
   “advogado” etc.

Exemplos:

- oficina especializada em câmbio:
  `FOUNDER_OR_SPECIALIST_TRUST + PROCESS_AND_TRANSPARENCY`;
- rede nacional de pneus:
  `PRODUCT_OR_SERVICE_FINDER + LOCATION_AND_NETWORK`;
- assistência com laboratório forte:
  `CRAFT_AND_PHYSICAL_PROOF + PROBLEM_TO_DIAGNOSIS`;
- campanha de reparo específico:
  `URGENT_FAST_PATH + PROBLEM_TO_DIAGNOSIS`.

## 6. Falhas que esta matriz evita

### ENGINELESS_COMPLETE_SITE

Página tenta conter tudo — hero, serviços, benefícios, números, processo,
depoimentos, FAQ, galeria, CTA — mas nenhum elemento governa a experiência.

### ENGINE_STACKING

Três ou mais motores competem com o mesmo peso, produzindo landing longa,
genérica e sem assinatura.

### SEGMENT_ENGINE_DEFAULT

Motor escolhido por rótulo do negócio, sem evidência da decisão real daquele
cliente.

### ENGINE_DECORATIVE_ONLY

Brief declara um motor, mas a página final continua com a mesma seção-order,
grid, CTA e media cadence de um vizinho.

## 7. Motion candidates derivados — não observados

- `PROBLEM_TO_DIAGNOSIS` → progress/scan/reveal por estado;
- `PRODUCT_OR_SERVICE_FINDER` → transição de seleção e confirmação;
- `LOCATION_AND_NETWORK` → foco de unidade/rota;
- `PROCESS_AND_TRANSPARENCY` → progress-line/step state;
- `CRAFT_AND_PHYSICAL_PROOF` → macro/focus reveal;
- `PLAN_OR_SCOPE_CONFIGURATION` → state/price recalculation;
- `URGENT_FAST_PATH` → motion mínimo, rápido e funcional.

Todos exigem reduced-motion e justificativa de performance.

## 8. Lições negativas

Não absorver:

- depoimentos ou métricas sem provenance;
- contadores que renderizam zero como “prova”;
- claims absolutos de confiança/qualidade sem fonte;
- grid de serviços como única arquitetura;
- formulário cedo quando o visitante ainda não sabe o que selecionar;
- pricing/plans só porque a referência usa;
- menu/taxonomia gigantes sem priorização;
- repetição de CTA direto quando um finder/diagnóstico resolveria melhor a dúvida.

## 9. Próxima R3 sugerida

Próxima micro-rodada deve cobrir:
- iRepair, Bryytech, Eletrônica Fast, AiconBR, Infocase e demais tecnologia;
- diretórios/marketplaces locais;
- HubSpot, Wix, Hotmart e EAD Plataforma;
- evidência visual de motion quando browser/render estiver disponível.

A R3 deve adicionar sinais somente quando trouxer uma gramática nova; não aumentar
o corpus por quantidade.
