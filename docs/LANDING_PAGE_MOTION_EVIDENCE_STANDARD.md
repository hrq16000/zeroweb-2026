# LANDING PAGE MOTION & VISUAL EVIDENCE STANDARD

Status: norma global para landing pages, homes comerciais e páginas institucionais de aquisição do ecossistema 0WEB.

Skill executável: `.agents/skills/0web-landing-experience/SKILL.md`.

## 1. Objetivo

A 0WEB não trata motion, mídia e direção visual como acabamento opcional. Em páginas de aquisição,
eles fazem parte da experiência, da percepção de valor e da originalidade.

O agente deve buscar o **máximo de capacidades pertinentes**, e não o máximo de efeitos ligados.
Cada escolha precisa servir hierarquia, narrativa, orientação, profundidade, feedback ou conversão.

## 2. Regra anti-template

É proibido concluir uma página que pareça apenas:

```text
hero + grid de cards + prova + CTA
```

com pequenas mudanças de cor, copy ou logo.

A originalidade deve ser perceptível em:

- hero;
- topologia e ordem narrativa;
- escala tipográfica;
- uso de imagem;
- geometria;
- densidade;
- ritmo vertical;
- transições entre capítulos;
- motion grammar;
- navegação;
- CTA persistente;
- encerramento/footer.

Reutilizar primitives de engenharia é correto. Reutilizar a mesma experiência visual não.

## 3. Motion matrix global

Toda landing avalia a seguinte paleta:

| Capability | Uso típico |
|---|---|
| `fade-up` | entrada leve de copy/heading |
| `fade-left` | bloco editorial vindo da direita para a posição final |
| `fade-right` | bloco editorial vindo da esquerda para a posição final |
| `blur-in` | hero/texto/mídia com foco progressivo |
| `scale-in` | assinatura, CTA, mídia ou bloco de prova |
| `stagger-up` | serviços, logos, steps, listas e coleções |
| `image-reveal` | mídia entrando com máscara/escala |
| `clip-reveal` | projeto, hero image, faixa editorial, transição de capítulo |
| `parallax` | profundidade em hero, mídia ou background |
| `marquee` | logos, clientes, categorias ou faixa textual contínua |
| `float` | elemento decorativo/mídia em movimento lento e controlado |
| `header-scroll` | mudança do header por contexto de scroll |
| `menu-reveal` | abertura/fechamento do menu mobile com hierarquia |

Status permitido por capability:

```text
APPLIED
N/A_JUSTIFIED
REJECTED_PERFORMANCE
```

`N/A` sem justificativa não vale.

## 4. Cobertura mínima por função

Não existe número mágico de animações. Existe cobertura de funções.

Uma landing comercial substancial deve normalmente contemplar:

- **Hero load** — sequência própria para headline, apoio, prova e CTA;
- **Navigation state** — header/menu reage à navegação e ao scroll;
- **Section entry** — capítulos entram com intenção, não todos iguais;
- **Media reveal** — imagens/cases têm reveal compatível com a direção;
- **Repeated group rhythm** — listas/serviços usam stagger quando apropriado;
- **Depth/scroll** — parallax, sticky, pan ou outro efeito quando compatível;
- **Microinteraction** — hover, focus, pressed, links e ícones respondem;
- **Persistent conversion** — CTA flutuante/persistente quando a estratégia pedir;
- **Narrative transition** — claro/escuro, overlap, mask, faixa, linha ou outro recurso conecta capítulos;
- **Reduced motion** — versão funcional e completa.

Uma página `EXPRESSIVE`/`IMMERSIVE` deve demonstrar variedade maior que `SUBTLE`/`BALANCED`,
mas sem concorrência simultânea entre efeitos.

## 5. Motion não pode ser decoração automática

Pergunta obrigatória para cada efeito:

> O que este movimento comunica ou melhora?

Respostas válidas incluem:

- direciona o olhar;
- explica relação espacial;
- cria continuidade entre capítulos;
- dá feedback de interação;
- diferencia hierarquia;
- revela mídia com intenção;
- reforça personalidade da marca.

Se a resposta for apenas "porque fica bonito", reduza ou remova.

## 6. Conteúdo visível por padrão — fail-open

Motion é enhancement, não dependência do conteúdo.

Regras:

1. SSR/HTML contém o conteúdo real;
2. conteúdo crítico é visível se JS falhar;
3. `opacity:0`, `visibility:hidden` e `clip-path` só podem ser ativados de modo seguro;
4. observer ausente/falhando não deixa seção invisível;
5. erro de hidratação não pode transformar media/case em bloco vazio;
6. `prefers-reduced-motion` remove deslocamento/loop/parallax e mantém conteúdo visível.

Se uma seção de projetos renderiza como grande bloco escuro sem as capas, isso é **FAIL**, mesmo com build verde.

## 7. Evidência de imagens e assets

Para mídia crítica, verificar em runtime:

- `src/currentSrc`;
- `naturalWidth`/`naturalHeight`;
- resposta de rede;
- `object-fit`/crop;
- opacity/visibility;
- overlay/z-index;
- lazy loading;
- estado final após motion.

Projetos/cases devem usar capas reais quando existem. Conteúdo editorial deve usar mídia real quando disponível.
Grafismos abstratos podem complementar, mas não devem substituir imagem real apenas por conveniência.

## 8. Evidência visual mínima

Capturar/registrar as áreas equivalentes a:

1. **hero**;
2. **bloco narrativo/visual principal**;
3. **serviços/oferta**;
4. **experiência/prova**;
5. **projetos/cases/galeria com imagens visíveis**;
6. **conteúdo/editorial com mídia real quando disponível**;
7. **CTA flutuante/persistente quando aplicável**;
8. **footer/fechamento**.

Os nomes das seções podem variar. O que importa é provar as funções visuais críticas.

## 9. Evidência temporal de motion

Configuração não prova animação.

Para cada signature moment escolhido, medir/registrar pelo menos:

```text
BEFORE  → antes da entrada/gatilho
DURING  → frame/estado intermediário perceptível
AFTER   → estado final estável
```

No mínimo verificar:

- 1 signature moment do hero;
- 1 reveal/scroll de mídia ou seção;
- 1 microinteração/navigation state.

Também registrar reduced-motion.

## 10. Header e navegação

Quando pertinente:

- transparente → sólido/blurred ao scroll;
- alteração de densidade/altura contextual;
- hover e focus visual nos links;
- âncoras com navegação coerente;
- menu mobile com `aria-expanded`, foco e reveal próprio;
- menu mobile não é versão espremida do desktop.

## 11. Serviços e listas

Coleções não devem parecer cards SaaS por padrão.

Use composição adequada à marca e, quando houver repetição:

- stagger controlado;
- ícones com microfeedback;
- CTA/seta respondendo ao hover/focus;
- diferenças de ritmo e densidade;
- sem excesso de sombra/glass/radius apenas por convenção de IA.

## 12. Projetos/cases

Projetos são mídia, não placeholders.

Quando a página tem galeria/cases:

- capa real visível;
- reveal de imagem contextual;
- overlay legível;
- hover/focus com nome/ação;
- ausência de gap/blank involuntário;
- crop responsivo;
- navegação real para o projeto quando existir.

## 13. Conteúdo editorial

Conteúdo/blog precisa parecer conteúdo, não card abstrato genérico.

Prioridade:

1. imagem real do artigo;
2. mídia institucional verdadeira;
3. capa/projeto real semanticamente relacionado;
4. arte abstrata apenas quando não houver mídia factual apropriada.

Nunca inventar post, data, autor, estatística ou imagem factual.

## 14. CTA flutuante

Quando a estratégia de conversão adotar CTA persistente:

- reutilizar mecanismo canônico do domínio;
- preservar analytics/funil;
- respeitar safe-area e mobile;
- alvo de toque ≥44px;
- não cobrir conteúdo/consentimento;
- reduced-motion não pode impedir uso.

## 15. Skills e repertório

Antes de trabalho substancial, usar `0web-skill-discovery`.

Referências aprovadas/condicionais são registradas em `docs/skills/REGISTRY.md`.
O objetivo é combinar competências diferentes:

```text
creative direction
+ frontend craft
+ landing/CRO
+ motion
+ UX/HIG
+ accessibility
+ performance
+ visual/browser QA
```

Não empilhar várias skills que repetem o mesmo template.

### Fontes de descoberta e repertório já consideradas

- `https://www.skills.sh/`
- `vercel-labs/skills/find-skills`
- Anthropic `frontend-design`
- `sergekostenchuk/ui-ux-agent-skill-system`
- `educlopez/ui-craft`
- `sugarforever/open-design-skill`
- `DonkeyKing01/tasteful-ui-skill`
- `dickwu/apple-design-skill`
- `uxuiprinciples/agent-skills`
- Figma agent skills quando houver arquivo/design verificável
- `jezweb/claude-skills → landing-page`
- `bear2u/my-skills → landing-page-guide-v2`
- marketplaces de skills apenas como descoberta; fonte original precisa ser revisada.

O caminho solicitado `K-Dense-AI/scientific-agent-skills/skills/ui-ux-design` foi verificado e não está presente no upstream na revisão de 2026-09-12; portanto não deve ser fingido como instalado.

## 16. Apple/HIG

Apple HIG é camada de revisão de interação e qualidade, não skin visual.

Aplicar principalmente em:

- clareza de hierarquia;
- affordance;
- feedback;
- foco;
- ergonomia mobile;
- reduced motion;
- consistência de estados.

Nunca transformar todos os sites em "estilo Apple".

## 17. Browser QA

Mínimo para landing/home comercial:

- 390px;
- 768px;
- 1440px;
- 390px com reduced-motion.

Quality gate geral continua cobrindo também os demais viewports definidos em
`.agents/skills/0web-ui-quality-gates/SKILL.md`.

Verificar:

- overflow;
- console;
- hydration;
- imagens críticas;
- navegação;
- foco;
- motion observado;
- CTA/funil;
- sticky/floating;
- CLS;
- reduced-motion.

## 18. Relatório de conclusão

Toda rodada material de landing deve informar:

- skills efetivamente usadas;
- motion capabilities `APPLIED`;
- motion capabilities `N/A_JUSTIFIED`;
- signature moments observados;
- evidência visual capturada;
- imagens críticas verificadas;
- mobile/reduced-motion;
- tests/build/gates;
- arquivos alterados.

Não declarar PASS por leitura de código. PASS exige produto renderizado.
