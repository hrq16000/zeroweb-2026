# Prompt de finalização para o Lovable

Trabalhe exclusivamente sobre o commit mais recente de `main` deste repositório.

Objetivo: fechar a reconciliação dos destinos WhatsApp dos 92 portfólios sem inventar, copiar ou expor contatos.

Regras obrigatórias:

1. Use somente catálogo, `portfolio-clients`, `portfolio-funnel-context`, ledger de destinos, migrations, documentação, histórico Git e secrets configurados no ambiente.
2. Para cada `clientKey`, aceite somente `CONFIGURED`, `MISSING`, `INVALID_FORMAT` ou `CONFLICT`.
3. Nunca exiba números, tokens ou secrets em logs, relatórios, bundles, commits ou respostas.
4. Nunca reutilize o contato de outro cliente. Não faça fallback para contato institucional da 0WEB.
5. Corrija apenas mapeamentos com evidência documental inequívoca. Casos sem evidência continuam bloqueados como `MISSING`; divergências continuam `CONFLICT`.
6. Resolva destinatários exclusivamente server-side por `clientKey` e confirme que nenhum contato operacional aparece no bundle público.
7. Não declare produção pronta enquanto houver `MISSING`, `INVALID_FORMAT`, `CONFLICT` ou gate falhando.

Execute e registre:

- auditoria do catálogo e boundaries;
- auditoria de funnel-context e operação;
- reconciliação dos 92 `clientKey`s;
- scan de privacidade;
- testes unitários, typecheck, build de produção e E2E de hidratação, quando o ambiente fornecer Bun/dependências;
- relatório final em `docs/reports/PORTFOLIO-WHATSAPP-RECONCILIATION.md`, sem valores sensíveis.

O relatório final deve informar apenas contagens, status por `clientKey`, fontes sem revelar valores, gates executados e bloqueios restantes. Se os secrets oficiais não estiverem disponíveis, pare sem alterar mapeamentos e informe exatamente quais casos permanecem pendentes.

Ao terminar, retorne o commit, branch/PR, resultado de cada gate e a confirmação de que nenhum contato foi exposto. Não use “100% concluído” se a evidência ou os gates não sustentarem essa conclusão.
