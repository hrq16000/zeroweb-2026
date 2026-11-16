# Painel de funis por portfólio

Uma tela única no painel para ver e gerenciar, portfólio a portfólio, o funil de
atendimento, o destino de WhatsApp e a publicação — sem tocar nas páginas já
publicadas.

## O que você vai poder fazer

- Ver a lista dos 95 portfólios com, para cada um: se já existe funil próprio,
  se ele está publicado, quantas perguntas tem, destino de WhatsApp (mascarado,
  ex. `(41) 9****-3627`) ou "somente amostra", e leads recebidos.
- Filtrar por "sem funil", "funil em rascunho", "sem destino" e "amostra".
- Criar o funil individual de um portfólio com um clique: ele nasce isolado
  (`portfolio-<clientKey>`), com as perguntas padrão do tipo de funil do projeto
  e **já publicado** — é a "publicação automática" pedida.
- Publicar/despublicar um funil existente e abrir o editor de perguntas atual.
- Ver o estado do destino de WhatsApp e, quando faltar, um aviso claro de que o
  portfólio funciona em modo amostra (o lead continua salvo, com protocolo).

## O que a tela NÃO faz (de propósito)

- Não altera o HTML, layout, textos, SEO ou imagens de nenhuma página
  publicada. Ela só mexe em funil (banco) e leitura de configuração.
- Não grava número de WhatsApp novo no cadastro versionado. O destino continua
  sendo dado do projeto em `src/config/portfolio-whatsapp.json`; a tela mostra o
  estado e aponta o caminho de alteração já existente (tela de números/propostas
  de destino). Isso evita conflito com o gate antirregressão e com o Git.
- Não cria fallback entre clientes e não expõe número completo no navegador.

## Detalhes técnicos

- Nova rota `src/routes/_authenticated/app/funis.portfolios.tsx` (admin,
  `noindex`), no padrão das telas existentes.
- Novas server functions em `src/lib/portfolio-funnel-admin.functions.ts`, com
  `requireSupabaseAuth` + verificação de papel admin/super_admin:
  - `listPortfolioFunnels()` — junta catálogo (`portfolio-catalog.json`),
    `portfolio-clients.json`, `portfolio-funnel-context.json`, destino resolvido
    server-side (mascarado) e `dynamic_forms`/`dynamic_form_questions`/
    `dynamic_form_leads` por slug `portfolio-<clientKey>`.
  - `provisionPortfolioFunnel({ clientKey, publish })` — reaproveita a lógica de
    provisionamento já existente em `dynamic-funnel.functions.ts` (usada hoje
    para portfólios managed antigos), sem duplicar regra.
  - `setPortfolioFunnelStatus({ clientKey, status })`.
- Nada de novo schema: usa as tabelas `dynamic_forms`, `dynamic_form_questions`,
  `dynamic_form_leads` que já existem.
- Link na navegação do painel junto de "Funis".
- Validação: `bunx tsgo --noEmit`, `bun test`, `bun run prebuild`,
  `validate:portfolio-boundaries`, `scan:source-privacy`.

## Itens do seu pedido que ficam de fora desta rodada

- **Publicar os 89 legados um a um**: cada projeto exige pesquisa, capa, funil e
  QA próprios pelo lifecycle. Dá para fazer em lotes acordados, não numa rodada.
- **12 fotos reais dos serviços**: eu não tenho os arquivos e é proibido gerar
  imagem para catálogo transacional. Preciso que você envie as fotos.
- **Tela de comissões com comprovante da ADHONEP**: depende de valor real e
  comprovante que ainda não existem no sistema — inventar número é proibido.
- **Sincronizar Lovable com o `main` / gate no GitHub**: as ações de Git ficam do
  lado do repositório; posso preparar o arquivo do gate quando você pedir.
