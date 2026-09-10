# Análise completa — 0web.com.br (10/09/2026)

Base de evidências: Search Console (10/08 a 06/09/2026), auditoria de
acessibilidade de 92 rotas, inventário de capas, mapa único do portfólio
(189 URLs) e código atual do portal. Nada aqui é estimativa inventada.

## 1. Visão geral (evidência real)

- Home indexada ("Submitted and indexed"), canônica correta, rastreio em
  01/09/2026 como mobile, robots permitindo.
- Desempenho do período: **0 cliques, 19 impressões**, posição média ~9,5.
- Páginas com impressão: home, `/solucoes`, `/servicos/criacao-de-sites`,
  `/bairros-bh` e dois bairros de BH.
- Consultas: "0web" e variações. Ou seja: hoje o site aparece quase só para
  quem já conhece a marca. **Não há demanda genérica capturada.**

## 2. Pontos fortes

- Base técnica sólida: SSR real, sitemap único consolidado, robots limpo,
  metadados próprios em 89 projetos, JSON-LD por página.
- Zona institucional congelada e validada por gate automático.
- Funil próprio por cliente, contato sempre server-side (nenhum telefone ou
  e-mail exposto no código público — 495 arquivos verificados).
- Portfólio real com 89 projetos e busca interna inteligente (sinônimos,
  plural, erro de digitação).
- Painéis internos de leads, buscas, capas e SEO por cidade.

## 3. Pontos fracos

| Área | Problema | Evidência |
|---|---|---|
| Conversão orgânica | 0 cliques no período | GSC |
| Cobertura | ~462 URLs "detectadas, não indexadas" | relatório GSC |
| Prova visual | 42 capas ainda sem foto real do cliente | inventário |
| Acessibilidade | 60 rotas com contraste insuficiente (467 trechos) | axe-core |
| Prova social | poucos depoimentos auditáveis publicados | política editorial |
| Escala programática | muitas páginas locais finas competindo entre si | GSC |

## 4. Diagnóstico central

O portal tem **mais páginas do que autoridade**. O Google descobre as páginas
locais e programáticas, mas não gasta rastreio nelas porque:

1. o domínio tem pouquíssimo histórico de cliques;
2. muitas páginas regionais são variações do mesmo conteúdo;
3. faltam sinais externos (links, menções, perfil de empresa).

Publicar mais páginas locais hoje **piora** o problema. O caminho é
concentrar força em poucas páginas fortes.

## 5. Plano prático (ordem recomendada)

**Onda 1 — concentrar (2 semanas)**
1. Escolher 12 páginas prioritárias: home, `/solucoes`, `/servicos`, 5 serviços
   principais, `/portfolio` e 3 cidades reais de operação.
2. Marcar como `noindex, follow` as combinações segmento×região sem conteúdo
   próprio, mantendo-as navegáveis.
3. Reduzir o sitemap às páginas com conteúdo único e verificável.

**Onda 2 — prova real (depende do cliente)**
4. Coletar fotos e depoimentos autorizados dos 42 projetos pendentes,
   começando pelos mais visitados.
5. Publicar 5 cases com número, prazo e autorização por escrito.

**Onda 3 — autoridade**
6. Perfil da Empresa no Google completo e ativo.
7. Presença nos portfólios dos clientes com link de volta.
8. Conteúdo de resposta a dúvidas reais (custo, prazo, o que está incluso).

**Onda 4 — qualidade**
9. Corrigir os 467 trechos de contraste (afeta leitura e experiência mobile).
10. Manter as ondas de compressão de imagem já iniciadas.

## 6. Diferenciação frente a concorrentes diretos

O que já é defensável e deve ficar explícito na home:
- portfólio real e verificável, cada cliente com site próprio;
- funil de contato próprio por cliente, sem WhatsApp genérico;
- infraestrutura com SSR, medição real e painel de leads.

O que falta comunicar com clareza na primeira dobra: **preço de entrada,
prazo de entrega e o que exatamente o cliente recebe.**

## 7. Itens bloqueados (dependem de material externo)

- Fotos reais das 42 capas: requerem arquivo autorizado do cliente.
- Depoimentos e números: só publicáveis com fonte auditável.
- Indexação efetiva: depende do rastreamento do Google, não de nova submissão.
