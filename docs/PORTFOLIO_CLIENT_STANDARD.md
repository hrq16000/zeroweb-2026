# Padrão oficial — sites de clientes na zona `/portfolio`

Status: **obrigatório**  
Escopo: todas as rotas `/portfolio/<slug>`  
Responsável pela plataforma: 0WEB

O contrato de divulgação, imagem social e amostras de papelaria está em
`docs/PORTFOLIO_PRESENCE_KIT_STANDARD.md` e é complementar a este padrão.
O padrão de conversão, SEO e leitura por mecanismos/LLMs está em
`docs/PORTFOLIO_CONVERSION_INTELLIGENCE_STANDARD.md`.

Checklist operacional de novos projetos: `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`.
O pop-up de captação da 0WEB é renderizado pela rota `/portfolio/$slug` para
todo projeto novo; overlays só são silenciados com `?0web_preview=1`.

## 1. Definição

`/portfolio` é a vitrine e camada de hospedagem da 0WEB. Cada endereço
`/portfolio/<slug>` é um site independente, pertencente a um cliente diferente.
Estar hospedado no domínio `0web.com.br` não transforma o site do cliente em uma
página institucional da 0WEB.

Dentro do site do cliente, identidade, experiência, navegação, conteúdo,
imagens, oferta, prova social, SEO e atendimento pertencem exclusivamente ao
cliente. A referência à 0WEB pode existir apenas como crédito discreto de
hospedagem/criação, sem competir com a marca atendida.

## 2. O que é compartilhado e o que é exclusivo

| Camada | Regra |
|---|---|
| Hospedagem, segurança e observabilidade | Compartilhadas pela plataforma |
| Mecanismo de CTA/funil | Compartilhado e parametrizável |
| Redirecionamento de contato | Compartilhado, tokenizado e resolvido no servidor |
| Mecanismo de pop-up/prova social | Compartilhado e parametrizável |
| Pop-up de captação da 0WEB | Camada externa obrigatória da vitrine/hospedagem |
| Analytics e privacidade | Compartilhados, sempre identificados por `clientKey` |
| Design, layout e animações | Exclusivos de cada cliente |
| Textos, perguntas, respostas e ofertas | Exclusivos de cada cliente |
| Logo, imagens, ícone e imagem social | Exclusivos de cada cliente |
| Destinatário e canais de atendimento | Exclusivos e mantidos no servidor |
| SEO e Schema.org | Exclusivos de cada cliente |

Compartilhar um mecanismo significa compartilhar comportamento, acessibilidade,
segurança e medição. Não significa compartilhar texto, aparência, identidade ou
destinatário.

## 3. Contrato mínimo de cada cliente

Todo novo cliente deve ser registrado em `src/config/portfolio-clients.json`
com uma chave imutável (`clientKey`) e possuir:

1. rota canônica `/portfolio/<slug>`;
2. componente raiz exclusivo;
3. diretório exclusivo de imagens;
4. título, descrição, canonical, `og:site_name`, imagem social e ícone próprios;
5. CTA usando o funil seguro com `clientKey` explícito;
6. perguntas e mensagem final coerentes com o ramo do cliente;
7. pop-up de prova social usando `PortfolioSocialProofPopup` com conteúdo do
   próprio cliente;
8. pop-up de captação da 0WEB usando `PortfolioUpsellPopup`;
9. botão flutuante de contato quando adequado ao negócio;
10. redirecionamento do contato resolvido somente no servidor;
11. experiência responsiva, acessível e validada em mobile.
12. crédito discreto no rodapé usando `PortfolioHostCredit`, com link para
    `https://0web.com.br`;
13. uma logo/marca própria, usada como identidade visual e registrada no campo
    `icon` de `src/config/portfolio-assets.json`;

Os itens 8 e 12 são universais e não podem ser desativados por configuração do
cliente. O script `npm run validate:portfolio-boundaries` falha se qualquer
portfolio registrado omitir o pop-up de captação ou o crédito com link.

Novos clientes devem usar `PortfolioCTAQuiz` (alias genérico do mecanismo atual)
e informar `clientKey` explicitamente. A configuração `quizConfig` permite
definir opções, títulos, explicações e exemplos próprios para cada ramo.

### Logo como requisito estrutural

Cada projeto precisa ter uma marca própria antes de ser publicado. O campo
`icon` é o ativo canônico da logo/brand mark do cliente (e não um placeholder
genérico): o arquivo deve viver no diretório `/public/images/<slug>/`, ter
relação visual com o ramo, nome e região do projeto e nunca ser reutilizado em
outro slug. Quando o cliente ainda não possui uma marca aprovada, a plataforma
pode gerar um conceito original; nesse caso, a página e os materiais devem
identificá-lo como conceito até a aprovação. A logo é independente da imagem
OG/social e dos mockups do Kit de Presença.

## 4. Isolamento obrigatório

O componente do cliente não pode importar cabeçalho, rodapé ou elementos de
identidade da 0WEB. A exceção deliberada é `PortfolioUpsellPopup`: ele pertence
à camada externa de hospedagem/vitrine e existe para captar novos negócios para
a 0WEB a partir da visita ao portfolio. Também não pode importar componentes de
identidade de outro cliente. Componentes neutros de infraestrutura podem ser
usados quando recebem toda a parametrização do cliente.

Existem, portanto, dois pop-ups com responsabilidades diferentes:

- `PortfolioSocialProofPopup`: pertence ao cliente e reforça confiança no
  serviço exibido;
- `PortfolioUpsellPopup`: pertence à 0WEB e converte visitantes interessados em
  contratar uma solução própria.

Eles devem aparecer em sequência, sem sobreposição. A prova social é breve e o
pop-up de captação da 0WEB entra depois, preservando leitura e conversão.

O crédito de desenvolvimento também é universal: todo site de cliente deve
renderizar `PortfolioHostCredit` no rodapé. O componente padroniza texto, link e
acessibilidade, enquanto cada cliente pode definir apenas cores e acabamento
compatíveis com sua identidade. O validador de boundaries bloqueia portfolios
registrados sem o crédito ou sem `PortfolioUpsellPopup`.

São proibidos no código público: `wa.me`, números de telefone, e-mails
operacionais, chaves, destinatários sensíveis e qualquer fallback que direcione
um cliente para o atendimento da 0WEB.

## 5. Fluxo de atendimento

O fluxo oficial é:

`CTA do cliente → mini questionário próprio → registro da intenção → token
temporário → resolução server-side do destinatário → aplicativo de contato`.

O texto enviado deve identificar a página vista, organizar as respostas e falar
com o prestador correto. A estética do botão e do modal acompanha o site do
cliente; validação, telemetria, acessibilidade e segurança permanecem comuns.

## 6. Acesso futuro do cliente

Solicitações de mudança devem sempre carregar `clientKey`, `slug` e escopo do
conteúdo. Permissões futuras do painel precisam ser filtradas por `clientKey` no
servidor. Um cliente nunca pode ler ou editar configuração, leads, assets ou
conteúdo de outro portfolio.

Os dois sites Beauty anteriores a este padrão ainda usam o diretório histórico
`public/images` e estão marcados como `legacySharedAssets`. Essa exceção existe
somente para migração sem quebra; o validador bloqueia novos clientes que não
possuam diretório exclusivo.

## 7. Processo para dezenas de novos sites

1. cadastrar o cliente no registro;
2. criar assets e componente exclusivos;
3. criar rota e metadados próprios;
4. configurar CTA, perguntas, destinatário server-side, prova social e captação
   da 0WEB;
5. executar `npm run validate:portfolio-boundaries`;
6. executar TypeScript, build e validadores de privacidade/SEO;
7. revisar mobile e publicar.

Nenhum novo portfolio está pronto apenas porque renderiza. Ele está pronto
quando passa no contrato de isolamento, atendimento, identidade, privacidade e
metadados.

> Padrões universais aplicados automaticamente (compartilhar, contato flutuante, rodapé e captação): ver `docs/PORTFOLIO_GLOBAL_STANDARDS.md`.

## 8. Fonte canônica do catálogo (`src/config/portfolio-catalog.json`)

`/portfolio` é um catálogo escalável. A identidade de descoberta de cada projeto
(`slug`, `clientKey`, `title`, `segment`, `projectType`, `status`, `city`,
`state`, `tags`) vive apenas em `src/config/portfolio-catalog.json`. Cards,
busca, filtros (segmento, tipo, texto, ordenação), paginação incremental,
sitemap, SEO, Lighthouse CI e testes consomem essa mesma fonte.

- `src/config/portfolio-clients.json` continua responsável pelo contrato
  técnico do site do cliente (rota, componente, assets, CTA, isolamento).
- `src/lib/portfolio-site-registry.ts` permanece como camada de SEO/sitemap e
  deve conter todo slug publicado do catálogo.
- Campos visuais legados na rota `/portfolio` são um fallback temporário e vão
  sendo migrados para o catálogo; nenhum card novo deve nascer só na rota.
- `bun run validate:portfolio-catalog` bloqueia slugs duplicados/ inválidos,
  campos ausentes e clientes registrados sem item de catálogo.

Filtros ficam persistidos na URL (`?segment=`, `?type=`, `?q=`, `?sort=`) e o
catálogo carrega em blocos ("Carregar mais"), com estados vazio/carregando/erro,
alvos de toque de 44px e respeito a `prefers-reduced-motion`.

## 9. Web Vitals de campo

`PortfolioStandardShell` coleta LCP, CLS e INP por slug e envia para
`/api/public/portfolio-vitals`. O endpoint valida métrica, valor, `id`, `slug` e
`path`, recusa qualquer outro campo e nunca recebe PII. A persistência usa
`public.portfolio_web_vitals` (RLS ativa, acesso público revogado, escrita e
leitura apenas por `service_role`, índices por slug/métrica/data), com fallback
em memória quando o banco está indisponível. O painel `/painel-web-vitals`
(restrito a administradores) mostra p75 por métrica, volume de amostras e
alertas de regressão contra os budgets 2500 ms / 0,1 / 200 ms.
