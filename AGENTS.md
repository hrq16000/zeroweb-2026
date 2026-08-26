# Regra oficial da zona de portfolios

Antes de criar ou alterar qualquer rota em `src/routes/portfolio.*`, leia
`docs/PORTFOLIO_CLIENT_STANDARD.md` e execute `npm run validate:portfolio-boundaries`.

## Princípio obrigatório

Cada `/portfolio/<slug>` é um site independente de um cliente. A 0WEB fornece
somente hospedagem, vitrine, infraestrutura e mecanismos compartilhados. Nunca
reutilize identidade, navegação, conteúdo, contato, SEO, CTA ou linguagem da
0WEB ou de outro cliente dentro desse site.

## Recursos compartilhados

- CTA/funil: compartilhar o mecanismo seguro e parametrizável; perguntas,
  destinatário, serviço, texto e visual pertencem ao cliente.
- Prova social: usar `PortfolioSocialProofPopup`; conteúdo e tema devem ser do
  cliente.
- Contato: nunca inserir `wa.me`, telefone ou e-mail operacional no bundle.
  Resolver o destinatário no servidor por `clientKey`.
- SEO: cada cliente precisa de título, descrição, canonical, imagem social e
  ícone próprios.
- Assets: cada cliente possui diretório próprio e não herda imagens de outro.

## Proibido

- `Header`, `Footer` ou `PortfolioUpsellPopup` da 0WEB dentro de um cliente.
- Copiar design/layout de outro portfolio como padrão visual.
- Inferir `clientKey` pelo nome visível da empresa.
- Expor contato direto ou dados sensíveis no código público.

