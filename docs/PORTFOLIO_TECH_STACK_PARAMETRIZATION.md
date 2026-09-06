# Parametrização técnica — stack, motion, performance e acessibilidade

Status: **normativo** · Escopo: projetos atuais e novos `/portfolio/<slug>` e demais páginas 0WEB.
Complementa `docs/PORTFOLIO_SKILL_PARAMETRIZATION.md`,
`docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`,
`docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md` e `docs/PORTFOLIO_CLIENT_STANDARD.md`.

Este documento traduz competências genéricas de desenvolvimento web para a
**stack real** do 0WEB. A regra é aproveitar a capacidade, não trocar a stack
apenas porque uma skill menciona outra ferramenta.

## 1. Stack canônica

| Competência genérica | Padrão 0WEB | Observação |
|---|---|---|
| HTML5 semântico | JSX/TSX semântico em React 19 | landmarks, headings, forms e ARIA quando necessários |
| CSS3, Flexbox, Grid, media queries | Tailwind CSS v4 + CSS custom properties | mobile-first; sem Sass/Less como requisito |
| JavaScript/framework | TypeScript + React 19 + TanStack Start | handlers React; DOM direto só em primitives justificadas |
| Build/bundling | Vite 7 + Bun 1.4 | sem Webpack/Babel manual por padrão |
| Backend/API | TanStack server functions + Supabase/Lovable Cloud | somente quando a feature exige |
| Versionamento | GitHub issue → branch → PR → checks → merge | nunca direto em `main` |
| QA | Bun tests + Playwright + Lighthouse + gates locais | evidência antes de declarar pronto |

## 2. Design system: plataforma ≠ cliente

Em páginas 0WEB, `src/styles.css` e os tokens globais são a fonte de verdade.

Em `/portfolio/<slug>`, o cliente pode ter tokens locais escopados para paleta,
tipografia, radius, espaçamento, superfície e tratamento de imagem. Isso é
preferível a forçar todos os clientes a parecerem a mesma marca.

Space Grotesk/Inter são defaults da 0WEB e fallbacks possíveis, **não obrigação
visual para clientes**. A tipografia do portfolio é definida no creative brief.

## 3. Interatividade e animação

| Capacidade | Equivalente 0WEB |
|---|---|
| DOM/event listeners | handlers React; DOM direto encapsulado |
| IntersectionObserver | primitives em `src/components/motion` quando aplicável |
| CSS transitions/animations | `transform`, `opacity`, `clip-path` e estados de UI |
| Motion library | `motion/react` + primitives locais |
| GSAP/AOS/Lottie/Three | somente com necessidade concreta, revisão e budget; nunca default |
| Reduced motion | `prefers-reduced-motion` obrigatório |

Todo projeto novo creative v2 precisa de **override de motion próprio**.
Defaults por segmento existem apenas como fallback legado.

Budget usual: até 3 signature moments, 1 parallax, 1 stagger por viewport e 1
loop. Não é “mínimo de efeito”; é limite para concentrar impacto onde importa.

## 4. UX/UI e responsividade

Aplicar em toda página comercial:

- hierarquia visual clara;
- mobile-first e cross-browser moderno;
- touch targets adequados;
- teclado/foco visível;
- contraste AA;
- loading/empty/error quando houver estado dinâmico;
- modais/lightboxes com semântica, ESC, foco e restauração de foco;
- composição específica do cliente definida antes do código.

A direção visual pode ser editorial, cinematográfica, técnica, assimétrica,
minimalista, brutalista, luxuosa, lúdica ou outra — desde que derive do negócio e
não copie o portfolio vizinho.

## 5. Mídia, performance e SEO

- **Imagens**: `PortfolioImage`, dimensões explícitas, hero/LCP prioritário e
  demais imagens lazy; WebP/JPG/SVG quando adequado.
- **Assets oficiais**: preservar logo/fotos reais do cliente. Mídia gerada pode
  ser arte de marca, mas não prova fictícia de equipe, sede, obra ou cliente.
- **SEO**: `head()` único, title/description/OG/Twitter/canonical/JSON-LD por
  cliente, sitemap e conteúdo semântico.
- **Performance**: code splitting, requests sob demanda, imagens responsivas,
  cache/CDN da plataforma, Lighthouse e Core Web Vitals.
- **Acessibilidade**: HTML semântico, alt, foco, contraste, teclado, reduced motion.

## 6. CTA/WhatsApp

Nunca usar `wa.me`, telefone ou e-mail operacional no bundle público.

Fluxo canônico:

```text
CTA → funil individual → lead → token → /r/whatsapp/:token
→ resolver contato server-side → mensagem → 302 para WhatsApp
```

Para novos clientes, o secret canônico é:

```text
PORTFOLIO_WHATSAPP_<CLIENT_KEY_NORMALIZADO>
```

Sem secret válido: `NOT_CONFIGURED`; nunca fallback silencioso para outro cliente.

## 7. Gates

```bash
bun run audit:portfolio-skills
bun run validate:portfolio-scaffold
bun run validate:portfolio-boundaries
bun run check:portfolio-originality
bun run check:experience-standard
bun run validate:client-privacy
bun test
bun run build
```

Além disso, validar a experiência real em mobile/desktop, console, teclado,
reduced motion e CTA/funil.

## 8. Briefing técnico + criativo para NOVOS projetos

```text
Cliente/slug: [nome + slug]
Segmento/tipo/cidade: [...]
Business truth / público / objetivo: [...]
Metáfora visual: [...]
Layout topology + hero archetype: [...]
Tipografia própria + color roles: [...]
Image strategy: [oficiais / brand art / licenciadas]
Motion override: [intensity + grammar + signature moments]
Interaction signature: [...]
Conversion narrative: [...]
Proof strategy: [evidence-first]
Funil/clientKey: [...]
Secret esperado: PORTFOLIO_WHATSAPP_<...>
SEO: [...]
A11y/perf: [...]
Anti-template decisions: [...]
```

Todo projeto novo nasce válido somente com creative brief preenchido, identidade
própria, motion override próprio, funil resolvível, SEO próprio, assets próprios
e gates verdes. **Padronizar a engenharia, nunca a criatividade.**

## 9. O que este padrão proíbe

- trocar React/TanStack/Tailwind/Bun por hábito de uma skill externa;
- Sass/Bootstrap/GSAP/AOS/Lottie/Three como default;
- telefone, `wa.me` ou e-mail operacional no bundle;
- copiar visual, composição ou motion de outro cliente;
- publicar workbench/scaffold não finalizado;
- apresentar métricas, selos, avaliações, depoimentos ou resultados fabricados
  como se fossem reais.
