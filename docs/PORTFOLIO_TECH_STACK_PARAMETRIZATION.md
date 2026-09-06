# Parametrização técnica — stack, motion, performance e acessibilidade

Status: **normativo** · Escopo: projetos atuais e novos `/portfolio/<slug>` e demais páginas 0WEB.
Complementa `docs/PORTFOLIO_SKILL_PARAMETRIZATION.md` (skills de negócio),
`docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md` e `docs/PORTFOLIO_CLIENT_STANDARD.md`.

Este documento traduz o template genérico de parametrização técnica para a
**stack real** do 0WEB. Valores que divergem do template genérico estão marcados
como **[CORREÇÃO]** — a fonte de verdade é o código, não o template.

## 1. Stack canônica

| Camada | Padrão 0WEB | Observação |
|---|---|---|
| Framework | **React 19 + TanStack Start v1 (SSR)** | [CORREÇÃO] Não é HTML/SCSS/JS vanilla nem Vue/Svelte. |
| Linguagem | **TypeScript (ES6+)** | Componentes `.tsx`; nada de manipulação manual de DOM fora das primitives. |
| Estilização | **Tailwind CSS v4** via `src/styles.css` + tokens semânticos | [CORREÇÃO] Sem Sass/SCSS, sem Bootstrap. Cores sempre por tokens, nunca utilitários hardcoded (`text-white`, `bg-[#...]`). |
| Build | **Vite 7 + Bun 1.4** (`bun.lock` único) | Minificação/bundle automáticos; sem Webpack/PostCSS manual. |
| Rotas | `src/routes/` (TanStack Router) | Cada `/portfolio/<slug>` é site independente do cliente. |
| Backend | Lovable Cloud (RLS) + `createServerFn` | Contato/WhatsApp resolvidos **somente no servidor** por `clientKey`. |

## 2. Interatividade e animação

| Item do template genérico | Equivalente 0WEB |
|---|---|
| Manipulação de DOM / event listeners | Handlers React nos componentes; DOM direto só dentro das primitives de motion. |
| IntersectionObserver (scroll reveal) | Encapsulado em `src/components/motion/index.tsx` (`useInViewOnce`, `MotionReveal`, `MotionStagger`). **Não espalhar observers avulsos.** |
| GSAP / AOS / Lottie | [CORREÇÃO] **Não usar por padrão.** A hierarquia é: CSS → API nativa → motion system (`src/components/motion`) → lib leve → lib pesada só com justificativa registrada. |
| CSS transitions/animations | Permitidas em `transform`, `opacity`, `clip-path`; conteúdo sempre no DOM e visível sem JS. |
| Intensidade | `SUBTLE · BALANCED · EXPRESSIVE · IMMERSIVE` — nunca "máximo de tudo". Budget: ≤3 signature moments, 1 parallax, 1 stagger por viewport, 1 loop. |
| Reduced motion | `prefers-reduced-motion` remove deslocamento, **nunca** conteúdo (via `usePrefersReducedMotion` + camada CSS). |

## 3. Mídia, performance e SEO

- **Imagens**: componente `PortfolioImage` (lazy-loading, dimensões, alt); formatos WebP/JPG; capa por precedência `image › fallbackImage › socialImage › icon › gradiente`. Imagens pesadas são o backlog `IMAGE_PERFORMANCE` — otimização só em rodada própria.
- **SEO**: `head()` por rota com título/descrição/OG/Twitter únicos, canonical e JSON-LD por cliente; conteúdo editorial verdadeiro (sem métricas/depoimentos inventados).
- **Acessibilidade**: HTML semântico, hierarquia de headings, `alt`, foco visível, contraste AA; validado pelos gates de experiência.
- **CTA/WhatsApp**: [CORREÇÃO] **Nunca** link `wa.me`/telefone no bundle. CTA abre o funil do cliente; o redirect `/r/whatsapp/:token` resolve o número no servidor. Sem número oficial: `NOT_CONFIGURED` é válido (sem 503, sem fallback para outro cliente ou 0WEB).

## 4. Gates que provam a parametrização

```bash
bun run audit:portfolio-skills        # matriz skill→parâmetro por projeto
bun run validate:portfolio-boundaries # isolamento entre clientes e 0WEB
bun run check:experience-standard     # motion/a11y/conteúdo (report + :enforce)
bun run validate:client-privacy       # zero PII/contato no bundle
bun test && bun run build
```

## 5. Template de parametrização para NOVOS projetos (preencher no briefing)

```text
Cliente/slug: [nome + slug]
Segmento/tipo: [segment, projectType]            Cidade/UF: [city, state]
Identidade: [paleta própria, tipografia, tom]     — nunca copiar outro cliente
Seções: [hero, serviços, prova real, FAQ, contato via funil...]
Motion profile: [SUBTLE|BALANCED|EXPRESSIVE|IMMERSIVE] + família preset
  signature moments (≤3): [...]   parallax (≤1): [...]   loop (≤1): [...]
  whyThisMotion: [justificativa curta]
Assets reais do cliente: [logo, fotos, socialImage] — nunca fachada/equipe inventada
Capa: [PHOTO_DERIVED | BRAND_COMPOSITION | ABSTRACT_BRAND_ART]
Contato oficial: [recebido? cadastrar só na fonte server-side; senão NOT_CONFIGURED]
SEO: [título, descrição, cidade, tags, imagem social própria]
A11y/perf: [AA, reduced-motion, alt, lazy, budget de motion respeitado]
```

Todo projeto novo nasce válido somente com: identidade própria, motion profile
declarado, funil próprio resolvível, SEO próprio, assets reais, gates verdes
(`validate:portfolio-scaffold` + gates acima). **Padronizar a engenharia, nunca
a criatividade.**

## 6. O que este padrão proíbe

- Sass/Bootstrap/GSAP/AOS/Lottie como default; libs pesadas sem justificativa.
- Telefone, `wa.me` ou e-mail operacional no bundle, analytics ou logs.
- Copiar visual, composição ou motion de outro cliente.
- Desligar por override: rodapé de hospedagem, captação 0WEB, reduced-motion.
- Métricas, selos, depoimentos ou resultados sem evidência auditável.
