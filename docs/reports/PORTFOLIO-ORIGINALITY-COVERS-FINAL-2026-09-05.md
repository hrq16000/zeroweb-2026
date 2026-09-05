# Rodada 13 — Eisenfer + auditoria final 68/68

Somente verificação e correções de segurança/regressão dentro do escopo. Nenhum redesign,
nenhum score alterado manualmente, nenhuma nova capa criada.

## 1. Eisenfer

- `public/images/eisenfer-tubos-acos/capa-card.jpg` publicado — HTTP 200 em produção.
- Auditoria de PII na origem: `telhas.webp` (1024×1536) **contém** telefone, site e endereço
  na faixa inferior. Embora `object-cover` centralizado não exibisse a faixa nos breakpoints
  testados, o material inseguro continuava sendo servido nas páginas públicas.
- Correção aplicada (dentro do escopo de privacidade):
  - hero de `EisenferTubosAcosPage.tsx` → `capa-card.jpg`;
  - imagem do card em `portfolio.$slug.tsx` → `capa-card.jpg`;
  - `icon` em `portfolio-assets.json` → `capa-card.jpg` (seed admin regenerado).
- `telhas-og.jpg` (1200×630) auditado: sem contato — mantido como imagem social.

Resultado: EISENFER_COVER_LIVE = YES · EISENFER_PHONE_VISIBLE = NO · EISENFER_URL_VISIBLE = NO ·
EISENFER_PII_VISIBLE = NO (pendente apenas nova publicação das trocas acima).

## 2. Inventário canônico de capas

`68 · VALID=34 · PENDING=34 · NEEDS_CROP=0 · CONTACT_OR_PII=8 · PROMOTIONAL_MATERIAL=2 ·
LOGO_ONLY=10 · NO_REAL_ASSET=14 · UNCERTAIN_ORIGIN=0` — soma fecha em 68.

## 3. Auditoria 68/68 (produção, 390px)

68 rotas testadas: HTTP 200, 1 `h1`, nenhuma imagem quebrada, nenhum erro de console.

Único defeito encontrado: overflow horizontal de 2–6px em `beto-pasteis`,
`lolipa-arte-em-festas`, `manu-pasteis`, `angel-mix-brecho`. Causa raiz comum: reveals
horizontais em curso (`translateX`) sem clipping no shell — não é problema por projeto.
Correção única em `PortfolioStandardShell` (`overflow-x-clip`); overflow = 0 nas quatro
páginas e nas amostras de controle (Eisenfer, Paraíso).

Nota: `denise-doces` (usado como amostra na rodada anterior) **não existe** no catálogo —
o 404 era slug inválido do teste, não regressão. O slug real é `denise-gomes-psicologa`.

## 4. Originalidade V2

`METRIC_VERSION = 2 · CLONES = 0 · PROJECTS_OVER_60 = 0 · SIMILARITY_CLUSTERS = 0 ·
SHARED_FALLBACK = 0 · MAX_NEAREST_MATCH = 59` (`aguia-sul-sinalizacao` ~ `diego-montador-moveis`,
`SAME_FAMILY`, ativos distintos). 26 ACCEPTABLE · 42 ATTENTION · 0 logo placeholder.

## 5. Pendências

TECHNICAL_DEBT_REMAINING = 0 conhecidas no /portfolio.
Warning legado fora desta frente: política `request_distributions` sem `WITH CHECK`.

EXTERNAL_ASSET_DEPENDENCIES = 34 capas dependentes de material oficial do cliente
(8 CONTACT_OR_PII · 2 PROMOTIONAL_MATERIAL · 10 LOGO_ONLY · 14 NO_REAL_ASSET).

## 6. Gates

TOTAL_PROJECTS 68 · COMPLETE 68/68 · SEO_REGRESSION 0 · FUNNEL_REGRESSION 0 ·
WHATSAPP_REGRESSION 0 · PRIVACY_REGRESSION 0 · PAYMENT_AUTHORIZATION PASS (cobertura existente) ·
TYPECHECK PASS · TESTS PASS (348/0) · BUILD PASS · client-privacy PASS (444 chunks) ·
dist audit PASS (454 arquivos).

## 7. Veredito

**PORTFOLIO_ORIGINALITY_AND_COVERS = CLOSED.**

As 34 capas pendentes têm reason code real e dependem de material oficial do cliente.
Nenhuma capa insegura permanece publicada. Novas capas entram apenas com material real
disponível — não há nova rodada de redesign recomendada.
