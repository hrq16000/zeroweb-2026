# 0WEB — reconexão Vercel, painel e correções autorizadas

## Escopo e resultado

Pedido híbrido de 24/11/2026 às 04:58 UTC; página administrativa autorizada às 05:10 UTC. O commit `873a19383de9ae0084cad59b7cd3df0a9fd563d4` não foi reescrito. Correções e nova página pertencem a commits posteriores, não são apresentadas como conteúdo do SHA documental.

- **Conexão Vercel: operacional.** Consulta do projeto retornou HTTP 200 e confirmou `prj_IiJJUu2Rr4vV20tWJ6WaZ7nlr6xv`, `accountId=team_m7IZ2zkytSEOtp2bTsQy0R0A`, equipe `msolus`, projeto `zeroweb-2026`.
- A credencial antiga negou criação de token com `403 forbidden`, `action=create`, `resource=token`. Nenhum token foi gerado por essa tentativa. A conexão foi atualizada pelo fluxo seguro de reconexão; não foi solicitado nem exposto token em código/chat.
- **Publicação exata 873a1938: NÃO.** Uma chamada POST `/v13/deployments`, `target=production`, SHA fixo confirmado em `gitSource` e `meta.githubCommitSha`. ID `dpl_2p37yyDbFFFhbKw55y2hWv11QFBX`; inicialmente BUILDING, leitura final às 05:29 UTC: **ERROR**, `errorCode=module_not_found`, `errorStep=buildStep`, `aliasAssigned=false`. Logs finais lidos às 05:30 UTC comprovam o import `cloudflare:workers` não resolvido pelo build Vercel. Nenhum retry efetuado.
- URL candidata: `https://zeroweb-2026-gjra5eunw-msolus.vercel.app`. Não apresentada como site publicado.
- Última produção READY confirmada no histórico consultado: `dpl_FcL5kPsArmdCToF47oCzeRu61GGA`, SHA `58032d30991b9203ebdadb4501d83acaafd1a3a8`. Preservada para retorno; nenhum deployment apagado/cancelado.

## Painel administrativo

`/app/publicacao` usa conexões GitHub/Vercel do proprietário somente no servidor, com sessão existente e `requireAdmin` aceitando somente `admin`/`super_admin`. Nenhuma migração, nova tabela ou fonte paralela de catálogo.

- Lista os últimos 50 commits reais da `main`, seleciona SHA e consulta checks após verificar que o commit é ancestral/igual à main.
- Mostra status das três consultas (GitHub, projeto Vercel, histórico Vercel), código HTTP e erros sem credenciais.
- Histórico de 10 deployments: separa preview/produção e READY/BUILDING/ERROR; SHA ausente permanece desconhecido.
- Selecionar um commit não o publica: ações são copiar SHA, abrir o commit no GitHub e abrir publicações Vercel. Não implementado deploy automático, alteração de settings, bypass de gates ou seleção de branch arbitrária.
- Projeções públicas da função excluem e-mail de autores, creator, env, tokens, contatos e leads. Projeto deve corresponder aos IDs autorizados antes de consultar histórico.
- Link no menu admin; nenhum link inserido no site público e nenhum acesso de agentes alterado.

## Correções editoriais

1. `/sobre`: “Ver cases de clientes” passa de `/#cases` para a rota existente `/cases`.
2. `/servicos/gestao-redes-sociais`: seção deixa de apresentar fotos Unsplash como “Equipe real, trabalho real”. Título/aviso identificam referências editoriais ilustrativas, não equipe/sede/trabalhos da 0WEB; alt também identifica a natureza das imagens.

Imagens existentes, preços, escopos comerciais, carrinho, CTAs, funis e metadados foram preservados. Nenhuma imagem fictícia criada e nenhuma revisão geral de métricas ou outros portfolios.

## Evidência de validação

- Harness: **build OK** após correção do tratamento de `error: unknown`; nenhum build manual executado.
- 14 testes focados em política de publicação, permissões, redirecionamento OAuth e erro de auth: **14 PASS, 0 FAIL**.
- Testes novos comprovam IDs exatos, rejeição de equipe diferente, ausência/skips não equivalendo a PASS, READY preview não equivalendo a produção, projeção sem e-mail/chave, nenhuma escrita com falha Vercel e bloqueio de usuário/colaborador.
- `validate:brand-integrity`: **6 assets protegidos OK**.
- `scan:source-privacy`: **OK, sem contato operacional em código público**; avisos preexistentes não alterados.
- Playwright autenticado com conta administrativa do proprietário: seleção 873a1938 e checks reais aprovados; Vercel projeto/histórico HTTP 200; atualizar status finaliza; visitante redirecionado para auth.
- 390px: zero overflow; controles acessíveis e título/seleção/SHA legíveis. Capturas desktop/mobile inspecionadas em `/tmp/browser/publication-check`.
- Navegação real /sobre → /cases: PASS. Seis fotos da seção ilustrativa carregadas (`naturalWidth>0`), aviso visível: PASS. Zero pageerror nas páginas conferidas.
- POST MCP sem token: **401**; rotas MCP, OAuth, escopos e implementação de agentes não foram editados nesta rodada.

### Suíte completa — bloqueios não ocultados

`bun test`: **1174 PASS, 2 FAIL**, 1176 testes / 212 arquivos. Runtime sandbox disponível: Bun 1.4.4; nenhuma dependência ou lockfile alterado para mudar a versão.

- `tests/rls/portal_isolation.test.ts`: timeout de 5000 ms durante teste de banco real; resposta 400 no seed de `visitantes_rastreio` também aparece no log. Não concluir isolamento completo aprovado.
- `tests/rls/sensitive_tables.test.ts`: atualização admin de `lead_submissions` falha porque uma inserção em `lead_history` viola RLS. Não afrouxar políticas para publicar; esse trabalho requer frente específica de segurança/banco.
- As fixtures dos testes existentes usam `finally` para limpeza. Nenhum novo dado de pedido/lead foi usado para homologar o painel, que é somente leitura.

Não publicado um novo commit de correções enquanto a suite geral tem falhas reais e o runtime Vercel da base falha. A publicação no host Lovable/domínio oficial não foi solicitada para substituir silenciosamente o SHA 873a1938 por um commit posterior.

## Doce Coração — não confundir falha global com falha do cliente

PR #530 foi conferida no HEAD abreviado `6cf27155`. Checks existentes consultados; nenhum rerun disparado.

- `Lighthouse, funis e visual dos novos portfólios`: **SUCCESS**.
- `Doce Coracao - Chromium 390/768/1440`: **SUCCESS**.
- Build, hidratação e estáticos: **SUCCESS**.
- Shards globais 0, 1 e 2: **FAILURE**; shard 3: **SUCCESS**.
- Gate compartilhado de pop-up/funis/acessibilidade/regressão visual: **FAILURE**. Não apresentado como aprovado.

Falhas efetivas dos três shards, com threshold de performance **0,90 preservado**:

| Shard | Portfólio | Performance encontrada | Outro bloqueio |
| --- | --- | --- | --- |
| 0 | refrigeracao-maresia | 0,87 | — |
| 0 | embalar-embalagens | 0,87 | — |
| 0 | mania-de-limpeza | 0,89 | — |
| 0 | your-brutus-burguer | 0,87 | — |
| 0 | carecas-infotec | 0,89 | — |
| 1 | paulo-mestre-de-obras | 0,88 | — |
| 1 | dlara-pizzaria | 0,88 | — |
| 1 | angel-mix-brecho | 0,83 | LCP 2671,8413 ms > 2500 ms |
| 1 | auto-socorro-dentinho | 0,88 | — |
| 2 | marmitaria-dom-diego | 0,89 | — |
| 2 | centro-mega | 0,89 | — |
| 2 | jkl-decor | 0,88 | — |

Não existe evidência desses logs de que alterar Doce Coração corrija essas 12 páginas. Não remodelar outros clientes nem mudar thresholds/baselines implicitamente. A release #530 aguarda remediação dos gates globais/revisão externa já em curso; não reconstruir a candidata em main.

## Erro Vercel confirmado na publicação solicitada

Logs finais HTTP 200 da publicação `dpl_2p37yyDbFFFhbKw55y2hWv11QFBX` (873a1938) confirmam a mesma causa já encontrada no deployment histórico `dpl_5FWa81yxMBkQX9RzLF3iXPQWEREh` (45ea4abe):

```text
[vite]: Rollup failed to resolve import "cloudflare:workers" from
"/vercel/path0/node_modules/@lovable.dev/mcp-js/dist/validation-xzkdIA-x.js".
```

A correção auditada está na PR #548, HEAD `9d496e16e7f7a8ca0212c70b8ebca0bd0769f717`, ainda aberta/não integrada na conferência. Não aplicada silenciosamente ao SHA documental solicitado. Agora a mesma causa está comprovada diretamente nos logs finais da tentativa 873a1938, não apenas inferida do histórico.

## Continuidade híbrida

Código salvo no commit `9e4c2fa8` pelo estado sincronizado da plataforma; correção final do tratamento de erro e relatório inicial no commit `6958cfa3`. Este fechamento registra o erro terminal em commit posterior, sem reescrever histórico. GitHub main continua canônico; não recriar alterações em outra cópia. Nenhuma operação de DNS, domínio, settings Vercel, reset, force-push, merge ou migração foi usada.

Próximo operador: revisar gates e integração da PR #548 preservando MCP/OAuth, resolver os dois testes RLS e os gates globais da #530 nas frentes correspondentes, então publicar um SHA novo aprovado. **873a1938 não pode passar esse build Vercel sem alteração posterior**; não repetir o mesmo deployment à espera de resultado diferente. Publicação da nova página, correções editoriais e Doce Coração permanecem pendentes; nada foi declarado no ar sem evidência.