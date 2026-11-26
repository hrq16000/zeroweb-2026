# Pendência — peças reais da Dona Garimpeira Brechó

- **Status:** ABERTA — aguardando material do cliente
- **Registrada em:** 2026-11-26
- **Rota:** `/portfolio/dona-garimpeira-brecho` (`clientKey` próprio; catálogo: `draft`)
- **Responsável pelo envio:** Henrique Rodrigues (vai enviar pelo celular)

## O que falta

Para montar a galeria e a seção "Você também pode gostar" são necessárias,
para cada peça real:

1. foto real da peça;
2. nome da peça;
3. preço.

## Estado atual

- `GALLERY_ITEMS = []` — a página mostra "Novas histórias estão chegando".
- Não há seção "Você também pode gostar", produtos ou preços na página.
- Nenhuma peça, foto ou preço foi inventado (regra de credibilidade editorial).

## Ação obrigatória do agente

**Cobrar o envio das peças no início da próxima rodada de trabalho**, antes de
qualquer outra tarefa na Dona Garimpeira. Só depois de receber o material:

1. ingerir as fotos conforme `docs/PORTFOLIO_PUBLIC_MEDIA_INGESTION_STANDARD.md`;
2. preencher a galeria;
3. criar "Você também pode gostar" apenas com peças reais;
4. fechar os bloqueios abaixo e só então marcar `published` no catálogo.

## Fora do escopo

Central de leads/painel administrativo da Dona Garimpeira (decisão do
responsável em 2026-11-26: focar só no portfólio).

## Tentativa de sair de rascunho em 2026-11-26 — BLOQUEADA pelos gates

O responsável pediu marcar o projeto como `published` no catálogo mesmo com a
galeria vazia. A troca foi testada e **revertida**, porque reprova gates de
qualidade que não devem ser afrouxados:

- `tests/portfolio/originality.test.ts`: logo classificada como placeholder
  (27 > baseline 26) e 1 fallback de vertical;
- `tests/portfolio/asset-fingerprint.test.ts`: `sharedFallback` = 1 (esperado 0);
- capa do catálogo: `UNCERTAIN_ORIGIN`, sem imagem de capa nem julgamento humano;
- `dona-garimpeira-funnel-onboarding`, `-draft-contract` e `-seo-prepublish`
  fixam `draft` até o manifesto v4 sair de `stage: draft`.

Para liberar: logo oficial do cliente, capa real aprovada (das peças), revisão
da baseline de originalidade e fechamento dos bloqueios do manifesto v4.

A página `/portfolio/dona-garimpeira-brecho` continua no ar e acessível; o
rascunho afeta só o selo/estado no catálogo.
