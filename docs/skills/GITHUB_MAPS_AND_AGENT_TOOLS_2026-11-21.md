# Curadoria operacional — três mapas de agentes e 19 GitHub (21/11/2026)

**Estado:** repertório incorporado para seleção por tarefa; **nenhum software externo instalado, testado em produção ou habilitado** por este documento. Complementa o `GITHUB_TOOL_TRIAGE_2026-11-09.md`, a curadoria dos 17 GitHub de 20/11 e a skill `0web-curated-github-adoption`. Não substitui `AGENTS.md`, os gates, o pipeline de portfólios ou o contrato Git-first.

## Fontes primárias e nível da verificação

- Listas completas lidas: [20 ferramentas de conteúdo — mapa 107](https://andrelug.com/materiais/mapa-107), [24 agentes de programação — mapa 103](https://andrelug.com/materiais/mapa-103), [24 agentes operacionais — mapa 104](https://andrelug.com/materiais/mapa-104). São **68 entradas de catálogo**, não 68 auditorias de repositórios, nem provas de licença, segurança ou de que as alegações de marketing são verdadeiras.
- Os **19 repositórios indicados diretamente** tiveram suas páginas GitHub consultadas para finalidade/posicionamento. Inspeção de README **não** comprova segurança, compatibilidade de dependências, legalidade comercial ou funcionalidade na infraestrutura atual.
- Link truncado recebido para HyperFrames foi resolvido para [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes); considerar a edição offline com HTML/CSS/JS e Apache-2.0 descrita no upstream, não um componente obrigatório do site.

## 19 referências diretas — decisão prática

| Grupo | Repositórios | Uso onde há ganho | Estado |
| --- | --- | --- | --- |
| Engenharia reversa/observação | [REA](https://github.com/morluto/rea), [Craft Anything](https://github.com/storytold/craft-anything) | Pesquisa autorizada de interação; primeiro usar fontes públicas e Playwright; não copiar marca, layout, código nem contornar controles | REFERENCIA; execução exige revisão/sandbox |
| Direção visual | [Hallmark](https://github.com/Nutlope/hallmark), [Impeccable](https://github.com/pbakaus/impeccable), [Taste Skill](https://github.com/Leonxlnx/taste-skill) | 0WEB: anti-template, hierarquia, layout, identidade, vídeo/motion com propósito, QA 390/1440; aproveitar roteador/skills locais | ADOTAR COMO CRITÉRIO; CLIs/hooks não instalados |
| Segurança | [Cloudflare security-audit-skill](https://github.com/cloudflare/security-audit-skill) | EUT/O Técnico/0WEB: triagem de fronteiras de confiança, autenticação, RLS, contatos, segredos, prova por achado | ADOTAR MÉTODO; não alegar auditoria executada |
| Conteúdo em vídeo | [HyperFrames](https://github.com/heygen-com/hyperframes), [Remotion](https://github.com/remotion-dev/remotion), [OpenShorts](https://github.com/mutonby/openshorts), [Rescript](https://github.com/wassgha/rescript) | 0WEB campanhas e portfólios, O Técnico tutoriais; **job offline isolado**, não SSR nem Vercel; Remotion tem licença comercial especial | PILOTO CONDICIONAL POR JOB |
| Áudio / voz | [VoiceStudio](https://github.com/debpalash/VoiceStudio), [Voicebox](https://github.com/jamiepine/voicebox), [FluidVoice](https://github.com/altic-dev/FluidVoice), [Hex](https://github.com/anomalyco/hex) | locuções consentidas, legendas, documentação e ditado de operadores; escolha SO/recursos antes de instalar | USO LOCAL OPCIONAL; proteção de voz/dados |
| Memória de agentes | [Claude-Mem](https://github.com/thedotmack/claude-mem), [AI Memory](https://github.com/akitaonrails/ai-memory) | primeiro `AGENTS.md`, PRs, changelogs e documentação; hooks de captura só após revisar armazenamento, segredos e retenção | REFERENCIA / SECURITY_REVIEW_REQUIRED |
| Prototipação de modelos | [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) | somente experimentação pessoal, com atenção aos termos de cada provedor; upstream desaconselha produção | NÃO ADOTAR NO BACKEND DE PRODUÇÃO |
| Android TV | [CleanYourTV](https://github.com/Gathin23/cleanyourtv), [TV Detox](https://github.com/Ansub/tv-detox) | referência para suporte técnico/serviços Android TV com autorização do dono e rollback | FORA DO FRONTEND; eventual operação assistida |

## Triagem dos mapas: candidatos com vantagem específica

| Origem | Candidatos | Encaminhamento |
| --- | --- | --- |
| mapa 103 (código) | [PR-Agent](https://github.com/The-PR-Agent/pr-agent), [Context7](https://github.com/upstash/context7), [Spec Kit](https://github.com/github/spec-kit), [Superpowers](https://github.com/obra/superpowers), [Task Master](https://github.com/eyaltoledano/claude-task-master) | Usar método de revisão, consulta a docs reais, especificação curta e plano por micro-rodada. **Não instalar outro bot de PR**, framework de processo ou duplicar o CI sem lacuna comprovada. |
| mapa 103 (geradores) | [Dyad](https://github.com/dyad-sh/dyad), [bolt.diy](https://github.com/stackblitz-labs/bolt.diy), [Open Lovable](https://github.com/firecrawl/open-lovable), [Screenshot-to-Code](https://github.com/abi/screenshot-to-code) | Protótipos descartáveis **sem dados reais**; não substituir GitHub, site atual nem o processo Lovable econômico. |
| mapa 104 (automação) | [Activepieces](https://github.com/activepieces/activepieces), [Automatisch](https://github.com/automatisch/automatisch), [Windmill](https://github.com/windmill-labs/windmill) | Só para demanda operacional comprovada, isolada e aprovada. Avaliar self-hosting, autenticação, webhook, custo/retention; nenhum acesso irrestrito ao admin. |
| mapa 104 (navegador) | [Stagehand](https://github.com/browserbase/stagehand), [Skyvern](https://github.com/Skyvern-AI/skyvern), [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | Preferir Playwright existente para QA; automatização de contas reais requer consentimento explícito, mínimos privilégios e parada antes de ações irreversíveis. |
| mapa 104 (memória/agentes) | [mem0](https://github.com/mem0ai/mem0), [Letta](https://github.com/letta-ai/letta), [OpenAI Agents SDK](https://github.com/openai/openai-agents-python), [CrewAI](https://github.com/crewAIInc/crewAI) | Referências para projetos que de fato necessitem agente persistente, não incorporar ao SSR nem replicar dados dos clientes. |
| mapa 107 (pesquisa) | [last30days](https://github.com/mvanhorn/last30days-skill), [social-media-research-skills](https://github.com/ScrapeCreators/social-media-research-skills) | 0WEB: pautas, tendências e posts com fontes rastreáveis; revisar dependência de APIs, scraping, direitos e conteúdo datado. Nunca inventar engajamento. |
| mapa 107 (edição/legenda) | [Whishper](https://github.com/pluja/whishper), [AutoSubs](https://github.com/tmoroney/auto-subs), [OpenChatCut](https://github.com/0xsline/OpenChatCut), [FunClip](https://github.com/modelscope/FunClip), [AutoClip](https://github.com/zhouxiaoka/autoclip) | Selecionar **uma** ferramenta offline por necessidade; preservar origem, autorização de mídia, revisões humanas e custos de GPU/FFmpeg. |

As demais entradas dos três mapas permanecem **REFERENCE_ONLY** até existir demanda; muitas implicam servidores, OAuth, GPU, credenciais ou automação poderosa e duplicam recursos do projeto.

## Aplicação **ativa como procedimento** por projeto

- **0WEB / portfólios novos e revisões materiais autorizadas:** executar `0web-skill-router` → descoberta local → direção criativa/originalidade → Hallmark/Impeccable/Taste como *critérios complementares* → evidência de conteúdo/mídia legítima, CTA/funil, SEO e browser QA responsivo existente. Não reabrir portfólios legados só para dizer que a skill foi aplicada. Para um vídeo solicitado, isolar edição/render offline e publicar apenas o arquivo final otimizado/licenciado após revisão.
- **Encontre um Técnico:** método Cloudflare no escopo de uma mudança real de admin/Auth/RLS; critérios visuais apenas para Home, filtros, perfis e painel. Nada de substituir Supabase, exibir contato ou alterar regras comerciais por nova ferramenta. Comunicação/automação só com autorização explícita.
- **O Técnico de Informática:** legendas/áudio autorizados para tutoriais, com produção fora do site; método de segurança por evidência, QA e conteúdo técnico original. Preservar proibição local de imagens geradas por IA.
- **Futuros projetos:** começar pelo contrato do novo `AGENTS.md`; escolher **capacidade, não pacote**. Duplicação funcional = REJECT/REDUNDANT; se precisar de produto externo, abrir proposta com versão, licença, limite de custo, dados acessados, rollback e teste piloto.

## Gate por ferramenta e prova

Toda aplicação concreta deve documentar: necessidade/fluxo, equivalente local consultado, fonte + versão/commit, licença comercial, dependências, dados e segredos acessados, custo (inclusive infraestrutura), modo de desativação, validação real e PR. Usar `REFERENCE_ONLY` ou `NOT_APPLICABLE` quando não houver evidência; **não declarar instalação, teste, integração, merge ou publicação apenas por constar no catálogo**.

**Mudança desta rodada:** documentação de seleção; sem alterações em `src/`, `package.json`, CI, Supabase, RLS, mídias, identidade, clientes, deploy ou produção.
