---
name: 0web-curated-github-adoption
description: Triagem operacional de ferramentas e skills externas sugeridas para 0WEB, com seleção por necessidade, security gate, licença, custo, evidência e testes de regressão. Uso especialmente em UI, pesquisa de referência, vídeo, automação, memória de agentes e auditoria de segurança.
---

# 0WEB — Curated GitHub Adoption (evidence first)

Esta skill é uma camada **local, textual e não executável**. Ela NÃO instala os programas externos listados e não cria integrações de runtime. Fontes e decisões: docs/skills/GITHUB_TOOL_TRIAGE_2026-11-09.md.

## Antes de agir

1. Ler AGENTS.md, docs/0WEB_EXECUTION_CONTRACT.md, docs/skills/SECURITY.md e 0web-skill-router.
2. Identificar uma capacidade ausente que resolva um problema verificável; verificar se Playwright, motion existente, design system, gates de SEO/funil e scripts locais já resolvem.
3. Escolher NO MÁXIMO UMA ferramenta complementar para um piloto isolado por rodada; registrar alternativa rejeitada, versão/commit, licença, risco, custo, dados acessados e rollback.
4. Manter repositório oficial como fonte de verdade. Nunca instalar executáveis externos em Vercel, build, CI, produção, package.json ou hooks sem revisão linha a linha e validação prévia específica.

## Aplicação por tarefa

### UI / identidade — Impeccable, Hallmark, Taste Skill

Usar como **referência de revisão**, não como instalador automático nem template visual. Primeiro usar as skills locais de direção criativa, experiência e QA. Para um único componente/página escolhido, avaliar: hierarquia, motivo visual ligado à marca, coerência de espaçamento, responsividade 390/768/1440, foco e teclado, formulários, estados vazios/erro, contrastes, imagem factual/licenciada, animação com prefers-reduced-motion e conversão por funil. Registrar evidência antes/depois quando houver mudança.

- Não importar folha CSS genérica, hero pré-fabricado, imagens de terceiros ou presets que tornem clientes parecidos.
- Não executar Impeccable live/apply automaticamente: o upstream descreve fallback para execução de agentes com aprovações/sandbox desativados. Revisão específica é obrigatória.
- O teste real permanece nos gates existentes; o nome de uma skill não prova qualidade visual.

### Segurança — Cloudflare security-audit-skill

Aproveitar metodologia de descoberta de fronteiras, cobertura, hipóteses, verificação independente e achados estruturados, **sem** instalar orquestrador multiagente. Para um escopo pequeno (ex.: nova rota de formulário ou autenticação): identificar entrada, destino, credenciais, limites de tenant/clientKey, PII, rate limits e evidência observável; reprovar falso positivo antes de rotular uma falha como CONFIRMED. Não declarar auditoria abrangente sem executá-la. Nenhuma varredura agressiva em sistemas de terceiros.

### Pesquisa de referência — REA e Craft Anything

Começar pelos mecanismos públicos + scripts de observação já presentes e docs/skills/REA_RESEARCH_ADOPTION.md. Inspecionar comportamento autorizado de UI/fluxos, não copiar código, layout proprietário, mídia ou marca. Craft Anything em clean-room reduz acesso ao interior do alvo, mas NÃO é sandbox de sistema; não executar seu agente com permissões de produção.

### Vídeo, voz e conteúdo

HyperFrames e Remotion: considerar só em pipeline de conteúdo separado e mediante piloto de render offline; verificar licença comercial do Remotion antes de serviço remunerado. OpenShorts/Rescript/VoiceStudio/Voicebox e ferramentas de ditado: ativos e áudio somente com direitos/autorização; preservar consentimento para voz sintética. Sem GPU, FFmpeg, container ou chaves adicionadas ao deploy web apenas para gerar mídia.

### Memória e automação de agentes

Claude-Mem e AI Memory: não habilitar hooks que gravem prompts, segredos, dados de clientes ou histórico de sessões sem avaliação de retenção, escopo e acesso. Preferir registros explícitos de decisões e evidências em docs/PR quando suficientes. Ferramentas de automação dos mapas André Lug exigem piloting por processo e permissões mínimas, nunca acesso administrativo irrestrito.

## Filtros de aprovação

- P0: bug/funil/SEO/segurança real > estética; prova verificável > estrelas.
- Aprovar princípios seguros independentemente de instalação; registrar executável como SECURITY_REVIEW_REQUIRED até revisar scripts/dependências/saídas e fazer teste isolado com versão fixa.
- Proibido modificar DNS, segurança, identidade institucional congelada, regras de funil, gates, thresholds e indexabilidade como efeito colateral.
- Não usar FreeLLMAPI como backend de produção: upstream limita uso a experimentação pessoal e recomenda API paga para sistemas reais.
- Não executar npx/curl pipe shell/npm global com código não revisado; nada de Max mode/Lovable sem autorização específica.
- Em PR registrar: escopo, capacidade nova, fonte+versão, risco/licença, evidência de teste real, custo, arquivos alterados, estado de deploy e rollback.

## Resultado por micro-rodada

Saída objetiva: ADOTADO_COMO_PRINCIPIO, PILOTO_ISOLADO_VALIDADO, SECURITY_REVIEW_REQUIRED, REDUNDANT, FORA_DE_ESCOPO ou REJEITADO. Distinguir sempre fonte inspecionada, arquivo escrito, teste realizado, PR aberto, merge e publicação.
