# ONDA 1 — Experience System em produção

Data: 2026-09-05 · Escopo: reconciliação de auditoria + 5 páginas STATIC → SIGNATURE.

## 1. Reconciliação 67 × 68 (cobertura 100%)

Causa raiz: `scripts/check-experience-standard.mjs` varria `src/components/site/*Page.tsx`,
o que (a) incluía `HubPage.tsx`, que não é projeto de cliente, e (b) excluía
`RenataBeautyView.tsx` e `RBeautyEditorialView.tsx`, além de 10 slugs cujo arquivo
não deriva do nome.

Correção:
- `src/config/experience-capabilities.json` → `projectComponentMap` (12 aliases + `nonProjectComponents`).
- O gate passou a derivar a lista do catálogo (`portfolio-catalog.json`), aceitar `Page.tsx` e `View.tsx`,
  emitir `AUDIT_COVERAGE_GAP` e reportar `auditCoverage`.

Resultado: `68/68 projetos · cobertura 100% · missingSlugs = []`.

## 2. Seleção da onda (5 projetos STATIC, segmentos distintos)

Sem dados de tráfego auditáveis por projeto, o critério foi diversidade de segmento
+ maturidade de conteúdo real:

| Slug | Segmento | Antes | Depois |
|---|---|---|---|
| miro-tech | assistência técnica | STATIC | SIGNATURE |
| woodhouse-hamburgueres | alimentação | STATIC | SIGNATURE |
| sos-presentes-cosmeticos | presentes e cosméticos | STATIC | SIGNATURE |
| jc-revestimentos | construção e acabamento | STATIC | SIGNATURE |
| guaratuba-reparos-residenciais | serviços residenciais | STATIC | SIGNATURE |

## 3. Signature moments (3 por página, nenhum repetido entre projetos)

- **MIRO TECH** — intenção PRECISÃO (SUBTLE/TECHNICAL): título por máscara ·
  grade de diagnóstico em stagger · seta do CTA avança + cartão eleva.
- **Woodhouse** — CALOR E ENERGIA (EXPRESSIVE/BOLD): foto vertical por clip de baixo
  para cima · linhas da comanda entrando pela direita · CTA com press físico.
- **SOS Presentes** — ACOLHIMENTO E SURPRESA (BALANCED/LUXURY): cesta por máscara
  lateral · vitrine em escala · recorte do produto aproxima no ponteiro.
- **JC Revestimentos** — ORGANIZAÇÃO E CAMADAS (BALANCED/TECHNICAL): texto atravessa o
  plano da foto · tabela técnica linha a linha pela esquerda · linha recua e etiqueta desliza.
- **Reparos do Litoral** — RESOLUÇÃO RÁPIDA (SUBTLE/MINIMAL): ficha chega em escala curta ·
  checklist item a item · números 01–03 contando ao entrar.

Perfis e justificativas (`whyThisMotion`, `effectsAvoided`, notas de performance)
gravados em `src/config/portfolio-motion-profiles.json` (`overrides` + `decisions`).

## 4. Restrições respeitadas

- Nenhuma biblioteca nova; apenas primitives de `src/components/motion`.
- Sem codemod em massa; 5 arquivos de página editados.
- Identidade, copy, `ManagedText`, funis, CTAs, SEO, analytics, imagens gerenciadas,
  host credit e resolução server-side de contato preservados.
- Somente `transform`/`opacity`/`clip-path`; máx. 3 signature moments, 1 stagger por viewport,
  0 parallax, 0 loops.
- `prefers-reduced-motion` remove deslocamento, nunca conteúdo.

## 5. Validação

- `check:experience-standard` → 68/68, cobertura 100%, PREMIUM 6 · **SIGNATURE 5** · BASELINE 30 · STATIC 27.
- `validate:portfolio-boundaries` → OK (68 isolados).
- `check:portfolio-projects` → 68 COMPLETE · 0 bloqueante.
- `check:portfolio-originality` → 0 HIGH_SIMILARITY · 0 CLONE · 0 SHARED_FALLBACK · 0 cluster.
- `tsgo --noEmit` → limpo. `bun test` → 324 pass / 0 fail. `bun run build` → OK, bundle público limpo.
- Navegador real (Playwright), 390 e 1440, com e sem `prefers-reduced-motion`, nos 5 slugs:
  HTTP 200 · overflow horizontal 0 · 1 `h1` · 0 blocos de texto presos em `opacity:0` · 0 erros de console.

## 6. Pendências conhecidas

- 27 páginas ainda STATIC (ondas seguintes).
- 26 projetos sem capa dedicada e 10 capas bloqueadas seguem em fila editorial (fora desta onda).
- Regressão visual automatizada continua indisponível na infra (`VISUAL_REGRESSION_INFRA_NOT_AVAILABLE`).
