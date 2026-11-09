# Triagem de ferramentas GitHub — 0WEB e ecossistema | 2026-11-09

**Escopo:** levantamento solicitado de 19 repositórios explícitos (o link HyperFrames foi completado pelo repositório oficial) e triagem dos três índices do André Lug. **Status:** pesquisa/curadoria de fontes, não instalação nem homologação funcional das ferramentas. Os três índices trazem 20 + 24 + 24 referências; a lista abaixo NÃO afirma auditoria de segurança dos 68 projetos.

**Fonte oficial do projeto 0WEB:** https://github.com/hrq16000/zeroweb-2026. Este arquivo complementa AGENTS.md, docs/skills/REGISTRY.md e docs/skills/SECURITY.md. Não altera runtime, package.json, lockfile, credenciais, DNS, deploy ou políticas de aprovação.

## Fontes de descoberta

- https://andrelug.com/materiais/mapa-107 — 20 ferramentas de criação de conteúdo e crescimento em redes sociais (08/11/2026).
- https://andrelug.com/materiais/mapa-103 — 24 agentes de programação (04/11/2026).
- https://andrelug.com/materiais/mapa-104 — 24 agentes de automação/trabalho (05/11/2026).
- As páginas agregadoras são índices, **não prova de segurança nem de licença**; validar repositório original e commit fixo antes de executar.

## Repositórios indicados — decisão de compatibilidade

| Fonte | Potencial real para 0WEB | Decisão nesta rodada |
|---|---|---|
| https://github.com/morluto/rea | Inspeção autorizada de comportamento e investigação técnica; protocolo já existe em docs/skills/REA_RESEARCH_ADOPTION.md | REFERENCE_ONLY; instalação requer security review |
| https://github.com/storytold/craft-anything | Reconstrução autoral com validação observável e modo clean-room | REFERENCE_ONLY; não executar automaticamente; clean-room não é sandbox |
| https://github.com/debpalash/VoiceStudio | Locução, transcrição, dublagem e voz consentida em estação local | PILOTO_FUTURO em mídia, fora do portal |
| https://github.com/jamiepine/voicebox | Alternativa de estúdio de voz local | ALTERNATIVA; evitar duas pilhas de voz |
| https://github.com/Gathin23/cleanyourtv | Debloat de Android/Google TV no dispositivo do cliente | FORA_DE_ESCOPO da 0WEB web; eventualmente serviço do O Técnico, com backup/consentimento |
| https://github.com/Ansub/tv-detox | Limpeza de Android TV por automação no dispositivo | FORA_DE_ESCOPO da 0WEB; alternativa ao anterior |
| https://github.com/tashfeenahmed/freellmapi | Comparar provedores e roteamento em testes pessoais | SEM_BACKEND_PROD; o README limita a experimentação pessoal |
| https://github.com/Nutlope/hallmark | Heurísticas anti-template e revisão de composição | ADOTADO_COMO_PRINCIPIO na skill local; CLI não instalada |
| https://github.com/pbakaus/impeccable | Crítica dirigida, detecção de padrões genéricos e QA de UI | ADOTADO_COMO_PRINCIPIO; live/apply NÃO autorizado por risco de agentes sem sandbox |
| https://github.com/Leonxlnx/taste-skill | Direção visual, mídia real/licenciada e validação em browser | ADOTADO_COMO_PRINCIPIO; não impor seus starters/layouts a clientes |
| https://github.com/heygen-com/hyperframes | Render de vídeo a partir de HTML; licença Apache-2.0 declarada | PILOTO_FUTURO isolado para conteúdo |
| https://github.com/remotion-dev/remotion | Vídeo programático com React; skill de boas práticas já no registry | PILOTO_FUTURO; confirmar licença comercial especial antes de vender |
| https://github.com/mutonby/openshorts | Recortes de vídeo longo em shorts, legendas e detecção de momentos | PILOTO_FUTURO em produção de conteúdo; custo GPU e dados |
| https://github.com/wassgha/rescript | Edição de áudio/vídeo pela transcrição | ALTERNATIVA para edição manual; não incluir no frontend |
| https://github.com/thedotmack/claude-mem | Contexto entre sessões de agentes | SECURITY_REVIEW_REQUIRED: hooks e retenção de dados |
| https://github.com/akitaonrails/ai-memory | Handoff entre agentes/Codex e memória de desenvolvimento | SECURITY_REVIEW_REQUIRED: hooks/serviço local e credenciais |
| https://github.com/altic-dev/FluidVoice | Ditado local; README informa macOS disponível e Windows futuro | FORA_DE_ESCOPO de runtime; opção macOS pessoal |
| https://github.com/anomalyco/hex | Ditado local para computadores | FERRAMENTA_DE_ESTACAO; validar compatibilidade na máquina-alvo |
| https://github.com/cloudflare/security-audit-skill | Método em fases: fronteiras, cobertura, verificação independente e achados estruturados | ADOTADO_COMO_PRINCIPIO; não executar automaticamente auditoria multiagente |

## Ideias úteis extraídas dos três índices, sem instalação

| Índice | Candidatos a teste futuro | Filtro |
|---|---|---|
| mapa-107 (conteúdo) | OpenChatCut, Whishper, AutoSubs, Easel, Social Media Research Skills, AI YouTube Shorts Generator | Priorizar um problema editorial real; licenças, mídia e API de pesquisa têm de ser verificadas |
| mapa-103 (código) | PR-Agent para revisão pontual de PR; Task Master quando planejamento multietapa justificar; Qwen Code como alternativa a Lovable; Open Lovable apenas referência | Preferir Codex/GitHub; não substituir CI nem implantar agente autônomo com permissão de escrita sem controle |
| mapa-104 (automação) | Stagehand em browser QA; Windmill/Activepieces/Automatisch em rotinas internas; Letta para memória quando houver caso real | Evitar novas plataformas/serviços permanentes sem evidência de valor, regras de autenticação e custo |

## Primeira rodada realmente adotada

- Skill local criada: .agents/skills/0web-curated-github-adoption/SKILL.md. É documentação operacional para agentes: orientação de seleção, revisão, risco e aplicação aos portfólios, com referências verificadas.
- Roteamento/registro desta skill: 0web-skill-router e REGISTRY.md.
- **Não** foram executados instaladores, CLIs ou hooks externos. Nenhuma vulnerabilidade foi declarada confirmada e nenhum audit completo foi executado.
- Não foram realizados testes de UI no browser ou de render de vídeo nesta rodada documental; o efeito só pode ser medido em piloto posterior.
- Próximo piloto recomendado: em um único portfólio ainda não publicado, realizar revisão de um componente (hero ou cards) usando a skill local + ferramentas já existentes, com QA visual/SEO/funil; somente depois considerar detector externo isolado e versionado.

## Gates para qualquer próxima adoção executável

1. Problema demonstrado e alternativa local insuficiente.
2. Ler fonte original, LICENÇA, versão e scripts/instaladores inteiros.
3. Analisar acesso a rede, shell, subprocessos, browser, cookies, env, chaves, dados privados e persistência.
4. Testar fora de produção e sem dados reais, limitado a um caso; medir custo/tempo e benefício.
5. Criar PR pequeno com evidências dos testes realmente executados, rollback e gates existentes preservados.
6. Não promover para APPROVED_* executável sem cumprir docs/skills/SECURITY.md.

## Observações de licença/segurança

- FreeLLMAPI: README afirma explicitamente que o projeto é para experimentação pessoal e aprendizagem, não produção.
- Remotion: README alerta sobre licença especial e possíveis exigências de licença empresarial.
- HyperFrames: README indica Apache-2.0 e ausência de taxa por render como parte de sua implementação open source.
- Impeccable live: README documenta fallback com Codex/Claude executando com sandbox e aprovações desativados. Não habilitar live/apply por padrão.
- REA: protocolo anterior da 0WEB permanece válido; nenhuma segunda integração ou cópia do REA é necessária.
