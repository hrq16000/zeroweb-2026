# GLOBAL WEB EXPERIENCE STANDARD

Norma permanente de produto. Independente da arquitetura da 0WEB: qualquer
domínio ou repositório do ecossistema adota este contrato **antes** de começar
a construir páginas.

Máquina: `src/config/experience-capabilities.json`.

Para landing pages, homes comerciais e páginas institucionais de aquisição, também é
obrigatório ler `.agents/skills/0web-landing-experience/SKILL.md` e
`docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md`.

## 1. Princípio

Uma página fantástica não é a que tem mais animação. É aquela em que
identidade, conteúdo, movimento e conversão parecem parte da mesma ideia.

Nunca aceitar como pronto:

- página estática genérica (hero + cards + CTA) só porque o build passou;
- página saturada de efeitos sem propósito;
- página tecnicamente verde, mas sem mídia crítica visível, vida visual ou assinatura própria.

## 2. Camadas obrigatórias

Toda página cumpre, simultaneamente:

```text
ENGINEERING · BRAND · MOTION · INTERACTION · CONTENT · CONVERSION
SEO · ACCESSIBILITY · PERFORMANCE · ORIGINALITY · PRIVACY
```

O padrão universal é a **capacidade**. A execução visual permanece individual:
mesmas primitives, composições diferentes.

## 3. Hierarquia tecnológica

```text
CSS → APIs nativas do navegador → motion system do projeto →
biblioteca leve especializada → biblioteca pesada só com justificativa
```

Uma skill nunca justifica sozinha uma dependência nova.

## 4. Motion system

Primitives oficiais, não animação avulsa espalhada por componentes:

`MotionScope · MotionReveal · MotionStagger · MotionTextReveal ·
MotionImageReveal · MotionCounter` (+ `useInViewOnce`,
`usePrefersReducedMotion`).

Regras invioláveis:

1. conteúdo existe no DOM e é visível sem JS (SSR/SEO intactos);
2. anima prioritariamente `transform`, `opacity`, `clip-path`;
3. `prefers-reduced-motion: reduce` remove deslocamento, parallax, marquee, float e zoom, e
   **nunca** esconde conteúdo;
4. entrada em viewport ocorre normalmente uma única vez;
5. animação nunca torna botão, foco ou leitura inacessível;
6. motion é fail-open: falha de JS, observer ou hidratação não pode manter conteúdo crítico invisível.

## 5. Intensidade

```text
SUBTLE · BALANCED · EXPRESSIVE · IMMERSIVE
```

Não existe `MAXIMUM_EVERYTHING`. Jurídico não se move como hamburgueria.

## 6. Motion profile por projeto

Campos em `motionProfileSchema` (intensity, preset, heroMotion, sectionReveal,
imageReveal, textReveal, iconMotion, hoverBehavior, depthBehavior,
scrollBehavior, staggerPattern, reducedMotionFallback e comportamento explícito
para desktop, tablet e mobile).

Presets (`EDITORIAL · CINEMATIC · TECHNICAL · PLAYFUL · LUXURY · ORGANIC ·
BOLD · MINIMAL`) são famílias combináveis, não templates fechados.

## 7. Motion budget

Budget significa **complexidade simultânea**, não proibição de variedade ao longo da página.

- `SUBTLE`: poucos efeitos, quase sempre microinterações e transições contextuais;
- `BALANCED`: hero + reveals + microinterações + um recurso de profundidade quando pertinente;
- `EXPRESSIVE`: gramática variada entre hero, mídia, navegação, coleções e transições;
- `IMMERSIVE`: pode combinar mais famílias, desde que performance, leitura e foco permaneçam estáveis.

Evitar múltiplos loops concorrentes, parallax em todo bloco e vários elementos chamando atenção ao mesmo tempo.
O limite é atenção/performance medida, não um número universal rígido de efeitos.

## 7.1 Motion Matrix global para landing/home comercial

Toda landing/home comercial deve avaliar explicitamente:

`fade-up` · `fade-left` · `fade-right` · `blur-in` · `scale-in` ·
`stagger-up` · `image-reveal` · `clip-reveal` · `parallax` · `marquee` ·
`float` · `header-scroll` · `menu-reveal`.

Status por capability:

`APPLIED` · `N/A_JUSTIFIED` · `REJECTED_PERFORMANCE`.

A obrigação não é ligar tudo: é **aplicar o máximo pertinente**, justificar o que não se aplica
e evitar a solução preguiçosa de um único `fade-up` repetido em toda a página.

## 8. Signature moments

Cada projeto tem no mínimo 1 momento de hero, 1 de seção e 1 de interação.
Podem ser extremamente sutis — mas precisam existir e ser próprios.

Em páginas `EXPRESSIVE`/`IMMERSIVE`, os signature moments devem demonstrar mais de uma família
de movimento (por exemplo reveal de mídia + profundidade/scroll + microinteração), sem excesso simultâneo.

## 9. Interação e microinterações

Botões: hover, focus visível, pressed, loading, success quando aplicável.
Cards: resposta contextual (imagem, profundidade, elevação).
Links: revelação de sublinhado + foco explícito. Ícones interativos com
feedback. Sem gimmick.

Header e menu mobile devem ter estados próprios quando a página usa navegação persistente.

## 10. Acessibilidade

Além de reduced motion: foco nunca se perde, leitura não é interrompida,
leitor de tela não recebe conteúdo duplicado, elemento animado não vira
armadilha de foco. Base: `docs/design/ACCESSIBILITY.md`.

## 11. Performance

Budgets em `src/config/portfolio-performance.json` +
`performanceBudget` das capabilities. Nunca fixar número sem medir baseline.
Proibido animar `width`, `height`, `top`, `left`, `margin` como estratégia principal de motion.

## 12. Mobile explícito

Cada capability declara `desktopBehavior`, `tabletBehavior`, `mobileBehavior` e
`reducedMotionBehavior`. Mobile não é desktop reduzido.

## 13. Capas autênticas

```text
PHOTO_DERIVED · BRAND_COMPOSITION · ABSTRACT_BRAND_ART
```

Nunca inventar fachada, funcionário, produto ou serviço executado. Nenhuma capa
pode ser "logo ao centro + gradiente + nome embaixo" repetido.

Para cases, projetos e conteúdo editorial, mídia real existente tem prioridade sobre grafismo abstrato genérico.

## 14. Originalidade inclui motion

A auditoria considera `motionProfile`, `heroMotion`, `sectionRhythm`,
`transitionStyle` e `interactionPattern`. Dois projetos não podem ser clones
animados.

Originalidade também inclui navegação, tratamento de imagem, CTA persistente,
ritmo vertical e fechamento/footer.

## 15. Skill profile

`branding · motion · interaction · storytelling · conversion · seo ·
accessibility · performance · originality · privacy`, cada um
`REQUIRED | OPTIONAL | NOT_APPLICABLE`.

Para trabalho substancial de landing/home comercial, o skill stack deve passar por
`0web-skill-discovery` e `0web-landing-experience`, consultando o registry de referências aprovadas.

## 16. Gate

`bun run check:experience-standard` (report-only) e
`check:experience-standard:enforce`. Bloqueiam apenas falhas objetivas:

```text
MOTION_CONTENT_INACCESSIBLE · REDUCED_MOTION_BROKEN ·
MOTION_CAUSES_LAYOUT_SHIFT · INTERACTION_UNUSABLE ·
MOBILE_OVERFLOW · PERFORMANCE_REGRESSION
```

Nunca bloquear por gosto. Qualidade autoral continua em review humano.

## 16.1 Evidência visual e temporal

Build, classes CSS e configuração de motion não provam experiência.

Landing/home comercial deve registrar no navegador real áreas equivalentes a:

1. hero;
2. bloco narrativo/visual principal;
3. serviços/oferta;
4. experiência/prova;
5. projetos/cases/galeria com imagens efetivamente visíveis;
6. conteúdo/editorial com mídia real quando disponível;
7. CTA persistente quando aplicável;
8. footer/fechamento.

Para signature moments, registrar no mínimo:

`BEFORE → DURING → AFTER`, além de `prefers-reduced-motion`.

Se uma seção de projetos fica vazia/escura porque o reveal não finalizou, o estado é FAIL,
mesmo que build/tests passem.

## 17. Documentação de decisão

Cada projeto registra `whyThisMotion`, `signatureMoments`, `motionIntensity`,
`performanceNotes`, `accessibilityNotes`, `originalityNotes` em
`portfolio-motion-profiles.json → decisions` quando estiver na zona de portfólio.

Para landing/home institucional fora do portfólio, registrar equivalente no PR/relatório da rodada.

## 18. Identidade não é portável

A norma é global. A identidade não. Cada domínio tem público, marca, objetivo,
intensidade, funil e linguagem próprios.

## 19. Contrato de novos projetos (vigente desde a Onda 6)

Nenhum projeto novo entra em `/portfolio/<slug>` sem, já no nascimento:

1. perfil de motion resolvível (`overrides[slug]` ou `defaultsBySegment`,
   com fallback `default`);
2. pelo menos um sinal real de experiência no componente do cliente
   (primitives de `src/components/motion`, `motion/react`, `animate-*`,
   `transition*` ou `hover:`);
3. nenhuma animação infinita sem guarda de `prefers-reduced-motion`;
4. assinatura perceptível própria — não reaproveitar a combinação de outro
   cliente (reutilizar primitives é infraestrutura, não clone);
5. funil próprio, capa/logo próprios, SEO próprio e contato só no servidor;
6. evidência de runtime suficiente para provar que mídia crítica e motion realmente aparecem.

Itens 1–3 são verificados por `bun run validate:portfolio-scaffold`
(bloqueante). Item 4 é medido por `bun run check:experience-standard`
(`MOTION_CLONES`, `MOTION_GROUPS`). Item 5 pelos gates já existentes de
originalidade, capas, boundaries e privacidade. Item 6 exige browser QA/evidência visual.

O nível de experiência publicado no admin vem exclusivamente de
`src/config/portfolio-experience-levels.json`, gerado pelo gate. Ninguém
classifica projeto à mão.
