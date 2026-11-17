# Adoção seletiva de soluções abertas — ecossistema de projetos (2026-11-17)

**Status:** CURADORIA_APROVADA_COMO_REFERÊNCIA; **zero instalações ou integrações de runtime aprovadas por este documento**.
**Aplicação:** 0WEB, Encontre um Técnico, O Técnico de Informática e demais projetos ativos, cada um com contratos próprios.
**Fontes:** repositórios oficiais públicos consultados em 17/11/2026; metadados de licença de GitHub são indicativos, **não** auditoria jurídica nem de segurança.

## Contrato de absorção

1. Aproveitar **capacidade e padrão**, não importar um produto completo no frontend SSR. Um serviço que exige Docker, Postgres, Redis, worker, GPU, armazenamento, fila, OAuth ou domínio próprio é um **produto separado** e depende de infraestrutura, credenciais, orçamento e piloto específicos.
2. Preservar `origin/main`, GitHub CI, Vercel/Lovable sob publicação controlada, Supabase dedicado por projeto, RLS, autenticação, LGPD, contatos privados, funnels e isolamento `clientKey`. Não compartilhar bancos nem leads entre portais.
3. Cada implementação exige caso de uso, dependência realmente necessária, licença detalhada, versão/SHA fixado, egress/segredos avaliados, modo de falha, desativação reversível, testes e gates existentes aprovados. Nenhum pacote externo é autorizado em CI, hooks ou runtime por constar aqui.
4. Usar **uma ferramenta candidata e um fluxo isolado por rodada**. Se já existir solução equivalente, integrar por API somente com vantagem medida; evitar dois CRMs, duas caixas de atendimento, dois agendadores ou dois fluxos de contato.
5. Estado `REFERENCIA` permite pesquisa e aprendizagem factual, `PILOTO_CONDICIONAL` exige escopo e segurança, `USO_INTERNO_OPCIONAL` não é dependência dos sites; `ADIAR` não entra no roadmap de instalação atual.

## Matriz dos 20 candidatos

| # | Fonte oficial | Capacidade aproveitável | Decisão | Encaixe inicial / cuidado |
|---|---|---|---|---|
| 20 | [Agentes Chat](https://github.com/agentes-chat/agentes-chat) | colaboração interna entre operadores e agentes | ADIAR | serviço independente Docker/Postgres; não substitui GitHub, autenticação nem aprovações |
| 19 | [Podcastfy](https://github.com/souzatharsis/podcastfy) | produção editorial de episódios a partir de textos | USO_INTERNO_OPCIONAL | O Técnico; gerar offline, revisar conteúdo e direitos de voz |
| 18 | [Anarlog](https://github.com/fastrepl/anarlog) | notas locais de reuniões | USO_INTERNO_OPCIONAL | operação interna; consentimento dos participantes e política de retenção |
| 17 | [Kokoro](https://github.com/hexgrad/kokoro) | locução sintética local, licenciada separadamente de vozes/datasets | PILOTO_CONDICIONAL | O Técnico / vídeos 0WEB; nada de inferência pesada no SSR |
| 16 | [Inbox Zero](https://github.com/elie222/inbox-zero) | triagem de e-mail com IA | ADIAR | OAuth e e-mails privados; licença/composição requerem revisão antes de implantação |
| 15 | [Documenso](https://github.com/documenso/documenso) | assinatura de contratos/termos/OS | PILOTO_CONDICIONAL | 0WEB e operações B2B, via API; documentos e signatários isolados |
| 14 | [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) | tradução por API privada | PILOTO_CONDICIONAL | só se surgir demanda multilíngue, tradução editorial revisada; sem API pública irrestrita |
| 13 | [Buzz](https://github.com/chidiwilliams/buzz) | transcrição/legendas local com Whisper | USO_INTERNO_OPCIONAL | artigos e vídeos do O Técnico; não enviar áudio de terceiros sem permissão |
| 12 | [Cap](https://github.com/CapSoftware/Cap) | captura de demonstrações e tutoriais | USO_INTERNO_OPCIONAL | suporte, QA e guias dos portais; compartilhamento de gravações sob controle |
| 11 | [Vane](https://github.com/ItzCrazyKns/Vane) | pesquisa interna com fontes | PILOTO_CONDICIONAL | conteúdo factual; não substituir citações primárias nem oferecer respostas não verificadas |
| 10 | [Handy](https://github.com/cjpais/Handy) | ditado local | USO_INTERNO_OPCIONAL | entrada de conteúdo e operações desktop, não componente React |
| 9 | [Chatwoot](https://github.com/chatwoot/chatwoot) | caixa omnicanal de atendimento | PILOTO_CONDICIONAL | 0WEB / EUT apenas se não duplicar funil atual; consentimento, webhooks, RLS, autenticação |
| 8 | [Postiz](https://github.com/gitroomhq/postiz-app) | agendamento de conteúdo social | PILOTO_CONDICIONAL | marketing 0WEB e O Técnico; tokens OAuth e hospedagem separados |
| 7 | [SiYuan](https://github.com/siyuan-note/siyuan) | base interna de conhecimento | ADIAR | docs/Git existentes continuam canônicos; evitar base paralela que diverge |
| 6 | [Cal.diy](https://github.com/calcom/cal.diy) | agendamentos isolados | PILOTO_CONDICIONAL | agendamento B2B quando o fluxo atual faltar; edição comunitária MIT, sem recursos multi-tenant/teams comerciais |
| 5 | [Upscayl](https://github.com/upscayl/upscayl) | melhoria offline de resolução | USO_INTERNO_OPCIONAL | mídias autorizadas; nunca fabricar detalhes de produtos, equipe ou avaliações |
| 4 | [Cherry Studio](https://github.com/CherryHQ/cherry-studio) | área de trabalho multi-IA | USO_INTERNO_OPCIONAL | ferramenta desktop privada; não substituir gateway IA em servidor |
| 3 | [Twenty](https://github.com/twentyhq/twenty) | CRM extensível | ADIAR | 0WEB tem governança administrativa; evitar duplicar cadastro/lead e revisar licenças por pacote |
| 2 | [Penpot](https://github.com/penpot/penpot) | design e prototipação colaborativos | USO_INTERNO_OPCIONAL | projetos React; linguagem visual autoral por cliente, sem importar templates |
| 1 | [Plane](https://github.com/makeplane/plane) | gestão de projetos e triagem | ADIAR | GitHub PR/issues já são fonte de verdade; servidor de gestão seria opcional |

**Licenças:** várias opções são AGPL-3.0; Penpot reporta MPL-2.0; ferramentas como Kokoro/Podcastfy Apache-2.0; Cal.diy e REA MIT. Chatwoot, Cap, Twenty e Inbox Zero têm condições ou múltiplos regimes: ler os arquivos de licença da versão selecionada antes de executar/copiar. Uso próprio e incorporar código em serviço comercial são decisões distintas.

## Fontes complementares: Vitor Menoli, REA e DeepSeek

- **[vitormenoli.com](https://vitormenoli.com/)** — observação direta das rotas Home, Projetos e Prompts em 17/11/2026: hero editorial curto, CTA principal + secundário, apresentação explícita de tecnologias, projeto com demonstração, catálogo pesquisável de prompts, abas YouTube/Instagram, opção de ler/copiar e ligação com o repositório original. **ABSORVER:** clareza editorial, busca, proveniência/versão, demonstração verificável, reutilização responsável do conteúdo próprio. **NÃO COPIAR:** tipografia, cores, logo, geometria, textos, imagens, prompts ou a silhueta da página. Motion não foi verificado.
- **[vitormenoli/Prompts-YouTube](https://github.com/vitormenoli/Prompts-YouTube)** e **[Prompts-Instagram](https://github.com/vitormenoli/Prompts-Instagram)** — exemplos de organização de biblioteca por fonte; usar **somente a ideia de navegação**, com material original e direitos de uso.
- **[vitormenoli/claude-motion-studio-skill](https://github.com/vitormenoli/claude-motion-studio-skill)** e **[claude-video-editor](https://github.com/vitormenoli/claude-video-editor)** — referência a pipelines de motion/vídeo offline. Metadados GitHub não indicavam licença padronizada; **não copiar código, prompts ou scripts** sem autorização/licença e revisão de segurança.
- **[morluto/rea](https://github.com/morluto/rea)** — **JÁ ABSORVIDO** no 0WEB em `docs/skills/REA_RESEARCH_ADOPTION.md`, `docs/skills/REGISTRY.md` e observação local com Playwright. Não instalar segundo REA nem ligá-lo a browser autenticado/prod. Upstream foi atualizado desde a triagem: revalidar SHA e dependências antes de qualquer execução.
- **[deepseek-ai](https://github.com/deepseek-ai)** — organização com múltiplas implementações; o link parcial não identifica uma ferramenta única. **[deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)** é candidato experimental MIT, em *developer preview* com aviso de mudanças incompatíveis. **REFERENCIA**, nunca substituição automática da arquitetura de agentes ou runtime; `DeepInfer`, `3FS`, kernels e infraestrutura GPU são `FORA_DE_ESCOPO` dos portais SSR normais.

### Recorte por projeto

| Projeto | Primeira capacidade útil | Evitar agora |
|---|---|---|
| Encontre um Técnico | melhorar rastreabilidade de solicitações e respostas **dentro do funil atual**; considerar Chatwoot só após prova de necessidade | instalar CRM, chat público ou agendamento que revele contato privado/pule cobrança/consentimento |
| O Técnico de Informática | produção editorial offline com Cap + Buzz/Handy, depois Podcastfy/Kokoro para conteúdo autorizado | colocar GPU/FFmpeg ou TTS no frontend/worker do site |
| 0WEB | referências de UX, demonstrativos verificáveis, mídia interna e protótipos Penpot; investigar Postiz/Documenso num fluxo B2B real | substituir admin/funil, implantar Twenty/Plane/Cal.diy sem caso de uso |
| Outros clientes/projetos | selecionar por necessidade real, contrato e infraestrutura próprios | instalar as 20 ferramentas por padrão ou compartilhar CRM/credenciais entre clientes |

## Roteiro de implantação controlada

1. **R0 (esta rodada):** incorporar matriz e roteamento em documentação 0WEB. Resultado = `REFERENCIA_ADOTADA`, **não** software instalado, integração ativa, testes E2E ou deploy.
2. **R1 (primeiro piloto funcional):** escolher **uma** mídia autorizada de um guia do O Técnico ou demonstração 0WEB e testar offline captura/transcrição com ferramenta já disponível; reportar comparação de qualidade/custo com baseline, sem dados de cliente.
3. **R2 (serviço opcional):** Chatwoot, Postiz, Documenso ou Cal.diy **somente** após definir processo/conta/host, isolamento, credenciais, licença e aceite; PR pequeno com feature flag desligada, testagem e rollback.
4. **R3 (expansão):** replicar decisões aprovadas em cada repositório ativo, respeitando seu `AGENTS.md`, gates, proprietário dos dados e deploy. O catálogo na 0WEB **não** aprova instalações transversais.

**Validação da rodada documental:** consistência dos 20 links/nomes, triagem por aplicação, proibições de cópia/segredos, REA deduplicado, nenhum arquivo de runtime alterado. PR e CI existentes são a prova operacional; não alegar que o software externo está funcionando.
