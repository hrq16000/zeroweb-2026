# HOME3 · Direção aditiva do mix

## Regra central

`/home2` é baseline aprovado e deve permanecer intacta durante a experimentação da Home3.

`/home3` evolui por **soma**, nunca por substituição. Nenhuma nova referência pode apagar uma qualidade já conquistada no baseline. Mudanças que removam hero, seções, mídia, motion, ritmo ou comportamento aprovados exigem justificativa objetiva antes de serem aceitas.

A identidade final é sempre **0WEB**. As referências abaixo são repertório de composição e comportamento, nunca templates para clonagem.

## As quatro referências e o que agregar

### WCRIA

Usar como referência de:
- escala tipográfica e hero editorial;
- grande respiro;
- alternância clara/escura entre capítulos;
- soluções limpas;
- portfólio visual e full-bleed;
- editorial/blog com presença de mídia;
- sensação premium e ritmo de agência.

Não copiar marca, textos, imagens, cases, depoimentos ou métricas.

### Doğukan Tavlacı

Usar como referência de:
- energia tecnológica;
- header translúcido/sticky e navegação viva;
- hero com profundidade e parallax;
- ecossistema/stack visual;
- microinterações;
- processo/timeline;
- FAQ quando houver conteúdo real;
- motion rico e contextual.

Não copiar portrait, números, reviews, claims ou provas de terceiros.

### Suprema Mídia

Usar como referência de:
- amplitude de soluções;
- autoridade informacional;
- SEO, presença local, automação e IA;
- portfólio vivo;
- diferenciais objetivos;
- profundidade de conteúdo sem excesso textual.

Não copiar claims, números, textos, clientes ou layouts literais.

### Prime2B

Usar como referência de:
- narrativa por pilares;
- blocos de alto contraste;
- sensação de agência em movimento;
- crescimento/performance como narrativa;
- ecossistema integrado de soluções;
- ritmo forte entre capítulos.

Não copiar métricas, clientes, logos, claims ou estrutura literal.

## Síntese 0WEB esperada

- **WCRIA:** macrocomposição, escala, respiro, portfólio e editorial.
- **Doğukan:** vida, tecnologia, processo, interação e motion.
- **Suprema:** autoridade, amplitude, SEO/local/IA/automação e densidade útil.
- **Prime2B:** pilares, contraste, narrativa de crescimento e ecossistema.
- **0WEB:** marca, serviços, projetos reais, funil, linguagem, conteúdo e identidade final.

Nenhuma referência pode dominar a página inteira.

## Política de implementação

1. Ler o baseline atual antes de editar.
2. Classificar cada proposta como `PRESERVAR`, `AGREGAR` ou `NÃO COPIAR`.
3. Implementar novas camadas apenas em arquivos Home3-específicos quando possível.
4. Não editar arquivos Home2 para obter um efeito exclusivo da Home3.
5. Reutilizar componentes canônicos da 0WEB apenas quando isso não acoplar futuras mudanças da Home3 à Home2.
6. Não usar Blueprint/skeleton de `/portfolio/:slug`.
7. Não transformar a Home3 em dashboard, bento ou landing SaaS genérica.
8. Não inventar métricas, clientes, avaliações, resultados ou depoimentos.

## Motion esperado

Avaliar de forma contextual, não uniforme:
- `fade-up`
- `fade-left`
- `fade-right`
- `blur-in`
- `scale-in`
- `stagger-up`
- `image-reveal`
- `clip-reveal`
- `parallax`
- `marquee`
- `float`
- `header-scroll`
- `menu-reveal`

Motion é **fail-open**: conteúdo visível por padrão. Falha de observer/runtime não pode deixar conteúdo preso em `opacity: 0`, `visibility: hidden` ou `clip-path` fechado.

`prefers-reduced-motion` deve manter todo o conteúdo visível e desativar loops, parallax e movimentos prolongados.

## Evidência visual obrigatória

Para alterações relevantes, validar ao menos:
- hero;
- estratégia/sobre;
- serviços;
- experiência/pilares;
- projetos com imagens reais visíveis;
- conteúdo/editorial com mídia real;
- CTA persistente quando aplicável;
- footer.

Para motion importante, capturar/validar três estados:
- BEFORE;
- DURING;
- AFTER.

## Responsividade

QA mínimo:
- 1440px;
- 768px;
- 390px;
- 390px com `prefers-reduced-motion`.

Sem overflow horizontal, com toque mínimo adequado, mídia responsiva e elementos decorativos sem cobrir conteúdo/CTA.

## Indexação e publicação

Enquanto laboratório:
- `/home3` permanece `noindex,nofollow`;
- não entra em sitemap/menu principal;
- não substitui `/`;
- não altera `/home2`;
- merge/publicação só após QA e aprovação explícita.
