# 0WEB — Post-R9 reference reconciliation

Status: **governance reconciliation / no new research**  
Date: **2026-09-25**

This document reconciles two useful deltas that remained isolated in older,
non-mergeable branches after the R1–R9 consolidation.

It does **not** reopen the corpus audit and does **not** create new engines,
interaction signatures, clusters or public runtime behavior.

## 1. Source authority classification

Every one of the 38 current reference sources now declares exactly one
`sourceClass`:

- `COMPOSITION_REFERENCE`
- `ENTITY_DISCOVERY_SOURCE`
- `META_METHOD_REFERENCE`
- `ANTI_PATTERN_REFERENCE`
- `INSUFFICIENT_EVIDENCE`

The class constrains what the source is allowed to teach. A directory or
methodology article cannot silently become a composition reference.

## 2. R1 experience-engine normalization

Twelve R1 sources with useful evidence but no explicit machine-readable
`experienceEngine` mapping were normalized to one primary engine plus at most
one counterpoint.

No new engine was introduced. Mapping follows observed visitor decision mode,
not the business segment.

Legitimate exemptions remain:

- `use = REJECT`
- `evidenceStatus = INSUFFICIENT_EVIDENCE_FOR_STRUCTURAL_PATTERN`

## 3. Final machine-readable audit

After reconciliation:

- 38 sources;
- 5 allowed source classes;
- 10 canonical experience engines;
- 0 sources without source class;
- 0 unknown source classes;
- 0 eligible USE/ADAPT sources without engine mapping;
- 0 sources with more than two engines;
- 0 unknown engines.

## 4. Superseded branches

The useful deltas from old PRs #178 and #185 are reconciled here on top of the
current main.

PR #174 remains superseded by the later corpus architecture: its useful
automotive mechanisms were absorbed into the current engine/signature system;
its early cluster proposals are recorded in the [historical R2 ledger](PORTFOLIO_REFERENCE_CORPUS_R2_AUTOMOTIVE_2026-09-23.md). The [R4 authority ledger](PORTFOLIO_REFERENCE_CORPUS_R4_SOURCE_AUTHORITY_2026-09-23.md) also retains discovery and method sources that do not participate in composition selection.

## 5. Scope

- no landing changed;
- no funnel/contact changed;
- no asset changed;
- no route changed;
- no client runtime changed;
- no new reference URL added.

Rule preserved:

> **ABSORB GRAMMAR — NEVER COPY SILHOUETTE.**

## 6. Normalização machine-readable de experience engines — 2026-09-24

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
