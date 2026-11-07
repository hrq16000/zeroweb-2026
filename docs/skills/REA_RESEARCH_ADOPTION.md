# REA — protocolo opcional de investigação de referências para a 0WEB

**Status:** `REFERENCE_ONLY` (análise da fonte concluída; execução de terceiros ainda exige revisão completa de segurança).  
**Data da triagem:** 2026-11-07.  
**Origem:** https://github.com/morluto/rea — revisão `99db80a13e369885e7de99417475c25380446081`, licença MIT; pacote `rea-agents` v6.8.0 no `package.json` upstream consultado.  
**Aplicação:** pesquisa técnica *fora da produção* sobre funcionalidades de aplicações/sites, nunca instalação no site ou no serviço público 0WEB.

## Valor e limites

REA é uma ferramenta de investigação por agentes (CLI/MCP) para observar aplicações web, relações entre módulos JavaScript, comportamento e evidências de execução. **Não** gera automaticamente uma cópia funcional, não substitui o Playwright da 0WEB nem garante reconstrução fiel. Em pesquisa de websites, a observação é passiva por padrão e depende de um Chrome/Chromium controlado pelo operador; funções de observação, comparação, análise e automação podem ter permissões e efeitos distintos.

A 0WEB já tem pipeline de pesquisa/autonomia de portfólios e browser QA. REA só acrescenta valor quando a pergunta envolve **como uma interação funciona**, e os recursos já instalados não fornecem evidência suficiente. Exemplos: estados de um agendamento, organização de navegação SPA, transições entre passos e comportamento de erro de um formulário. Iniciar por análise pública convencional e Playwright.

## Fluxo operacional adotado (não automático)

1. **Definir escopo:** URL/origem exata, funcionalidade-alvo, autorização aplicável, se existe login/dados privados, perguntas que faltam responder, limites de coleta e tempo. Site público não implica autorização para contornar controles ou reproduzir propriedade intelectual.
2. **Pesquisa normal primeiro:** fontes públicas, páginas, HTML/SSR, acessibilidade, navegação, logs e Playwright. Registrar fatos, capturas e incertezas. Se suficiente, **não usar REA**.
3. **Security gate:** antes de executar REA ou importar skill externa, revisar integralmente o `SKILL.md`, scripts de instalação, dependências, comportamento de rede e operações com browser; cumprir `docs/skills/SECURITY.md`. O código do upstream **não foi aprovado para execução automática** nesta triagem. Confirmar versão/commit fixos e ambiente isolado, sem segredos ou cookies de produção.
4. **Opt-in local somente após aprovação:** REA suporta agentes MCP como Codex. Instalação documentada pelo upstream: `npx rea-agents@6.8.0 setup` em ambiente de desenvolvimento descartável, fora da pasta 0WEB, e somente após a revisão acima; analisar todas as alterações propostas antes de confirmar. Exige Node.js compatível (22.23.4+, 24.22.1+ ou 26.12.1+). Não executar em CI, Vercel ou servidor de produção.
5. **Observação web estritamente limitada:** usar perfil de navegador descartável, endpoint CDP **somente loopback** (ex.: `127.0.0.1:9222`) e origem autorizada. Revisar e restringir os alvos antes de anexar. Não reutilizar sessão autenticada, capturar credenciais/tokens, tentar bypass de captcha, login, rate limit ou DRM; não interagir com contas de terceiros. Respeitar termos e privacidade. Consultar `docs/browser-observation.md` no upstream para flags e limitações da versão efetivamente instalada.
6. **Registro da evidência:** documentar `target | pergunta | observação | fonte/artifacto | verificadoEm | confiança | limites | comportamento proposto`. Separar `OBSERVED` de `INFERRED`; remover conteúdo pessoal e segredos dos relatórios. Guardar apenas material e mídia com direitos de uso apropriados.
7. **Construir original e validar:** transformar aprendizado em implementação própria da 0WEB, mantendo `ROLE_MATRIX`, `COMPOSITION_MATRIX`, `ANTI_COPY_MATRIX`, `FRESHNESS_MATRIX` e `SCOPE_TRUTH_MATRIX` quando aplicáveis. Preservar o isolamento `clientKey`, funis, indexabilidade e testes de regressão existentes. Publicação exclusivamente via PR + gates aprovados.

## Política de integração técnica

- **Zero mudanças no bundle/servidor:** não adicionar `rea-agents` a `dependencies`/`devDependencies`, lockfile, deploy Vercel ou runtime de portfólio.
- **Sem ativação silenciosa:** não adicionar MCP remoto ou `npx@latest` a configurações automáticas do repositório; não armazenar cookies, credenciais, traces sensíveis ou binários no Git.
- **Revisão por versão:** qualquer futura aprovação operacional deve registrar SHA, versão, superfície de permissões, scripts revisados e teste local, e então mudar o status no `docs/skills/REGISTRY.md`. A atualização do upstream não promove aprovação automaticamente.
- **Resultado esperado:** inteligência de engenharia/referência com evidências, não cópia de layout, código proprietário, imagens sem direito de uso, nem substituição de ferramentas já suficientes.

## Piloto operacional 0WEB (sem executar REA)

A linha de base para a investigação foi implementada em `scripts/reference-observation.mjs` utilizando o **Playwright já presente no projeto**, sem novas dependências. O script lê apenas páginas públicas pertencentes à 0WEB e devolve um JSON com título, descrição, canonical, robots, hierarquia de headings, CTAs, estrutura de campos de formulário (sem valores), contagens de links/imagens e possíveis lacunas básicas de acessibilidade.

Uso **local e opcional** no ambiente de desenvolvimento que já disponha de Playwright/Chromium:

```bash
node --test tests/reference-observation.test.mjs
node scripts/reference-observation.mjs https://0web.com.br/portfolio
```

A coleta não executa ações de usuário, não envia formulários, não grava cookies, não observa tráfego de outras origens e bloqueia métodos diferentes de GET/HEAD. A URL inicial e os redirecionamentos são restritos à home, /portfolio, /servicos e páginas individuais públicas dos respectivos catálogos; /auth, /admin, /api e outras rotas não podem ser pontos de observação. O workflow de homologação registra home, /portfolio e /servicos no mesmo job e gera um JSON separado por rota, com escopo fixo e sem execução automática em produção. Também bloqueia domínios fora da allowlist, parâmetros de query e fragmentos. **A captura real em navegador deve ser executada antes de usar o resultado como evidência:** os testes unitários validam restrições e não provam que o relatório foi produzido contra produção.

Limitações: recursos de terceiros bloqueados podem causar renderização incompleta; presença de CTA não prova persistência de lead; presença de canonical não comprova indexação pelo Google. O relatório gerado é somente a linha de base `OBSERVED_LIMITED` para comparação futura com evidências do REA, cuja instalação segue pendente de revisão de segurança específica. Não copiar dados/ativos de terceiros.

## Referências

- Fonte/README: https://github.com/morluto/rea
- Browser observation: https://github.com/morluto/rea/blob/main/docs/browser-observation.md
- Instalação: https://github.com/morluto/rea/blob/main/docs/installation.md
- Segurança: https://github.com/morluto/rea/blob/main/SECURITY.md
- Uso responsável: https://github.com/morluto/rea/blob/main/DISCLAIMER.md
- Governança 0WEB: `docs/PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD.md`, `docs/skills/SECURITY.md`, `docs/0WEB_EXECUTION_CONTRACT.md`.
