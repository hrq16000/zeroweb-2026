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

- **Política global solicitada pelo proprietário em 10/11/2026:** na equipe Vercel `msolus`, o padrão para TODOS os projetos presentes e futuros é `previewDeploymentsDisabled=true`. O campo foi enviado via API para os 15 projetos existentes (14 atualizados nesta rodada + 0WEB anterior); as requisições tiveram sucesso, **mas a leitura de confirmação do campo não foi exposta pelo conector**. Validar o efeito em novos commits e no dashboard. Esta medida não desativa por si só auto-deploys da branch de produção.
- **Provisionamento de todo projeto novo (obrigatório):** identificar a equipe `msolus`, criar o projeto com `deploy=false` quando a integração oferecer a opção, aplicar imediatamente `previewDeploymentsDisabled=true` com `update_project`, confirmar o ID/configuração, e só conectar a primeira release aprovada. Não presumir herança automática pela equipe; não foi confirmada opção global nativa no nível do time.
- Preview temporário é **exceção controlada**, quando QA/cutover exigir URL externa: liberar ou criar explicitamente apenas para o projeto alvo, validar, registrar evidência e voltar ao padrão econômico. Nunca impossibilitar homologação de migração nem anunciar preview aprovado sem ter executado os testes.
- Se houver automação disponível, verificar novos projetos de forma recorrente e reaplicar a política. Enquanto não houver automação ou mecanismo global comprovado, o checklist de criação é o controle efetivo. Em 10/11, a tentativa de criar tarefa recorrente no ChatGPT foi bloqueada pelo limite de 5 automações do plano; **não** afirmar monitoramento automático ativo.
- Toda versão a ser publicada em produção deve estar em `main` após PR revisada e gates verdes. Não fazer push direto em `main` apenas para testar um palpite. Uma sequência de alterações de documentação/pesquisa permanece na branch, sendo integrada em lote quando finalizada.
- Caso se deseje `release-only` explícito além de `main`, desenhar e homologar um fluxo de promotion/commit marcado com rollback; **não** aplicar `ignoreCommand` bloqueante sem plano de publicação: builds cancelados pelo Ignored Build Step ainda podem consumir quota.
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
