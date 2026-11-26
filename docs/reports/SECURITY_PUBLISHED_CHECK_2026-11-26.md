# Checagem de segurança — site publicado (0web.com.br) — 26/11/2026 02:30 UTC

Escopo: leitura apenas. Nenhuma permissão, dado, segredo ou publicação foi alterado.
Sem segredos, credenciais ou dados pessoais neste relatório.

## Como foi verificado
- Sondagem HTTP anônima em `https://www.0web.com.br` (rotas administrativas, arquivos sensíveis, cabeçalhos).
- Leitura anônima da API de dados com a chave pública (somente contagem de linhas e nomes de colunas).
- Varredura automática do projeto (banco, dependências, MCP) e linter do banco.
- Consulta de privilégios reais (`has_function_privilege` / `has_table_privilege`).

## Críticos
Nenhum encontrado.

## Altos
1. **Funções de manutenção executáveis por visitante anônimo** via API de dados.
   Privilégio EXECUTE confirmado para `anon` em funções `SECURITY DEFINER` sem checagem interna de papel:
   - `purge_visitor_events_old`, `purge_visitantes_rastreio_old`, `purge_visitor_funnel_sessions`,
     `purge_ip_blocklist`, `purge_rate_limit_buckets`, `anonymize_visitantes_rastreio_old`
     (apagam/anonimizam registros vencidos; um terceiro pode dispará-las e esvaziar bloqueios/limites expirados);
   - `refresh_visitor_mvs`, `pgrst_reload_schema` (carga/negação de serviço);
   - `bump_experiment` (permite inflar números de experimentos);
   - `resolve_or_create_identity`, `stitch_visitor_identity` (gravação em identidades de clientes — corpo completo ainda não revisado);
   - `wa_funnel_update_session`, `check_and_record_rate_limit` (uso legítimo pelo funil; precisam de análise antes de restringir).
   Não executei nenhuma delas (seriam escritas). Todos os usos no código são do lado do servidor.
2. **Visões com privilégio do dono e visões materializadas legíveis por anônimo**:
   `license_overview`, `partner_ranking_30d`, `mv_visitors_daily`, `mv_visitors_hourly`, `mv_block_reasons_daily`
   respondem HTTP 200 a visitante. Hoje retornam **0 linhas** (estão vazias), portanto não há vazamento atual;
   passam a expor licenças, ranking de parceiros e tráfego assim que houver dados.

## Médios
3. Funções de checagem de papel (`has_role`, `is_super_admin`, `is_admin_or_super`, `is_portal_member`, `has_portal_role`,
   `can_manage_settings`) executáveis por anônimo: permitem sondar se um identificador de usuário é administrador.
   Para usuários logados o acesso é necessário (o painel depende dele); para anônimo não.
4. Varredura profunda de código desatualizada (não executada nesta rodada).
5. Homologação remota de RLS no CI segue bloqueada por credencial ausente (run 45418525760).

## Baixos
6. Cabeçalhos `Content-Security-Policy` e `X-Frame-Options`/`frame-ancestors` ausentes. Presentes: HSTS, `nosniff`, `Referrer-Policy`.
7. 71 políticas permissivas múltiplas, 65 chaves estrangeiras sem índice, 1 índice duplicado (desempenho, não exposição).
8. Leitura pública intencional já aceita anteriormente: `blog_seo_overrides`, `mk_specialties`, `site_sections`, bucket `service-images`.

## Aprovado
- RLS habilitado em 100% das tabelas públicas; `anon` sem privilégios diretos em tabelas.
- `lead_submissions` nega leitura anônima (401); `orders`, `profiles`, `user_roles` retornam 0 linhas a anônimo.
- `/.env` e `/.git/config` → 403. Nenhum marcador de segredo no HTML das rotas administrativas.
- Rotas `/painel*` e `/app/agentes` entregam apenas a casca da página; os dados dependem de sessão e papel verificados no servidor (conferido em rodadas anteriores no preview).
- Dependências: 0 vulnerabilidades na varredura de cadeia de suprimentos.

## Correções realizadas
Nenhuma — mudanças de permissão no banco real aguardam autorização do proprietário.

## Correção preparada (não aplicada)
- Revogar EXECUTE de `PUBLIC`/`anon`/`authenticated` nas funções de manutenção e conceder só a `service_role`,
  após confirmar que cada chamada usa o cliente privilegiado.
- Revogar EXECUTE de `anon` nas funções de checagem de papel, mantendo `authenticated`.
- Revogar SELECT de `anon`/`authenticated` nas três visões materializadas e em `license_overview`/`partner_ranking_30d`,
  ou convertê-las para `security_invoker`, validando painel de visitantes, licenças e parceiros.

## Não verificado
- Tentativas autenticadas de escalada de privilégio com conta comum.
- Revisão função a função de todos os endpoints de servidor.
- Loja da Dona Garimpeira: não existe neste projeto (aqui há apenas a página de portfólio em rascunho).

**Conclusão:** o site não deve ser declarado seguro para divulgação ampla enquanto os itens 1 e 2 estiverem abertos.
