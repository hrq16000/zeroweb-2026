# Centro Mega Store — relatório de evolução

Data: 2026-09-21  
Slug: `centro-mega`  
Client key: `centro-mega`  
Estado deste documento: **pré-merge / aguardando gates executáveis**.

## Escopo

Evolução autônoma do portfolio Centro Mega para uma amostra de loja virtual com identidade tech + outlet e maior intensidade visual, preservando as regras 0WEB de factualidade, isolamento de cliente, funnel-only e performance.

## Fontes utilizadas

- Linktree oficial: https://linktr.ee/centro.mega
- Instagram oficial: https://www.instagram.com/centro.mega/
- Facebook oficial: https://www.facebook.com/CentroMega.com.br/
- VHSYS público: https://www.vhsys.net/centromega/contato/
- Feed público indexado: https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega

## Produto social → catálogo

### Poco X5 Pro

Do feed indexado:
- 8GB RAM;
- 256GB;
- post datado de 25/01/2024;
- preço histórico publicado: de R$ 2.399,00 por R$ 1.899,00.

A landing não trata esse valor como preço atual.

### Tênis Dunk Low Pro

Do feed indexado:
- post datado de 08/11/2023;
- publicação menciona tamanhos e pagamento em cartões;
- cópias indexadas divergem na grade, portanto a landing não exibe grade atual.

## Instagram

Seis URLs oficiais que já existiam no componente anterior foram preservados como **drops de discovery**. O fetch automatizado das páginas individuais falhou, por isso nenhum nome de produto/caption foi inferido a partir desses links.

## Nova experiência

- hero oversized com linguagem neon tech/outlet;
- composição gráfica sem raster crítico;
- anéis/orbit, glow e float;
- ticker/marquee de categorias;
- filtro de categoria;
- cards de produto com provenance e freshness;
- seção outlet em drops;
- seção feed-to-store;
- sacola lateral;
- CTA persistente no mobile;
- reduced-motion;
- sem 3D/WebGL/GSAP adicional.

## Sacola e funil

A sacola não é checkout transacional falso.

Ela:
1. permite selecionar itens;
2. gera `order_items`;
3. passa os itens para `PortfolioCTAQuiz`;
4. usa `funnelIntent=pedido`;
5. confirma disponibilidade, valor e logística com a equipe;
6. resolve apenas o WhatsApp do próprio `client_key`.

## Destino

WhatsApp: `5541998589419`.

Evidência:
- VHSYS público da Centro Mega;
- presença social indexada;
- identidade/CNPJ compatíveis.

Status no ledger: `VERIFIED`.

## Factualidade

Não são publicados como atuais sem confirmação:
- estoque;
- preço;
- cores;
- grade;
- prazo;
- frete;
- disponibilidade por unidade.

## Arquivos centrais

- `src/components/site/CentroMegaPage.tsx`
- `src/routes/portfolio.$slug.tsx`
- `src/config/portfolio-catalog.json`
- `src/config/portfolio-clients.json`
- `src/config/portfolio-discovery.json`
- `src/config/portfolio-assets.json`
- `src/config/portfolio-funnel-context.json`
- `src/config/portfolio-whatsapp.json`
- `src/config/portfolio-funnel-destinations.json`
- `docs/portfolio/briefs/centro-mega.md`
- `docs/portfolio/enrichment/centro-mega.json`
- `docs/portfolio/media-plans/centro-mega.json`
- `tests/portfolio/centro-mega-store.test.ts`

## Próximo gate

Este relatório não presume publicação. Antes do merge:
- build/tests;
- portfolio gates;
- preview READY;
- smoke da rota;
- funil;
- isolamento;
- mobile/reduced-motion quando ambiente de browser estiver disponível.
