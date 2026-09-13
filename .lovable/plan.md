# Plano de execução — zona /portfolio

Escopo travado: apenas `/portfolio` e `/portfolio/<slug>`. Home, `/home2`, `/home3`,
zona institucional e painéis não ligados a portfolio ficam intocados. Os dois avisos
de monitoramento (Home e Painel SEO) ficam como estão, por sua decisão.

Execução em rodadas, uma por vez, com validação antes de seguir para a próxima.

## Rodada 1 — ADHONEP Curitiba no ar

- Ativar o destino confirmado 41 99561-0718 como destino oficial da marca, gravado
  no registro canônico de destinos com evidência mascarada (`••••0718`).
- Gerar a capa da página (arte editorial própria, sem pessoas reais nem marcas de
  terceiros) e usá-la como imagem social.
- Publicar a página sem faixa de resultados: hero, ficha da noite (data, horário,
  endereço, tema, preletor) e confirmação de presença.
- Validar o funil contextual ponta a ponta e conferir que a confirmação aparece em
  Contatos por marca, com data, hora e status.

## Rodada 2 — Mestre dos Serviços

- Gravar o número comprovado da marca como destino oficial e ativar o funil.
- Publicar com hero próprio, faixa de provas e resultados conforme o material da
  marca, usando mídia própria da página.
- Validar funil e chegada do contato no painel.

## Rodada 3 — Fila de marcas sem destino

- Publicar a fila com status por marca (sem destino, solicitado, respondido,
  confirmado, conflito) e histórico de cada mudança.
- Priorizar a próxima rodada pelas marcas cujo nome e cidade batem exatamente com
  as fichas oficiais.
- Enviar uma solicitação real e acompanhar a resposta na própria tela.
- Listar ao final o que continua sem prova.

## Rodada 4 — Solicitações de número e leads

- Tela de solicitações: cada envio para marca sem destino, com status, data, hora,
  canal e a resposta recebida.
- Painel de leads do portfolio: status, data, hora, entrega e histórico, ligando
  cada lead à marca e ao destino usado no momento.
- Números sempre mascarados na interface.

## Rodada 5 — Metadados das landings

- Tela de metadados com título, descrição e schema de cada landing, editável e
  publicável linha a linha, sem recarregar cada página.
- Ligação direta entre metadados e a fila de marcas sem destino, para ver a
  situação de cada landing no mesmo lugar.
- Publicação individual das landings atualizadas, uma por uma.

## Detalhes técnicos

- Destinos continuam server-side, resolvidos por `clientKey`; nada de `tel:`,
  `wa.me` ou número completo no código público.
- Cada rodada roda os gates: limites do portfolio, privacidade do cliente,
  integridade de marca, camada institucional, funil operacional, testes e build.
- As telas administrativas ficam em rotas de painel já existentes; elas leem e
  gravam apenas dados da zona de portfolio.

## Fora deste plano

- Configuração da Vercel `zeroweb-2026`: é um serviço externo, feito por você no
  painel da Vercel; a chave de serviço não é acessível por aqui.
