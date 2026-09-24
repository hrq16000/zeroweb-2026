# 0WEB — Reference Corpus R9 · consolidação final

Status: **final consolidation audit**  
Data: **2026-09-24**  
Escopo: fechamento da frente de referências → matrizes → diretrizes anti-template.

Princípio preservado:

> **ABSORB GRAMMAR — NEVER COPY SILHOUETTE.**

## 1. R8 — varredura editorial residual

A R8 foi deliberadamente **research-only** e não gerou PR/taxonomia nova.

Fontes revisadas:
- https://hotmart.com/pt-br/blog/exemplos-de-landing-pages
- https://hotmart.com/pt-br/blog/o-que-e-landing-page
- https://eadplataforma.com/blog/tipos-de-landing-page/
- referências editoriais já vistas em RD Station, HubSpot, Wix e E-Dialog.

Resultado:
- objetivo/conversão singular já coberto;
- tipos de landing/pageMode já cobertos;
- fricção de formulário já coberta;
- thank-you/post-conversion já coberto;
- preview/demonstração de valor já coberto;
- simulador/calculadora/preview antes de cadastro já cobertos por
  `DECISION_AID_GATE`, `valueDemonstration[]` e capability palette;
- mobile, prova e mensuração já cobertos.

**Delta taxonômico da R8: zero.**

Não criar engine, signature ou matrix quando a fonte apenas renomeia mecanismo
já existente.

## 2. Auditoria estrutural R9

Estado auditado após R7:

- 38 fontes no pattern library;
- 10 clusters canônicos;
- 10 experience engines;
- 8 interaction signatures;
- 7 research ledgers canônicos;
- 0 URLs duplicadas;
- 0 labels duplicadas;
- 0 experience engines desconhecidos;
- 0 interaction signatures desconhecidas;
- ledgers sincronizados entre library e policy.

### Inconsistências encontradas

Duas referências R7 usavam clusters não declarados:

- `LOCATION_LED`
- `LOCAL_SERVICE_LED`

Correção:
- Fisioterapeutas: remover `LOCATION_LED`; a dimensão de localidade permanece
  no engine `LOCATION_AND_NETWORK`.
- Médicos: substituir `LOCAL_SERVICE_LED` por `SPECIALIST_SINGLE_JOB`.

**Nenhum cluster novo foi criado.**

## 3. Estado canônico após correção

A library passa a v8 sem expandir engines/signatures.

Critérios esperados:
- todos os `source.clusters[]` pertencem a `clusters[]`;
- todos os `source.experienceEngine[]` pertencem a `experienceEngines[]`;
- todos os `source.interactionSignatures[]` pertencem a
  `interactionSignatures[]`;
- `use` permanece em `USE | ADAPT | REJECT`;
- URLs e labels permanecem únicas;
- reference ledgers permanecem sincronizados com a policy.

## 4. Referências oficialmente não resolvidas

Continuam sem substituição por domínio/entidade semelhante:

- https://novageracaoinformatica.com.br/?page_id=9
- https://assistencia-rose.vercel.app/
- https://irepair.com.br/
- https://lp.centroautomotivofera.com.br/

Essas referências não fornecem claims atuais até resolução segura.

## 5. Capacidades finais absorvidas

O corpus consolidado cobre, entre outros:

### Experience engines
- `PROBLEM_TO_DIAGNOSIS`
- `CRAFT_AND_PHYSICAL_PROOF`
- `LOCATION_AND_NETWORK`
- `PRODUCT_OR_SERVICE_FINDER`
- `PROCESS_AND_TRANSPARENCY`
- `PLAN_OR_SCOPE_CONFIGURATION`
- `FOUNDER_OR_SPECIALIST_TRUST`
- `INVENTORY_OR_PRODUCT_BROWSING`
- `URGENT_FAST_PATH`
- `EDUCATION_AND_RISK_REDUCTION`

### Interaction signatures
- `SERVICE_MODE_SELECTOR`
- `CATEGORY_THEN_LOCATION`
- `SYMPTOM_TO_SERVICE_MODE`
- `SERVICE_PLUS_COMMERCE_CONTINUITY`
- `WARRANTY_ELIGIBILITY_TRIAGE`
- `PRODUCT_IDENTITY_CAPTURE`
- `MULTI_NEED_SCOPE_BUILDER`
- `ASSESSMENT_TO_AUTHORIZATION`

### Matrizes/governança adicionais
- role/composition/rhythm/media/anti-copy;
- scope truth/freshness;
- composition contract v2;
- decision profile;
- professional compliance boundary;
- reference evidence and motion provenance.

## 6. Motion

Nenhuma animação de fonte foi promovida sem evidência visual confiável.

Regra final:
- HTML/crawl pode provar interação/estrutura;
- não prova easing, parallax, stagger, clip reveal ou coreografia;
- sem browser/render: `motionObserved = NOT_VERIFIED`;
- ideia própria: `DERIVED_MOTION_CANDIDATE`.

## 7. Critério de encerramento

A frente de referência pode ser considerada **consolidada** quando a PR R9:
1. mantém os gates verdes;
2. não altera landing/funil/contato/assets/runtime;
3. deixa a library sem referências a clusters/engines/signatures inexistentes;
4. preserva as URLs não resolvidas sem substituição;
5. não introduz nova taxonomia sem delta real.

Novas URLs futuras devem ser tratadas como extensão do corpus, não como motivo
para reiniciar as auditorias R1–R9.
