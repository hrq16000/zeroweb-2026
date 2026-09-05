# PORTFOLIO_ORIGINALITY_AND_COVERS — Relatório final de encerramento

Data: 2026-09-05 · Rodada 14 (fechamento)
Escopo: apenas finding de segurança pendente + encerramento formal da frente.
Nenhuma capa publicada, nenhum projeto redesenhado, nenhum painel criado.

---

## 1. Finding de segurança

| Campo | Valor |
|---|---|
| Rule / ID | `MISSING_RLS_PROTECTION` · `request_distributions_update_missing_with_check` (scanner `supabase_lov` v3.2) |
| Objeto | policy `"dist target update"` em `public.request_distributions` (UPDATE, role `authenticated`) |
| Origem | `supabase/migrations/20260605003753_bd8aacfa-4f10-45e3-9ff7-716ab100887a.sql:279-282` |
| Categoria | Autorização / RLS incompleta |
| Superfície | Data API autenticada (não depende do frontend) |

**Problema.** A policy validava, via `USING`, que o chamador era dono do alvo
**atual** da distribuição (provider ou company), mas não possuía `WITH CHECK`.
Sem `WITH CHECK`, os **novos** valores de `target_id`/`target_type` não eram
validados, permitindo que um prestador/empresa dono da linha reatribuísse a
distribuição de lead para um alvo de terceiros.

**Trust boundary.** O dado (`target_id`/`target_type`) é controlado pelo usuário
autenticado e cruza a fronteira usuário → banco. A única barreira existente era a
própria RLS; não há validação server-side adicional nessa rota, e a Data API pode
ser chamada diretamente, contornando o frontend.

**Exploitability.** Exige sessão autenticada (não é público) e não exige role
administrativa. Sem role de admin, um provider/company legítimo poderia executar
o UPDATE via API. Portanto: real e alcançável por qualquer conta de prestador.

| Item | Estado |
|---|---|
| Classificação | `TRUE_POSITIVE_EXPLOITABLE` |
| Decisão | `FIX` |
| Correção | migration `20260905165004_…` — `DROP POLICY` + `CREATE POLICY` preservando o `USING` original e adicionando `WITH CHECK` idêntico contra os novos valores |
| Verificação em banco | `pg_policies.with_check` presente e equivalente ao `USING` |
| Teste de regressão | `tests/rls/request_distributions_with_check.test.ts` (BEFORE: sem `WITH CHECK` → reatribuição aceita · AFTER: `WITH CHECK` obrigatório e simétrico) — PASS |
| Escopo da mudança | mínimo, apenas a policy; nenhuma refatoração associada |

Scanner reexecutado após a correção: **0 finding crítico ativo**. Os 4 itens
remanescentes (`security definer view`, `materialized view in api`, funções
`SECURITY DEFINER` executáveis) permanecem **ignorados pelo usuário** em decisões
anteriores e não foram reabertos nesta rodada.

---

## 2. Estado final do portfólio

| Métrica | Valor |
|---|---|
| TOTAL_PROJECTS | 68 |
| COMPLETE | 68/68 |
| CLONES | 0 |
| PROJECTS_OVER_60 | 0 (score máximo 59) |
| HIGH_SIMILARITY | 0 |
| SHARED_FALLBACK | 0 |
| Clusters | 0 |
| Distribuição | 26 ACCEPTABLE · 42 ATTENTION (afinidade de família, não clone) |
| Logos placeholder | 0 |
| Experience Standard | OK · STATIC 0 |

---

## 3. Estado final das capas (fonte canônica)

| Métrica | Valor |
|---|---|
| COVER_VALID | 34 |
| COVER_PENDING | 34 |
| NEEDS_CROP | 0 |
| Capas compartilhadas | 0 |
| COVERS_PUBLISHED_THIS_ROUND | 0 |

Distribuição das pendências por reason code:

| Reason code | Qtde |
|---|---|
| `NO_REAL_ASSET` | 14 |
| `LOGO_ONLY` | 10 |
| `CONTACT_OR_PII` | 8 |
| `PROMOTIONAL_MATERIAL` | 2 |

Nenhuma capa pendente foi publicada para zerar inventário. `PENDING` é o estado
correto enquanto faltar material oficial e seguro.

---

## 4. Dívida técnica

| Item | Estado |
|---|---|
| COVER_TECHNICAL_DEBT | 0 |
| Fonte de verdade das capas | única e canônica (`src/config/portfolio-cover-status.json`, gerada por script) |
| Rastreamento admin | `ADMIN_COVER_TRACKING = SUFFICIENT` — painel existente já expõe status, reason code e filtro (default `PENDING`); nenhuma tela nova criada |
| Pendências de código | nenhuma nesta frente |

---

## 5. Dependências externas

`EXTERNAL_ASSET_DEPENDENCIES = 34`

Os 34 projetos pendentes aguardam exclusivamente material oficial do cliente:

- 14 sem fotografia ou material real apropriado;
- 10 com apenas marca/logo disponível;
- 8 cujo material existente exibe contato ou endereço (não publicável);
- 2 cujo material é peça promocional com preço/campanha.

Assim que houver foto real, logo oficial ou variante segura aprovada, o item sai
de `PENDING` pelo fluxo já existente — sem nova rodada de engenharia.

---

## 6. Gates

| Gate | Resultado |
|---|---|
| SECURITY (crítico não resolvido) | 0 |
| SECURITY_REGRESSION_TEST | PASS |
| PRIVACY | PASS — bundle público limpo (444 chunks; 2 avisos conhecidos em chunks administrativos), 454 arquivos do dist sem contato operacional ou segredo |
| SEO_REGRESSION | 0 — 224 arquivos canonicais, 0 aviso, 0 erro |
| FUNNEL_REGRESSION | 0 |
| WHATSAPP_REGRESSION | 0 — resolução server-side por `clientKey` inalterada |
| TYPECHECK | PASS |
| TESTS | PASS — 350/0 (40 arquivos) |
| BUILD | PASS |
| check:portfolio-projects | 68 COMPLETE · 0 bloqueante |
| check:experience-standard | OK |
| check:portfolio-originality | regressão PASS |

---

## 7. Veredito

`PORTFOLIO_ORIGINALITY_AND_COVERS = CLOSED`

Tudo que dependia de código está resolvido: originalidade sem clones, clusters ou
fallback compartilhado; 68/68 projetos completos e dentro do Experience Standard;
inventário de capas com fonte única e rastreamento administrativo suficiente;
nenhuma capa insegura publicada; único finding de segurança pendente corrigido,
verificado e coberto por teste.

As 34 capas restantes são dependência externa legítima (material do cliente) e
não constituem dívida técnica. Nenhuma nova rodada desta frente é necessária.
