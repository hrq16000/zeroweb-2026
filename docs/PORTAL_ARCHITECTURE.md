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

O botão flutuante institucional de atendimento também fica fora da loja. Em
páginas de produto, qualquer ajuda deve manter o contexto do produto por
`serviceSlug`, `ProductActionGate` ou fluxo equivalente.

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
2. Não colocar funil ou botão flutuante institucional concorrendo com compra na loja.
3. Não colocar contato/funil 0WEB dentro de uma landing de cliente.
4. Não compartilhar destinos entre `clientKey`.
5. Não converter `/portfolio` em loja.
6. Não converter `/servicos` em galeria de projetos.

Qualquer alteração que atravesse essas fronteiras deve ser tratada como mudança
de arquitetura, não como ajuste visual isolado.


## 8. Gate automatizado

`scripts/validate-portal-architecture.mjs` roda no `prebuild` e protege as
fronteiras principais do portal. Ele deve reprovar regressões como:

- CTA institucional reaparecendo na loja;
- botão flutuante institucional reaparecendo em rotas de compra;
- Home perdendo os caminhos explícitos para Loja e Portfólio;
- canonical de uma rota pública apontando para URL que redireciona;
- breadcrumb de serviço voltando a apontar para âncora antiga da Home.

A documentação explica a intenção; o gate impede que a intenção se perca no código.


## 9. Carrinho da loja

Serviços são unitários no carrinho: clicar novamente no mesmo serviço atualiza
o snapshot, mas não multiplica quantidade nem preço. O cliente pode combinar
serviços diferentes no mesmo pedido.

O checkout preserva o pedido e decide entre pagamento online, quando habilitado,
ou atendimento assistido. Ele não expõe link direto de WhatsApp, telefone ou
e-mail.


## 10. Variantes comerciais e recorrência

Quando uma página de serviço oferece planos reais, o carrinho usa o slug
canônico do serviço mais um `variantId`. Trocar de plano substitui a variante
anterior do mesmo serviço; não cria dois planos concorrentes no mesmo pedido.

Produtos com `pricePeriod` (mensal/recorrente) são registrados no checkout,
mas não são enviados ao Stripe one-time. Até existir cobrança recorrente
nativa, esses pedidos seguem para ativação assistida. Produtos de pagamento
único continuam elegíveis ao pagamento online quando o Stripe estiver ativo.


## 11. Página dinâmica de produto

Em `/servicos/:slug`, quando `price > 0`, a página é transacional: compra e
ajuda contextual do próprio produto. CTAs institucionais genéricos não aparecem
no fim da página nem depois das recomendações.

Quando não há preço transacional, o serviço pode continuar no fluxo consultivo
e usar `ServiceCTA`.


## 12. Atalho de compra na vitrine

A vitrine de `/servicos` oferece "Adicionar ao carrinho" diretamente no card
de cada produto com preço publicado, sem obrigar o visitante a abrir a página
de detalhes. A página de detalhes continua disponível para comparação e leitura.

Troca de variante do mesmo serviço deve ser registrada na telemetria como nova
seleção comercial, mesmo que o slug canônico permaneça igual.


## 13. Checkout assistido sem conta

O visitante pode finalizar pelo atendimento assistido sem criar conta Google.
Nome + WhatsApp válido são obrigatórios; o servidor aplica rate limit e grava
um snapshot do carrinho na fonte pública de leads. O retorno fornece protocolo
opaco e não expõe contato interno.

Login continua necessário para pagamento online e para acompanhar pedidos
autenticados no painel.

Produtos com múltiplos planos não usam "Adicionar ao carrinho" genérico na
vitrine: o card direciona para "Escolher plano" e só então grava a variante.

## 14. Credibilidade da página de obrigado

Métricas, avaliações e depoimentos só podem aparecer em `/obrigado` quando
houver fonte auditável e consentimento documentados. Na ausência dessa prova,
o bloco inteiro fica oculto em vez de publicar números ou histórias exemplificativas.


## 15. Login não é etapa do carrinho

Adicionar um segundo serviço não deve disparar convite de login. O carrinho
continua local e utilizável anonimamente. Login é uma escolha funcional do
checkout: necessário para pagamento online e para histórico autenticado, mas
não para pedir atendimento assistido.

A página de obrigado também não deve prometer canal, SLA, resultado ou
confirmação de pagamento que ainda dependa de evento externo. Para checkout
assistido anônimo, o protocolo substitui a falsa promessa de "ver meu pedido"
no painel.


## 16. Schema da vitrine

A página `/servicos` não publica uma lista estruturada baseada em catálogo
estático. A fonte real da vitrine é o loader conectado ao catálogo público;
por isso o índice declara `CollectionPage` e deixa o schema detalhado para
cada rota de produto. Isso evita anunciar no Google produtos, FAQs ou contagens
que não estejam realmente publicados na loja.


## 17. Semântica de pedido e conversão

Atendimento assistido autenticado usa `payment_method=manual`; o valor
`whatsapp` fica apenas como legado histórico. A interface não presume canal
de contato.

O evento GA4 `purchase` só pode disparar quando `orders.status = paid`.
Criar pedido, abrir a página de obrigado ou entrar em `awaiting_payment`
não contam como venda. Variante comercial é enviada em `item_variant` e
a quantidade permanece 1 para serviços.
