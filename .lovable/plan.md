# Home2 — convergência visual com a referência

## Objetivo
Aproximar a composição, proporções, ritmo e comportamento da `/home2` à referência WCRIA, mantendo marca, conteúdo, imagens, links e dados reais da 0WEB. A rota `/`, os projetos em `/portfolio/:slug`, seus funis e a zona institucional congelada não serão alterados.

## Diagnóstico visual já medido
- A altura desktop total já é comparável: Home2 5.764 px versus referência 5.712 px em 1440 px.
- A primeira dobra da Home2 está mais alta (940 px versus 853 px) e as faixas curvas dominam mais a leitura; serão reposicionadas e refinadas, sem adicionar mockups.
- O bloco de soluções está fragmentado em introdução + grade e ocupa mais altura que a referência; será compactado para recuperar ritmo editorial.
- A galeria atual ainda precisa parecer mídia full-bleed, não uma seção contida.
- A prova e o conteúdo editorial precisam ganhar composição visual e alternância de escala, evitando a sensação de coleção de componentes.
- Tablet e mobile acumulam altura excessiva especialmente em serviços e projetos; terão composição própria, não apenas empilhamento.

## Alterações
1. **Composição da Home2**
   - Ajustar somente `Home2Prototype.tsx` para completar a frase da faixa curta, alinhar os seis serviços solicitados e usar imagens reais do catálogo também na faixa editorial.
   - Preservar o cabeçalho, links reais, contagem dinâmica comprovável e CTA/funil existentes.
   - Manter a página isolada e sem qualquer primitive de Blueprint ou motion de portfólio.

2. **Direção visual local**
   - Refinar somente `home2-wcria.css`: hero cinematográfico, headline e espaço negativo; faixa curta; montagem 50/50; soluções 2×3 mais editoriais; experiência escura; faixa contínua de clientes; projetos full-bleed; prova legítima; editorial com grandes crops; fechamento próprio.
   - Reduzir arredondamentos, sombras e containers onde hoje lembram cards genéricos.
   - Criar tratamentos específicos para 1440, 768 e 390 px, com alvos de toque de pelo menos 44 px e sem overflow.

3. **Motion exclusivo da Home2**
   - Evoluir apenas `home2-motion.ts`, sem dependência nova: sequência de hero, parallax leve das faixas e montagem, stagger de serviços, entradas independentes na experiência, faixa horizontal lenta, clip reveal dos projetos, editorial alternado e fechamento próprio.
   - Preservar conteúdo integral em `prefers-reduced-motion`, removendo parallax, loops e deslocamentos longos.

4. **Verificação e registro**
   - Fazer comparação visual por screenshots com a referência em 1440 px e revisar a silhueta após a implementação.
   - Validar 1440, 768, 390 e reduced-motion em navegador real: sticky header, menu, crop, links, CTAs/funil, foco, hover, parallax, stagger, reveal, hidratação, console e overflow.
   - Executar `bun test` e `bun run build`.
   - Registrar as competências aplicadas no changelog obrigatório, sem publicar.

## Arquivos previstos
- `src/components/site/Home2Prototype.tsx`
- `src/components/site/home2-wcria.css`
- `src/components/site/home2-motion.ts`
- `docs/skills/CHANGELOG.md`
- `roadmap.md` somente para acompanhar e fechar esta rodada, sem alterar produto.

## Fora de escopo
- Publicação, merge ou mudança de branch.
- Alterações em `/`, `/portfolio`, `/portfolio/:slug`, conteúdo/funil de clientes, SEO dessas páginas ou identidade institucional congelada.
- Novas dependências, GSAP, Blueprint, structural family, templates genéricos ou dados não comprovados.
