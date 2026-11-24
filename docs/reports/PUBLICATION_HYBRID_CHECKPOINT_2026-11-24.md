# 0WEB — checkpoint de estabilização e execução híbrida

Data: 2026-11-24 UTC. Escopo: infraestrutura/publicação e primeira candidata elegível; nenhuma funcionalidade administrativa nova.

## Sincronização e ações efetivas

- GitHub `main` e checkout Lovable confirmados em `11a6d2edb076018e98fdfaeb3cfccd058831577d`, após o registro da rodada. Esse SHA não é uma confirmação de publicação.
- Preferência de continuidade híbrida registrada; não reimplementar mudanças existentes no Codex para sincronizar.
- Recuperadas as nove execuções já existentes do SHA de referência da PR #530; nenhum workflow repetido, nenhum deployment iniciado.
- Conexão privada Vercel API criada e autorizada pelo proprietário. Credenciais permanecem no conector; nenhum valor foi lido/exposto. O acesso ao projeto alvo não foi confirmado.
- Revisadas as PRs #547 e #548 sem integrá-las: não substituir MCP por 404/503 para declarar compatibilidade.
- Checkpoint registrado também na PR existente, para continuidade fora do Lovable: https://github.com/hrq16000/zeroweb-2026/pull/548#issuecomment-7121372644

## Execuções históricas recuperadas — PR #530

SHA: `c9f823014239c1e4bb21951498bc9ec651b7dbc5`.

| Run | Workflow | Resultado existente |
| --- | --- | --- |
| 45316791570 | portfolio-gates | failure |
| 45316791412 | Agropet Filt · visual QA | failure |
| 45316791550 | Lighthouse CI | failure |
| 45316791429 | Doce Coracao - QA 390/768/1440 e NO-BRAND | success |
| 45316791610 | E2E · Hidratação | cancelled |
| 45316791489 | New Portfolio Publication Gate | failure |
| 45316791540 | Portfolio · Pré-voo de lote (rápido) | success |
| 45316791458 | Cantinho Tia Mari · visual QA | success |
| 45316791549 | build-validate | failure |

Logs dos runs `45316791549`, `45316791570` e shard Lighthouse confirmam falha do hash protegido de `src/assets/logo-0web.png.asset.json`: esperado `e23e6080e6097733ad368b8d442ba02684ae0bd33ca866e143c1e9535565a219`, obtido `75229de6008d3f924f6867c1bec3488607161f7def41b48a4688375894e65f85`. O Lighthouse desse SHA parou no prebuild; não havia artifacts LHR. Não tratar essa falha antiga como estado da candidata atual.

## Logo — medição efetiva

Arquivos públicos lidos diretamente no SHA histórico acima, sem alterar/gerar imagens:

| Arquivo | Bytes | Dimensões |
| --- | ---: | --- |
| `public/0web-logo.png` | 149726 | 900 × 277 |
| `public/0web-logo.webp` | 87136 | 900 × 277 |

Redução: **62590 bytes / 41,80%**. Comparação das matrizes RGBA: **idênticas**. Isso comprova redução de transferência potencial, não ganho de LCP nem utilização do WebP no host publicado. Nenhuma baseline institucional foi alterada.

## PR #530 atual — não reutilizar o SHA antigo

HEAD consultado: `a8c0fa2191037888f3652a44136ed6d656b26190`, ainda draft.

- Build, validadores estáticos, hidratação, QA próprio Chromium 390/768/1440 e gate específico de novos portfólios: aprovados na execução existente.
- Shards Lighthouse 1, 2 e 3: reprovados; shard 0 aprovado.
- No shard 3, `/portfolio/r_beauty`: performance 0,77/0,69 (piso 0,90), LCP 3667,74/3853,22 ms (limite 2500 ms). Evidência de laboratório do CI, não p75 de visitantes e não efeito causal do logo.
- Job visual `138187088076`, run `45317161665`: **46 diferenças não aprovadas**; imagens da Doce Coração em desktop/tablet/mobile passaram com 0,00% de diferença. Avisos de ingestão de vitals sem credencial não devem ser confundidos com a causa final desse job, que foi o gate visual.
- Não reduzidos thresholds, não atualizadas baselines e não retirado draft.

## MCP — origem identificada, publicação Vercel não homologada

Pacote instalado e resolvido: `@lovable.dev/mcp-js@3.6.0`.

```text
src/routes/mcp.ts
src/routes/[.well-known]/oauth-protected-resource.ts
  → @lovable.dev/mcp-js/stacks/tanstack
  → dist/stacks/tanstack/index.js
  → dist/validation-xzkdIA-x.js:89–92
  → import opcional de cloudflare:workers
```

A leitura de ambiente do SDK já usa `@vite-ignore`, captura falha da importação opcional e possui leitura de `process.env`. Empacotamento isolado do adaptador TanStack com esbuild para Node: **PASS**. Não é homologação Vercel/Nitro/Rollup e não demonstra que o SDK seja inteiro exclusivamente Cloudflare.

- PR #547: substitui `/mcp` por 404, deixa de cobrir a rota de metadados e usa versão anterior da configuração Vite. Não integrada.
- PR #548, HEAD `58cbd829d641cdb21f32b6bfcea1ab84f86df83b`: módulos virtuais substituem transporte/metadados por 503. Build/estáticos/hidratação aprovados, mas quatro shards Lighthouse e gate visual reprovados. Entre as seis execuções existentes consultadas, não foi encontrado run do workflow novo `Vercel build compatibility`. Não integrada.
- Não criado alias vazio, mock, externalização global ou implementação alternativa de MCP; código atual preservado.

## Bloqueio externo — acesso Vercel

GitHub registra `Vercel: failure` para `45ea4abe4789c4ed2e2aa1fcc512abec8464421d`, associado a `dpl_5FWa81yxMBkQX9RzLF3iXPQWEREh`.

Consultas reais pela conexão autorizada:

| Consulta | Resultado |
| --- | --- |
| `/v2/teams` | 403 `forbidden`, action `list`, resource `team` |
| `/v9/projects/zeroweb-2026`, slug `msolus` | 404 `Project not found.` |
| `/v13/deployments/dpl_5FWa81yxMBkQX9RzLF3iXPQWEREh`, com slug e também por ID direto | 404 `Deployment not found` |

Não foi possível obter logs completos, configurações reais de build, último Production READY/rollback ou confirmar propriedade/associação do domínio na Vercel. Um 404 nessa situação não prova que o deployment ou projeto não exista. Não repetir criação/reconexão de credenciais nem disparar build como tentativa de obter acesso.

## Host atual

- `https://www.0web.com.br` responde 200 após redirecionar para `https://0web.com.br/`.
- `https://0web.com.br` responde 200; canonical `https://0web.com.br/` e título específico da 0WEB.
- Esses resultados mostram que o site atual está acessível. **Não comprovam nova publicação nem READY na Vercel.**

## Continuação mínima e verificável

1. O operador da Vercel deve liberar acesso da conexão ao projeto/equipe corretos. Alternativa externa: na conta/equipe autorizada, executar `vercel inspect dpl_5FWa81yxMBkQX9RzLF3iXPQWEREh --logs` e compartilhar apenas logs sanitizados/configuração não secreta.
2. Reconciliar a correção com a `main` vigente e resolver a cadeia de imports no ambiente real, preservando MCP/OAuth; não integrar #547/#548 como solução de compatibilidade funcional.
3. Aproveitar a #539 somente após revisão de delta e resolver os gates reais de LCP/visual sem reduzir limites. Não alterar em massa portfólios/baselines para liberar a fila.
4. Homologar novo candidato equivalente à Vercel com lockfile congelado, versões verificadas, output SSR, Node e Bun da produção. O sandbox tinha Node 22.23.5/Bun 1.4.4; isso não equivale automaticamente ao contrato Bun 1.4.0 nem à configuração Vercel inacessível. Nenhum build completo local foi disparado nesta rodada.
5. Somente após gates aprovados: integrar por PR, confirmar SHA, iniciar no máximo uma publicação autorizada, verificar READY e host efetivo. `vercel.json` mantém `git.deploymentEnabled: false`; merge não implica deploy automático.
6. Avançar na primeira PR de portfólio elegível depois da infraestrutura. Nenhuma candidata foi publicada nesta rodada.

## Restrições preservadas

Sem SQL/migração/dados de banco, DNS, mudanças de funis/WhatsApp, edição institucional, alterações comerciais ou novas funcionalidades. Nenhum publish Lovable/Vercel foi solicitado. Alterações locais desta rodada: registro de roadmap e este relatório; comentário de continuidade na PR existente. Skills aplicadas: `0web-skill-router`, contratos Git-first e regras de runtime; stack visual/research externo de UI não aplicável.

**Publicação efetiva nesta rodada: NÃO. Commit publicado: não confirmado. Production READY: não confirmado.**