# Padrão oficial — Conversão, SEO e legibilidade por IA em portfólios

Status: obrigatório para cada projeto em `/portfolio/<slug>`.

## Princípio

Cada site de cliente deve combinar conversão humana, SEO técnico e informação
estruturada legível por mecanismos de busca, assistentes e LLMs. A referência
visual pode inspirar a sequência de decisão — nunca a identidade, copy, provas
ou layout de outro negócio.

## Skills e camadas obrigatórias

Todo projeto aplica, na ordem adequada ao escopo:

1. `0web-skill-router`: classifica landing page, funil, SEO e acessibilidade;
2. `0web-design-system`: define identidade própria, hierarquia e componentes;
3. `0web-ui-quality-gates`: revisa estados, contraste, teclado, mobile e
   performance;
4. `PORTFOLIO_CLIENT_STANDARD` e `PORTFOLIO_NEW_CLIENT_PLAYBOOK`: isolamento,
   funil, privacidade, assets e metadados do cliente;
5. validadores de portfólio, SEO/JSON-LD, privacidade, teste e build.

## Estrutura de conversão recomendada

Cada página deve avaliar e usar, quando fizer sentido ao negócio:

- hero orientado ao benefício e ao público, não apenas à lista de serviços;
- CTA primário do cliente e CTA secundário explicativo (ex.: “Como funciona”);
- cards de serviços com entregas concretas;
- preço/oferta somente quando confirmado e atualizado;
- prova de confiança próxima da primeira decisão;
- CTA final que responde objeções reais e indica o próximo passo;
- rodapé com dados e links reais ou mecanismos seguros da plataforma.

Esses blocos são parametrizados; eles não formam um template visual obrigatório.
A identidade, imagens, tom, serviços, argumentos e CTA pertencem a cada
cliente.

## Links e funis

É proibido publicar links vazios, `#`, canais sociais fictícios, telefones,
e-mails ou rotas sem destino. Quando uma ação ainda não tiver URL pública real,
ela deve abrir `FunnelCTAButton`/`PortfolioCTAQuiz` com `clientKey`,
`companySlug` e funil daquele projeto. O destino de contato continua resolvido
somente no servidor.

## SEO, autoridade e leitura por LLMs

Cada rota deve responder de forma explícita e verificável: quem atende, qual
serviço oferece, para quem, onde atende, como funciona e qual próximo passo.

- usar um único `h1`, headings sequenciais e texto visível que corresponda ao
  conteúdo estruturado;
- manter título, descrição, canonical, Open Graph, imagem social e ícone
  próprios;
- emitir JSON-LD adequado ao conteúdo realmente exibido (Organization ou
  LocalBusiness, Service, BreadcrumbList, FAQPage, Article quando aplicável);
- incluir respostas concisas a dúvidas reais em FAQ visível, sem preencher
  palavras-chave artificialmente;
- usar evidência específica e confirmada — não métricas, depoimentos,
  certificações, preços, descontos ou garantias inventados;
- preferir dados estruturados canônicos e fontes únicas de verdade para que
  buscadores, crawlers e LLMs encontrem a mesma informação que o visitante.

## Critério de pronto

O projeto só pode ser publicado após validar funil, privacidade, boundaries,
metadados, JSON-LD, build e a experiência mobile. A revisão humana confirma
que provas, preços, promoções e imagens são reais ou estão explicitamente
marcados como conceito de demonstração.
