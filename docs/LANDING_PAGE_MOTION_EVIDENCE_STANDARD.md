# LANDING PAGE MOTION & VISUAL EVIDENCE STANDARD

Status: norma global para landing pages, homes comerciais e páginas institucionais de aquisição do ecossistema 0WEB.

Skill executável: `.agents/skills/0web-landing-experience/SKILL.md`.

## 1. Objetivo

A 0WEB não trata motion, mídia e direção visual como acabamento opcional. Em páginas de aquisição,
elas fazem parte da experiência, da percepção de valor e da originalidade.

O agente deve buscar o **máximo de capacidades pertinentes**, e não o máximo de efeitos ligados.
Cada escolha precisa servir hierarquia, narrativa, orientação, profundidade, feedback ou conversão.

## 2. Regra anti-template

É proibido concluir uma página que pareça apenas `hero + grid de cards + prova + CTA` com pequenas mudanças de cor, copy ou logo.

A originalidade deve ser perceptível em hero, topologia narrativa, escala tipográfica, uso de imagem, geometria, densidade, ritmo vertical, transições entre capítulos, motion grammar, navegação, CTA persistente e encerramento/footer.

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

`APPLIED` · `N/A_JUSTIFIED` · `REJECTED_PERFORMANCE`.

`N/A` sem justificativa não vale.

## 4. Cobertura mínima por função

Não existe número mágico de animações. Existe cobertura de funções.

Uma landing comercial substancial deve normalmente contemplar:

- Hero load — sequência própria para headline, apoio, prova e CTA;
- Navigation state — header/menu reage à navegação e ao scroll;
- Section entry — capítulos entram com intenção, não todos iguais;
- Media reveal — imagens/cases têm reveal compatível com a direção;
- Repeated group rhythm — listas/serviços usam stagger quando apropriado;
- Depth/scroll — parallax, sticky, pan ou outro efeito quando compatível;
- Microinteraction — hover, focus, pressed, links e ícones respondem;
- Persistent conversion — CTA flutuante/persistente quando a estratégia pedir;
- Narrative transition — claro/escuro, overlap, mask, faixa, linha ou outro recurso conecta capítulos;
- Reduced motion — versão funcional e completa.

Uma página `EXPRESSIVE`/`IMMERSIVE` deve demonstrar variedade maior que `SUBTLE`/`BALANCED`, mas sem concorrência simultânea entre efeitos.

## 5. Motion não pode ser decoração automática

Pergunta obrigatória para cada efeito: **o que este movimento comunica ou melhora?**

Respostas válidas incluem direcionar o olhar, explicar relação espacial, criar continuidade entre capítulos, dar feedback de interação, diferenciar hierarquia, revelar mídia com intenção e reforçar personalidade da marca.

Se a resposta for apenas “porque fica bonito”, reduza ou remova.

## 6. Conteúdo visível por padrão — fail-open

Motion é enhancement, não dependência do conteúdo.

1. SSR/HTML contém o conteúdo real;
2. conteúdo crítico é visível se JS falhar;
3. `opacity:0`, `visibility:hidden` e `clip-path` só podem ser ativados de modo seguro;
4. observer ausente/falhando não deixa seção invisível;
5. erro de hidratação não pode transformar media/case em bloco vazio;
6. `prefers-reduced-motion` remove deslocamento/loop/parallax e mantém conteúdo visível.

Se uma seção de projetos renderiza como grande bloco escuro sem as capas, isso é **FAIL**, mesmo com build verde.

## 7. Evidência de imagens e assets

Para mídia crítica, verificar em runtime `src/currentSrc`, `naturalWidth/naturalHeight`, resposta de rede, `object-fit`/crop, opacity/visibility, overlay/z-index, lazy loading e estado final após motion.

Projetos/cases devem usar capas reais quando existem. Conteúdo editorial deve usar mídia real quando disponível. Grafismos abstratos podem complementar, mas não devem substituir imagem real apenas por conveniência.

## 8. Evidência visual mínima

Capturar/registrar as áreas equivalentes a:

1. hero;
2. bloco narrativo/visual principal;
3. serviços/oferta;
4. experiência/prova;
5. projetos/cases/galeria com imagens visíveis;
6. conteúdo/editorial com mídia real quando disponível;
7. CTA flutuante/persistente quando aplicável;
8. footer/fechamento.

## 9. Evidência temporal de motion

Configuração não prova animação.

Para cada signature moment escolhido, medir/registrar pelo menos `BEFORE → DURING → AFTER`.

No mínimo verificar 1 signature moment do hero, 1 reveal/scroll de mídia ou seção, 1 microinteração/navigation state e também o estado reduced-motion.

## 10. Header e navegação

Quando pertinente:

- transparente → sólido/blurred ao scroll;
- alteração de densidade/altura contextual;
- hover e focus visual nos links;
- âncoras com navegação coerente;
- menu mobile com `aria-expanded`, foco e reveal próprio;
- menu mobile não é versão espremida do desktop.

## 11. Serviços e listas

Coleções não devem parecer cards SaaS por padrão. Use composição adequada à marca e, quando houver repetição, stagger controlado, ícones com microfeedback, CTA/seta respondendo ao hover/focus e diferenças de ritmo e densidade.

## 12. Projetos/cases

Projetos são mídia, não placeholders. Quando a página tem galeria/cases: capa real visível, reveal de imagem contextual, overlay legível, hover/focus com nome/ação, ausência de gap/blank involuntário, crop responsivo e navegação real para o projeto quando existir.

## 13. Conteúdo editorial

Prioridade de mídia:

1. imagem real do artigo;
2. mídia institucional verdadeira;
3. capa/projeto real semanticamente relacionado;
4. arte abstrata apenas quando não houver mídia factual apropriada.

Nunca inventar post, data, autor, estatística ou imagem factual.

## 14. CTA flutuante

Quando a estratégia de conversão adotar CTA persistente, reutilizar mecanismo canônico do domínio, preservar analytics/funil, respeitar safe-area e mobile, alvo de toque ≥44px e não cobrir conteúdo/consentimento.

## 15. Skills e repertório

Antes de trabalho substancial, usar `0web-skill-discovery`.

Referências de repertório a considerar quando pertinentes:

- `https://www.skills.sh/` e `vercel-labs/skills/find-skills`;
- Anthropic `frontend-design`;
- `sergekostenchuk/ui-ux-agent-skill-system`;
- `educlopez/ui-craft`;
- `sugarforever/open-design-skill`;
- `DonkeyKing01/tasteful-ui-skill`;
- `dickwu/apple-design-skill`;
- `uxuiprinciples/agent-skills`;
- Figma agent skills quando houver arquivo/design verificável;
- `jezweb/claude-skills → landing-page`;
- `bear2u/my-skills → landing-page-guide-v2`.

Marketplaces de skills servem como descoberta; a fonte original deve ser revisada antes de adoção. Skill externa é especialista, nunca autoridade absoluta nem justificativa automática para dependência pesada.

## 16. Referências visuais para estudo, não clonagem

Referências como WCRIA, Doğukan Tavlacı e Suprema Mídia podem informar ritmo, profundidade, hierarquia, motion, tratamento de mídia e fluxo comercial. O que se absorve é a gramática visual/comportamental; marca, copy, assets, métricas, depoimentos e claims permanecem próprios e verificáveis.

## 17. Apple/HIG

Apple HIG é camada de revisão de interação e qualidade, não skin visual. Aplicar principalmente em clareza de hierarquia, affordance, feedback, foco, ergonomia mobile, reduced motion e consistência de estados.

## 18. Browser QA

Mínimo para landing/home comercial:

- 390px;
- 768px;
- 1440px;
- 390px com reduced-motion.

Verificar overflow, console, hydration, imagens críticas, navegação, foco, motion observado, CTA/funil, sticky/floating, CLS e reduced-motion.

## 19. Relatório de conclusão

Toda rodada material de landing deve informar skills efetivamente usadas, motion capabilities `APPLIED`, motion capabilities `N/A_JUSTIFIED`, signature moments observados, evidência visual capturada, imagens críticas verificadas, mobile/reduced-motion, tests/build/gates e arquivos alterados.

Não declarar PASS por leitura de código. PASS exige produto renderizado.
