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
its obsolete cluster expansion must not be resurrected.

## 5. Scope

- no landing changed;
- no funnel/contact changed;
- no asset changed;
- no route changed;
- no client runtime changed;
- no new reference URL added.

Rule preserved:

> **ABSORB GRAMMAR — NEVER COPY SILHOUETTE.**
