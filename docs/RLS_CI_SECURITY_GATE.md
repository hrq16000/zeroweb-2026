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

O workflow legado só pode utilizar essa credencial se ela já estiver disponível
por um meio autorizado. **Lovable Cloud não fornece essa chave ao proprietário**;
não pedir que ele a obtenha, não fabricar um valor e não trocar de backend.
Nunca gravar credenciais em `.env`, source code, logs, artefatos ou documentação.

Enquanto o runner não tiver autorização suficiente, manter
`BLOCKED_MISSING_SECRET`. Uma execução no ambiente autorizado do Lovable Cloud
com fixtures sintéticas fornece evidência local, mas **não substitui** o gate
remoto. Adequar o gate a um método autorizado de sessão/fixtures é uma frente
separada: requer provisionamento seguro no runner, dois sujeitos sem privilégios
globais e um administrador de teste; nunca expor um endpoint público de testes,
reaproveitar contas reais sem aprovação ou desabilitar o preflight.

## Preparação de 24/11/2026 — não aplicada ao banco

- Os testes agora usam `bun test`, limite de 180 s para a sequência completa e
  cancelamento por requisição após 10 s. O isolamento exige leitura positiva do
  próprio lead e negativa entre portais; falhas de rede/FK não contam como PASS.
- `visitantes_rastreio` usa INSERT com hashes sintéticos únicos; o índice real
  inclui `COALESCE(path, '')`, não é a chave `(ip_hash, day)` assumida pelo teste.
- `docs/rls/lead-history-trigger-candidate.sql` prepara somente a elevação do
  trigger de histórico, search_path seguro e revogação de EXECUTE público; não
  cria permissões diretas para ler/forjar histórico nem modifica o corpo/roles.
- `tests/rls/lead-history-trigger.fixture.sql` é **exclusivamente para banco local
  descartável**. Não executá-lo no backend: ele reproduz a falha antes do ajuste
  e verifica persistência, histórico único e negativas de leitura/forja depois.
  Substituir somente a linha `-- APPLY_CANDIDATE` pelo candidato, usando função
  de substituição (não string de replacement, que corrompe os delimitadores $$).
- O script histórico `tests/rls/portal_isolation.sql` não é a via de homologação
  desta preparação: contém DROP de FK e captura `OR others` que pode mascarar
  sucesso de escrita indevida. Não executado; usar os testes TypeScript corrigidos.

Evidência e condições para promoção do SQL em
`docs/reports/RLS_LIGHTHOUSE_PREPARATION_2026-11-24.md`.

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
