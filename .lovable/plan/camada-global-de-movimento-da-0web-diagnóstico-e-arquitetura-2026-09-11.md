# Camada global de movimento da 0WEB — diagnóstico e arquitetura

Etapa 1: apenas mapa, divergências, arquitetura proposta e plano de migração. Nada implementado.

## 1. Mapa atual

**Núcleo compartilhado** — `src/components/motion/index.tsx` (408 linhas): `MotionScope` (contexto de intensidade), `MotionReveal`, `MotionStagger`, `MotionTextReveal`, `MotionImageReveal`, `MotionCounter`, `MotionParallax`, `useInViewOnce`, `usePrefersReducedMotion`, `useScrollProgress`, `useDesktopViewport`. Tabela `TUNING` define distância/duração/stagger/escala por intensidade (SUBTLE→IMMERSIVE), com easing fixo `cubic-bezier(0.22,1,0.36,1)` e `rootMargin` padrão `0px 0px -12% 0px`, threshold 0,05.

**Camada CSS** — `src/styles.css`: `page-reveal` (520ms), `section-reveal` com `animation-timeline: view()` aplicado apenas a três temas antigos (`portfolio-theme-rj`, `-santos`, `-fernanda`), um loop `rj-level-scan`, e um bloco `prefers-reduced-motion: reduce`.

**Hooks compartilhados** — `useNearFooter` (usado por CTA flutuante institucional e do Blueprint, com quatro seletores de fallback), `use-mobile`.

**Blueprint** — `PortfolioBlueprintRenderer` envolve tudo em `MotionScope` com `layout.motionIntensity ?? "BALANCED"`; `sections.tsx` implementa reveal/parallax/contador/hover/zoom/timeline por seção; `BlueprintFloatingCta` combina scroll > 60% da viewport com `useNearFooter`.

**Perfis por projeto** — `src/config/portfolio-motion-profiles.json`: `defaultsBySegment` + `overrides` (Moreira `mechanical-contained`, JKL `cabinetry-settling`) e `decisions`. Aplicação por lote, nunca automática.

**Páginas de cliente legadas** — 57 de ~68 componentes em `src/components/site/*Page.tsx` usam alguma primitive ou classe animada, cada um com composição própria.

**Piloto** — `/lab/motion-pilot` exercita todas as primitives com conteúdo fictício e `noindex`.

**Institucional** — `Header` usa `motion/react` e transições Tailwind próprias; `WhatsAppFloat` tem loop de shake com `useAnimationControls` sem guarda de reduced motion no JS; `__root.tsx` só lê `prefers-reduced-motion` de forma pontual.

## 2. Divergências e lacunas

1. **Nenhuma rota institucional herda o sistema.** Zero arquivos em `src/routes/` importam `@/components/motion`. `/`, planos, blog, serviços, cidades e `/portfolio` (índice) usam transições Tailwind soltas ou nada.
2. **Duas linguagens paralelas**: primitives JS (Blueprint/clientes) versus `motion/react` + classes utilitárias (shell institucional). Durações e easings não coincidem.
3. **`section-reveal` do CSS é órfão**: existe, mas só três temas legados o consomem.
4. **Tokens não são tokens**: `TUNING` é constante TS interna, sem variáveis CSS equivalentes; não há como aplicar a mesma linguagem fora do React.
5. **Reduced motion é desigual**: coberto nas primitives, parcial no CSS, ausente em loops como o do `WhatsAppFloat`.
6. **Ciclo do CTA flutuante duplicado**: institucional e Blueprint repetem thresholds e seletores de rodapé em componentes diferentes.
7. **Gate mede configuração, não percepção**: `MOTION_PRESENCE_GATE` já distingue `MOTION_DECLARED / IMPLEMENTED / OBSERVED`, mas "OBSERVED" é preenchido no JSON da matriz por evidência textual — nada compara pixels ou estilos computados em dois instantes.
8. **Escopo do gate é só `/portfolio/:slug`**: raiz e páginas institucionais não têm gate de motion algum.

## 3. Arquitetura proposta — `GlobalMotionContract`

Fonte única em `src/config/global-motion-contract.json` + `src/lib/global-motion-contract.ts`, espelhada em variáveis CSS geradas em `src/styles.css`.

**(A) Regras globais obrigatórias** (valem para qualquer página pública):

- **Tokens**: durações `micro 160ms / element 260ms / section 420ms / page 520ms`; easings `enter cubic-bezier(0.22,1,0.36,1)`, `exit cubic-bezier(0.7,0,0.84,0)`; distâncias `8/16/26/38px` por intensidade; escalas `1 / 1.01 / 1.03 / 1.05`; opacidade base 0→1.
- **Observação**: `threshold 0.05`, `rootMargin 0px 0px -12% 0px`, disparo único, SSR-safe (conteúdo visível sem JS).
- **Reveal/stagger**: variantes fade/up/down/left/right/scale/mask; passo `50/70/90/110ms`; máximo 1 grupo escalonado por viewport.
- **Hover/focus/elevação**: hover só com ponteiro fino; foco visível sempre independente do hover; elevação por `transform` + sombra, nunca layout.
- **Zoom/parallax**: parallax só desktop, no máximo 1 camada, deslocamento máximo 32px; zoom máximo 1,06 e ≥ 600ms.
- **Scroll-progress**: valor 0→1 normalizado, sem escrita de layout, throttle por rAF.
- **CTA flutuante**: aparece após 60% da primeira viewport, some ao intersectar rodapé ou crédito da hospedagem, respeita safe-area, `aria-hidden` quando oculto — implementação única compartilhada.
- **Mobile/touch**: sem parallax, sem hover, distâncias reduzidas em um nível.
- **`prefers-reduced-motion`**: remove deslocamento, parallax, zoom e loops; mantém opacidade e todo o conteúdo.
- **Propriedades animáveis**: apenas `transform`, `opacity`, `clip-path`.
- **Observabilidade runtime**: cada primitive marca `data-motion="<primitive>"`, `data-motion-state="idle|armed|played"` e `data-motion-intensity`, permitindo auditoria por DOM real em vez de configuração.

**(B) Perfis locais por página/projeto** (personalidade, não regra):

- Campos: `intensity`, `preset`, `heroMotion`, `sectionReveal`, `imageReveal`, `textReveal`, `hoverBehavior`, `depthBehavior`, `scrollBehavior`, `staggerPattern`, `signatureMoments[]`.
- Escopo institucional ganha perfis próprios (`root-editorial`, `catalog-calm`), separados dos perfis de cliente.
- Moreira permanece `mechanical-contained`; JKL permanece `cabinetry-settling`. Nenhum perfil existente é reescrito.
- Um perfil só pode ajustar dentro dos limites do contrato global; nunca ultrapassar budget nem burlar reduced motion.

**Gate de três estados, com percepção medida:**

- `MOTION_DECLARED` — perfil existe no config. Nunca é PASS sozinho.
- `MOTION_IMPLEMENTED` — análise estática confirma primitives/atributos `data-motion` no componente da página.
- `MOTION_OBSERVED` — verificação em navegador real: para cada elemento `data-motion`, captura de estilo computado antes e depois do scroll; exige delta mensurável de `opacity` (≥ 0,3) ou `transform` (≥ 6px ou escala ≥ 0,01) e transição de `data-motion-state` para `played`; complementado por diferença de pixels entre dois screenshots do mesmo bloco. Sem delta = `MOTION_NOT_PERCEPTIBLE` (falha), mesmo com CSS presente.
- Execução adicional com `prefers-reduced-motion: reduce` obriga: todo conteúdo presente e visível, deslocamento zero.

## 4. Plano de migração (4 rodadas pequenas)

**Rodada 1 — Core global (sem mudança visual).** Criar contrato, tokens CSS, `data-motion`, hook único de CTA flutuante e perfis institucionais; primitives passam a ler o contrato. Nenhuma landing alterada. Canário: `/lab/motion-pilot`.

**Rodada 2 — Observabilidade e gate.** Auditor de runtime com delta computado + pixel diff, estados `DECLARED/IMPLEMENTED/OBSERVED`, execução também em reduced motion. Rodar em modo relatório sobre piloto, Moreira e JKL antes de bloquear.

**Rodada 3 — Raiz e páginas institucionais.** Aplicar perfis `root-editorial` e `catalog-calm` a `/`, `/portfolio` e páginas institucionais principais; unificar `Header` e `WhatsAppFloat` sob o contrato (incluindo guarda de reduced motion no loop). Gate institucional em modo relatório.

**Rodada 4 — Portfolios.** Blueprint passa a consumir o contrato explicitamente; Moreira e JKL revalidados sob `MOTION_OBSERVED` sem alterar personalidade; legados permanecem intocados, entrando só por gatilho real. Gate passa a bloquear projetos novos.

## 5. Detalhes técnicos

- Arquivos previstos: `src/config/global-motion-contract.json`, `src/lib/global-motion-contract.ts`, `src/hooks/useFloatingConversionVisibility.ts`, `scripts/audit-motion-observed.mjs`, extensões em `src/components/motion/index.tsx`, `src/styles.css` e `scripts/check-portfolio-landing-quality.mjs`.
- Sem dependências novas: IntersectionObserver, rAF, CSS e Playwright já existente.
- Zona institucional congelada (logo, `BrandLogo`, manifests) não é tocada; alterações em `Header`/`Footer` ficam restritas a timing e reduced motion, sujeitas a `validate:brand-integrity`.
