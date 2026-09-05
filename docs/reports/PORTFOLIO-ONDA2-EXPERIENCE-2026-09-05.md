# Onda 2 — Security Gate + Experience Rollout (2026-09-05)

## 1. Security gate

| Finding | Scanner | Estado |
|---|---|---|
| `license_audit_usage_no_check` | agent_security | CORRIGIDO — `authorizeLicenseRead` (super-admin ou membro do portal) já protegia `getLicenseAudit`/`getLicenseUsage`; finding estava stale, marcado como corrigido após rescan |
| `health_db_unauth_reload` | agent_security | CORRIGIDO — reload exige `requireCronSecret`; resposta pública devolve só `ok/checked/missing` (contagem), sem nomes de tabelas |

- `CRITICAL_ACTIVE = 0` (scanner `agent_security` sem findings ativos).
- `TOTAL_SCANNER_FINDINGS = 6`, todos `ignored_by_user` (4 warnings Supabase de views/functions security-definer, 2 exposições de config já avaliadas).
- **Pendente fora de escopo:** `partner_materials_any_authenticated_read` (supabase_lov, warn) — não corrigido nem ignorado nesta rodada; recomendado tratar na Onda 3.

## 2. Inventário de experiência

| Momento | PREMIUM | SIGNATURE | BASELINE | STATIC |
|---|---|---|---|---|
| Antes | 6 | 5 | 30 | 27 |
| Depois | 14 | 5 | 30 | 19 |

Cobertura 68/68 (100%).

## 3. Lote aplicado (8 páginas)

`premium-envelopamentos` foi descartado do lote por ter sido recomposto recentemente.

| Slug | Intensidade | Assinatura autoral |
|---|---|---|
| jkl-marcenaria | BALANCED | Título em máscara (prancha cotada); ambientes entrando pela lateral, item a item |
| refrigeracao-maresia | BALANCED | Cena revelada por clip; serviços em stagger com lift — `motion/react` avulso removido |
| galileu-locacao-brinquedos | EXPRESSIVE | Título em escala elástica; cartela de atrações em stagger com leve inclinação |
| lj-cleaning | SUBTLE | Matriz de superfícies deslizando linha a linha; contagem de passos |
| dlara-pizzaria | BALANCED | Disco central em escala; três cozinhas em stagger com giro do ícone |
| mirassol-conserta-celular | SUBTLE | Laudo em máscara; etapas descendo como ordem de bancada; realce de linha na tabela |
| guaratuba-oficina-nautica | SUBTLE | Casco entrando pela direita; ficha e checklist como linha d'água |
| thays-camilla | BALANCED | Etiqueta de preço descendo; peças abrindo do centro para as laterais |

Perfis, comportamento desktop/tablet/mobile e fallback registrados em
`src/config/portfolio-motion-profiles.json` (`wave: ONDA_2`).

## 4. Restrições respeitadas

- Somente primitives de `src/components/motion` (`MotionReveal`, `MotionImageReveal`, `MotionCounter`); nenhuma dependência nova; nenhum motion system paralelo.
- SEO, funil, `clientKey`, `ManagedText`, analytics, assets, host credit e contato server-side inalterados.
- Conteúdo permanece no DOM; animação restrita a transform/opacity/clip-path; `prefers-reduced-motion` remove deslocamento.

## 5. Validação

- `check:experience-standard`: 68/68, OK.
- `validate:portfolio-boundaries`: OK (68 sites isolados).
- `check:portfolio-projects`: 68 COMPLETE, 0 bloqueante.
- `check:portfolio-originality`: 0 HIGH_SIMILARITY · 0 CLONE · 0 SHARED_FALLBACK · 0 cluster; 23 ACCEPTABLE · 45 ATTENTION; 26 capas ausentes (fila editorial).
- Typecheck: OK. `bun test`: 324 pass / 0 fail (1657 expects).
- QA Playwright: 8 slugs × 390/1440 × reduced-motion on/off = 32 checagens, 0 falhas (H1 visível, overflow 0, nenhum título com opacidade 0, sem `wa.me`/`tel:`, console limpo).
- `bun run build`: OK; scanner de privacidade — bundle público limpo (444 chunks).

## 6. Recomendação — Onda 3

1. Tratar `partner_materials_any_authenticated_read`.
2. Elevar os 19 STATIC restantes em dois lotes (brechós/alimentação primeiro).
3. Retomar a fila de capas (26 projetos sem capa dedicada).
