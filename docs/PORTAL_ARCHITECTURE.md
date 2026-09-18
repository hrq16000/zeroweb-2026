# Arquitetura global do portal 0WEB

Estado: **canônico**  
Definido em: 18/09/2026

Este documento fixa a responsabilidade de cada grande área pública do portal.
A regra principal é simples: cada rota deve ter uma função comercial clara e
não deve herdar CTAs, contatos ou comportamentos de outra área.

## 1. Home `/`

A Home é institucional e de direcionamento.

Responsabilidades:
- posicionar a 0WEB;
- explicar a jornada digital;
- destacar poucos serviços, sem virar catálogo;
- mostrar uma amostra de projetos;
- encaminhar para o funil comercial institucional, `/servicos` ou `/portfolio`.

A Home não deve duplicar a loja nem a galeria inteira.

## 2. Loja `/servicos`

`/servicos` é a loja virtual de serviços da 0WEB.

Responsabilidades:
- exibir somente produtos prontos para venda;
- mostrar preço, escopo e ação de compra/contratação;
- receber tráfego de campanhas para ofertas específicas;
- preservar carrinho, checkout, pedido e suporte do pedido no mesmo contexto.

Rotas de loja incluem, no mínimo:
- `/servicos/*`;
- `/checkout`;
- `/pedido/*`;
- `/suporte-pedido/*`;
- `/categoria/*`;
- `/marketplace/*`.

O CTA institucional genérico "Solicitar Diagnóstico" não deve competir com a
compra dentro dessas rotas. A ação principal vem do produto/carrinho.

## 3. Portfólio `/portfolio`

`/portfolio` é galeria e catálogo de projetos publicados.

Responsabilidades:
- descoberta e busca de projetos;
- filtros por segmento/local;
- apresentação visual dos trabalhos;
- entrada para cada landing independente.

A página de catálogo pode usar captação institucional da 0WEB porque ela pertence
à plataforma. Já `/portfolio/:slug` pertence à experiência isolada do projeto.

## 4. Landing `/portfolio/:slug`

Cada projeto é uma landing independente.

Regras obrigatórias:
- identidade visual própria;
- conteúdo próprio;
- assets próprios;
- funil próprio;
- `clientKey` próprio;
- destino WhatsApp próprio quando houver;
- modo amostra quando o contato oficial estiver `null`;
- zero fallback para outro cliente ou para contato institucional da 0WEB;
- nenhum CTA institucional deve substituir o funil do projeto.

O contato de um projeto nunca pode resolver para outro projeto.

## 5. `/solucoes`

`/solucoes` é uma camada editorial/institucional para explicar problemas,
estratégias e frentes de atuação. Não é a loja.

Quando existir um produto comprável relacionado, a passagem para contratação
deve terminar em `/servicos/<slug>`.

## 6. Matriz de CTA

| Contexto | CTA principal |
|---|---|
| Home e institucional | funil comercial/diagnóstico 0WEB |
| `/servicos` e produto | ação do produto, carrinho ou checkout |
| `/portfolio` catálogo | descoberta de projeto / captação 0WEB |
| `/portfolio/:slug` | funil exclusivo do cliente |
| Projeto sem WhatsApp | lead + protocolo + aviso de amostra |

## 7. Regra anti-drift

Mudanças futuras devem preservar estas fronteiras:

1. Não transformar a Home em catálogo completo.
2. Não colocar funil institucional concorrendo com compra na loja.
3. Não colocar contato/funil 0WEB dentro de uma landing de cliente.
4. Não compartilhar destinos entre `clientKey`.
5. Não converter `/portfolio` em loja.
6. Não converter `/servicos` em galeria de projetos.

Qualquer alteração que atravesse essas fronteiras deve ser tratada como mudança
de arquitetura, não como ajuste visual isolado.
