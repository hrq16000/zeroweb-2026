# Auditoria da entrada `/portfolio` — 2026-09-07

Escopo limitado à entrada `/portfolio`; nenhuma rota `/portfolio/<slug>` ou
outro endereço foi alterado.

- Região agora é persistida na URL (`regiao`) e restaurada em links filtrados.
- O resumo usa a quantidade real do catálogo carregado e remove porcentagem não verificável.
- O preview fecha se a filtragem invalidar seu índice.
- A revisão foi mantida exclusivamente na rota de entrada e documentada para futuras auditorias.
