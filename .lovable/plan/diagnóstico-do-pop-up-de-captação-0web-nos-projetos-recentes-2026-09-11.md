# Diagnóstico do pop-up de captação 0WEB nos projetos recentes

## 1. Onde ele está realmente montado

Ele já é global, e não depende da landing:

- `PortfolioStandardShell` (a casca que envolve todo `/portfolio/:slug`) monta o pop-up ao final, para qualquer projeto — atual ou futuro.
- Além disso, **Moreira, Careca's e JKL montam uma segunda cópia manualmente** dentro do próprio conteúdo (`afterContent`), assim como outras ~90 páginas antigas.

Ou seja: hoje existem duas instâncias por página. Um "guard" interno deixa apenas a primeira assumir o controle, então visualmente aparece um só — mas quem assume é a cópia da landing, não a camada oficial da plataforma. É uma duplicação frágil, não uma ausência.

## 2. O que segura ou atrasa a exibição

Regras atuais, todas verificadas no componente:

- Espera **10 segundos** de leitura; ou **90% de rolagem**; ou um fallback de **25 segundos**.
- **Uma vez por sessão**, gravado por projeto na memória da aba.
- Não aparece quando o endereço tem `0web_preview=1` ou `0web_overlays_off=1`.
- Pode ser desligado ou agendado (data de início/fim) por projeto pelo painel, sem publicação.
- Some para sempre naquela visita assim que o funil do cliente é aberto.
- Só uma instância por projeto assume o controle.

## 3. Por que alguém pode não ver mesmo estando importado

Quatro causas reais, em ordem de probabilidade:

1. **A pré-visualização da vitrine consome a cota da sessão.** O catálogo `/portfolio` abre a landing dentro de uma janela embutida com `?preview=1` — parâmetro que **não** é reconhecido como preview. O pop-up dispara lá dentro, marca "já exibido" e, quando a pessoa abre a página de verdade na mesma aba, ele não aparece mais.
2. **Abrir o funil do cliente cancela o pop-up definitivamente.** Quem clica no botão flutuante nos primeiros 10 segundos nunca mais vê a oferta naquela visita, mesmo fechando o funil em seguida.
3. **A leitura da configuração remota reinicia a contagem.** Quando a configuração do painel chega, o cronômetro recomeça do zero — o que empurra a exibição para bem depois dos 10 segundos previstos.
4. **Desligamento silencioso pelo painel** (registro desabilitado ou fora da janela de datas) e visitas curtas de menos de 10 segundos.

## 4. Correção arquitetural mínima

Objetivo: o pop-up passa a ser camada obrigatória da plataforma, e nenhuma landing precisa (nem pode) montá-lo.

1. **Dono único**: manter a montagem só na casca padrão e remover a cópia manual de Moreira, Careca's e JKL; o gerador de novos projetos deixa de inserir o pop-up no conteúdo do cliente.
2. **Não gastar a sessão na pré-visualização**: reconhecer janela embutida (e o `preview=1` do catálogo) como preview — não exibe e não marca "já exibido".
3. **Rearmar após o funil**: fechar o funil do cliente volta a permitir o pop-up depois de um intervalo, em vez de bloquear a visita inteira.
4. **Contagem estável**: separar "carregar configuração" de "agendar exibição", para a resposta do painel não reiniciar o cronômetro.
5. **Gate permanente**: a validação de portfólio passa a acusar landing que monte o pop-up manualmente e a exigir a camada na casca; o teste de navegador já existente (`scripts/playwright-portfolio-popup.mjs`) cobre os três projetos recentes, inclusive dentro da vitrine.

## Detalhes técnicos

- Arquivos envolvidos: `src/components/site/PortfolioUpsellPopup.tsx`, `src/lib/portfolio-preview.ts`, `src/components/portfolio/PortfolioStandardShell.tsx`, `src/routes/portfolio.index.tsx` (iframe `?preview=1`), `scripts/scaffold-portfolio-client.mjs`, `scripts/validate-portfolio-boundaries.mjs`, `scripts/playwright-portfolio-popup.mjs`.
- Chave de sessão atual: `0web:portfolio-upsell-shown:v2:<slug>`; a mudança de comportamento pede bump para `v3` para não herdar sessões marcadas indevidamente.
- Supressão em embed: `window.self !== window.top` somado aos parâmetros já existentes, aplicada em `shouldSuppressPortfolioHostOverlays`.
- Efeito de agendamento: dependências passam a ser valores primitivos (`enabled`, `timerMs`, `fallbackMs`, `scrollPct`), não o objeto de configuração inteiro.
- Nada de contato operacional, telefone ou WhatsApp entra no bundle; o funil de captação da 0WEB continua como está.

Escopo desta rodada: somente os itens 1–5 acima. Sem redesenho, sem migrar legados, sem publicar.
