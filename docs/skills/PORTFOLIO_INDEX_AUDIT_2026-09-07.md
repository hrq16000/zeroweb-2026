# Auditoria da entrada `/portfolio` — 2026-09-07

Escopo deliberadamente limitado à rota de entrada `/portfolio`. Nenhuma rota
`/portfolio/<slug>` ou outro endereço foi alterado.

## Correções aplicadas

- Filtro de região passou a ser persistido na URL (`regiao`) e restaurado ao
  abrir um link filtrado.
- Resumo do cabeçalho usa a quantidade real do catálogo carregado e não exibe
  uma porcentagem comercial não verificável.
- Selects receberam foco visível consistente para navegação por teclado.
- Preview é fechado automaticamente quando uma filtragem torna seu índice
  inválido, evitando estado quebrado.

## Validação

- Escopo revisado por diff: apenas `src/routes/portfolio.index.tsx` e este
  registro documental.
- Typecheck/build devem ser executados no ambiente Node/Bun configurado do
  projeto antes do merge.
