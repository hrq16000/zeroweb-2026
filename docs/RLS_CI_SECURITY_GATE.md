# RLS CI SECURITY GATE

Status: **OBRIGATÓRIO PARA AFIRMAR “RLS VALIDADO”**  
Effective date: **2026-09-23**

## Problema corrigido

Historicamente, testes RLS podiam aparecer dentro de `bun test` e encerrar com
`SKIP` quando `SUPABASE_SERVICE_ROLE_KEY` não estava disponível no runner.

Isso tornava possível ter CI global verde sem que o RLS tivesse sido realmente
exercitado.

A regra oficial passa a ser:

> **SKIP não significa PASS. Ausência da credencial significa RLS NÃO VALIDADO.**

## Workflow canônico

`.github/workflows/rls-security.yml`

O workflow:

1. verifica se `SUPABASE_SERVICE_ROLE_KEY` existe no GitHub Actions;
2. falha explicitamente com `RLS BLOCKED_MISSING_SECRET` quando não existe;
3. nunca imprime o valor do secret;
4. executa `tests/rls/sensitive_tables.test.ts`;
5. executa `tests/rls/portal_isolation.test.ts`;
6. só permite a afirmação “RLS validado” quando ambos executam e passam.

## Credenciais

O projeto já possui URL e publishable key públicas/configuradas no ambiente do
repositório. O segredo que não pode ser versionado é:

`SUPABASE_SERVICE_ROLE_KEY`

Ele deve existir em GitHub repository/environment secrets. Nunca deve ser
gravado em `.env`, source code, logs, artefatos ou documentação.

## Semântica de status

- `PASS`: os testes RLS reais executaram e passaram.
- `FAIL`: os testes executaram e encontraram quebra de isolamento/política.
- `BLOCKED_MISSING_SECRET`: o runner não possui a credencial; não há evidência
  suficiente para afirmar que o RLS passou.
- `SKIP` dentro da suíte genérica: não conta como evidência RLS.

## Gatilhos

O gate roda:

- manualmente;
- diariamente;
- em push para `main` quando arquivos relacionados a Supabase/RLS ou o próprio
  workflow forem alterados.

O gate não bloqueia todas as PRs comuns enquanto a credencial ainda não está
disponível, mas torna a lacuna de segurança explícita e auditável.

## Projeto Supabase observado

A configuração versionada da 0WEB aponta para o project ref:

`lxajhxocyqzwwbcfahya`

A presença desse identificador não substitui autorização de acesso ao projeto.
Auditoria direta via Supabase requer que a conta/conector tenha acesso ao
projeto correto.

## Regra operacional

Nenhum relatório, agente ou auditoria deve transformar:

`CI geral verde + RLS SKIP`

em:

`RLS verificado`.

A afirmação correta enquanto o secret estiver ausente é:

`CI funcional verde; RLS bloqueado por credencial ausente no runner.`
