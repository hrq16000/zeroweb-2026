# Experiência imersiva em `/portfolio/:slug`

Aplicação da norma global (`docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md`) à zona de
portfólio. Config: `src/config/portfolio-motion-profiles.json`.

## 1. O que é compartilhado e o que não é

Compartilhado: primitives de motion, `PortfolioStandardShell`, funil, popups,
rodapé com crédito de hospedagem, analytics, acessibilidade, gates.

Exclusivo de cada cliente: identidade, composição, ritmo, perfil de motion,
iconografia, capa, copy, SEO e funil.

Design system ≠ mesmo site. As mesmas peças precisam se combinar de forma
diferente em cada projeto.

## 2. Resolução do perfil

```text
overrides[clientKey]  >  defaultsBySegment[segment]  >  SUBTLE/MINIMAL
```

Segmento vem de `src/config/portfolio-catalog.json`. Projetos Managed herdam o
perfil do wizard; projetos custom continuam autorais, mas obedecem ao standard.

## 3. Experiência mínima obrigatória

Um projeto só é considerado premium quando demonstra:

1. transição de entrada da página;
2. tratamento próprio de hero;
3. reveal de seções coerente com o ritmo do negócio;
4. microinterações em cards ou links;
5. feedback explícito no CTA;
6. identidade de movimento reconhecível.

## 4. Signature moments

Registrar por projeto em `decisions[clientKey]`:

```json
{
  "whyThisMotion": "...",
  "signatureMoments": ["hero: ...", "section: ...", "interaction: ..."],
  "motionIntensity": "BALANCED",
  "performanceNotes": "...",
  "accessibilityNotes": "...",
  "originalityNotes": "..."
}
```

## 5. Profundidade e scroll storytelling

Planos sobrepostos, imagem atravessando limite de seção, sticky storytelling e
revelação progressiva são **capacidades opcionais**. Só entram quando o negócio
pede e nunca prejudicam leitura, teclado, mobile ou performance.

## 6. Capas pendentes

As 10 capas bloqueadas deixam de ficar eternamente travadas: podem ser
resolvidas como `BRAND_COMPOSITION` ou `ABSTRACT_BRAND_ART`, usando marca,
tipografia, formas, texturas e tokens reais — sem simular fotografia,
fachada, equipe ou serviço executado que não existam.

Cada nova capa é comparada com os nearest matches do gate de originalidade.

## 7. Rollout em ondas

1. **Onda 0 (esta rodada):** system, config, docs, gate, auditoria. Sem
   redesign.
2. **Onda 1:** projetos `STATIC` com maior tráfego, um lote pequeno por vez.
3. **Onda 2:** demais `STATIC`.
4. **Onda 3:** projetos `BASELINE` que ganham com refinamento.

Projetos autorais já aprovados nas rodadas anteriores **não** são
redesenhados. Motion só entra quando melhora, combina e preserva a identidade.
Nada de codemod cego nas 68 páginas.

## 8. QA de motion por projeto

Relatório com estados `PASS | WARNING | FAIL` para: `heroMotion`,
`sectionMotion`, `interactionMotion`, `pageTransition`, `mobileMotion`,
`reducedMotion`, `performance`. Viewports mínimos: 390px e 1440px.

## 9. Gates

```bash
bun run check:experience-standard
bun run check:portfolio-originality
bun run check:portfolio-projects
bun run validate:portfolio-boundaries
```
