# Migração autêntica — S&S Construções → `/portfolio/sscons`

Data: 2026-09-06 · Issue: `hrq16000/zeroweb-2026#60` · Gatilho de reabertura do
`/portfolio` (SEALED): **NEW_PROJECT** com material real do cliente.

Estado do lacre preservado: nenhuma das 68 páginas existentes foi tocada.
Esta rodada apenas **adiciona** o 69º projeto seguindo o playbook
(`docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`) e a parametrização técnica
(`docs/PORTFOLIO_TECH_STACK_PARAMETRIZATION.md`).

## 1. Proveniência

| Campo | Valor |
|---|---|
| Tipo | `AUTHENTIC_MIGRATION` (não é template nem clonagem) |
| Projeto Lovable de origem | `a6148619-92b1-4e27-afdc-bd7864392fe5` |
| Referência publicada | `https://sscons.lovable.app/` |
| Acesso ao projeto de origem | **indisponível** neste workspace (checkout cross-project negado: projeto não compartilhado). A referência publicada foi usada somente para inspeção read-only do HTML/CSS/assets. |
| Registro | `src/config/portfolio-clients.json` → `provenance` |

### Assets originais (8) — copiados byte a byte

| Destino (`public/images/sscons/`) | Origem | SHA-256 | Dimensões |
|---|---|---|---|
| `hero.jpg` | `hero-construction-*.jpg` | `fe539ee9…828426` | 1920×1080 |
| `sobre.jpg` | `about-construction-*.jpg` | `00039028…c0ee11` | 800×600 |
| `projeto-01.jpg` … `projeto-06.jpg` | `project-1-*.jpg` … `project-6-*.jpg` | `8c4ff911…`, `63a52798…`, `083bd614…`, `5b910fac…`, `23fc4793…`, `9fcde083…` | 800×600 |

Hashes completos e verificação automática: `tests/portfolio/sscons-migration.test.ts`.
Derivados gerados localmente (sem alterar os originais): WebP responsivos
(`hero-768/1280/1920.webp`, `projeto-0N-480.webp`, `sobre.webp`), `logo.png`
(BRAND_COMPOSITION a partir da identidade tipográfica), `social.jpg` (1200×630) e
`capa-card.jpg` (1600×1000, derivada do hero via `scripts/build-portfolio-covers.mjs`).
Pasta total: 1,9 MB.

## 2. O que foi preservado da experiência original

- Identidade carvão/grafite + dourado (`#e8b430`), Playfair Display para títulos,
  Inter para texto, tokens locais em `BRAND_VARS` (nunca herdados da 0WEB).
- Hero full-screen com headline original (“Construindo sonhos com excelência”),
  subtítulo e dupla de CTAs.
- Seis serviços com os textos originais (Carpintaria, Obras, Alvenaria, Pintura,
  Reforma, Azulejo), destaques marcados com ✦.
- Galeria com as seis imagens originais + **lightbox acessível** (foco inicial no
  botão fechar, focus trap, ESC, setas ← →, restauração de foco no gatilho,
  `aria-modal`, título rotulado, `body` sem scroll enquanto aberto).
- Bloco institucional (“Quem Somos”) com a imagem `sobre.jpg`.
- Contato/conversão, rodapé escuro e motion (hero em camadas, serviços em
  stagger, galeria com reveal mascarado) — perfil `EXPRESSIVE · CINEMATIC`.

## 3. O que NÃO foi transportado (norma editorial da hospedagem)

| Item da origem | Decisão | Motivo |
|---|---|---|
| Telefone / `wa.me` públicos | **removidos** | Contato só via resolver server-side por `clientKey`; nenhum número no bundle. |
| Botão flutuante de WhatsApp | **convertido** em CTA flutuante do funil (`PortfolioStandardShell`) | Mesmo mecanismo dos demais 68 sites. |
| Depoimentos | **não migrados** | Sem fonte auditável/consentimento documentado. |
| “Atendimento 24 horas” | **reescrito** (“Envie o pedido a qualquer hora…”) | Promessa operacional não verificável. |
| Atribuição das fotos da galeria como obras executadas | **reclassificadas** como “referências por tipo de serviço” | Sem comprovação de autoria; evita fato inventado. |
| Contadores/métricas | inexistentes na origem; **nenhum criado** | — |

## 4. Implementação

| Camada | Arquivo |
|---|---|
| Página isolada | `src/components/site/SsConsPage.tsx` (`<main>`, `PortfolioImage` com `width/height` em todas as imagens, `ManagedText/ManagedRich`, `PortfolioHostCredit`, `PortfolioSocialProofPopup` + `PortfolioUpsellPopup`, reduced-motion) |
| Rota compartilhada | `src/routes/portfolio.$slug.tsx` — `lazy(() => import(...SsConsPage))` (chunk próprio), descrição/keywords, JSON-LD `HomeAndConstructionBusiness` **sem telefone**, breadcrumb herdado |
| Registro/SEO | `src/lib/portfolio-site-registry.ts` (`prestadores-de-servicos`, indexável → sitemap/canonical/OG) |
| Chave de roteamento | `src/lib/portfolio-client-keys.ts` → `"sscons"` |
| Registros canônicos | `portfolio-clients.json`, `portfolio-catalog.json`, `portfolio-assets.json`, `portfolio-share-copy.json`, `portfolio-funnel-context.json`, `portfolio-motion-profiles.json`, `portfolio-visual-review.json`, `portfolio-brand-review.json`, `portfolio-cover-plan.json`, `portfolio-global-config.json` |
| Gerados (não editados à mão) | `portfolio-quiz-configs.generated.ts` (48 funis), `portfolio-cover-status.json` (69), `portfolio-admin-seed.json` (69), `portfolio-experience-levels.json` (`sscons: SIGNATURE`) |
| Funil | `supabase/migrations/20260906045759_1727439c-094f-4a48-af20-dbd488aabcda.sql` — `funnel-sscons` idempotente, perguntas de construção civil (nome, serviço, tipo de obra, local, prazo, detalhes, telefone de retorno). **Nenhum número de destino cadastrado** → canal WhatsApp em `NOT_CONFIGURED`; o lead é salvo e a página responde sucesso honesto sem redirect. |
| Testes | `tests/portfolio/sscons-migration.test.ts` (12 casos) · `tests/portfolio/cover-status.test.ts` (inventário 68 → 69) |

A migration não cria funções, views ou tabelas; os 92 avisos do linter de banco
emitidos após a aplicação são o baseline pré-existente (SECURITY DEFINER,
views/materialized views já auditados em `mem://security`) e não foram
introduzidos aqui.

## 5. Validação (saída real)

| Gate | Resultado |
|---|---|
| `validate:portfolio-boundaries` | OK — 69 sites isolados |
| `validate:portfolio-scaffold` | OK — 69 conformes ao playbook |
| `validate:portfolio-catalog` / `meta` / `assets` / `logos` / `quiz` / `admin-seed` / `regional` / `presence-kit` / `conversion-profiles` | OK (69) |
| `check:portfolio-cover-status` | 69 · VALID=35 · PENDING=34 · NEEDS_CROP=0 |
| `validate:portfolio-performance` | OK — 0 avisos para `sscons` após `fetchPriority="high"` no lightbox |
| `check:portfolio-originality` | `sscons` score 24 (ACCEPTABLE) · 0 CLONE · 0 HIGH_SIMILARITY · 0 cluster · regressão PASS |
| `check:experience-standard:enforce` | 69/69 · PREMIUM 33 · SIGNATURE 20 · BASELINE 16 · STATIC 0 · motion clones 0 |
| `scan:source-privacy` | OK — nenhum contato operacional em código público |
| `bunx tsgo --noEmit` | limpo |
| `bun test` (focados) | 25 pass / 0 fail (`sscons-migration` + `cover-status`) |
| `bun test` (suíte) | ver §5.1 |
| `bun run build` + `validate:client-privacy` (dist) | executados pelo gate de build da plataforma e pelo workflow `portfolio-gates.yml` (o `dist/` não é gerado manualmente nesta sessão) |

### 5.1 QA em navegador (Playwright, `http://localhost:8080/portfolio/sscons`)

| Viewport | HTTP | `<main>` | overflow | imgs sem dimensão | imgs quebradas | wa.me / telefone | erros de console |
|---|---|---|---|---|---|---|---|
| 1440×1800 | 200 | 1 | não | 0 | 0 | não / não | 0 |
| 390×844 | 200 | 1 | não | 0 | 0 | não / não | 0 |
| 1024×1400 + `prefers-reduced-motion` | 200 | 1 | não | 0 | 0 | não / não | 0 |

- Título `S&S Construções · Curitiba — PR`; canonical `https://0web.com.br/portfolio/sscons`;
  `og:image` `/images/sscons/social.jpg`; JSON-LD com `HomeAndConstructionBusiness`
  próprio e **sem `telephone`**.
- Lightbox: abre com foco em “Fechar galeria”; `→` troca `projeto-01 → projeto-02`;
  ESC fecha e devolve o foco a “Ampliar Residência Moderna”. Quando o pop-up
  compartilhado de captação está aberto por cima, o primeiro ESC fecha o pop-up
  e o segundo fecha o lightbox (empilhamento correto de camadas).
- CTA “Solicitar orçamento” abre o funil próprio (`1 DE 5 · Qual serviço você precisa?`
  com Carpintaria/Obras/Alvenaria/Pintura/Reforma/Azulejo).
- Botões sem nome acessível: 0. Alvos < 44 px restantes: apenas o crédito de
  hospedagem compartilhado (`PortfolioHostCredit`, componente lacrado).

## 6. Dependências externas (não bloqueiam a publicação)

| Item | Estado | Ação |
|---|---|---|
| WhatsApp oficial da S&S | `NOT_CONFIGURED` | Cadastrar somente na fonte server-side quando o cliente enviar (gatilho `OFFICIAL_CLIENT_CONTACT_RECEIVED`). |
| Depoimentos | ausentes | Publicar só com fonte auditável e consentimento. |
| Direitos das fotos do hero (pessoas identificáveis) | herdadas do site original do cliente | Confirmar com o cliente ou substituir por material oficial (`REAL_CLIENT_ASSET_RECEIVED`). |
| Branch/PR mencionando #60 | branch de edição `edit/edt-…` gerenciada pela plataforma | Nunca publicar direto na `main`; PR aberto pelo fluxo da plataforma. |

## 7. Skills aplicadas

`0web-skill-router` → `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md` → `0web-design-system`
(identidade do cliente soberana) → `0web-ui-quality-gates` (estados, a11y, responsivo,
motion, privacidade) → `validate:portfolio-boundaries`. Apple HIG usada apenas como
camada de revisão (alvos de toque, foco, modais).
