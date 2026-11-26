# 0WEB — recuperação Vercel/MCP: evidências e handoff

Rodada híbrida autorizada em 24/11/2026 às 04:01 UTC. GitHub é canônico; não reconstruir implementações do Codex. Este documento substitui somente os estados históricos de runtime do checkpoint anterior, não as regras de segurança/publicação.

## Resultado executivo

**A candidata da PR #548 agora compila para Vercel e preserva MCP/OAuth. Não foi integrada nem publicada nesta rodada.** Falta o gate final compartilhado e acesso ao projeto Vercel/rollback para uma release controlada. Nenhuma alteração de DNS, banco, contato, catálogo ou autenticação foi executada.

| Entrega | PR / SHA conferido | Evidência | Merge / Production | Pendência |
| --- | --- | --- | --- | --- |
| Base canônica | main `747c1f9b187b51a501b6a23202e60a5ed589458e` | GitHub e checkout conferidos | Nenhum novo merge | SHA efetivamente publicado não confirmado |
| Correção MCP Node do Codex | #548 `9d496e16e7f7a8ca0212c70b8ebca0bd0769f717` | CI Vercel e três testes OAuth/MCP PASS | Draft, não integrada/publicada | Gate compartilhado em andamento; acesso/rollback |
| Conferência independente | Mesmo SDK/código da #548 em cópia isolada | Node v22.23.5: três testes PASS + quatro verificações do adaptador PASS | Sem alterar SDK do app | Não equivale à configuração de produção ainda inacessível |
| Metadados e proteção no host atual | `https://0web.com.br` | Metadados 200; chamada MCP anônima 401 com Bearer challenge | Estado atual acessível | Não comprova que a #548 esteja publicada |
| Handoff | Este relatório + descrição atualizada da #548 | Evidências e ação restrita de autorização | Documental | Continuar quando proprietário liberar acesso e gate finalizar |

## 1. Repositório e infraestrutura

- Repositório: https://github.com/hrq16000/zeroweb-2026
- Equipe Vercel indicada: `msolus`; projeto indicado: `zeroweb-2026`.
- Domínios: https://0web.com.br e https://www.0web.com.br.
- Deployment histórico reprovado: `dpl_5FWa81yxMBkQX9RzLF3iXPQWEREh`, SHA `45ea4abe4789c4ed2e2aa1fcc512abec8464421d`.
- Último Production READY, rollback e associação efetiva de domínio na Vercel: **não acessíveis nesta conexão; não inferir**.
- `vercel.json` mantém `git.deploymentEnabled: false`; merge não garante deploy automático. Não alterar essa configuração nem o DNS para testar.
- `747c1f9b` altera somente `roadmap.md` e o checkpoint documental. **Não contém correções de cases/fotos** e não deve ser transportado como feature. A publicação Lovable desse SHA foi agendada na conversa anterior, sem comprovação de conclusão; nenhuma nova publicação solicitada nesta rodada.

## 2. Origem e solução MCP

```text
src/routes/mcp.ts
src/routes/[.well-known]/oauth-protected-resource.ts
  → @lovable.dev/mcp-js/stacks/tanstack
  → SDK 3.6.0 / dist/validation-xzkdIA-x.js
  → leitor opcional de ambiente / import cloudflare:workers
```

O SDK possui export ESM/CJS TanStack e suporte a Node >=20. O import opcional está protegido em runtime, mas isso não basta quando o empacotador tenta resolvê-lo. A correção atual do Codex **não troca o transporte** nem retorna 404/503 artificialmente.

### Arquivos da candidata #548

- `scripts/prepare-vercel-mcp-runtime.mjs`: somente com `VERCEL=1`, valida versão 3.6.0 e hashes dos dois arquivos ESM/CJS e adapta `readCloudflareEnv` para o leitor real `readProcessEnv`.
- `package.json`: chama esse script antes da compilação, sem alterar o prebuild ou desativar validadores.
- `tests/mcp/vercel-runtime.test.mjs`: metadados, ausência de token, sessão assinada sintética, inicialização/listagem/chamada; rejeita token expirado, audiência incorreta e token sem `client_id`.
- `.github/workflows/build-validate.yml`: job `vercel-runtime-compatibility` com lockfile congelado, Bun 1.4.0 e Node 24.
- Rotas geradas, `src/lib/mcp/index.ts`, escopos, client claim, cliente caller-scoped e ferramentas do catálogo não foram substituídos.

O adaptador é **específico dos bytes auditados da versão 3.6.0**: uma atualização do SDK deve reprovar e exigir revisão, não alteração silenciosa dos hashes. Nenhum alias vazio, mock de transporte, bypass de OAuth ou externalização global foi introduzido.

## 3. Evidência funcional e de compilação

Job confirmado: https://github.com/hrq16000/zeroweb-2026/actions/runs/45323447190/job/138207248889

Logs existentes, sem repetir execução:

- Node **v24.22.3**, Bun **1.4.0**, `bun install --frozen-lockfile`.
- `VERCEL=1`, `NITRO_PRESET=vercel`; prebuild, compilação e postbuild completos.
- `[vercel-mcp] Node environment adapter verified; SDK transport and OAuth preserved.`
- Nitro gerou `.vercel/output/functions/__server.func/...` incluindo o SDK MCP real.
- `.vercel/output/config.json` verificado; **3 testes PASS, 0 FAIL**.

Conferência independente em cópia isolada do pacote (Node v22.23.5, sem credenciais reais):

1. Execução não-Vercel conserva hashes originais: PASS.
2. Adaptação Node auditada remove o import Workers dos dois leitores: PASS.
3. Segunda execução é idempotente: PASS.
4. SDK com bytes inesperados é recusado antes de outras gravações: PASS.
5. Metadados 200, chamada anônima 401, JWTs inválidos 401 e sessão sintética válida com inicialização, listagem e ferramenta somente leitura: três testes PASS.

Apenas o emissor/JWKS sintético do teste foi simulado; transporte, assinatura RSA, verificações OAuth e handler são reais. Nenhum lead, pedido, convite, mensagem ou usuário real foi criado. A conferência não fez login em uma conta de produção e não validou um deployment Vercel publicado.

Às 04:08 UTC, checks da #548: **6 aprovados, 2 pulados por escopo, 1 em andamento**. Build geral, hidratação, estáticos e compatibilidade Vercel aprovados; gate `Pop-up, funis, acessibilidade e regressão visual` ainda em andamento. Jobs pulados de Lighthouse/novos portfólios não foram apresentados como homologação funcional.

## 4. Acesso Vercel: evidência e intervenção mínima

A conexão existente `Vercel API` usa chave emitida pela Vercel; Lovable não gerencia seus escopos. Não foi lida ou exposta nenhuma credencial.

- Consulta sem equipe `/v9/projects`: 200, `projects: []`.
- Consulta atual `/v10/projects?slug=msolus`: 200, `projects: []`.
- Evidência anterior: consulta do projeto/deployment pelo nome/ID retornou 404; consulta de equipe retornou 403.

**Certeza:** não há visibilidade comprovada do recurso alvo nesta conexão. **Não comprovado:** qual conta/escopo exato está incorreto, se falta associação à equipe ou se o projeto está cadastrado sob outro identificador. Não concluir que a chave é inválida, que o recurso foi apagado ou que é necessário acesso global. Um token project-scoped pode negar listagem de equipes por desenho.

### Ação do proprietário

1. Na Vercel, confirmar que a conta que criou a conexão abre `msolus/zeroweb-2026` e tem permissão para ler configurações/logs/deployments do projeto. Para publicar, precisa também de permissão de deployment **nesse projeto**, não administração global.
2. Revisar/criar token em https://vercel.com/account/tokens: selecionar equipe `msolus` e somente projeto `zeroweb-2026`. Não selecionar Full Account quando escopo de projeto for suficiente. Se o projeto não aparecer, resolver acesso da conta primeiro; gerar outro token não concede membership.
3. Atualizar a credencial pela reconexão segura da conexão existente, nunca por GitHub, arquivo ou chat. Não criar outra infraestrutura.
4. Com o acesso corrigido, consultar o projeto e deployments pelo identificador retornado; ler logs e configuração efetiva, identificar último Production READY e rollback.

Referências oficiais: [tokens e escopo restrito](https://vercel.com/docs/accounts/access-tokens), [primeira chamada REST](https://vercel.com/docs/rest-api/getting-started).

## 5. Estado público atual

- Home: HTTP 200.
- `/.well-known/oauth-protected-resource`: HTTP 200, recurso `https://0web.com.br/mcp`, um authorization server e suporte a Bearer por header.
- POST `/mcp` sem credencial para `tools/list`: HTTP 401, desafio Bearer.
- Não reconfigurados OAuth, providers ou serviços; backend e autenticação já existentes preservados.
- Isso confirma proteção/descoberta da **versão que já serve no domínio**, não publicação da nova adaptação Vercel nem consulta autorizada de catálogo na produção.

## 6. Fila recuperada, sem novos testes nem merge

| PR | HEAD consultado | Estado dos checks existentes | Decisão |
| --- | --- | --- | --- |
| #547 | `b8b258307362fd26a0990aab3dbac30044ffa267` | Substitui somente /mcp por 404, mantém imports anteriores | Não integrar; só encerrar após substituição/homologação integral |
| #530 Doce Coração | `6cf27155c709bff5c130e65e2284a335e378373b` | Nova rodada em andamento, estáticos/QA Agropet/Cantinho/preflight aprovados no snapshot | Não reutilizar HEADs antigos nem afirmar gates finais verdes |
| #543 BPL | `2d78b56d4f27215e1b78f4381c9a0420f74c7860` | 9 aprovados, 5 falhas, 1 pulado; falhas visual e quatro shards Lighthouse | Não elegível ainda; reconciliar após infraestrutura |
| #542 Fran | `f09bdfd319703266255fa1afdba30ee998411b22` | 5 aprovados, 8 falhas, 2 pulados; inclui build/estáticos/hidratação e Lighthouse | Não elegível ainda |
| #536 Marli | `923a11d843b29d1972d595bdc6b520d236408e77` | 8 aprovados, 5 falhas, 2 pulados; estáticos e quatro shards Lighthouse | Não elegível ainda |
| #539 performance | `c8a8d25e9a625fe125db955da9349a386c136a6a` | HEAD inventariado; não repetidos testes nem aplicada composição visual nesta rodada | Reaproveitar só delta necessário e comprovado |

Inventário da consulta de PRs abertas inclui também #544, #537, #535, #525, #512, #511, #503, #502, #497, #466, #458, #456, #446, #295, #285, #283, #282, #278, #273, #272, #271, #270, #269, #267, #265, #263, #262, #261, #260, #216, #214, #212, #204, #194, #193, #96, #93, #90, #84 e #81. Nenhuma foi integrada/fechada nesta inspeção. Não tratar propostas antigas/duplicadas como novas marcas prontas para publicar.

Fases comerciais, mídia, cases, administração, Jotform e divulgação do anexo permanecem backlog, não mudanças desta rodada. Não substituídas imagens, números, preços ou funis.

## 7. Reprodução e critérios para uma única release

Em checkout autorizado da candidata vigente, com pacotes/runtime confirmados e sem imprimir variáveis secretas:

```bash
bun install --frozen-lockfile
VERCEL=1 NITRO_PRESET=vercel bun run build
test -f .vercel/output/config.json
node --test tests/mcp/vercel-runtime.test.mjs
```

Não repetir esses comandos para o SHA já homologado por um CI equivalente. No sandbox Lovable, não disparar builds manuais; a evidência acima veio do workflow existente. A configuração real de produção continua por confirmar.

Aceite para integrar/publicar:

1. Revalidar main e HEAD imediatamente antes do merge; não sobrepor alterações do Codex.
2. Todos os gates aplicáveis concluídos/aprovados, sem redução de thresholds/baselines.
3. Acesso ao projeto, build settings, runtime, último READY e rollback comprovados.
4. Merge por PR revisada, SHA integrado confirmado; uma única publicação controlada autorizada.
5. Confirmar deployment READY, SHA e domínio separadamente; não mudar DNS se domínio estiver na origem Lovable.
6. Homologar descoberta MCP, ausência/token inválido, consentimento e chamada autorizada somente leitura no deployment publicado, sem leads/WhatsApp.
7. Só então liberar a primeira candidata de portfólio que estiver reconciliada e com gates verdes.

Rollback: preservar o último Production READY e seus aliases; usar o mecanismo oficial de rollback apenas se necessário e autorizado. Nenhum ID READY foi inventado nem deployment removido.

## 8. Registro de competências

Aplicados roteamento 0WEB, contratos Git-first, regras de runtime e procedimentos MCP/TanStack/OAuth. Não aplicáveis nesta fase: redesenho, mídias, CRO/motion e auditorias gerais. Nenhuma dependência instalada/atualizada no app, nenhuma alteração em rotas geradas ou políticas. Mudanças desta rodada: registro documental e descrição da PR existente; execução funcional isolada da correção já feita pelo Codex.

**Production READY nesta rodada: não confirmado. SHA integrado/publicado da #548: nenhum. Próximo bloqueio acionável: acesso da conta/escopo Vercel e finalização do gate compartilhado.**