# 0WEB — Git-first, releases econômicas e SEO verificável

Status: **política operacional obrigatória**, vigente para Codex, ChatGPT, agentes e fluxos de produção e evolução da 0WEB. Completa `docs/0WEB_EXECUTION_CONTRACT.md` e `docs/PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md`. Não substitui nenhum gate, termo comercial, regra de privacidade ou regra de funil.

## 1. Responsabilidade por fase

| Etapa | Ferramenta principal | Regra |
| --- | --- | --- |
| Pesquisa, planejamento e prototipação | Codex + GitHub, documentação e fixtures | Não instalar ferramentas ou abrir deployments só para investigar |
| Código e correções | Codex/Git em branch isolada | Commit pequeno, preservando `AGENTS.md`, isolamento por `clientKey` e dados factuais |
| Teste | CI do GitHub e testes locais | Rodar testes por escopo, depois gates exigidos para release; sem afrouxar limites |
| Revisão | PR e relatório de evidências | Sem merge cego de branch divergente ou substituição de correção mais nova |
| Release | `main` validada → Vercel (e origem oficial efetiva) | Uma versão **finalizada** por ciclo; sem publicação para cada experimento |
| Pós-release | Host oficial + logs + Google Search Console | Comprovar HTTP/canonical/robots/sitemap/CTA/funil e registrar progresso |

**Codex/GitHub é a via padrão para desenvolvimento.** Lovable é exceção para preview visual, sincronização e publicação do host oficial enquanto seu DNS continuar lá; evitar Max mode ou operações de alto custo sem autorização. Vercel não é ambiente de experimentação contínua.

Cada commit de feature não precisa gerar uma nova versão na Vercel. A aprovação da PR não basta quando há gate reprovado ou bloqueio de destino de lead.

## 2. Controle de quota Vercel

- **Estado persistido em 25/11/2026:** a equipe Vercel `msolus` tem **17 projetos ativos** e os 17 possuem evidência de `previewDeploymentsEnabled: false` no histórico de eventos da própria Vercel (`project-preview-environment-branch-tracking-updated`). São 17 IDs distintos, incluindo o evento mais antigo de 16/10 para `myhostvip-tanstack-ssr-preview`; os demais foram registrados entre 09/11 e 25/11. A resposta `get_project` do conector omite esse campo, portanto a confirmação é feita pelo payload do evento, não por ausência de deployments.
- **Não há default de equipe documentado para esta propriedade.** As Team Settings da Vercel são configurações de equipe que podem ser aplicadas a projetos selecionados; a propriedade `previewDeploymentsDisabled` está disponível na configuração de projeto. Não assumir herança automática para projetos futuros.
- **Provisionamento obrigatório de projeto novo:** usar a API/ação `create_project` com escopo explícito `msolus` e incluir `previewDeploymentsDisabled: true` no mesmo `requestBody` de criação; quando aplicável, informar também `gitRepository` nessa chamada. Assim o projeto nasce com a configuração, sem janela entre criar e corrigir. O `create_git_project` disponível não expõe esse campo e, por padrão, cria um preview; não o usar como caminho padrão de provisionamento econômico. Se alguém criar o projeto manualmente no dashboard, aplicar `update_project({previewDeploymentsDisabled:true})` imediatamente e confirmar o evento de auditoria.
- **Limitação de automação contínua:** não foi possível instalar um reconciliador agendado no GitHub com credenciais já disponíveis. O repositório não contém referências a `VERCEL_TOKEN`; a conexão GitHub disponível não permite inspecionar ou cadastrar Actions secrets; a leitura de webhooks da equipe retornou `403 forbidden` e não há ação de criação de webhook disponível nesta integração. A credencial da conexão Vercel não pode ser exportada para GitHub Actions. Não criar workflow que dependa de segredo não confirmado, nem gravar tokens no código/logs. Até existir um secret Vercel autorizado para Actions, a garantia para projetos criados via API é o uso obrigatório de `create_project` com a flag; projetos criados fora desse fluxo precisam da correção imediata acima.
- Preview temporário é **exceção controlada**, quando QA/cutover exigir URL externa. **Antes de reativar previews, confirmar pela API/histórico da Vercel que o projeto alvo já possui ao menos um deployment `Production` anterior (preferencialmente `READY`). Se não houver Production anterior, não usar a exceção nem tentar classificar o primeiro deployment como Preview:** o primeiro deployment deve seguir o fluxo explícito de Production, a partir de SHA aprovado da `main`, após PR revisada, todos os gates obrigatórios verdes e aprovação explícita; definir o cutover e o procedimento de recuperação antes de iniciar. Somente projetos com Production preexistente podem liberar preview temporário, limitado ao projeto alvo; após QA, restaurar `previewDeploymentsDisabled: true` e registrar os eventos antes/depois. Nunca impossibilitar homologação de migração nem anunciar preview aprovado sem executar os testes.
- Toda versão a ser publicada em produção deve estar em `main` após PR revisada e gates verdes. Não fazer push direto em `main` apenas para testar um palpite. Uma sequência de alterações de documentação/pesquisa permanece na branch, sendo integrada em lote quando finalizada.
- No repositório `hrq16000/zeroweb-2026`, `vercel.json` define `git.deploymentEnabled: false`. Os commits do GitHub passam pelo CI normalmente. Para publicar, selecionar explicitamente um SHA final da `main`, confirmar os gates e o deployment anterior para rollback, e iniciar o deploy autorizado. Uma implantação de homologação usa um alvo de preview. Antes de seguir com a fila, confirmar no histórico da Vercel que a integração Git não gerou deployment após o primeiro merge com essa configuração.
- **Semântica de publicação:** `previewDeploymentsDisabled: true` bloqueia previews, mas não bloqueia por si só a produção em `main`. Já `git.deploymentEnabled: false` desativa os deployments automáticos de **todas** as branches, inclusive produção. Para manter produção automática somente após merge validado, a configuração de branch pode manter `main: true` e negar as demais branches; não substituir a estratégia de um projeto sem conferir gates, domínio e rollback.
- **Exceção 0WEB/EUT:** os repositórios `hrq16000/zeroweb-2026` e `hrq16000-a11y/encontreumtecnico` têm `git.deploymentEnabled: false`; portanto, a produção não é publicada automaticamente por push/merge Git. A 0WEB não possui workflow GitHub dedicado de deploy Production; os workflows de publicação/build atuais fazem validação. A publicação explícita pode ser iniciada via Vercel `create_deployment` a partir de SHA Git aprovado, com `target: production`, somente após gates e aprovação. Não mudar para `main: true` sem desenhar/homologar o fluxo e rollback.
- O limite do plano Hobby é **compartilhado por todos os projetos da equipe**. Monitorar deployments por projeto e janela móvel de 24h, além da fila por hora. Diagnóstico em 10/11/2026: 62 deployments na janela consultada, sendo 58 do projeto `encontreumtecnico` e 4 de `zeroweb-2026`. Esses números são um retrato, não um valor permanente.
- Não apagar deployments em massa: preservar produção atual, alias, ao menos um rollback estável, evidências e trabalhos ativos. A retenção/limpeza segue `docs/PORTFOLIO_FINALIZATION_CLEANUP_STANDARD.md`. Excluir histórico não repõe quota consumida.
- Registrar no fechamento: `main_sha`, PR aprovada, gates, `deployment_id`, versão do domínio oficial, consumo de builds e decisão de rollback.
- **O domínio 0web.com.br ainda é atendido por origem externa/Lovable** no diagnóstico de 10/11/2026. `Vercel READY` não implica publicação nesse domínio. Não alterar DNS sem autorização específica; conferir host real após cada publicação.

## 3. SEO: 100% das páginas públicas aptas, indexação e ranking acompanhados

Meta operacional: **100% dos portfólios legitimamente publicados tecnicamente elegíveis à indexação** e presença orgânica competitiva em consultas de marca, serviços, bairro e cidade. Não há método honesto para garantir posição 1 ou indexação imediata pelo Google.

Antes de marcar `SEO_READY` para qualquer `/portfolio/:slug` público:

1. Entidade resolvida, conteúdo original, específico e atualizado; informações incertas em `unverified[]`, sem promessas de estoque, avaliação ou vínculo.
2. Resposta pública **HTTP 200** em `https://0web.com.br/portfolio/:slug`; URL legítima ausente responde 404, não página 200 vazia.
3. `robots.txt` permite rastreamento; HTML/SSR tem `index,follow` e **não** recebe `X-Robots-Tag: noindex`; canonical aponta para si mesmo no domínio oficial.
4. `<title>`, descrição, H1, OG e imagem social próprios, com comprimento e limites validados pelos scripts existentes. SEO/schema estruturado com `LocalBusiness`/`Service` apropriado, endereço e `sameAs` somente quando comprovados.
5. URL no `sitemap-portfolio.xml` e alcançável por links HTML do catálogo e malha contextual; zero URLs rascunho ou com `noindex` no sitemap.
6. Mídia identificada e autorizada, imagens com alt factual, experiência mobile, performance/acessibilidade; nenhum conteúdo textual essencial depende exclusivamente de JS em cliente.
7. **Funil individual** com `clientKey`, CTA flutuante, lead salvo antes de handoff seguro, WhatsApp validado ou modo `LEAD_ONLY` sem inventar canal; pop-up institucional 0WEB separado. Sem conversão funcional, portfólio não é `FINALIZED`, mesmo que seja indexável.
8. Evidência por URL: data, SHA, resposta real no host oficial, resultado dos gates, e divergências registradas. Não declarar que uma URL está indexada usando somente sitemap, `site:` ou metatags.

Depois da publicação, **monitorar via Google Search Console**: URL Inspection (indexado, crawled, discovered, canonical Google), sitemaps aceitos, impressões, cliques, consultas e posição média com janela e data. Diagnosticar `Discovered – currently not indexed`, `Crawled – currently not indexed`, duplicação, canonical escolhido e conteúdo fraco antes de pedir reprocessamento. Reavaliar em 7, 14 e 30 dias para URLs prioritárias; relatório de mudanças e problemas, sem disparar requisições inúteis.

A meta de **primeiras posições** é competitiva, não contratualmente garantida. Medir consultas de marca e marca+cidade, e depois segmento+bairro/cidade; usar conteúdo factual profundo, associação correta da entidade, Google Business Profile quando pertencente ao cliente, referências e links orgânicos legítimos, velocidade, UX e evidências públicas. Evitar páginas doorway, redes de links artificiais, avaliações e preços fabricados e múltiplos portfólios clones.

### Evidência versus estado externo

- `TECHNICALLY_INDEXABLE`: gate técnico e HTTP públicos aprovados.
- `GSC_INDEXED`: status consultado na Search Console para a URL correta.
- `RANKING_OBSERVED`: dados reais da Pesquisa (consulta, país/dispositivo, período, impressões, posição), nunca promessa.
- `UNKNOWN`: ausência de acesso/credencial, não representa `INDEXED` e não justifica adicionar `noindex`.

Em 10/11/2026, o gate encontrou **98/99 tecnicamente elegíveis**; falha de título em São Francisco Pet Center deve ser reconciliada com o HTML atualmente servido. O snapshot GSC estava desatualizado; os jobs diários de GSC carecem de credenciais. Não reportar indexação efetiva de 98 portfólios sem evidência nova.

## 4. Travamentos que impedem dizer "100% concluído"

- Gate de regressão visual de `main` com diferenças não aprovadas: investigar imagens/baselines, **sem relaxar thresholds**.
- Jobs SEO runtime/GSC/RLS com falha: corrigir causas verificadas e manter evidência de bloqueio; não marcar `PASS` em job pulado ou sem credencial.
- Agropet e Cantinho (#521): páginas publicadas, porém funil proprietário ainda depende de homologação e ativação; Jotform não é substituto canônico.
- Controle compartilhado de deploys da equipe: priorizar redução de novos builds, sem apagar outros projetos ou quebrar rollback.
- Mudanças em Supabase, DNS, preço, redirects, filas de leads e segredos exigem revisão específica; não inserir `SUPABASE_SERVICE_ROLE_KEY` em bundle cliente nem torná-la pré-requisito para cadastrar portfólios.

**Critério de conclusão**: release rastreável ao SHA de `main`, todos gates aplicáveis verdes, host oficial revalidado, funil/leads funcional, 100% das páginas públicas avaliadas como `TECHNICALLY_INDEXABLE` e observabilidade GSC explicitada — independentemente do tempo de indexação pelo Google.
