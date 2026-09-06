# Padrão de direção criativa — `/portfolio/<slug>`

Status: **normativo para projetos novos e redesigns materiais a partir de 2026-09-06**.
Projetos existentes não são redesenhados automaticamente por esta regra; quando
forem materialmente alterados, passam pelo contrato abaixo.

## Princípio

A 0WEB padroniza a engenharia, segurança, SEO, performance, acessibilidade,
funil e observabilidade. **Não padroniza a composição visual do cliente.**

Um site novo deve parecer uma criação específica para aquele negócio. Cor e
logo diferentes sobre o mesmo esqueleto não contam como identidade própria.

## 1. Creative brief obrigatório

Antes do primeiro componente visual, criar `docs/portfolio/briefs/<slug>.md`
com os campos abaixo preenchidos:

```text
businessTruth:
audience:
singleGoal:
brandPersonality:
visualMetaphor:
layoutTopology:
heroArchetype:
navigationArchetype:
sectionRhythm:
typePairing:
colorRoles:
imageStrategy:
iconStrategy:
motionGrammar:
interactionSignature:
conversionNarrative:
proofStrategy:
nearestPortfolioRisks:
antiTemplateDecisions:
```

Para projeto publicado, nenhum campo pode permanecer como `[PREENCHER]`.

## 2. Competências obrigatórias

As categorias abaixo são capacidades, não obrigação de trocar a stack:

| Camada | Competências aplicadas no 0WEB |
|---|---|
| Estrutura web | HTML5 semântico via JSX/TSX, landmarks, headings, acessibilidade |
| CSS/layout | Tailwind v4, CSS Grid/Flexbox, custom properties escopadas, responsive/mobile-first |
| Interatividade | React 19, eventos React, state, modais, carrosséis, lightboxes e APIs quando necessárias |
| Build | Vite + Bun, TypeScript, lint/format, code splitting e bundling |
| UX/UI | direção visual, wireframe mental/Figma quando houver, hierarquia, navegação, microinterações |
| Acessibilidade | WCAG, teclado, foco, contraste, touch targets, reduced motion |
| Backend | TanStack Start/server functions + Supabase/Lovable Cloud quando a feature exigir |
| SEO | metadata própria, canonical, Open Graph/Twitter, JSON-LD, sitemap e conteúdo semântico |
| Performance | `PortfolioImage`, WebP/JPG, lazy loading, dimensões, LCP controlado, cache/CDN da plataforma |
| Versionamento | issue → branch → PR → revisão → merge; nunca alteração direta em `main` |
| Qualidade | testes, build, browser QA, Lighthouse/Pagespeed quando aplicável, console limpo |

Sass/Less, Vue, Angular, Webpack ou Babel não são adicionados só porque aparecem
em uma referência genérica. O equivalente deve ser aplicado na stack real do
0WEB, salvo necessidade técnica concreta e aprovada.

## 3. Skill stack em camadas

Para um novo portfolio/landing comercial:

```text
0web-skill-router
→ 0web-skill-discovery
→ 0web-portfolio-art-direction
→ 1 especialista de landing/CRO adequado à intenção
→ 0web-design-system (engenharia visual, identidade local do cliente)
→ motion/accessibility/performance especialistas quando relevantes
→ 0web-ui-quality-gates
→ browser + funnel + originality QA
```

O objetivo é usar **máximo de competências úteis**, não máximo de dependências
nem máximo de contexto. Skills redundantes são descartadas.

## 4. Diversidade visual real

Todo projeto novo precisa decidir conscientemente:

- topologia de layout;
- composição do hero;
- tipografia;
- sistema de cor;
- linguagem de bordas/radius;
- ritmo vertical e densidade;
- tratamento de imagem;
- linguagem de ícones/decoração;
- gramática de motion;
- assinatura interativa;
- narrativa de conversão.

Não usar automaticamente:

`navbar padrão → hero split → cards 3 colunas → benefícios → depoimentos → FAQ → CTA`.

Essa ordem só é permitida se o briefing justificar cada bloco e a composição
resultante continuar materialmente distinta do portfólio existente.

## 5. Tipografia e tokens do cliente

Os tokens globais existem para a plataforma. Dentro de um site de cliente,
crie escopo local (`data-client-theme`, classe raiz ou custom properties locais)
quando isso for necessário para preservar identidade.

Não forçar Space Grotesk/Inter. Fontes podem variar por cliente desde que sejam
licenciadas/permitidas, performáticas e possuam fallback adequado.

## 6. Imagens e mídia

Cada cliente tem diretório próprio. Priorizar materiais oficiais.

Quando não houver foto real suficiente, pode-se criar composição de marca,
ilustração ou fotografia conceitual que **não seja apresentada como prova
factual** do cliente. Não fabricar equipe, sede, cliente, obra executada,
resultado, antes/depois ou produto inexistente como se fossem reais.

Capas devem manter leitura em mobile e desktop, contraste suficiente e crop
coerente com a identidade do projeto.

## 7. Prova social

Depoimentos, avaliações, estrelas, prêmios, contadores, logos de clientes e
resultados publicados precisam de evidência. Conteúdo fictício para protótipo é
permitido somente se estiver explicitamente rotulado como exemplo/demonstração.

Prova social ausente não é motivo para inventar: usar processo, garantias reais,
escopo, materiais, FAQ, metodologia, fotos oficiais ou outra evidência legítima.

## 8. Motion

Todo projeto novo v2 precisa de override próprio em
`src/config/portfolio-motion-profiles.json`. Defaults por segmento são fallback
legado e ponto de inspiração, nunca direção final de um cliente novo.

Motion deve traduzir o negócio. Máximo usual: três signature moments, um
parallax, um stagger por viewport e um loop, sempre respeitando
`prefers-reduced-motion` e budgets de performance.

## 9. Anti-template gate humano + automático

Antes do PR:

1. rodar `check:portfolio-originality`;
2. comparar o novo projeto com seus três vizinhos mais próximos;
3. revisar hero, section order, components, style, copy, assets e identity;
4. registrar no creative brief quais decisões evitam semelhança.

Se a diferença depender principalmente de cor, logo ou troca de fotos, a
direção criativa ainda está incompleta.

## 10. WhatsApp e conversão

Todo cliente usa `clientKey`, funil individual e contato privado server-side.
Para novos clientes, a convenção canônica é:

```text
PORTFOLIO_WHATSAPP_<CLIENT_KEY_NORMALIZADO>
```

Ex.: `clientKey="sscons"` → `PORTFOLIO_WHATSAPP_SSCONS`.

Nenhum `wa.me`, telefone ou e-mail operacional entra no bundle público.

## 11. Definição de pronto

Novo projeto só pode ficar `published` quando:

- creative brief v2 estiver preenchido;
- componente não tiver marcador de scaffold pendente;
- identidade e assets forem próprios;
- motion override for próprio;
- funil e contato server-side estiverem configurados ou o estado operacional
  estiver explicitamente documentado;
- SEO, a11y, performance, privacidade, build e browser QA passarem;
- originalidade for revisada contra o portfólio real.
