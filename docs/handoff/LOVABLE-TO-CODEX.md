# 0WEB — continuidade Lovable → GitHub/Codex

**Inspeção final autorizada em 24/11/2026 às 14:54 UTC.** Repositório: [hrq16000/zeroweb-2026](https://github.com/hrq16000/zeroweb-2026). Esta rodada é somente leitura, preservação e documentação. Não autoriza as próximas rodadas.

## 1. Resultado executivo e referências verificadas

| Item | Resultado |
|---|---|
| HEAD Lovable no início | `eecb2829f3309351d5b8eee008741b13e0d27472` |
| Branch local | `main`; remote local é espelho gerenciado, não prova sozinho o estado GitHub |
| HEAD GitHub main consultado | `eecb2829f3309351d5b8eee008741b13e0d27472`, HTTP 200 às 14:55 UTC |
| Commits da implementação não sincronizados | **0**, SHA idêntico e árvore remota integral confrontada |
| Arquivos versionados conferidos | **3019 blobs, zero ausentes e zero diferenças** em relação ao GitHub; árvore não truncada |
| Working tree no início | Limpo; sem arquivos de aplicação modificados/não rastreados |
| Alterações desta rodada | Somente este documento e checklist `roadmap.md`; sem substituição de código por relatórios |
| Branch isolada solicitada | `docs/lovable-to-codex-handoff-20261124` **não criada**, HTTP 403 OAuth App da organização |
| Transferência de código exclusiva | Não necessária: a implementação já está preservada na main; não recriar/cherry-pickar `eecb2829` sobre si mesma |
| Sincronização da implementação | **CONFIRMADA** por SHA + todos os blobs; documento final depende da sincronização do commit de encerramento |
| Production Vercel READY mais recente | SHA `58032d30991b9203ebdadb4501d83acaafd1a3a8`, `dpl_FcL5kPsArmdCToF47oCzeRu61GGA` |
| Última tentativa Vercel | `873a19383de9ae0084cad59b7cd3df0a9fd563d4`, `dpl_2p37yyDbFFFhbKw55y2hWv11QFBX`, ERROR/module_not_found |
| SHA efetivamente servido em 0web.com.br | **PENDENTE**, HTTP 200/headers Cloudflare e domínio verificado não identificam versão do código |
| Contagem pública | **99 cards e 99 leafs de sitemap; 100 entidades nomeadas com HTTP 200**, explicadas abaixo; alias JKL é 101ª URL, não cliente novo |
| Projetos de criação/reativação pendentes | **8**: Doce Coração, BPL, Fran, Marli, Toop, Letícia, Relopar e Dona Garimpeira |
| Outras reconciliações | São Francisco fora do catálogo, Moreira manifesto divergente, alias JKL, manutenção Agropet/Cantinho |
| Solicitações recuperadas | **34 frentes únicas** na seção 7; **17 issues abertas**, **47 PRs abertas (18 Draft)**; não somar contagens sobrepostas |
| Branches preservadas | **566 distintas**, páginas 100/100/100/100/100/66; nenhuma excluída |
| Autonomia Codex | **PARCIAL**: fonte/instalação/CI e edição comprovados; operação privilegiada Cloud, autorizações GitHub e release Vercel bloqueadas ou pendentes |
| Nova publicação nesta rodada | **NÃO realizada**, nenhum merge, rollback, DNS, SQL ou mudança de dados |

### Correções a leituras antigas

- O anexo cita CRM “preparado”. Isso era verdadeiro antes do pedido de 14:19 UTC, mas **foi superado**: migração atômica aplicada, caminho real ligado e código sincronizado em `eecb2829`. Não reaplicar a migração nem reconstruir eventos. Evidência canônica: `docs/reports/LIGHTHOUSE_CRM_AUTOMATION_2026-11-24.md`.
- `/agent-login` hoje responde **200**, não o 404 do checkpoint antigo. Isso comprova rota pública, **não** envio de convite/recuperação nem acesso autenticado em Production.
- “99 projetos publicados” da galeria é contagem bruta do JSON: inclui **Dona Garimpeira draft** e exclui **São Francisco publicado fora do catálogo**. Não corrigir isso por troca cosmética de contador.
- Vercel listou agora **22 deployments**, `next=null`, versus 27 no snapshot anterior. Não atribuir a redução a exclusão nesta rodada: nada foi apagado; política de retenção existe na configuração.
- Relopar original agora tem **14 commits exclusivos / 103 atrás**, não os 93 atrás do inventário inicial. #548 tem **4 exclusivos / 7 atrás**, sem reconciliação.

## 2. Preservação e transferência segura

A tentativa autorizada de criar **somente uma ref isolada**, baseada no SHA já remoto `eecb2829`, retornou:

> HTTP 403: “Although you appear to have the correct authorization credentials, the `hrq16000` organization has enabled OAuth App access restrictions, meaning that data access to third-parties is limited.”

Endpoint: `POST /repos/hrq16000/zeroweb-2026/git/refs`. Nenhuma branch criada, nenhum push forçado ou escrita de conteúdo pela API. **Não contornado por outro token, CLI, conta ou conexão.** Read-only pela conexão existente permanece HTTP 200; Git sync da plataforma é mecanismo distinto dessa API.

Arquivos exclusivos de implementação local: **nenhum**. O último commit remoto inclui os 24 arquivos de CRM/Lighthouse/migração/testes/documentação; árvore inteira comprovada. Somente o documento/checklist desta inspeção requer salvamento final. A plataforma salva commits na branch atualmente sincronizada; isso não comprova criação de PR nem publica Vercel. Não chamar esse salvamento de transferência isolada bem-sucedida.

**Recuperação pelo Codex:** clonar o Git oficial com a autorização própria aprovada da organização; conferir `eecb2829` e `docs/handoff/LOVABLE-TO-CODEX.md`. Se o documento não chegar pelo Git sync, preservar sua cópia do editor antes de permitir substituição por push remoto; aplicar **somente o delta documental** numa branch própria, nunca substituir o repositório por um ZIP de relatórios. Não desconectar Git sync nem criar outro repositório para contornar restrições. Não excluir `lovable-sync*`, backups, branches de clientes ou #547 enquanto equivalência não estiver demonstrada.

## 3. Autonomia: o que existe e o que falta

COMPROVADO = há fonte/executável ou CI já concluído; PENDENTE = falta provar no contexto de uma conta/ambiente independente; BLOQUEADO = há impedimento concreto. Histórico de uma PR não prova permissão atual de um novo agente.

| Capacidade Codex sem editor Lovable | Classe | Evidência / requisito |
|---|---|---|
| Obter/clonar fonte | COMPROVADO (CI); PENDENTE (sessão Codex atual) | Actions checkout executado no repo e 3019 arquivos preservados; conta Codex precisa acesso oficial |
| Instalar lock congelado | COMPROVADO | CI fora do Lovable instalou Bun/lock e compilou; não rerodar o mesmo SHA aprovado |
| Desenvolver páginas públicas localmente | COMPROVADO estrutural; PENDENTE E2E independente | `bun run dev`/Vite/React/TanStack disponíveis; alguns loaders consultam Cloud e falham em vazio quando sem privilégio |
| Criar/editar portfolios | COMPROVADO | Sete candidatas e registries/rotas autorais em branches reais; lifecycle/isolamento/SEO/funil/gates continuam obrigatórios |
| Editar painel/CRM | COMPROVADO código; BLOQUEADO operação privilegiada externa | Funções e UI no Git; caminhos admin dependem da credencial Cloud não exportável |
| Executar testes não privilegiados/build | COMPROVADO | Checks de build/tipos/hydration já success para eecb2829; Bun 1.4.0 normativo, build-validate usa latest e precisa reconciliação futura |
| Executar RLS remoto real | BLOQUEADO | Preflight de credencial falhou em run 45418525760; testes sequer executaram |
| Criar branches/PRs | COMPROVADO histórico; BLOQUEADO nesta API | 566 branches/47 PRs existentes; criação ref desta rodada HTTP 403; sessão GitHub/Codex própria não testada |
| Homologar alteração | PARCIAL | QA, pré-build e workflows existem; resultado atrelado ao SHA e ao escopo, RLS/alguns gates pendentes |
| Publicar pela integração GitHub/Vercel | BLOQUEADO no estado atual | Vercel lê repo/main e último READY, mas #548 não integrada; auto-deploy desativado e privilégio Cloud não provisionado externamente |
| Continuar código sem crédito de agente Lovable | COMPROVADO para source; PARCIAL para operação | Git é fonte independente; Cloud/Auth/AI/gateways ainda são serviços Lovable, não remover por conveniência |

### Stack e preparação independente (instruções, não executadas agora)

1. Ler `AGENTS.md`, `docs/0WEB_EXECUTION_CONTRACT.md`, `docs/0WEB_GIT_FIRST_RELEASE_AND_SEO_POLICY.md` e este documento. Para portfolios, usar playbook/lifecycle e regras clientKey; regras atuais de WhatsApp **SEM COFRE** em `docs/PORTFOLIO_WHATSAPP_POLICY.md` prevalecem sobre documentos históricos.
2. Clonar `https://github.com/hrq16000/zeroweb-2026.git` pela conta oficial autorizada. Conferir main, working tree e branches sem reset, force push ou aplicação cega de branches antigas. Criar branch de tarefa no GitHub/Codex; não editar main para testar hipóteses.
3. **Bun 1.4.0 + bun.lock**, Node 24 para alvo Vercel. `bun install --frozen-lockfile`. Não usar npm install/package-lock. `package.json` é TanStack Start v1 + React 19 + Vite 7 + Tailwind v4, não Next.js apesar de pedidos históricos.
4. `bun run dev` gera derivadas de imagem antes do Vite. Manter outputs gerados conforme scripts; não substituir assets/identidades ou baixar mídia nova para “instalar”. `bun run preview:prod` serve o worker Cloudflare real após build; não é substituto de Node/Vercel preview.
5. `bun test` e `bun run build` **só para um novo delta que precise validação**. Prebuild/postbuild carregam gates canônicos e privacidade; não pular scripts para passar build. Evidências já aprovadas são listadas na seção 8.
6. Para Vercel, reaproveitar #548 e seu job de compatibilidade: `VERCEL=1 NITRO_PRESET=vercel bun run build`; não instalar plugin Nitro/React/TanStack duplicado nem trocar framework. Adaptador é version/hash-specific do SDK MCP; não copiar SDK de uma branch sem analisar delta.
7. Configurações/credenciais de runtime pertencem ao ambiente seguro do serviço. **Não exportar chaves de serviço indisponíveis no Cloud**. Não há autonomia plena de operações admin apenas copiando `.env`; não criar um novo backend ou pedir uma chave impossível.

### Dependências Lovable remanescentes e configuração por papel

| Dependência | Papel / impacto fora do Lovable |
|---|---|
| `@lovable.dev/vite-tanstack-config@2.27.1` | Bootstrap compartilhado instala plugins, Nitro default Cloudflare, aliases/injeção VITE e detecção sandbox. Pacote versionado no lock; CI prova uso externo, sem remoção nesta rodada |
| `@lovable.dev/mcp-js@3.6.0` | `/mcp`, metadata OAuth e plugin dev; import opcional `cloudflare:workers` quebra Vercel da main; #548 contém adaptador preservando OAuth |
| Lovable Cloud | Banco, storage, sessões e clientes gerados; `SUPABASE_SERVICE_ROLE_KEY` inacessível ao proprietário impede provisionamento privilegiado genérico em Vercel/Codex |
| Lovable Auth broker / cloud-auth-js | Google-only existente passa pelo broker. Mesma origem/callback público, sessão hidratada, papéis no servidor; não substituir por senha ou localStorage-only |
| Lovable AI / `@lovable.dev/ai-gateway` | Model calls no servidor, dependem de `LOVABLE_API_KEY` configurada em ambiente autorizado; não assumir key copiável para outro host |
| Connector gateway Lovable | GitHub, Vercel, GSC, Sheets e integrações usam credenciais de conexão do workspace via gateway. Leitura API não equivale a Git sync; copiar nome da variável não provisiona acesso |
| email-js / webhooks-js | Infra de mensagens/recebimentos integrados; manter contratos e configuração de cada consumidor |
| Lovable Assets / mídia no Git | Ponteiros `.asset.json` são URLs utilizáveis pelo app; CLI de geração/ingestão é serviço distinto. Preservar 9 ponteiros versionados e imagens reais locais; não gerar substitutos |
| Ferramentas de editor/preview | Agente, auth-session, migração tool, publish e telemetry são conveniências da plataforma, não APIs de execução disponíveis automaticamente no Codex |

Nomes de configuração necessários (sem valores): públicos browser `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`; servidor `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`; privilégio Cloud interno `SUPABASE_SERVICE_ROLE_KEY` (não solicitável/exportável); AI/gateways `LOVABLE_API_KEY` e conexão específica; recebimento `LHCI_HMAC_SECRET`; integrações opcionais conforme consumidores: Stripe, WhatsApp/UAZAPI, Resend, GSC/Sheets, cron/SEO secrets. Nunca ativar todos por obrigação. A Vercel hoje lista somente `OPENAI_API_KEY` (production), `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` (production/preview); isso **não** demonstra configuração de recebimento, papéis admin, AI gateway ou backend privilegiado naquele host. Nenhum valor/ciphertext foi copiado para este handoff.

## 4. Inventário completo reconciliado

| Fonte | Quantidade atual / definição |
|---|---|
| JSON catálogo | 99 registros; 98 published + 1 draft, zero slug/clientKey duplicados; nenhum campo de data de inclusão/publicação |
| Registry clientes | 98; cada routeFile/componentFile existe no Git; Dona Garimpeira não é registro ativo |
| Seed admin | 99; fallback/override, não fonte independente de publicação |
| Leafs de sitemap público | 99; 98 published do catálogo + São Francisco; Dona Garimpeira fora |
| Cards / resultados UI atual | 99 no preview e no domínio; inclui draft Dona Garimpeira, exclui São Francisco |
| Rotas de entidades nomeadas HTTP 200 | 100 = 99 do catálogo + São Francisco; título/H1 de entidade encontrados. Isso **não** associa a versão a um SHA |
| Alias adicional | `/portfolio/jkl-marcenaria` 200 com título/H1 JKL Decor, mesmo cliente, não 101º portfolio |
| Rotas estáticas individuais | 6 folhas no código, 5 pertencem ao catálogo + São Francisco; restantes usam dispatcher `/portfolio/$slug` |
| Managed publicados / overrides | Última evidência R1: zero Managed, 87 overrides legacy; **não reconsultado banco** nesta rodada; não inferir que é contagem live hoje |
| Lifecycle | 8 manifestos: 7 published, Moreira ready. Legados sem manifesto não são automaticamente incompletos |
| Criação / reativação | 7 rotas novas 404 + 1 draft reativável; nomes abaixo |

A checagem HTTP de leitura cobriu 108 URLs: **101 respostas 200** (100 entidades + alias JKL), **7 respostas 404**. Não é auditoria funcional/motion/funil e não repetiu Lighthouse, scans, builds ou testes. Publicação de código permanece não comprovada por HTTP isolado.

### 4.1 Lista nominal do catálogo e São Francisco

`main` indica que a fonte está integrada no Git, **não** que o SHA atual foi publicado. Nas linhas “200 / sitemap”, há evidência de página pública da entidade, mas nenhuma liberação implícita de redesign/migração/novo deploy. PRs relacionadas são deltas históricos a reconciliar; ausência de PR local não prova ausência de branches históricas. O inventário completo de 566 branches/47 PRs está preservado e a seção 6 lista todas as PRs abertas.

| Nome | Slug / rota `/portfolio/<slug>` | Fonte / PR relacionada | Situação atual | Bloqueio / próxima continuidade |
|---|---|---|---|---|
| SOS Presentes & Cosméticos | `sos-presentes-cosmeticos` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Mestre dos Serviços | `marido-de-aluguel` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| D.Y.Z Promo | `dyzpromo` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Empório LeleCute | `emporio-lelecute` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| RM Fretes | `rm-fretes` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| RJ Serviços de Drywall | `rj-servicos-drywall` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Paraíso do Hot Dog | `paraiso-do-hot-dog` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Renata Beauty Studio | `renata-beauty` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| R_Beauty Studio & Spa | `r_beauty` | main · #539 | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Clínica Integrada de Saúde | `clinica-integrada` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Almeida Torres Advocacia | `almeida-torres` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Casa Nativa Bistrô | `casa-nativa` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Chyrley Doces & Festas | `confeitaria-chyrley` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| MP Festas e Eventos | `mp-festas-eventos` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Studio de Cílios | `studio-de-cilios` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Refrigeração Maresia | `refrigeracao-maresia` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| A&G Electrical Services | `ag-electrical-services` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Vila da Capivara | `vila-da-capivara` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| LK Alvenaria | `lk-alvenaria` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Lucas Arruma Máquina de Lavar | `lucas-arruma-maquina-lavar` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Paulo Mestre de Obras | `paulo-mestre-de-obras` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| Ecommerce On | `ecommerce-on` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| No Brilho Higienização | `no-brilho-higienizacao` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Salão da Marcia | `salao-da-marcia` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Espaço CIH & LUH | `espaco-cih-luh` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Diego Montador de Móveis | `diego-montador-moveis` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Águia Sul Sinalização | `aguia-sul-sinalizacao` | main · #204 | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Eletrovale Eletromecânica | `eletrovale-eletromecanica` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Eletro Soluções Eficazes | `eletro-solucoes-eficazes` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Eisenfer Tubos e Aços | `eisenfer-tubos-acos` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Mary Diarista | `mary-diarista` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Açaí Total | `acai-total-araucaria` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Santos Montador de Móveis | `santos-montador-de-moveis` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Marmitaria Dom Diego | `marmitaria-dom-diego` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| Beto Pastéis | `beto-pasteis` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Woodhouse Hambúrgueres | `woodhouse-hamburgueres` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| D’Lara Pizzaria, Esfiharia e Hamburgueria | `dlara-pizzaria` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Toquinho de Gente Brechó Adulto e Infantil | `toquinho-de-gente-brecho` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| REuse House Brechó | `reuse-house-brecho` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Brechó São Francisco | `brecho-sao-francisco` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Angel Mix Brechó | `angel-mix-brecho` | main · #539 | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| Sabores da Baía | `guaratuba-sabores-da-baia` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Oficina Náutica Guaratuba | `guaratuba-oficina-nautica` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Ateliê Encanto da Baía | `guaratuba-atelie-presentes` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Reparos do Litoral | `guaratuba-reparos-residenciais` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Delícias Caseiras Mirassol | `mirassol-delicias-caseiras` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Conserta Mirassol | `mirassol-conserta-celular` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Marmitas do Barreiro | `bh-barreiro-marmitas` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Elétrica Bairro Brasil | `uberlandia-eletrica-residencial` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Lolipa Arte em Festas Decor | `lolipa-arte-em-festas` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Confeitaria Sabor da Realeza | `confeitaria-sabor-da-realeza` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Premium Envelopamentos | `premium-envelopamentos` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| MIRO TECH | `miro-tech` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Galileu Locação de Brinquedos | `galileu-locacao-brinquedos` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| L&J Cleaning | `lj-cleaning` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Manu Pastéis | `manu-pasteis` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Liz Moraes Nail Designer | `liz-moraes-nail-designer` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Assistência Técnica Microondas Santos | `assistencia-microondas-santos` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Artesanatos Darléia Oliveira | `artesanatos-darleia-oliveira` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Thays Camilla | `thays-camilla` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Fernanda & Amaral — Instalação de Drywall | `fernanda-amaral-drywall` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Denise Gomes · Psicóloga | `denise-gomes-psicologa` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Ton & Cor · Pintura e Pequenas Reformas | `ton-e-cor` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Raphael Construções | `raphael-construcoes` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| JC Revestimentos | `jc-revestimentos` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| HBK Iluminação LED Atacadão | `hbk-iluminacao-led` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Heloá Gás | `heloa-gas` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| S&S Construções | `sscons` | main · issue #60 | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Mimo Salgados e Doces | `mimo-salgados-doces` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| POPYS Conservação e Limpeza | `popys-conservacao-limpeza` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Bruna Diarista | `bruna-diarista` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| BTB Construção | `btb-construcao` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Easy Clean Higienização a Seco | `easy-clean` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| JS Elétrica e Manutenção | `js-eletrica-manutencao` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| PapeLemi Papelaria Personalizada | `papelemi-personalizados` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Maximos Cabeleireiros | `maximos-cabeleireiros` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Embalar Embalagens | `embalar-embalagens` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| Simone Lacerda Vaz · Nutricionista | `simone-lacerda-vaz` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Kitutes na Mesa · Porções com Carinho | `kitutes-na-mesa` | main · #212 / #216 | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Enoel Portas | `enoel-portas` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Mania de Limpeza Higienização | `mania-de-limpeza` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| Dona Lucy Salgados | `dona-lucy-salgados` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Centro Mega | `centro-mega` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| Pastelaria e Lanchonete Route 66 | `pastelaria-route-66` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Your Brutus Burguer | `your-brutus-burguer` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| Auto Socorro Dentinho | `auto-socorro-dentinho` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| Pinturas Nunes | `pinturas-nunes` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| EN — Estrutura Nacional | `estrutura-nacional` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Moreira Auto Mecânica | `moreira-auto-mecanica` | main · manifesto ready | published · 200 / sitemap | Reconciliar manifesto ready vs página existente; sem reconstrução |
| Careca's Infotec | `carecas-infotec` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| JKL Decor | `jkl-decor` | main · — | published · 200 / sitemap | Performance medida <90 em evidência; não autoriza redesign; release SHA pendente |
| ADHONEP Curitiba | `adhonep-curitiba` | main · #93 | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Catharine Lima Studio | `catharine-lima-studio` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Cris Presentes · Colônia Rio Grande | `cris-presentes-colonia-rio-grande` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Autoescola APTOS | `autoescola-aptos` | main · #214 | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Arildo Madeiras | `arildo-madeiras` | main · — | published · 200 / sitemap | SHA servido não comprovado; manter identidade e deltas históricos |
| Dona Garimpeira | `dona-garimpeira-brecho` | main · branch histórica 227644fa | draft · 200 · fora sitemap | Logo + 2 fotos reais e decisão de reativação; card indevido não corrigido |
| Agropet Filt | `agropet-filt` | main · #503 · issue #521 | published · 200 / sitemap | Funil/LEAD_ONLY/Jotform e manutenção #521; sem duplicar cliente |
| Cantinho da Tia Mari | `cantinho-da-tia-mari` | main · issue #521 | published · 200 / sitemap | Funil/LEAD_ONLY/Jotform e manutenção #521; sem duplicar cliente |
| São Francisco Pet Center | `sao-francisco-pet-center` | main · `portfolio.sao-francisco-pet-center.tsx`; branches 6ccf3271 / 4ab83970 / 954b5e8f / 288456ac | 200 / sitemap · fora catálogo/registry/seed | Incluir elegibilidade canônica após reconciliação, sem refazer site |

Arquivos responsáveis por cada site: `src/config/portfolio-clients.json` fornece `routeFile`, `componentFile` e `assetsDir` para os 98 ativos; preservados no Git. O catálogo e este inventário **não** substituem registro de identidade, imagens ou contratos. Branches sem PR ou de clientes já públicos precisam comparação de delta, nunca exclusão automática por nome/idade.

### 4.2 Sete novos projetos + uma reativação

| Nome | Slug / rota | Branch / PR / HEAD atual | Situação e bloqueio |
|---|---|---|---|
| Panificadora Doce Coração — Santo Antônio | `panificadora-doce-coracao-santo-antonio` | #530 · `feat/portfolio-doce-coracao-santo-antonio-20261119` · `6cf27155c709bff5c130e65e2284a335e378373b` | 404; Draft; 11 checks success/4 failure, QA individual já aprovada, 3 shards + visual compartilhado falham. Preview READY antigo 9b139413 não é HEAD atual |
| BPL Locações de Brinquedos | `bpl-locacoes-de-brinquedos` | #543 · `feat/portfolio-bpl-locacoes-20261123` · `2d78b56d4f27215e1b78f4381c9a0420f74c7860` | 404; Draft; 9 success/5 failure/1 skipped; QA própria aproveitável, visual + 4 shards globais reprovados; sem Production |
| Salgados da Fran | `salgados-da-fran` | #542 · `feat/portfolio-salgados-da-fran-20261123` · `f09bdfd319703266255fa1afdba30ee998411b22` | 404; Draft; HEAD preservado, evidência R1 de build/tipos/hydration + shards falhando; capturas aprovadas não autorizam publicação |
| Espaço Marli Nails — Guaratuba | `espaco-marli-nails-guaratuba` | #536 · `feat/portfolio-espaco-marli-guaratuba-r1` · `923a11d843b29d1972d595bdc6b520d236408e77` | 404; Draft; tipos/shards reprovados R1; preview canceled não Production; canal oficial a confirmar sem inventar |
| Toop Assados | `toop-assados` | #511 · `feat/portfolio-toop-assados-proposta-20261107` · `fea828bb545b787c412cc1ab985e5192850ed271` | 404; Draft; preservar proposta LEAD_ONLY; build/tipos/hydration/shards falhando R1; fatos operacionais/estoque não comprovados |
| Letícia Reiche | `leticia-reiche` | #512 · `feat/portfolio-leticia-reiche-r1` · `53d59f604a5dddb0e5ae36e4b5f379ccb4cf62a9` | 404; Draft; preview READY no HEAD segundo R1, não production; contracts/readiness/mídia/canal e gates globais pendentes |
| Relopar | `relopar` | Implementação `feat/relopar-portfolio-20261106` · `14288e4ffd7913f37b521403e0a993eee1840369`; pesquisa #497 · `31e00c105e2c0742995ad53c788df0740891fb3c` | 404; implementação 14 exclusivos/103 atrás, 13 arquivos no delta; PR #497 só pesquisa, não site. Recuperar original e reconciliar sem recriar |
| Dona Garimpeira | `dona-garimpeira-brecho` | Catálogo main draft; `feat/portfolio-dona-garimpeira-preparacao-20261102` · `227644fad029d2bd4015211a0349ac19c62fa16d` | 200 página antiga, fora sitemap/registry ativo, card hoje visível por bug de elegibilidade. Galeria/novas fotos puladas por proprietário; logo + 2 fotos reais para reativar. Funil já aplicado, não reexecutar |

As sete novas rotas não existem no catálogo/main; não há “implementação somente no Lovable” delas: estão em branches GitHub conferidas. Doce/BPL/Fran/Marli/Toop/Letícia têm PRs de implementação; Relopar é exceção com código original numa branch e PR separado de pesquisa. Não confundir demos CRM/B2B #544, scaffolds delivery BLOCKED ou batch tooling com clientes adicionais. Autoescola APTOS já é cliente publicado; checklist antigo de criação não justifica novo site.

## 5. Diagnóstico do catálogo — sem modificar

**Causa de ordenação COMPROVADA em source, não apenas cache.** `src/routes/portfolio.index.tsx`:

- Linhas 279–310: mapeia **todos** os registros do JSON; `live` é derivado do status/lifecycle, mas não exclui draft do conjunto de cards. Linhas 408–429 concatenam Managed sem dedup pelo slug/clientKey.
- Linhas 483–507: “Mais recentes” usa **proximidade pela cidade estimada do visitante primeiro**; depois **índice decrescente do array**. Não lê data real. Comentário append-only é hipótese de código, não registro comprovado de inclusão/publicação.
- Linhas 493–496: busca ativa e sort diferente de A–Z devolvem relevância; não aplicam o modo “recentes”. `src/lib/portfolio-search.ts`: sinônimos, radical, campos de discovery/serviços/problemas/localidade, relevância e desempate A–Z. Não varre texto renderizado arbitrário de toda landing.
- Só há **Mais recentes e Nome A–Z** como opções da UI; a validação aceita qualquer string. **Mais antigos e Aleatório ausentes**; `ProjetosNoAr.tsx` faz shuffle no bloco da Home, não no catálogo.
- JSON sem datas; Managed query não impõe order e o mapping elimina datas. Manifestos possuem `lastUpdatedAt`/etapas, que **não** são data histórica de publicação.
- Filtros segmento + tag/ramo + tipo + região são combináveis; região usa igualdade de label de `location`, não modelo de cidade/bairro. URL sincroniza segmento/ramo/q/sort/type, **não região**. Falta validação enum de sort/type; query desconhecida cai no comportamento recent.
- SSR rende conteúdo e loader tenta Managed (falha retorna vazio). VisitanteCity vem após hidratação e pode reordenar a lista por geo. Cache de ordenação não encontrado; stale Managed/error vazio e troca pós-hidratação são caminhos possíveis, mas não prova de cache desatualizado.
- Inicialmente 6 itens, efeito dos filtros amplia a 12 e observer adiciona 6 com rootMargin 320px. **Carregamento progressivo**, não paginação server-side. Quando filtro muda, reset da quantidade existe; sort sozinho não altera contador. Hero usa `portfolioCatalog.length`, resultados usam array filtrado; ambos exibem 99 hoje, mesmo sem a mesma elegibilidade do sitemap.
- Inclusão de static é **manual no JSON/registry**. Managed published pode entrar por loader, mas falta reconciliação de duplicação/data/contagem. São Francisco fora do catálogo não entra automaticamente por ter rota/sitemap.

### Medidas reais dos controles (inspeção passiva)

Preview e domínio em **1395×1095**: busca **204px**, segmento **215px**, tipo **176px**, região **547px**, sort **147px**. Área útil da busca ≈142px; placeholder medido ≈349px. **Truncamento e largura desproporcional COMPROVADOS**: o select de regiões cresce pela opção longa, usando espaço do flex restante. Sem overflow da página não significa busca legível.

Mobile **390×844**: busca 336px, área útil ≈286px para texto ≈306px; placeholder ainda cortado. Filtros em 2×2 de 164px, altura 36px (<44px). CTA flutuante encobre parte dos filtros na captura. Não alterados widths, CSS global, breakpoint, texto ou CTA.

### Proposta mínima para rodada própria Codex

1. Centralizar elegibilidade entre cards/contagem/SEO/sitemap: published + origem comprovada; tratar Dona draft e São Francisco por reconciliação explícita. Não publicar Dona automaticamente nem inventar prova.
2. Adicionar nullable metadata de inclusão/publicação **somente a partir de commit/registro verificável**, com proveniência. Commit do catálogo comprova inclusão de um delta, não necessariamente primeira publicação. Item sem data deve ter fallback explícito separado, nunca data fabricada.
3. Comparadores puros: newest desc / oldest asc por data comprovada + slug tie-break; geo/relevância não podem sobrepor silenciosamente o sort. Definir relevância separadamente com busca; testes para filtros combinados/dedup/contagem.
4. Aleatório seeded/stável na navegação, sem mutar fonte e com mesmo seed/order SSR/client; reseed só por ação explícita. Nenhum Math.random em SSR/hydration de render.
5. Layout local dos controles com grid tracks/intrinsic minmax e select constrained/min-w-0, dando prioridade real à busca. 1395/768/390, label/foco/44px e nenhum CTA occludente; não alterar Header/Footer/styles congelados.

**Esta rodada não implementou nenhum desses itens nem inventou datas.**

## 6. PRs, Vercel e agentes

### Prioritárias e evidências atuais

- **#548**, Draft `a3d44a7930817eebbeb2659119758f021d438117`: 7 success/2 skipped; compatibilidade Vercel e gate compartilhado já aprovados. 4 exclusivos/7 atrás da main e quatro arquivos: build-validate, package.json, adaptador MCP, teste runtime. Não mesclar #547 (MCP 404) como alternativa rápida. Erro OAuth confirmado nesta rodada ao criar ref; não é falta de teste do layout.
- **#530**: 11 success/4 failure, incluindo 3 shards globais e visual; **#543**: 9 success/5 failure/1 skipped. Sem rerun; resultados das próprias candidatas e falhas herdadas precisam classificação, não redução de thresholds.
- **Main eecb2829**, snapshot de 14:56 UTC: 7 success (build, tipos, hydration, JSON-LD, detecções e seo-diff), 1 failure RLS, 1 skipped novos portfolios e 5 in_progress (4 shards + visual). In_progress não vira PASS neste documento; consultar o run existente ao continuar, não repetir.
- RLS atual **run 45418525760 / job 138531303262**: preflight “Verificar credencial obrigatória do gate” failure; instalação/testes skipped. Credencial de serviço indisponível no Cloud; método seguro de homologação separado, preservando autorização/fixtures/isolamento, conforme `docs/RLS_CI_SECURITY_GATE.md`.
- Agente humano indicado já tinha admin/super_admin no preview, confirmado na rodada anterior; **não criar convite/role duplicado**. /agent-login, /painel e /painel-crm 200 público não provam sessão administrativa em Production. Nenhuma nova sessão/SQL/permissão nesta inspeção.
- Descoberta OAuth pública 200 no domínio, mas integração MCP/Codex plenamente autorizada e implantação do adaptador #548 ainda **não** comprovadas. Leitura GitHub/Vercel funciona; escritura por OAuth App restrita.

### Todas as 47 PRs abertas — preservar e reconciliar delta

Tabela é inventário, não autorização de merge. **18 Draft**; HEADs conferidos na listagem atual. PRs de SEO/referências antigas podem sobrepor main, e os deltas devem ser comparados; não refazer todo um projeto nem ativar skills externas apenas por haver PR.

| PR | Título | Branch / HEAD | Situação |
|---|---|---|---|
| #548 | fix(vercel): preserve MCP OAuth with audited Node runtime adapter | `fix/vercel-mcp-runtime-isolation-20261124` · `a3d44a7930817eebbeb2659119758f021d438117` | Draft · não integrada |
| #547 | fix(vercel): remover rota MCP Cloudflare-only do bundle SSR Vercel | `fix/vercel-mcp-route-cloudflare-import-20261123` · `b8b258307362fd26a0990aab3dbac30044ffa267` | Draft · não integrada |
| #544 | feat(portfolio): protótipo visual CRM e qualificação B2B sem integrar sistemas | `feat/visual-crm-b2b-showcase-20261123` · `f1abd0e6087724e97c31492e2df412159a809c14` | Aberta · não integrada |
| #543 | feat(portfolio): BPL Locações de Brinquedos — demonstração autoral | `feat/portfolio-bpl-locacoes-20261123` · `2d78b56d4f27215e1b78f4381c9a0420f74c7860` | Draft · não integrada |
| #542 | feat(portfolio): Salgados da Fran — demonstração autoral São José dos Pinhais | `feat/portfolio-salgados-da-fran-20261123` · `f09bdfd319703266255fa1afdba30ee998411b22` | Draft · não integrada |
| #539 | perf(portfolio): título LCP visível em R_Beauty e Angel Mix | `fix/lighthouse-hero-lcp-rbeauty-angelmix-20261123` · `c8a8d25e9a625fe125db955da9349a386c136a6a` | Draft · não integrada |
| #537 | docs(skills): WebHub Motion v0.3 + GSAP, img2threejs e LottieFiles | `docs/webhub-motion-cross-projects-20261123` · `bba12c63f2c5d8a022d9a98b7abf9862ee316fc9` | Aberta · não integrada |
| #536 | feat(portfolio): Marli Guaratuba — consulta Jotform verificada (R3) | `feat/portfolio-espaco-marli-guaratuba-r1` · `923a11d843b29d1972d595bdc6b520d236408e77` | Draft · não integrada |
| #535 | fix(a11y): reduzir movimento do botão Voltar ao topo nos portfólios | `fix/portfolio-backtotop-reduced-motion-20261121` · `912c7af04a55f0824a962bb946155fd2b92e64e1` | Draft · não integrada |
| #530 | feat(portfolio): Panificadora Doce Coração · Santo Antônio + SEO individual | `feat/portfolio-doce-coracao-santo-antonio-20261119` · `6cf27155c709bff5c130e65e2284a335e378373b` | Draft · não integrada |
| #525 | feat(seo): reforçar associação de todos os portfólios com a 0WEB | `feat/portfolio-seo-0web-association-20261114` · `f26a2fef94a3554c8bfec9281573802229a119fc` | Aberta · não integrada |
| #512 | feat(portfolio): Letícia Reiche — preview funcional + candidata SEO pública (R5) | `feat/portfolio-leticia-reiche-r1` · `53d59f604a5dddb0e5ae36e4b5f379ccb4cf62a9` | Draft · não integrada |
| #511 | feat(portfolio): Toop Assados — site autoral e funil demonstrativo isolado [QA pendente] | `feat/portfolio-toop-assados-proposta-20261107` · `fea828bb545b787c412cc1ab985e5192850ed271` | Draft · não integrada |
| #503 | fix(agropet): repair preview QA scope, structural gates and hosted form CSP | `feat/agropet-filt-preview-20261104` · `952c12a2443c639116722ddbfb0c12998d22e835` | Draft · não integrada |
| #502 | feat(portfolio): verificação Google-only e associação de administrador por empresa | `feat/portfolio-booking-google-admin-guard-20261107` · `9c9f9a4869fe408fefdc37a873674c09618fdb91` | Draft · não integrada |
| #497 | draft: Relopar Curitiba — pesquisa factual e direção criativa | `research/relopar-curitiba-20261106` · `31e00c105e2c0742995ad53c788df0740891fb3c` | Draft · não integrada |
| #466 | perf: adiar montagem do logo no loader de navegação invisível | `perf/route-loader-lazy-logo-20261029` · `651ac99025752620a664d38aa90f7f856df092ee` | Draft · não integrada |
| #458 | SEO competitivo R4: impedir métricas e ranking falsos com GSC desatualizado | `fix/gsc-snapshot-freshness-competitive-r4-20261027` · `6f5d4aa4f02858c2bd642778a5d7902ba4751953` | Aberta · não integrada |
| #456 | SEO competitivo R2: guia de decisão e provas para criação de sites Curitiba | `feat/seo-curitiba-site-decisao-20261027` · `e76944227fa1779cb7dd4566a03c97337b3dc37e` | Aberta · não integrada |
| #446 | feat: ponte opcional de aulas OpenMAIC em HTML offline (sem ativação) | `feat/openmaic-learning-bridge-20261017` · `df1391473e92ff4d522c730c628a7d5b16f92b0f` | Draft · não integrada |
| #295 | AI: gateway OpenAI universal economy-first (rebased) | `feat/openai-shared-gateway-rebased-20260928` · `d232d5ac9bd76bfe16ab88fef1a3c08c5ef52722` | Aberta · não integrada |
| #285 | test(seo): exigir cada portfolio como site individual completo | `test/portfolio-individual-site-gate-20260928` · `206ca275fa2903945999c105351c8a978e928cd3` | Aberta · não integrada |
| #283 | feat(seo): tratar cada portfólio como site individual | `feat/portfolio-individual-site-seo-20260928` · `4e48ecd0b9b93a76f81802fbfbb8529920e23563` | Aberta · não integrada |
| #282 | feat(seo): tornar cada portfolio uma presença digital individual | `feat/portfolio-individual-seo-universal-20260928` · `97e579e39e031ae8e094e271009294526aa996c9` | Aberta · não integrada |
| #278 | fix(seo): consolidar entidade Organization no portfólio | `fix/portfolio-schema-org-consolidation-20260928` · `87726b292212ee777dc4f4260383dd69c26845b9` | Aberta · não integrada |
| #273 | feat(seo): segunda onda de conteúdo original em portfólios | `seo/portfolio-original-content-wave2-20260928` · `160c02812b7d05e780b8f4107060b8cd1cf0dff8` | Aberta · não integrada |
| #272 | feat(seo): aprofundar conteúdo original em portfólios reais | `seo/portfolio-original-content-wave-20260928` · `a4ead5a9bdf4b654806046b0ac242d15c2cb33d1` | Aberta · não integrada |
| #271 | fix(seo): consolidar indexação universal dos serviços | `seo/services-universal-indexability-rebased2-20260928` · `798f742249293a1d086748c8206052b7d182a0e3` | Aberta · não integrada |
| #270 | feat(seo): publicar Home2 e Home3 como LPs autênticas | `feat/home2-home3-indexable-lps-rebased-20260928` · `eb366389740f9fda2d1825d2356878ebfe5f0086` | Aberta · não integrada |
| #269 | feat(seo): aprofundar hub de soluções web | `seo/solucoes-web-gsc-20260928` · `163eaac1d50b7e427cbe8898b1a4c570e0c852e6` | Aberta · não integrada |
| #267 | fix(seo): consolidar governança editorial e indexação factual | `seo/editorial-quality-governance-rebased-20260928` · `b401feca52fc60ebe311af98bb08de5553e48cf5` | Aberta · não integrada |
| #265 | fix(seo): consolidar indexação universal do portfólio | `seo/portfolio-universal-indexability-rebased-20260928` · `c38eeca2363517d7db57431bb0a896c165e331d6` | Aberta · não integrada |
| #263 | fix(seo): alinhar áreas de atendimento à evidência real | `fix/areas-hub-evidence-rebased-20260928` · `5041d339496d7fa2a04bd032c44af75c35613fe0` | Aberta · não integrada |
| #262 | fix(seo): indexar hubs geográficos só com evidência | `fix/geo-hubs-evidence-rebased-20260928` · `2f71c4e2e1072d5a68c14e9418d5d9e8b262b32b` | Aberta · não integrada |
| #261 | fix(seo): indexar capitais institucionais só com evidência | `fix/institutional-capital-evidence-rebased-20260928` · `3ed7a28b87b6b965ad60a4f4a469b0bfba7c0310` | Aberta · não integrada |
| #260 | feat(seo): enriquecer páginas de sites por segmento | `seo/sites-verticals-authentic-content-20260928` · `e4837dc3dd8ae52508692eb406603b666684a0cd` | Aberta · não integrada |
| #216 | feat: originality wave 2I Kitutes menu | `feat/portfolio-originality-wave2i-kitutes-menu-20260926` · `5278b863755965bdab8bfee8fb6a49bd79814fa7` | Aberta · não integrada |
| #214 | feat: portfolio cover wave 3A for Autoescola APTOS | `feat/portfolio-cover-wave3a-autoescola-aptos-20260926` · `899e2fa75175459228606fa4b9ee9c9d2e63b6b0` | Aberta · não integrada |
| #212 | feat: originality wave 2I for Kitutes na Mesa | `feat/portfolio-originality-wave2i-kitutes-20260926` · `33ae5ce47214efc227cfd11b0658546413975666` | Aberta · não integrada |
| #204 | feat: originality wave 2B for Aguia Sul | `feat/portfolio-originality-wave2-aguia-sul-20260926` · `1958a429e238160d42fd1bedcdad47aa682cead4` | Aberta · não integrada |
| #194 | fix: blindar divulgação canônica e testar clipboard dos portfolios | `fix/portfolio-share-runtime-e2e-20260925` · `e0403160624f51b5f4a9e37aba917fbe4eb4362c` | Aberta · não integrada |
| #193 | fix: blindar Copiar divulgação em todos os portfolios | `fix/portfolio-share-canonical-e2e-20260925` · `0090b6d293906590c9fa2af434375dbccb76aa97` | Aberta · não integrada |
| #96 | Home3: matriz estrutural, visual e motion das referências | `docs/home3-reference-matrix-v2` · `c881ec3768151b1ce12b9c99d970efc27a52d88c` | Draft · não integrada |
| #93 | Portfolio P0: ADHONEP premium + ownership por projeto + fábrica autônoma | `feat/portfolio-p0-autonomy-adhonep` · `c9024764c3c7645cfef117f8132b3bcbfabf7c7c` | Draft · não integrada |
| #90 | Fix WhatsApp destination verification integrity | `fix/portfolio-whatsapp-integrity` · `868b96d36869c8bb95053775272f4d9622ce5efe` | Aberta · não integrada |
| #84 | fix(portfolio): estabilizar vínculos de destino por clientKey | `fix/portfolio-destination-integrity` · `404faae407fd6e07f9052c3b5bd558a1230cd8df` | Draft · não integrada |
| #81 | Frente A Turno 3: restaurar TTL e janela de reuso do redirect | `fix/frente-a-turno-3` · `995aa0548ba555488e0d6e881f40759ba0bce572` | Aberta · não integrada |

### Configuração Vercel / domínio

Conexão existente lê `msolus/zeroweb-2026`, framework `tanstack-start-lovable`, Node **24.x**, produção branch main; overrides install/build/output/root são null (defaults do framework). `vercel.json` tem **git.deploymentEnabled=false**; GitHub merge/sync **não publica** automaticamente. Preview disable policy permanece referência canônica; esta consulta não confirmou seu efeito global.

Vercel lista 0web.com.br e www verificados; apex tem redirect cadastrado para www (308). Resposta HTTP atual do host vem com server Cloudflare; cadastro na Vercel **não prova DNS/origem atual**, e não houve alteração DNS. Último READY e último ERROR são os da seção 1. Preservar deployment/rollback atuais; nenhum READY do novo SHA existe nessa lista.

**Procedimento futuro de uma release autorizada:** reconciliação da candidata sobre main atual → PR/revisão → gates aplicáveis do SHA candidato sem rerun redundante → confirmar runtime/configuração segura → integrar por PR → selecionar SHA real da main na integração oficial existente → um deployment aprovado → comprovar READY/ID/SHA e o domínio separadamente → validar Home, loja/produto/checkout, portfolio e funções autenticadas/recebimento sem dados reais fabricados. Não inventar auto-deploy que foi explicitamente desligado. Não iniciar esse procedimento neste encerramento.

## 7. Backlog único de continuidade — 34 frentes, sem execução

Estados distintos: SOLICITADO, INCOMPLETO, IMPLEMENTADO/SINCRONIZADO, PR, MAIN, HOMOLOGADO, PUBLICADO, BLOQUEADO. Evidência de preview não é Production; “aberta” não implica que o delta ainda seja necessário.

| ID | Prioridade / frente | Estado recuperado | Evidência / próximo passo |
|---|---|---|---|
| 01 | P0 · preservação/Git sync/documento | Código MAIN/SINCRONIZADO; branch documental BLOQUEADA | Todos blobs iguais; ref 403. Finalizar documento, confirmar sync, continuar por conta oficial |
| 02 | P0 · compatibilidade Vercel/MCP/agentes IA | PR #548 HOMOLOGADA no seu HEAD, divergente / BLOQUEADA integração | Reconciliar 4/7; preservar OAuth/transport; não #547 |
| 03 | P0 · RLS CI independente | BLOQUEADO | run 45418525760 preflight failure; método autorizado sem service key impossível |
| 04 | P0 · release/origem/rollback | BLOQUEADO / SHA servido PENDENTE | #469; READY 58032d30 vs main eecb; provar domínio, sem DNS agora |
| 05 | P0 · build/instalação baseline | COMPROVADO CI, governança PENDENTE | issue #6; Bun 1.4.0 vs latest workflow; aproveitar logs, não reinstalar nesta inspeção |
| 06 | P0 · gates obrigatórios / Managed publication | SOLICITADO, delta pendente | #417, #171; não chamar COMPLETE de runtime prontidão; não enfraquecer gates |
| 07 | P1 · Doce Coração | PR #530, 404 / BLOQUEADO | QA própria pronta; global 4 failures; preservar original |
| 08 | P1 · BPL | PR #543, 404 / BLOQUEADO | 5 failures; homologação/contratos/identidade preservados |
| 09 | P1 · Fran | PR #542, 404 / INCOMPLETO | Build/tipos/hydration/shards do R1; source/capturas preservados |
| 10 | P1 · Marli | PR #536, 404 / INCOMPLETO | Build parcial, tipos/shards/canal/readiness pendentes |
| 11 | P1 · Toop | PR #511, 404 / INCOMPLETO | Proposta LEAD_ONLY; fatos operacionais e CI |
| 12 | P1 · Letícia | PR #512, 404 / INCOMPLETO | Preview não release; v4/SEO/canal/mídia/gates |
| 13 | P1 · Relopar | BRANCH implementação, 404 / INCOMPLETO | 14 exclusivos/103 atrás; #497 só pesquisa; não recriar |
| 14 | P1 · Dona Garimpeira reativação | SOLICITADO depois / GALERIA PULADA | Funil aplicado antes; material real para reativar; draft mostrado indevidamente |
| 15 | P1 · São Francisco elegibilidade | PUBLICADO entidade / fora catálogo | Rota/sitemap 200; reconciliação mínima sem novo site |
| 16 | P1 · catálogo datas/sort/filtros | BUG COMPROVADO, NÃO CORRIGIDO | Array+geo/relevância, ausência oldest/random, busca truncada, contagem draft |
| 17 | P1 · Moreira lifecycle e alias JKL | PUBLICADO entidades / DOCUMENTAÇÃO DIVERGENTE | Manifesto ready, jkl-marcenaria alias; não duplicar clientes |
| 18 | P1 · performances já medidas | PREPARADO/MAIN parcial, release não comprovada | Matriz 12 slugs/25 notas e #539; 18 reprovações preservadas; não repetir mesmas medições agora |
| 19 | P1 · deltas visuais legados/clientes | PRs antigas / equivalência PENDENTE | #100, #94, #473, #93/#204/#212/#216/#214; APTOS/Kitutes/Águia/ADHONEP já públicos, não “novos” |
| 20 | P2 · CRM atômico / history trigger | APLICADO Cloud + MAIN/SINCRONIZADO, HOMOLOGADO preview | eecb2829 + relatório; último snapshot 1239 pass; não reaplicar ou backfill; release ainda pendente |
| 21 | P2 · planilha CRM / nota e SQL legado | IMPLEMENTADO/MAIN, HOMOLOGADO foco | Preparação adicional: falhas de importação explícitas, terminal preservado, fixture segura; não dedup/ledger |
| 22 | P2 · recebimentos Lighthouse | MAIN/SINCRONIZADO, HOMOLOGADO mecanismo local | HMAC/idempotência/limite; 25 notas, 0 Actions no snapshot anterior; /painel-lighthouse Production 404; run real futuro |
| 23 | P2 · suporte/agentes/painel | IMPLEMENTADO e acesso preview comprovado; convite/recuperação PENDENTE | /agent-login agora 200; não inferir envio ou ativar pessoas sem pedido; support_agents vazio no último snapshot |
| 24 | P2 · Agropet/Cantinho/Jotform | CLIENTES PÚBLICOS, homologação/espelho BLOQUEADOS | #503/#521; endpoint jotform-mirror ausente na evidência; reconciliar funil nativo vs espelho, não recriar operacional |
| 25 | P2 · destinos/leads/ownership/admin vazio | PARCIALMENTE IMPLEMENTADO, SOLICITAÇÕES restantes | Roadmap seis rodadas, #94/#502/#81/#84/#90; provas clientKey; sem destino alheio/cofre obrigatório |
| 26 | P2 · captação/comercial/loja | IMPLEMENTADO vários fluxos; HOMOLOGAÇÃO real PENDENTE | Três frentes, fluxo serviço→produto→carrinho→checkout; não substituir transação por CTA; dados/comissões não inventados |
| 27 | P2 · parcerias/resposta ADHONEP/tráfego | IMPLEMENTADO histórico, produção/escopo residual PENDENTE | Chat #1486–1487, app.parcerias/trafego/resultados; respostas manuais factual/consentimento, sem comissão fabricada |
| 28 | P3 · SEO/sitemap/canonical/autoridade | PRs/ISSUES, implementação/observação parcial | #9/#11/#453/#454, #458/#456/#525 e ondas antigas; GSC OBSERVING não é ranking comprovado |
| 29 | P3 · Home3 independente e referências | DOC/PR #96/#270, experiência material PENDENTE | #95; Home2 congelada; laboratório não virar redesign automático da Home |
| 30 | P3 · mobile/a11y/motion/share | PRs #535/#193/#194 e findings anteriores | Movimento reduzido, foco/filtros/overlay; aplicar só delta real, não ondas em clientes aprovados |
| 31 | P3 · mídia real/capas/editor/autonomia | BACKLOG editorial/funcional, não blocker genérico | Relatórios de capas, fotos faltantes e rodadas editor; sem imagens novas ou prova inventada |
| 32 | P3 · memória de segurança/truth/SEO métricas | PENDÊNCIA de governança, não nova auditoria | #8/#171/#417 e scans existentes; não re-reportar ignored_by_user, nem assumir deep scan limpo |
| 33 | P3 · descoberta/ferramentas/ensino/referências | DOC/PRs opcionais, NÃO ATIVADOS | #510/#446/#537/#295; marketing em Project Files e mem://marketing/research-reference não automaticamente no Git; exportar só material autorizado necessário |
| 34 | P3 · runtime/peso SSR/navegação/latência | BACKLOG técnico aprovado, deltas PR | #10/#466 e relatórios de perf; baseline/issue antiga não autoriza refatoração ampla |

**Fora de nova execução:** deduplicação/ledger só achados conforme escolha do usuário; rodadas 3–4 não iniciadas; Mestre dos Serviços sem novo destinatário presumido; scaffolds delivery BLOCKED não são checkout/order; galeria/imagens e espelhos pulados não ganham ativação automática; checklist de APTOS no roadmap é histórico a reconciliar, não prova de site inexistente.

### 17 issues abertas sem PR (recuperação completa)

- **#521** — P0 | Agropet + Cantinho: funil nativo 0WEB, lead salvo e LEAD_ONLY sem Jotform principal. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#510** — Pesquisa 0WEB R1: piloto Crawlee econômico, isolado e com evidência (após PR #507). Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#473** — P1 QA global: 29 divergências visuais e Lighthouse <90 observados na PR #472. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#469** — Infra 0WEB: comprovar publicação em 0web.com.br e preparar independência Lovable sem alterar DNS. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#454** — SEO competitivo 0WEB: superar concorrentes em Curitiba/RMC com evidências e conversão. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#453** — SEO: reconciliar sitemap com noindex e canonical (355 URLs auditadas). Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#417** — governança: tornar obrigatórios os gates no main e no publish Managed. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#171** — Hardening: tornar truth/freshness executável para novos portfolios. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#100** — Remediar 92 portfolios para ZERO_GENERIC_TOLERANCE. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#95** — Home3: matriz de referências estruturais e motion v2. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#94** — P0 — Portfolio: paridade, destinos, ownership e originalidade sem regressão. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#60** — Migrar S&S Construções para /portfolio/sscons preservando experiência e ampliando recursos. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#11** — P1 — Construir plano de autoridade nacional baseado em demanda e prova real. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#10** — P1 — Reduzir latência, peso SSR e dívida técnica do runtime. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#9** — P1 — Corrigir governança de sitemap, indexação e rotas desconhecidas. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#8** — P0 — Remover prova social e métricas sem evidência auditável. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.
- **#6** — P0 — Restaurar instalação reprodutível e baseline confiável de CI. Estado aberto; correlacionar com frentes acima e código já presente, não presumir que nada foi feito.

## 8. Evidências e workflows a reutilizar, não repetir

- `docs/reports/GROWTH_ENGINE_360_R1_2026-11-24.md` + CSVs de PRs/branches: recuperação nominal, contratos e evidências da fila. Snapshot antigo complementado aqui por heads/live count.
- `docs/reports/GROWTH_ENGINE_R2_CHECKPOINT_2026-11-24.md`: trigger autorizado, isolamento sintético, dez opt-ins críticos, 80 provas visuais/10 funis, R3 não iniciada.
- `docs/reports/LIGHTHOUSE_CRM_AUTOMATION_2026-11-24.md`: **CRM já aplicado**, Lighthouse HMAC, UI/25 notas, 1239 testes pass, 7 SQL/mutações, fixtures limpas zero, brand/boundaries/meta e build harness. **Não repetir** essas operações contra registros reais.
- `docs/reports/LIGHTHOUSE_PUBLIC_MATRIX_2026-11-24.csv`: 12 entidades e 25 medições consolidadas, incluindo Dlara 92/100/100 às 14:36 UTC; reprovações preservadas. CI pode medir local/staging, não inventar SHA público.
- `docs/reports/PUBLICATION_LIGHTHOUSE_HOMOLOGATION_2026-11-24.md`, `PUBLICATION_ADMIN_RECONNECTION_2026-11-24.md`, `VERCEL_MCP_RECOVERY_HANDOFF_2026-11-24.md`: estado antigo datado, compatibilidade e bloqueios superados/atuais; não usar 404 de agent-login ou candidate CRM inactive como verdade de hoje.
- `docs/RLS_CI_SECURITY_GATE.md`, `docs/PORTFOLIO_WHATSAPP_POLICY.md`, `docs/PORTFOLIO_PROJECT_LIFECYCLE.md` e contratos apontados por AGENTS.md: precedência canônica. Documento antigo pode falar em cofre ou segurança invoker do trigger antes do ajuste; usar regra atual/data da evidência, não reverter código.
- QA anterior de Centro Mega/loja/Home/checkout permanece disponível; esta rodada fez só leitura de URL/catalog controls. Nenhum scan/build/test/lighthouse enviado pelo agente.

### 21 workflows existentes

- `agropet-backend-credential-preflight.yml` — Agropet · backend credentials preflight.
- `agropet-indexnow-submit.yml` — Agropet Filt · IndexNow publication.
- `agropet-visual-qa.yml` — Agropet Filt · visual QA.
- `build-validate.yml` — build-validate.
- `cantinho-sync-derived.yml` — Cantinho Tia Mari · sync derived assets (one-time).
- `cantinho-tia-mari-visual-qa.yml` — Cantinho Tia Mari · visual QA.
- `delivery-catalog-resolver.yml` — Delivery Catalog Resolver.
- `delivery-pricing-kernel.yml` — Delivery Pricing Kernel.
- `delivery-readiness-spec.yml` — Delivery Readiness Spec Gate.
- `e2e-hydration.yml` — E2E · Hidratação.
- `gsc-daily.yml` — gsc-daily.
- `lighthouse.yml` — Lighthouse CI.
- `new-portfolio-publication.yml` — New Portfolio Publication Gate.
- `portfolio-batch-preflight.yml` — Portfolio · Pré-voo de lote (rápido).
- `portfolio-gates.yml` — portfolio-gates.
- `portfolio-seo-runtime.yml` — Portfolio SEO runtime audit.
- `portfolio-sitemap-sync.yml` — Portfolio sitemap · healthcheck.
- `reference-observation.yml` — Homologar observação passiva 0WEB.
- `rls-security.yml` — RLS Security Gate.
- `seo-diff.yml` — SEO Diff.
- `seo-jsonld.yml` — SEO / JSON-LD.

Build/validate, hidratação, portfolio gates, novos projetos, Lighthouse e JSON-LD são gates; delivery kernels/specs não equivalem a restaurante transacional publicado; GSC/sitemap/reference são observação/derivadas, não autorização de deploy. `cantinho-sync-derived` é one-time, não rerodar por conveniência. Sem secrets inventados, thresholds/baselines menores ou exclusão de páginas para obter verde.

## 9. Ordem recomendada: iniciar uma rodada, não quatro

**Rodada 1 Codex — P0 autonomia/preservação:** confirmar refs/arquivo de handoff; criar branch própria pela identidade oficial autorizada; reconciliar **somente** delta #548 com main atual; determinar método de teste RLS e configuração externa segura sem solicitar a chave inacessível; fechar mapa ambiente/serviços/origem. Recuperar logs do run existente. Critério: nenhum delta perdido, instalação/runtime comprovados com evidência adequada ao SHA, bloqueios de permissão classificados sem bypass, PR isolada e nenhuma publicação automática.

**Rodada 2 (somente autorização posterior) — P1 portfolios/catalog:** corrigir elegibilidade/datas/sort/layout e reconciliar São Francisco/Moreira/JKL; finalizar Doce/BPL usando QA já feita, depois demais. Critério: nomes/rotas/provas/cliente próprio, gates reais e comparação de composição, nenhum índice/data inventada.

**Rodada 3 (posterior) — P2 admin/integrações:** homologar release do CRM/painel/recebimento em ambiente autorizado, convites/recuperação e lead flows; Agropet/Cantinho sem trocar o que já funciona. Critério: dados reais corretamente recebidos, testes descartáveis limpos, terminal/tenant preservado.

**Rodada 4 (posterior) — P3 melhoria:** SEO/GSC/perf/a11y/mídia/referências por finding ou pedido; preservar baseline/institucional e não executar ondas automáticas.

## 10. Prompt curto para iniciar no Codex

```markdown
Trabalhe no repositório oficial hrq16000/zeroweb-2026. Leia AGENTS.md,
docs/0WEB_EXECUTION_CONTRACT.md e docs/handoff/LOVABLE-TO-CODEX.md.
Execute somente Rodada 1 — P0 autonomia e preservação, sem publicar, SQL/DNS,
novos portfolios, force push ou reduzir gates. Base inspecionada:
main eecb2829f3309351d5b8eee008741b13e0d27472; PR #548
HEAD a3d44a7930817eebbeb2659119758f021d438117 (4 exclusivos/7 atrás).
Releia refs atuais antes de agir. Confirme handoff e nenhum arquivo perdido;
crie branch própria autorizada; reconcilie só o delta original #548; reutilize
os checks/logs aprovados e documente método seguro para o RLS bloqueado no
run 45418525760, sem pedir service key indisponível do Lovable Cloud.
CRM atômico/migração 0009 já foram aplicados: não reexecutar/backfill.
Conclua com PR isolada, evidências do SHA candidato e bloqueios exatos;
nenhum deploy/merge. Preserve READY 58032d30 / dpl_FcL5kPsArmdCToF47oCzeRu61GGA.
```

## Registro de competências e limites desta inspeção

Skill stack **docs + 0web-skill-router** e contratos canônicos; leitura de source/Git API/Vercel/UI passiva para evidências. Max Mode, art direction/redesign, nova mídia, discovery externo/instalação, scan, build, teste e implantação **NOT_APPLICABLE / expressamente proibidos** nesta rodada. Nenhum pacote/config/secreto novo. AGENTS.md e identidades congeladas intocados. Memória de preferência híbrida somente reforçou prioridade GitHub/Codex já declarada, sem registrar arquitetura técnica.

Resultado é **handoff**, não quitação das 34 frentes nem declaração de projeto independente de todos os serviços Lovable. Produção atual preservada integralmente. Arquivos/HEADs relativos às evidências valem para o snapshot datado; o commit deste documento deve ser identificado por `git log -1 -- docs/handoff/LOVABLE-TO-CODEX.md`, pois inserir seu próprio SHA no corpo não é uma referência possível sem segundo commit.
