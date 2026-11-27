# Ecossistema — experiência premium | rodada 1 de 10
Data: 27/11/2026 (Brasil). **BASELINE / DOCUMENTAL**. Não é homologação visual, aprovação de release ou autorização para trocar domínio, identidade, arquitetura, funil ou dados.

## Escopo e decisão
O solicitante aprovou exatamente dez macro-rodadas. Cada uma tem micro-PRs pequenas, evidência antes/depois e gates internos. Não existe rodada 11: bloqueios permanecem explícitos na matriz de fechamento, não são convertidos em PASS. A rodada 1 não altera UI, CSS, JS, dependências, banco, DNS, configurações Vercel, Lovable ou produção. A priorização é Git/Codex first; manter previews Vercel desativados conforme política vigente; nenhum Max mode ou chamada de edição Lovable. Segurança/funcionalidade, fatos, acesso e conversão precedem efeitos. Esta matriz complementa, nunca substitui, os AGENTS.md dos repositórios, [GLOBAL_WEB_EXPERIENCE_STANDARD](../GLOBAL_WEB_EXPERIENCE_STANDARD.md) e o contrato JSON de motion.

## Inventário conectado e fonte operacional
Foram enumerados 45 repositórios GitHub (10 hrq16000, 35 hrq16000-a11y), 19 projetos Vercel na equipe msolus, 24 manifestos de aplicações e 21 entradas de Home encontradas durante a inspeção inicial. Isso delimita o universo acessível, não prova que todos são produtos publicados, nem que todos os caminhos do app foram testados. Um domínio HTTP acessível e uma associação de nome NÃO provam qual SHA o serve. Confirmação por deployment + leitura do package.json no mesmo SHA:

| Superfície | Repo confirmado | Referência da produção Vercel observada em 27/11 |
|---|---|---|
| 0WEB (www.0web.com.br) | hrq16000/zeroweb-2026 | main — bb8e969ce546dbc32f52d7c50ac053c8c7e4b5c8 |
| Encontre um Técnico (.com.br e .com) | hrq16000-a11y/encontreumtecnico | release/eut-admin-visitor-tab-resume-on-ready-a9cb6449-20261123 — f5952a6b708b3b63f207952e9584898491228eec |
| EncontreUm.online | hrq16000-a11y/encontre_um-online | main — 99398e09efac987f7ce8995677c823d6817f11dd |
| Empório Lele Cute | hrq16000-a11y/emporiolelecute-2026 | main — 96fdfe0a15b3394a75969434c181e7e700a8497f |
| PapeLemi | hrq16000-a11y/papelemi-2026 | main — f29417de4ead641d0b2b275535a963208b2360a3 |
| MyHostVIP (myhostvip.vercel.app) | hrq16000-a11y/myhostvip | main — 2bedb07c2d60ed50092ea2bcf16bb3a0edf43353 |
| API marketing Autoescola Aptos (Vercel) | hrq16000-a11y/autoescolaaptos | main — 80318d1e2b2d582c8e6e48b1206441454ec13b2e; não comprova host institucional |

Todos os sete deployments acima retornaram READY; o host oficial precisa ser verificado à parte. O domínio 0web.com.br retornou no browser sem redirecionamento para www, apesar da configuração de alias Vercel — não confundir DNS/host e Vercel; diagnóstico de release R3/R10, nenhuma alteração de DNS. EUT está na branch release, NÃO na main. Antes da R4, reconciliar a diferença com o SHA efetivo; preservar correções de produção e PRs existentes. Empório e PapeLemi versões sem -2026 NÃO contêm o SHA publicado; não duplicar implementação por nome. MyHostVIP possui preview TanStack separado; não promover automaticamente. O API marketing Aptos fica fora de alterações visuais.

| Superfície observada/indicada | Fonte candidata, ainda não comprovada por SHA publicado | Decisão |
|---|---|---|
| precisodeumprofissional.com.br | hrq16000-a11y/precisdeumprofissional (ortografia do repo) | correspondência README + Home; release/host ainda a verificar na R2 |
| precisodeum.com.br | hrq16000-a11y/precisodeum_old e precisodeum_n | não escolher pelo nome; old utiliza rota TanStack e Home mais extensa; AGENTS de _n proíbe presunção de canon |
| encontreumprofissional.com.br | não há repo homônimo na lista conectada | confirmar origem antes de edição |
| precisodeumtecnico.com | hrq16000/precisodeumtecnico_2026 | domínio no README; SHA publicado não identificado |
| otecnicodeinformatica.com.br | hrq16000/otecnicodeinformatica_2026 | domínio no README; SHA publicado não identificado |
| tecnicocuritiba.com.br | hrq16000/tecnicocuritiba-com-br e tecnicocuritiba_2026 | título e FastHeroSection coincidem com ambos; não alterar ambos cegamente; tecnicocuritiba histórico e tecnicocuritiba.br_2026 têm Home distinta |
| mestredosservicos.com.br / mestresdosservicos.com.br | hrq16000/mestresdosservicos | domínio e marca no README; browser redirecionou para www no singular; confirmar domínio alternativo e origem |
| Autoescola Aptos (site público) | autoescolaaptos e autoescolaaptos-2026 | site não inferido da API; confirmar versão visual e CTA |
| TamoNaWeb | hrq16000/TamoNaWeb; Vercel v0-automated-business-guide possui alias v0-tamonaweb.vercel.app | sem SHA comum provado |
| 1001 Soluções | Vercel 1001solucoes, www.mileumasolucoes.com.br | READY sem SHA; browser falhou ERR_HTTP2_PROTOCOL_ERROR; sem avaliação visual |
| Webrealce | Vercel v0-webrealce | sem SHA comum provado |
| v0-elo7-store-clone, v0-seo-for-tecnicocuritiba-com-br | aliases de protótipos, não canônicos confirmados | não substituir domínios por cópias |

Vercel: 19 nomes inventariados: zeroweb-2026, emporiolelecute, papelemi, sandbox-desktops, headshots-starter-clone, weathergpt, liftoff, encontreumtecnico, autoescolaaptos-marketing-api, encontreumtecnico-migracao, encontreumtecnico-tanstack, myhostvip, myhostvip-tanstack-ssr-preview, encontreum.online, v0-elo7-store-clone, v0-automated-business-guide, v0-webrealce, v0-seo-for-tecnicocuritiba-com-br, 1001solucoes. Migrações EUT com estado ERROR nas consultas de produção, sem host canônico; demos sandbox/headshots/weather/liftoff não retornaram registro Production. Não excluir ou migrar.

## Observação do estado publicado (desktop, somente leitura)
Medidas do DOM após carregamento em 1348–1353 px, não Lighthouse, não real user monitoring e não auditoria a11y. Não se efetuou cadastro, pedido, pagamento nem solicitação de lead. As duas primeiras superfícies tiveram revisão visual da dobra, as demais inspeção estrutural de Home; revisão visual integral e do código por projeto precede cada intervenção. Comprimento de página é sinal de investigação, nunca defeito isolado. Todas as 13 páginas acessíveis tiveram scrollWidth igual à largura do viewport nessa captura; responsividade mobile ainda não certificada.

| Home acessada | Evidência observada | Prioridade de intervenção / direção local |
|---|---|---|
| 0web.com.br | H1 «Sua presença digital precisa levar o cliente ao próximo passo.»; 5261 px altura; hero editorial tipográfico + painel de jornada em três passos; 13 imagens | R3: preservar marca, header/footer/logotipo/fontes/estilos congelados; assinatura de sequência/jornada visual, prova com cases reais, contraste e ritmo mais claros. Não uniformizar portfólio. |
| precisodeumprofissional.com.br | H1 «Quem precisa, encontra. Quem trabalha, aparece.»; 10572 px, 163 botões no DOM, 10 H2; hero central, dois públicos, barras de anúncios/cookie e cartões repetidos | R2: composição editorial de duas jornadas, hierarquia CTA cliente/prestador; simplificar ruído e assinatura de conexão sem apagar conteúdo útil. |
| precisodeum.com.br | H1 rotativo «Encontre um tradutor!» no momento da leitura; 5572 px; busca/formulário, categorias e destaques | R2: produto search-first; texto estável com fallback, filtros/feedback, categoria e localização legíveis; reduzir motion em busca frequente. |
| www.encontreumtecnico.com.br | H1 «Precisou? Encontrou!»; 13066 px, 2 forms, muitos módulos de região/cadastro/prova | R4: caminho por problema/localização e cadastro, prova pública real; microinteração de escolha; manter diretório, migração e integração. |
| encontreumprofissional.com.br | H1 «Encontre um profissional para qualquer serviço»; 19534 px, 41 imagens, form e 31 botões | R4: revisar repetição editorial e navegação, preservar conteúdo factual/SEO, preço e funil; assinatura por jornada. Fonte bloqueada até confirmação. |
| www.encontreum.online | H1 «O que você precisa encontrar hoje?»; 2817 px, 1 form, 0 imagens no DOM | R4: busca é protagonista; estados e sugestões de alta intenção; não trocar clareza por hero de marketing, usar mídia apenas se útil. |
| precisodeumtecnico.com | H1 «Assistência Técnica Especializada»; 12169 px, form, 27 botões, jornada por problema e orçamento | R5: diagnóstico visual rápido + CTA contextual; prova, serviços e território claros; sem inventar disponibilidade/preço. |
| otecnicodeinformatica.com.br | H1 «Qual problema de tecnologia precisamos resolver hoje?»; 9683 px, 3 forms, 20 botões | R5: central de conhecimento/triagem, contraste de serviço/guia, feedback, transições curtas; manter links/SSR. |
| tecnicocuritiba.com.br | Home de resposta direta, preço R$ 99,99 exibido e CTA; 2300 px, 2 imagens | R5: não converter landing rápida em página longa; preservar anúncio, termos e contato; feedback e confiança, motion SUBTLE. Identificar repo efetivo. |
| www.mestredosservicos.com.br | H1 «Mestre dos Serviços / Solução Completa para Você»; 10233 px, 50 botões; localização indisponível no browser e fallback explícito | R6: composição utilitária, seleção problema+serviço/região, prova e FAQ; fallback de localização sempre funcional. |
| emporiolelecute.com.br | 7059 px, 40 imagens, 54 botões; hero poético «Pequenos mimos, grandes encantos» em H2 e nenhum H1 no snapshot | R8: direção artesanal tátil, galeria por ocasião, textura/mídia real; corrigir hierarquia semântica se confirmar no código; nunca tocar checkout/consentimento. |
| www.papelemi.com.br | H1 «Detalhes que viram memórias.»; 4689 px, 14 imagens; coleções, encomenda e privacidade | R8: editorial de papelaria e coleções, imagem-reveal sutil com fallback; preservar catálogo, política de encomenda e privacidade. |
| myhostvip.vercel.app | H1 sobre hospedagem de sites ilimitados; 5878 px, 2 imagens, comparação planos/oferta | R7: premium técnico, visualização de infraestrutura factual, feedback na comparação; verificar oferta e alegações; não alterar cobrança nem migrar preview SSR. |

### R2 — achados específicos de código no institucional PDP
Na revisão de src/pages/Index.tsx (blob 8472a89d2c9692f50a6a86133fe392cbb612afe9, 1415 linhas), a primitive Reveal aparece repetidamente (25 usos) e o Framer Motion já está presente. Entradas de hero/Reveal com dependência do estado inicial de opacity 0 merecem revisão SSR, JS desabilitado e reduced-motion. Há glow, shimmer e outros sinais decorativos competindo com conteúdo/CTAs; selecionar 3 signature moments e não repetir fade-up em todas as seções. LiveActivityBar contém números iniciais ('280 online', '16.700 conexões'), dayCurve, Math.random e incrementos simulados no código observado: não publicar métrica simulada como real; validar backend/telemetria autorizada ou rotular claramente ilustração ou retirar a representação dinâmica não factual, sem afetar o resto da oferta. Não enviar dados de usuários/leads a novo serviço.

## Contrato incremental Emil Kowalski — adoção de princípios, não instalação
Fonte original: https://github.com/emilkowalski/skills (emil-design-eng, find-animation-opportunities e animation-performance; leitura das instruções de referência). DECISÃO: ADOTADO_COMO_PRINCIPIO. Nada instalado, nenhum script/CLI/asset externo executado, sem dependência nova ou cópia de layout; instalação futura requer licença, versão fixa e security review. Complementa os tokens e a disciplina já canônica no 0WEB, não cria outro motion system.
- Perguntar primeiro **se precisa animar**; feedback, continuidade, orientação ou significado. Frequência de uso alta = menor duração/nenhum motion que atrase operação. UI frequente: 100–160 ms de feedback; ao entrar/fechar elemento 150–260 ms, coerente com tokens do repo; descrição/marketing até as durações 420/520 ms existentes quando justificado.
- Usar ease-out para entrada/resposta (curva enter já canônica), ease-in apenas quando saída contextual requer; não usar linear para entrada física. Evitar bounce/overshoot gratuito. Pressed perceptível, foco visível, hover apenas com hover real; não esconder funcionalidade.
- CSS/nativa/motion primitives existentes > dependência pesada. Preferir transform e opacity; clip-path quando houver razão e medição. Proibido transition: all, animar layout (width/height/top/left/margin), blur/filter caros em loop. Reservar dimensões de mídia; nenhum shift provocado por motion.
- Conteúdo SSR/HTML e primeira dobra legíveis sem JS e com prefers-reduced-motion; fail-open. Nada de ocultar texto comercial por opacity 0 inicial sem fallback. Preferir reduce estático ou fade curto, sem deslocamento/parallax/zoom/loops.
- No máximo 3 signature moments por superfície pública (hero, seção, interação). Max 1 grupo stagger/viewport, 1 loop somente justificado e com pausa/remoção, 1 parallax de até 32px desktop, nenhum parallax mobile. Perfil SUBTLE em fluxos repetitivos, BALANCED institucional, EXPRESSIVE somente em editorial/loja com identidade e mídia. IMMERSIVE não é meta.
- Matriz por página: fade-up, fade-left/right, blur-in, scale-in, stagger-up, image-reveal, clip-reveal, parallax, marquee, float, header-scroll, menu-reveal, text-line-reveal, progress-line; cada capacidade REQUIRED/OPTIONAL/NOT_APPLICABLE, motivo, fallback e custo. Find-animation-opportunities: 5–7 oportunidades prioritárias, relatório read-only antes do código, sem força de aplicação automática.
- Reutilizar a infraestrutura, NUNCA o esqueleto visual. Awwwards inspira qualidade de composição, tipografia, mídia, narrativa e acabamento, não é promessa de prêmio nem licença para cópia. Reprovar troca de cor/nome sobre a mesma silhueta.

## 10 rodadas fechadas (sem expansão)
| Nº | Alvo | Entrega verificável e condição de avanço |
|---|---|---|
| 1 | Inventário, auditoria baseline e contrato comum | Este relatório de escopo/verdade, mapa de produção, prioridade e bloqueios; zero UI alterada. |
| 2 | Preciso de um Profissional + PrecisoDeUm | Institucional duas jornadas + busca de plataforma; resolver canon/host primeiro, QA integral e micro-PRs. |
| 3 | 0WEB institucional + representantes do catálogo | Narrativa/prova, assinatura editorial e pilotos; preservar zona institucional e guardas de marca, sem copiar composições. |
| 4 | Encontre um Técnico, Encontre um Profissional, EncontreUm.online | Busca/localização/cadastro, hierarquia e motion contextual; reconciliar EUT release e identificar fonte Encontre um Profissional. |
| 5 | Preciso de um Técnico, O Técnico de Informática e variantes Técnico Curitiba | Classificar domínios/clone, triagem/CTA/SEO local, UX de resposta rápida. |
| 6 | Mestre dos Serviços e Autoescola Aptos | Problema/região e escolha de curso, CTAs e formulários; API marketing fora de UI. |
| 7 | MyHostVIP, TamoNaWeb e sistemas digitais ativos | Interfaces e fluxos úteis; validar status real dos demais apps, sem alterar forks/demos não canônicos. |
| 8 | Empório Lele Cute e PapeLemi | Catálogo, mídia, coleção, feedback e encomenda, preservação de regras de venda. |
| 9 | Portfólio 0WEB em lotes por slug | Revisão individual e derivativos: arte, prova, conteúdo, funil, capas/OG, identidade e gates. Nunca um template aplicado em massa. |
| 10 | QA consolidado e publicação controlada | CI, visual, acessibilidade, SEO/funil, release/rollback e SHA efetivo; matriz PASS/BLOCKED por superfície; nenhuma rodada extra. |

### Gate em cada micro-PR
1. Base atual e host/commit canônico verificados, diff restrito à jornada; preservar regras de negócio, logotipo e identidade, consentimento, APIs, dados, credenciais, RLS, pagamentos/checkout, URLs/redirects, analytics e SEO.
2. Captura antes/depois da composição integral em 390, 768 e 1440 px; verificar zero overflow, touch/teclado/foco, contraste, viewport/reduced-motion, sem JS quando possível, navegação/estados, menu e CTA/footer; três signature moments BEFORE/DURING/AFTER se aplicável. Não afirmar teste que não executou.
3. Build/typecheck/testes e gates existentes do repo, SSR/head/canonical/robots/sitemap/schema/OG e funil sem lead real não autorizado; testes de regressão, a11y e console. Para 0WEB/portfólio, validate:brand-integrity, validate:portfolio-boundaries, check:portfolio-uniqueness, check:portfolio-visual-quality, check:experience-standard e motion observed/readiness conforme escopo. Exceções não removem gates.
4. Medir baseline versus candidato: metas Core Web Vitals p75 LCP <= 2.5s, CLS <= 0.1, INP <= 200ms quando dados reais disponíveis; Lighthouse lab é apenas proxy, não prova INP/p75. Sem regressão relevante de performance ou aumento injustificado de bundle.
5. Não publicar enquanto checks, revisão e homologação do head candidato estiverem pendentes. Uma versão final por repo/ciclo; confirmar Vercel/host real independentemente, HTTP, SHA/branch, CTA e rollback do último deploy saudável. Não promover projeto de preview nem trocar DNS. Registrar bloqueios sem forçar merge.

## Cobertura dos outros repositórios (inventário, não auditoria visual)
Classificar sem edição: ativos/candidatos acima; versões espelho e experimentos só recebem mudança se forem prova da fonte ativa. Repositórios de skills/referências/forks não são clientes comerciais automaticamente. Apps sem host confirmado podem ser auditados por código/CI na R7; se não houver fonte/publicação válidas, estado BLOCKED/REFERENCE_ONLY, nunca PASS inventado. Lista completa abaixo.

- `hrq16000-a11y/encontre_um-online` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/Projeto-Encontre-um` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/precisodeum_old` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/MoneyPrinterV2` — ferramenta de apoio/experimento — R7 se ativo; sem redesign de landing automático
- `hrq16000-a11y/crmkimi` — aplicação/experimento — validar atividade na R7
- `hrq16000-a11y/precisodeum_n` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/autoescolaaptos` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/emporiolelecute` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/myhostvip` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/encontreumtecnico` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/emporiolelecute-2026` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/autoescolaaptos-2026` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/How-to-Clone-Website---Claude-Skills` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/headshots-starter-clone` — aplicação/experimento — validar atividade na R7
- `hrq16000-a11y/weathergpt` — aplicação/experimento — validar atividade na R7
- `hrq16000-a11y/liftoff` — aplicação/experimento — validar atividade na R7
- `hrq16000-a11y/reanimate` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/agentskills` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/guia-interativo-de-carreiras` — aplicação/experimento — validar atividade na R7
- `hrq16000-a11y/impeccable` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/skills` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/skills2` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/react-bits` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/wasm-utils` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/gatsby-netlifycms` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/gsap-skills` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/img2threejs` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/motion-design-skill` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/claude-plugins-official` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/Claude-Code-Frontend-Design-Toolkit` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/interface-design` — referência técnica/skill/infra — sem redesign automático
- `hrq16000-a11y/DeskcommCRM` — aplicação/experimento — validar atividade na R7
- `hrq16000-a11y/papelemi` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/papelemi-2026` — produto/candidato ou variante — matriz acima
- `hrq16000-a11y/precisdeumprofissional` — produto/candidato ou variante — matriz acima
- `hrq16000/TamoNaWeb` — produto/candidato ou variante — matriz acima
- `hrq16000/tecnicocuritiba` — produto/candidato ou variante — matriz acima
- `hrq16000/winaceleradora` — aplicação/experimento — validar atividade na R7
- `hrq16000/tecnicocuritiba_2026` — produto/candidato ou variante — matriz acima
- `hrq16000/tecnicocuritiba.br_2026` — produto/candidato ou variante — matriz acima
- `hrq16000/precisodeumtecnico_2026` — produto/candidato ou variante — matriz acima
- `hrq16000/otecnicodeinformatica_2026` — produto/candidato ou variante — matriz acima
- `hrq16000/zeroweb-2026` — produto/candidato ou variante — matriz acima
- `hrq16000/mestresdosservicos` — produto/candidato ou variante — matriz acima
- `hrq16000/tecnicocuritiba-com-br` — produto/candidato ou variante — matriz acima

## Estado no encerramento da fase documental
- GitHub/Vercel: inventário e sete mapeamentos SHA verificados. Homes públicas observadas: 13; revisão visual de todos breakpoints/de todos os fluxos **pendente, por rodada**. Sem declaração de qualidade premium ou de performance verificada ainda.
- Lovable list_workspaces retornou erro interno em tentativas de leitura. Nenhuma edição/crédito de geração usado. Para hosts não identificados, confirmar conexão/repo por evidência antes de alterar.
- O runner não possui checkout autenticado via gh/git; conector GitHub de leitura/escrita disponível. CI/preview autorizado deverá fornecer evidências no head candidato; não simular build local executado. Bun não disponível no runner atual; preservar bun.lock quando projeto usa Bun.
- Acesso público 1001 Soluções não concluído; origem não identificada. Outros hosts não mapeados ficam condicionados à identificação antes da edição, com escopo da rodada mantido.
- A revisão documental não altera runtime/produção. PR pequena, revisar diff documental; acumular integração conforme política Git-first. R2 começa com diagnóstico do institucional PDP e identificação de canon/host da plataforma.

## Preflight R2 — evidência adicional (sem implementação)
- `precisdeumprofissional`: README referencia explicitamente o domínio e H1/CTAs/ordem observados coincidem com `src/pages/Index.tsx`; main atual identificada `601a230c370b21a43893deefd9a9ef41c332f33e`. A Vercel não possui deployment para o domínio, e `public/api/seo-health.json` versionado tem `build.commit: null` (não prova runtime). A origem Lovable é provável pelo histórico de commits, mas o workspace não pôde ser listado. Não presumir que main é o SHA em produção.
- `precisodeum_old`: main `8a5ce21e6d2300397ea42224c0d7ccf953699f45`, em atividade recente, rota TanStack e o `HeroBanner` contém `RotatingServiceText`, fundo `picture` responsivo, busca crítica com upgrade, urgência e região, coincidindo com o H1 rotativo da home pública. `_n` (main `983d30ce5423a7a5d3b3e9500731b66831144948`) tem hero alternativo padrão «Encontre profissionais para qualquer serviço», Framer Motion com opacity 0 inicial, sem o mesmo rotator. A evidência favorece `_old` mas não prova o SHA efetivamente publicado. Não alterar `_n` por suposição.
- `SocialProofToast.tsx` no institucional contém templates de supostos contatos/buscas vinculados a cidades escolhidas aleatoriamente, sem prova de atividade real nessa implementação. Tratar como achado de integridade/UX, além do LiveActivityBar. Testemunhos hardcoded em Index.tsx precisam de origem verificada antes de reforçá-los visualmente (hardcoded não demonstra falsidade). Não fabricar validação, remoção de conteúdo factual ou novas métricas.
- 7 oportunidades prioritárias para o institucional: (1) H1 sempre visível, contraste tipográfico/autoral; (2) hero assimétrico que expressa dois públicos, dois CTAs com mesma telemetria/destinos; (3) retirar shimmer/glow/sparkles e pulse/bounce repetitivos, manter resposta interativa de 100–160ms; (4) Reveal fail-open, seleção de uma assinatura de scroll contextual, sem esconder conteúdo; (5) conectar os cards de público e prova/FAQ através de ritmo e hierarquia, sem remover rotas, patrocinadores e conteúdo útil; (6) substituir prova dinâmica simulada por fatos/ilustração identificada e não interromper leitura; (7) geolocalização e CTA acessíveis com fallback e foco, menu/FAQ touch e reduced motion verificados.
- Lovable conector retornou INTERNAL_ERROR; a tentativa de abrir seu portal de gestão no browser mostrou a página pública com Entrar/ Começar, sem lista autenticada. Não iniciar login, operação de edição, preview pago, Max mode, nem modificar os sites antes da confirmação de origem. A confirmação dos vínculos e acesso a um runner/preview compatível são a pendência objetiva para R2. O limite continua 10; preflight não é rodada extra.
