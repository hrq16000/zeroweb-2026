# Onda 3 — Experience Rollout + fechamento do warning de materiais de parceiros

Data: 2026-09-05 · Escopo: segurança (frente A), inventário real (frente B) e
elevação de 9 páginas STATIC. Sem nova dependência de motion.

## Frente A — Warning de materiais de parceiros

| Campo | Valor |
|---|---|
| FINDING_ID | `partner_materials_any_authenticated_read` |
| SEVERITY | warning |
| AFFECTED_FILES | `supabase/migrations/20260605051639_*.sql`, `src/lib/partners.functions.ts` |
| AFFECTED_ROUTES | `/app/parceiro`, `/app/admin` (leitura via `listPartnerMaterials`) |
| DATA_EXPOSED | título, descrição e URL de materiais internos de parceria |
| PUBLIC_ACCESS | não (exige sessão), mas qualquer conta autenticada tinha leitura |
| ROOT_CAUSE | política `materials_read_all_authed` liberava SELECT para todo `authenticated`, ignorando `visible_to_kinds` e o status do parceiro |
| EXPLOITABILITY | baixa — exige conta; sem escrita, sem PII de terceiros |
| CLASSIFICAÇÃO | **CONFIRMED_ISSUE (baixa severidade)** |

Correção mínima aplicada (migração):

- nova função `public.can_view_partner_material(uuid, partner_kind[])`
  (`SECURITY DEFINER`, `search_path = public`, execute revogado de `anon`/`public`);
- política `materials_read_admin_or_matching_partner`: SELECT apenas para admin /
  super admin ou parceiro **aprovado** cujo `kind` esteja em `visible_to_kinds`;
- nenhum material legítimo removido.

Achados adicionais do rescan (error-level, `not_persisted`) também corrigidos por
serem escalonamento de privilégio real:

- `companies_self_service_status_verified_escalation`
- `providers_self_service_status_verified_escalation`

Correção: trigger `guard_listing_privileged_columns` em `companies` e `providers`
congela `status`, `verified`, `rating_avg`, `rating_count` e `views_count` para
quem não é admin (INSERT cai em `pendente`/`false`/zerado). Dono continua editando
os próprios campos descritivos.

Estado após a rodada: `CRITICAL_ACTIVE = 0`; findings restantes do linter são as
categorias pré-existentes já ignoradas pelo usuário.

## Frente B — Inventário real (não subtração)

Antes da rodada o gate falhava com `INVALID_MOTION_PROFILE` (metadados da Onda 2
fora do schema). Correções de metadado, sem tocar nas páginas:
`sectionReveal: slide → up` (jkl-marcenaria, lj-cleaning, guaratuba-oficina-nautica,
thays-camilla), `staggerPattern: radial → diagonal` (dlara-pizzaria),
`hoverBehavior: highlight → underline` (mirassol-conserta-celular,
guaratuba-oficina-nautica) e campo `wave` incorporado ao `motionProfileSchema`.

| Métrica | Antes | Depois |
|---|---|---|
| TOTAL | 68 | 68 |
| IMMERSIVE/PREMIUM | 14 | 23 |
| SIGNATURE | 5 | 5 |
| BASIC/BASELINE | 30 | 30 |
| STATIC | 19 | 10 |

`STATIC_TO_IMMERSIVE = 9` · `STATIC_TO_SIGNATURE = 0` · `BASIC_CHANGED = 0`

## Frente C/D — Lote selecionado (diversidade de segmento)

| Slug | Segmento | Assinatura |
|---|---|---|
| beto-pasteis | alimentação/balcão | título em cortina + vitrine linha a linha pela esquerda |
| bh-barreiro-marmitas | alimentação/marmita | quadro do dia descendo como placa; cardápio em cortina |
| casa-nativa | bistrô | quatro tempos entrando em ritmo de serviço lento (SUBTLE) |
| uberlandia-eletrica-residencial | técnico/elétrica | barras de carga energizando da esquerda (scaleX) |
| lolipa-arte-em-festas | eventos | mural montando peça a peça em direções alternadas |
| guaratuba-atelie-presentes | comércio/artesanato | peças saindo do ateliê em escala, recado entrando lateral |
| ton-e-cor | serviços/pintura | cartela cromática subindo tom a tom |
| raphael-construcoes | construção | trilho da obra avançando fase a fase (SUBTLE) |
| premium-envelopamentos | indústria/comunicação visual | tira fotográfica aplicada lateralmente como película |

## Frentes E–N — Originalidade, mobile e reduced motion

- Perfis, `whyThisMotion` e `mustAvoid` registrados em
  `src/config/portfolio-motion-profiles.json` (`decisions.onda3`).
- Padrões das Ondas 1 e 2 evitados; duas colisões de fingerprint detectadas pelo
  gate (`bh-barreiro-marmitas` e `uberlandia-eletrica-residencial` aproximando-se
  de `miro-tech`) foram desfeitas trocando `MotionStagger` por revelações
  individuais. Regressão final: **PASS**.
- QA Playwright: 9 slugs × {390, 1440} × {motion normal, reduced} = 36 checagens.
  HTTP 200, zero overflow horizontal, H1 presente, nenhum título com opacidade 0,
  zero erro de console.
- Reduced motion: conteúdo visível, CTA funcional, layout válido, nenhum
  movimento obrigatório.
- Rotações de layout (Ateliê, Beto) preservadas: motion aplicado em wrapper para
  não sobrescrever `transform` do design.

## Frentes O–S — Performance, funil, SEO, privacidade

- `NEW_MOTION_DEPENDENCY = NO`; apenas `transform`, `opacity` e `clip-path`.
- Peso de JS/CSS por página: não medido isoladamente nesta rodada (sem
  instrumentação confiável) — build total sem regressão de erro.
- Funil: `funnel-context 68 auditados · PASS 68 · WARNING 0 · FAIL 0`.
- SEO, textos, CTAs, capas e identidade: inalterados.
- Privacidade: `dist` limpo, 444 chunks públicos sem contato; 2 avisos apenas em
  chunks de painel autenticado (pré-existentes).

## Gates executados

```
check:portfolio-projects        68 COMPLETE · 0 PARTIAL · 0 bloqueante
check:portfolio-funnel-context  PASS 68 · WARNING 0 · FAIL 0
check:portfolio-originality     0 CLONE · 0 HIGH_SIMILARITY · 0 SHARED_FALLBACK · regressão PASS
validate:portfolio-boundaries   OK — 68 sites isolados
check:portfolio-visual-quality  NEEDS_UPGRADE 0 · P0 0 · score médio 87
check:experience-standard       68/68 · PREMIUM 23 · SIGNATURE 5 · BASELINE 30 · STATIC 10 · OK
bun test                        337 pass · 0 fail · 1681 expects
bun run build                   OK
typecheck                       OK
```

## Pendências para a próxima rodada

- `STATIC_REMAINING = 10`.
- Capas: 30 válidas · 38 pendentes (fora do escopo desta rodada).
- Validação em produção das 9 páginas após publicação.
