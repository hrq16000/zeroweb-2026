# Auditoria de acessibilidade — portfolio (rodada 2026-09-10b)

Gerado com axe-core (WCAG 2.0/2.1 A e AA) em 92 rotas: home, /servicos, /portfolio e as paginas de cliente.

- Rotas sem violacao: 30
- Rotas com violacao: 62
- Nenhuma violacao critical; todas as bloqueantes sao serious.

## Resumo por regra

| Regra | Impacto | Rotas | Elementos |
|---|---|---|---|
| color-contrast | serious | 61 | 479 |
| list / listitem | serious | 1 | 11 |

Foco de teclado e labels de formulario nao geraram violacao em nenhuma rota.

## Corrigido nesta rodada

- guaratuba-reparos-residenciais (`ReparosDoLitoralPage`): os chips de servico voltaram a ser uma lista valida (`ul > li`), eliminando as violacoes `list` e `listitem`.

## Contraste — pendente por pagina (ordem de prioridade)

Prioridade = paginas ainda nao indexadas no Google (todo o portfolio esta nesse estado hoje), ordenadas pelo volume de trechos abaixo de 4.5:1. Ajuste de cor e decisao de marca de cada cliente, entao nao alteramos automaticamente.

| # | Pagina | Trechos abaixo do minimo |
|---|---|---|
| 1 | /portfolio/dyzpromo | 94 |
| 2 | /portfolio/marido-de-aluguel | 47 |
| 3 | /portfolio/paraiso-do-hot-dog | 31 |
| 4 | /portfolio/papelemi-personalizados | 25 |
| 5 | /portfolio/kitutes-na-mesa | 16 |
| 6 | /portfolio/auto-socorro-dentinho | 16 |
| 7 | /portfolio/rj-servicos-drywall | 15 |
| 8 | /portfolio/embalar-embalagens | 14 |
| 9 | /portfolio/guaratuba-sabores-da-baia | 12 |
| 10 | /portfolio/studio-de-cilios | 9 |
| 11 | /portfolio/paulo-mestre-de-obras | 9 |
| 12 | /portfolio/lj-cleaning | 9 |
| 13 | /portfolio/liz-moraes-nail-designer | 9 |
| 14 | /portfolio/fernanda-amaral-drywall | 9 |
| 15 | /portfolio/jkl-marcenaria | 8 |
| 16 | /portfolio/mirassol-delicias-caseiras | 8 |
| 17 | /portfolio/mp-festas-eventos | 6 |
| 18 | /portfolio/lucas-arruma-maquina-lavar | 6 |
| 19 | /portfolio/denise-gomes-psicologa | 6 |
| 20 | /portfolio/enoel-portas | 6 |
| 21 | /portfolio/confeitaria-chyrley | 5 |
| 22 | /portfolio/diego-montador-moveis | 5 |
| 23 | /portfolio/aguia-sul-sinalizacao | 5 |
| 24 | /portfolio/reuse-house-brecho | 5 |
| 25 | /portfolio/ton-e-cor | 5 |
| 26 | /portfolio/dona-lucy-salgados | 5 |
| 27 | /portfolio/pinturas-nunes | 5 |
| 28 | /portfolio/no-brilho-higienizacao | 4 |
| 29 | /portfolio/salao-da-marcia | 4 |
| 30 | /portfolio/eletrovale-eletromecanica | 4 |
| 31 | /portfolio/mary-diarista | 4 |
| 32 | /portfolio/lolipa-arte-em-festas | 4 |
| 33 | /portfolio/manu-pasteis | 4 |
| 34 | /portfolio/heloa-gas | 4 |
| 35 | /portfolio/popys-conservacao-limpeza | 4 |
| 36 | /portfolio/simone-lacerda-vaz | 4 |
| 37 | /portfolio/mania-de-limpeza | 4 |
| 38 | /portfolio/sos-presentes-cosmeticos | 3 |
| 39 | /portfolio/refrigeracao-maresia | 3 |
| 40 | /portfolio/lk-alvenaria | 3 |
| 41 | /portfolio/assistencia-microondas-santos | 3 |
| 42 | /portfolio/thays-camilla | 3 |
| 43 | /portfolio/sscons | 3 |
| 44 | /portfolio/easy-clean | 3 |
| 45 | /portfolio/maximos-cabeleireiros | 3 |
| 46 | /portfolio/your-brutus-burguer | 3 |
| 47 | /portfolio/estrutura-nacional | 3 |
| 48 | /portfolio/renata-beauty | 2 |
| 49 | /portfolio/beto-pasteis | 2 |
| 50 | /portfolio/toquinho-de-gente-brecho | 2 |
| 51 | /portfolio/brecho-sao-francisco | 2 |
| 52 | /portfolio/bh-barreiro-marmitas | 2 |
| 53 | /portfolio/emporio-lelecute | 1 |
| 54 | /portfolio/vila-da-capivara | 1 |
| 55 | /portfolio/eletro-solucoes-eficazes | 1 |
| 56 | /portfolio/marmitaria-dom-diego | 1 |
| 57 | /portfolio/angel-mix-brecho | 1 |
| 58 | /portfolio/confeitaria-sabor-da-realeza | 1 |
| 59 | /portfolio/premium-envelopamentos | 1 |
| 60 | /portfolio/guaratuba-atelie-presentes | 1 |
| 61 | /portfolio/js-eletrica-manutencao | 1 |

## Como corrigir

Para cada pagina listada, elevar o contraste do texto sobre o fundo para no minimo 4.5:1 (texto normal) e 3:1 (elementos de interface e anel de foco), mantendo a identidade do cliente: escurecer o tom de destaque ou aumentar a opacidade dos textos em `text-white/xx` e dos rotulos em `tracking-[.2em]`.
