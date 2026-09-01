# Skill changelog / usage log

## 2026-09-01 — ordem do conteúdo, autenticidade e capas únicas do portfólio

- **Correção estrutural:** `PortfolioStandardShell` agora apresenta o bloco
  “Sobre o projeto” no início, envolve o conteúdo do cliente em uma fronteira
  única, oculta rodapés legados e encerra cada página com um único rodapé
  canônico após o Kit de Presença.
- Controles flutuantes observam exclusivamente o rodapé canônico
  (`data-portfolio-canonical-footer`), evitando sobreposição e falsos gatilhos
  causados por rodapés legados ocultos.
- **Autenticidade pública:** os 62 registros do catálogo foram normalizados
  como projetos reais, sem selos ou descrições de “amostra/conceito”; copy de
  prova e CTAs também foram particularizados para cada slug.
- **Capas e identidade:** capas OG geradas para lotes legados passaram a usar
  ilustração relacionada ao segmento, nome, cidade e serviços do próprio
  projeto; nenhuma capa aponta para `/images/concepts/` ou é compartilhada.
- **Conteúdo legado:** removidos placeholders “Substitua por...” e linguagem de
  conceito nas páginas de brechós, alimentação e pizzaria; a seção de papelaria
  da SOS agora descreve o Kit de Presença sem atribuir aprovação inexistente.
- **Skills/padrões:** `sites-building` (arquitetura de site existente),
  `0web-skill-router`, `0web-skill-discovery`, `0web-design-system`,
  `0web-ui-quality-gates`, `PORTFOLIO_CLIENT_STANDARD`,
  `PORTFOLIO_PRESENCE_KIT_STANDARD`, `PORTFOLIO_CONVERSION_INTELLIGENCE_STANDARD`
  e `PORTFOLIO_CONVERSION_NARRATIVE_STANDARD`.

## 2026-09-01 — Liz Moraes Nail Designer

- **Adição:** projeto oficial e público `/portfolio/liz-moraes-nail-designer` para manicure, pedicure, spa dos pés, esmaltação em gel e molde F1 no Centro de São José dos Pinhais.
- **Identidade:** logo exclusiva e prévia social horizontal geradas com `imagegen`, além da arte de serviços fornecida pelo negócio; paleta preto, rosé e rose-gold coerente com a marca.
- **Conversão:** quiz de agendamento próprio, CTAs por etapa, prova social e narrativa sem misturar segmentos; divulgação exclusiva do projeto.
- **Proteção:** telefone operacional não é embutido no bundle público; preços e endereço exibidos são somente os dados fornecidos no material do cliente.

## 2026-09-01 — L&J Cleaning

- **Adição:** projeto oficial `/portfolio/lj-cleaning` para higienização de sofás, limpeza automotiva, colchões, tapetes, carpetes e puffs.
- **Identidade:** logo própria em azul e laranja, com a arte fornecida pelo negócio vinculada como imagem principal.
- **Conversão:** funil, narrativa e divulgação exclusivos; telefone operacional permanece somente no servidor.

## 2026-09-01 — Galileu Locação de Brinquedos

- **Adição:** projeto oficial `/portfolio/galileu-locacao-brinquedos` para locação de tobogã inflável, cama elástica, piscina de bolinhas e outras atrações para festas.
- **Identidade:** logo própria gerada com `imagegen`, com paleta azul, amarela e multicolorida coerente com a arte fornecida.
- **Conversão:** funil, narrativa, divulgação e CTA exclusivos; telefone operacional permanece somente no servidor.

## 2026-09-01 — MIRO TECH

- **Adição:** projeto oficial `/portfolio/miro-tech` para manutenção de TVs, computadores, micro-ondas e recuperação de dados em São José dos Pinhais.
- **Identidade:** logo própria em preto, branco e verde-limão, com arte fornecida pelo negócio como hero.
- **Conversão:** funil, narrativa e divulgação exclusivos, com seção de presença digital preparada para futuras redes sociais oficiais.
- **Proteção:** telefone operacional permanece somente no servidor; nenhum preço, avaliação, depoimento ou promessa adicional foi inventado.

## 2026-09-01 — Premium Envelopamentos

- **Adição:** projeto oficial `/portfolio/premium-envelopamentos` para plotagem de móveis, envelopamento de geladeiras e comunicação visual em Curitiba e região.
- **Identidade:** logo própria gerada com `imagegen`, hero fornecido pelo negócio e galeria complementar coerente com o serviço.
- **Conversão:** CTA/funil exclusivo, narrativa própria, divulgação exclusiva e bloco do Instagram oficial `premiumenvelopamentos`.
- **Proteção:** telefone operacional permanece somente no servidor; a página não inventa preço, avaliação, depoimento ou promessa além dos dados fornecidos.

## 2026-09-01 — padrão de conversão e inteligência de portfólios

- **Classificação:** `portfolio-client-site`, `funnel`, `content/SEO`, `accessibility-fix`, `docs`.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates` e revisão de referência em navegador.
- **Alteração:** formalizada a sequência de conversão (benefício, dois CTAs, serviços, prova real, oferta confirmada e CTA final), leitura semântica por mecanismos/LLMs e a regra de que links sem URL pública real devem abrir o funil seguro do próprio cliente.

## 2026-09-01 — padrão de Kit de Presença

- **Classificação:** `docs`, `portfolio-client-site`, `content/SEO`.
- **Skills:** `0web-skill-router`, `0web-design-system` e `0web-ui-quality-gates`.
- **Alteração:** formalizado o contrato para copy exclusiva, imagem social própria e mockups conceituais de cartão/panfleto por cliente, incluindo o cadastro mínimo para lotes de comércios sem presença digital.

## 2026-09-01 — compartilhamento promocional e galeria de portfólios

- **Classificação:** `portfolio-client-site`, `component-refactor`, `content/SEO`, `accessibility-fix`.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates` e `imagegen`.
- **Direção:** catálogo como galeria visual, com cards orientados pela imagem e ações secundárias compactas; em cada site, o botão universal permanece discreto para não competir com o CTA do cliente.
- **Alterações:** uma fonte canônica gera a mensagem de divulgação com nome, resumo, tags e URL do cliente; o botão copia essa mensagem no site individual e no card do catálogo. A&G Electrical Services recebeu nova arte social editorial, substituindo o recorte de documento técnico.
- **Validação:** `validate-portfolio-assets`, `validate-portfolio-boundaries`, `validate-portfolio-catalog` e `validate-portfolio-meta` aprovados. Não há Bun funcional neste ambiente para executar a suíte completa/build; o CI permanece responsável por esses gates.

## 2026-08-30 — ciclo 1: segurança, RLS e governança de dados

- **Classificação:** `backend/RLS`, `dashboard`, `bugfix`, `docs`.
- **Skills:** `0web-skill-router`, `0web-skill-discovery`, `supabase` e `pdf`. Nenhuma skill externa foi instalada: o catálogo local cobre o escopo e fontes de marketplace não adicionariam controle verificável.
- **Achado global:** `listServiceCatalog` usava cliente privilegiado de servidor sem middleware de sessão. Agora exige usuário autenticado e super administrador, preservando a RLS como defesa em profundidade.
- **RLS:** importada a migration `20260830034105_06cdf2fa-f0ef-49c1-a8bc-e1d34a07cdec.sql`, que restringe leitura de `service_catalog` e consolida UPDATE autorizado em `lead_submissions`.
- **Governança:** criada a rota protegida `/app/auditoria/acessos`; CRM e catálogo registram metadados de leitura/escrita em `audit_logs`, sem repetir PII ou conteúdo de notas.
- **Teste:** adicionado `tests/rls/sensitive_data_access.test.ts` e `test:rls-sensitive`. Exige credenciais de ambiente de teste e faz limpeza em `finally`; sem service role retorna `SKIP`, nunca aprovação implícita.
- **Reescaneamento:** `scan-source-privacy` aprovado; `validate-client-privacy` aprovou o bundle público, com dois avisos confinados a chunks administrativos. A auditoria de dependências ficou pendente porque este ambiente não dispõe de Bun/npm funcional e o projeto usa `bun.lock`.
- **PDF:** `output/pdf/relatorio-seguranca-ciclo-1-2026-08-30.pdf` criado, renderizado e revisado visualmente em duas páginas.

## 2026-08-30 — ciclo de reconciliação Lovable e blindagem do portfólio

- **Tarefa:** reconciliar as alterações feitas pelo Lovable, impedir regressões globais e avançar o ciclo de performance, SEO e qualidade de `/portfolio`.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, Apple HIG/accessibility, React Best Practices e Browser QA.
- **Reconciliação:** `santos-montador-de-moveis` confirmado nos contratos de cliente, catálogo e assets, com funil e prova social próprios; 30 sites independentes permanecem parametrizados.
- **Correções:** busca SSR de `/portfolio` passou a usar search params validados pela rota, eliminando mismatch de hidratação; filtragem/ordenação foram memorizadas e diferidas; apenas a primeira imagem recebe prioridade; logo da Águia Sul passou pelo componente otimizado; favicons pesados de Renata Beauty foram trocados por WebP.
- **Dependências:** `@tanstack/react-router-ssr-query` foi fixado em `1.167.1`, `@tanstack/query-core` foi declarado diretamente em `5.101.4` e o `package-lock.json` regenerado para ficar consistente com o `bun.lock`, evitando versões duplicadas ou incompatíveis no build SSR.
- **Resiliência:** o scanner de privacidade ganhou fallback de leitura direta de `src/` quando o índice Git do OneDrive estiver indisponível.
- **Validação:** TypeScript; build client/SSR; boundaries, catálogo, meta, scaffold, standards, performance, assets e privacidade; auditoria local de indexabilidade 30/30; QA visual mobile de catálogo, Santos e Chyrley sem overflow, funil cruzado ou sobreposição no crédito 0WEB.

## 2026-08-28 — novo portfolio Açaí Total Araucária

- Página de delivery para copões e litrões de açaí em Araucária.
- Cardápio digital, CTA de pedido, motion, SEO local, prova social e funil próprio.
- Fotos e logo fornecidas otimizadas em WebP; telefone protegido em `ACAI_TOTAL_ARAUCARIA_WHATSAPP_NUMBER`.

## 2026-08-28 — novo portfolio Mary Diarista

- Página para diárias, pós-obra, pós-mudança e organização em Curitiba.
- Agenda parametrizada para quintas-feiras, clientes semanais, quinzenais e atendimentos esporádicos.
- Arte otimizada em WebP, funil individual, prova social, SEO local e motion mobile-first.
- Telefone protegido server-side em `MARY_DIARISTA_WHATSAPP_NUMBER`.

## 2026-08-28 — novo portfolio Eisenfer Tubos e Aços

- Página de catálogo B2B para tubos, perfis, chapas e telhas metálicas em São José dos Pinhais.
- Skills: `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, otimização mobile-first.
- Artes reais otimizadas em WebP, funil de cotação, prova social, SEO local, catálogo e links oficiais.
- Telefone protegido server-side em `EISENFER_TUBOS_ACOS_WHATSAPP_NUMBER`.

## 2026-08-28 — novo portfolio Eletro Soluções Eficazes

- Página para instalações, iluminação, manutenção e automação elétrica em Pinhais e região.
- Skills: `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, performance mobile-first.
- Arte fornecida otimizada em WebP, funil individual, prova social, SEO local e Instagram oficial.
- Telefone protegido server-side em `ELETRO_SOLUCOES_EFICAZES_WHATSAPP_NUMBER`.

## 2026-08-28 — novo portfolio Eletrovale Eletromecânica

- Página industrial para manutenção e rebobinamento de bombas, motores, motoredutores e motofreios.
- Skills: `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, performance mobile-first.
- Foto real otimizada em WebP, funil individual, prova social, SEO local e canais oficiais.
- Telefone protegido server-side em `ELETROVALE_ELETROMECANICA_WHATSAPP_NUMBER`.

## 2026-08-28 — novo portfolio Águia Sul Sinalização

- **Tarefa:** criar presença B2B para pintura e sinalização horizontal em Curitiba e região.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, otimização mobile-first.
- **Alterações:** página exclusiva com motion, logo fornecida otimizada em WebP, serviços de estacionamento/pintura industrial, funil, prova social, SEO local e catálogo.
- **Privacidade:** telefone/e-mail não entram no bundle; produção requer `AGUIA_SUL_SINALIZACAO_WHATSAPP_NUMBER` server-side.

## 2026-08-28 — novo portfolio Diego Montador de Móveis

- **Tarefa:** criar site independente para montagem/desmontagem de móveis, consertos e instalações no Sítio Cercado, Curitiba.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, `imagegen`, performance mobile-first.
- **Alterações:** página exclusiva com motion, capa editorial gerada e otimizada em WebP, catálogo/SEO/sitemap, funil individual, prova social e popup de captação 0WEB.
- **Privacidade:** telefone não entra no bundle; produção requer `DIEGO_MONTADOR_MOVEIS_WHATSAPP_NUMBER` server-side.

## 2026-08-28 — novo portfolio Espaço CIH & LUH

- **Tarefa:** criar site para o casal das unhas, com alongamento em gel, reconstruções, pedicure e cuidados podológicos.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, performance mobile-first.
- **Alterações:** oferta de 10% OFF para as 10 primeiras clientes, arte fornecida otimizada em WebP, CTA/funil próprio, prova social, SEO, sitemap e assets por cliente.
- **Privacidade:** telefone não entra no bundle; destinatário será resolvido por secret server-side `ESPACO_CIH_LUH_WHATSAPP_NUMBER`.

## 2026-08-28 — atualização promocional Renata Beauty

- **Tarefa:** atualizar oferta de extensão de cílios para Volume Brasileiro, Egípcio ou Fox Eyes por R$ 100,00.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, otimização mobile-first.
- **Alterações:** nova arte promocional em WebP aplicada ao hero e aos metadados sociais, copy de oferta atualizada e CTA preservado.

## 2026-08-28 — novo portfolio Salão da Marcia

- **Tarefa:** criar site local de beleza em Cidade Jardim, São José dos Pinhais, com depilação, cabelos, pé e mão.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, performance mobile-first.
- **Alterações:** componente exclusivo, três artes fornecidas otimizadas para WebP, CTA/funil próprio, prova social, SEO, sitemap e assets por cliente.
- **Privacidade:** telefone não entra no bundle; destinatário será resolvido por secret server-side `SALAO_DA_MARCIA_WHATSAPP_NUMBER`.

## 2026-08-28 — novo portfolio No Brilho Higienização

- **Tarefa:** criar site local para higienização profissional de estofados a domicílio em São José dos Pinhais.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, performance mobile-first.
- **Alterações:** componente exclusivo, arte fornecida otimizada para WebP, CTA/funil próprio, prova social, SEO, sitemap e assets por cliente.
- **Privacidade:** telefone não entra no bundle; destinatário será resolvido por secret server-side `NO_BRILHO_HIGIENIZACAO_WHATSAPP_NUMBER`.

## 2026-08-28 — novo portfolio Ecommerce On

- **Tarefa:** criar site de cliente para agência digital com SEO, e-commerce, mídia, conteúdo e automação.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, performance mobile-first.
- **Alterações:** componente exclusivo com imagens fornecidas, CTA/funil próprio, prova social, SEO, sitemap e assets WebP.
- **Privacidade:** telefones das filiais não entram no bundle; destinatários serão resolvidos por secret server-side `ECOMMERCE_ON_WHATSAPP_NUMBER`.
- **Validação:** executar validadores de catálogo, boundaries, assets e TypeScript antes do merge.

## 2026-08-28 — novo portfolio Paulo Mestre de Obras

- **Tarefa:** criar site de cliente para pedreiro, azulejista, construção civil, reformas e reparos.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, performance mobile-first.
- **Alterações:** componente exclusivo, imagem anexada otimizada para WebP, CTA/funil próprio, prova social, SEO, sitemap e assets por cliente.
- **Privacidade:** telefone não entra no bundle; destinatário será resolvido por secret server-side `PAULO_MESTRE_DE_OBRAS_WHATSAPP_NUMBER`.
- **Validação:** executada após integração do catálogo, rota, assets e migration.

## 2026-08-28 — novo portfolio Lucas Arruma Máquina de Lavar

- **Tarefa:** criar site de cliente para diagnóstico, conserto e manutenção de máquinas de lavar.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, imagegen/performance mobile-first.
- **Alterações:** componente exclusivo, imagem anexada otimizada para WebP, CTA/funil próprio, prova social, SEO, sitemap e assets por cliente.
- **Privacidade:** telefone não entra no bundle; destinatário será resolvido por secret server-side `LUCAS_ARRUMA_MAQUINA_LAVAR_WHATSAPP_NUMBER`.
- **Validação:** executada após integração do catálogo, rota, assets e migration.

## 2026-08-28 — novo portfolio Chyrley Doces & Festas

- **Tarefa:** criar site de cliente para bolos, kits festa, salgados, docinhos e Copo da Felicidade em Rio Bonito.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, imagegen e performance mobile-first.
- **Alterações:** slug `confeitaria-chyrley`, componente exclusivo, capa e galeria com imagens reais anexadas, imagem complementar gerada sem texto, CTA/funil próprio, prova social, SEO, sitemap e assets WebP.
- **Conteúdo:** hero de conversão, ofertas, galeria, modalidades de retirada/envio, pagamento e fluxo de encomenda.
- **Privacidade:** telefone não entra no bundle; destinatário será resolvido por secret server-side `CONFEITARIA_CHYRLEY_WHATSAPP_NUMBER`. Perfis sociais não foram inventados.
- **Validação:** pendente executar após preencher a secret de produção e validar migration no ambiente Supabase.


## 2026-08-28 — pedidos extensos sem rejeição no funil

- O contrato server-side de `answers.service` passou de 180 para 4000 caracteres, alinhado ao limite já aplicado ao `orderContext.order_items`.
- Novos leads registram `metadata_json.funnel_slug = portfolio-<clientKey>`, além do `client_key` e contexto estruturado.
- O painel prefere o slug persistido e mantém fallback compatível para leads anteriores.


## 2026-08-28 — paridade da prévia e mensagem final dos portfolios

- Corrigida a prévia “sua mensagem está personalizada”, que ainda usava copy antiga.
- Todos os `PortfolioCTAQuiz` passam a mostrar nome do cliente, URL completa, elogio “A página é linda, parabéns!” e localização estimada.
- Geo-IP silencioso passou a aceitar bairro (`district`/`suburb`/`neighborhood`) além de cidade e região; ausência de dado mantém fallback sem localização.
- O gerador final server-side recebeu a mesma frase, evitando divergência entre prévia e mensagem enviada.


## 2026-08-28 — painel de leads com contexto de pedido e cliente

- O funil de portfolio aceita `orderContext` estruturado e o Paraíso do Hot Dog envia itens, total, modalidade e observação em campos próprios.
- O painel identifica leads pelo slug virtual `portfolio-<clientKey>` e pelo nome do cliente, preservando o mecanismo compartilhado sem agrupar tudo como `funnel-service`.
- Filtros do painel aceitam os slugs virtuais sem alterar a consulta dos funis institucionais.


## 2026-08-28 — correção do pedido Paraíso do Hot Dog

- Removido truncamento fixo de 175 caracteres que cortava listas grandes, modalidade e total.
- A observação do carrinho (endereço, troco e instruções) passa a acompanhar o resumo enviado ao funil.
- O quiz usa `proposalKind: service`, evitando classificar pedidos como campanha/funnel-service genérico.


## 2026-08-28 — documentação consolidada da parametrização global

- **Tarefa:** documentar o contrato completo de `/portfolio/<slug>` e do CTA/funil.
- **Skills:** `0web-skill-router`, `0web-ui-quality-gates`, design system, acessibilidade, responsivo e performance.
- **Documentado:** shell compartilhado, isolamento de identidade, mensagem com nome/URL/elogio, geo-IP silencioso, resolução server-side, prova social, popup 0WEB, SEO, sitemap, assets, mídia, motion, performance, filtros e onboarding de novos clientes.
- **Validação:** boundaries, meta, assets, Schema.org, canonicals, rotas e `git diff --check`.


## 2026-08-27 — Fundação skills-first

**Task:** criar infraestrutura canônica de skills, registry, roteamento,
segurança e design docs para o ecossistema 0WEB.

**Skills considered:** frontend-design, ui-craft, apple-design-skill,
tasteful-ui, open-design, uxui-principles, ux-discovery, vercel agent-skills,
ui-ux-agent-skill-system, Figma MCP skills, K-Dense ui-ux-design.

**Skills used:** princípios de `frontend-design` (direção estética explícita,
anti-AI-slop), `ui-craft` (tokens, responsivo, motion, a11y, polish),
Apple HIG local (`.design-rules/`) para hierarquia, foco, estados e touch
targets, Vercel `composition-patterns`/`react-best-practices` para as regras de
API de componente e performance.

**Skills rejected:** downloads externos e ZIPs não auditados (risco de execução
de código de terceiros); `K-Dense ui-ux-design` (upstream indisponível);
Figma MCP (sem sessão desktop ativa neste ambiente).

**Changes:** `.agents/skills/{0web-skill-router,0web-design-system,0web-ui-quality-gates}`,
`docs/skills/*`, `docs/design/*`, seção de roteamento no `AGENTS.md`.

**Validation:** ver seção de execução no PR (typecheck, `bun test`,
`bun run validate:portfolio-boundaries`).

**Template para próximas tarefas**

```text
TASK:
SKILLS CONSIDERED:
SKILLS USED / WHY:
FINDINGS (CRITICAL/HIGH/MEDIUM/LOW):
CHANGES:
VALIDATION (comandos + saída real):
SKILLS REJECTED / REASON:
```

## Automação e validação de /portfolio

- Skills: `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`.
- Entregas: gerador `scaffold:portfolio`, validador estrutural
  `validate:portfolio-scaffold` (no prebuild), E2E de pop-up, regressão visual,
  auditoria axe-core, budgets Lighthouse ampliados, painel de performance dos
  portfólios e página viva do design system.
- Validação: `bun test` (183 pass), `validate:portfolio-boundaries`,
  `validate:portfolio-meta`, `validate:portfolio-scaffold`, typecheck e build.

## 2026-08-27 — Descoberta dinâmica de skills

**Task:** substituir o catálogo estático por um processo de descoberta, ranking,
revisão de segurança e composição dinâmica de skills.

**Changes:** nova skill `.agents/skills/0web-skill-discovery` (pipeline
TASK→CLASSIFY→FIND→RANK→SECURITY→SELECT→EXECUTE→CROSS-REVIEW→TEST→VISUAL QA→SHIP,
modelo de autoridade por camada, landing page policy evidence-first, regra
anti-redundância, cross-review); `Step 1.5` no `0web-skill-router`; novo vocabulário
de status e fila de auditoria em `docs/skills/REGISTRY.md`.

**Skills rejected:** nenhuma instalada nesta rodada — as 11 candidatas entram como
`SECURITY_REVIEW_REQUIRED`/`REFERENCE_ONLY`/`REDUNDANT` até revisão do repositório original.

**Validation:** `bun test` + typecheck (docs/skills only, sem impacto de runtime).

## Governança de skills + gates do pop-up

- Tarefa: dashboard de skills, relatório evidence-first, testes de pipeline,
  guardrails de landing, scanner de privacidade pré-build, métricas temporais,
  simulação/amostragem, canais de alerta e integração ao CI.
- Skills usadas: `0web-skill-router` (classificação e stack),
  `0web-design-system` (tokens e componentes dos painéis),
  `0web-ui-quality-gates` (estados, foco, alvos ≥44px, evidência),
  `.design-rules` Apple HIG (revisão de hierarquia e leitura).
- Skills rejeitadas: landing-page skills (tarefa não é landing) e todas as de
  status `SECURITY_REVIEW_REQUIRED`/`QUARANTINED` (sem auditoria da origem).
- Validação real: `bun test` 216 pass / 0 fail; `bunx tsgo --noEmit` limpo;
  `bun run build` com todos os gates OK e bundle público sem contatos;
  `bun run scan:source-privacy` OK; `bun run test:e2e:portfolio-popup`
  7 sites OK; verificação visual dos painéis sem erros de console.
- Relatório evidence-first: `docs/skills/evidence/popup-governanca.md`.
# 2026-08-27 — monitoramento e Lighthouse de portfólios

# 2026-08-27 — contrato canônico do catálogo

# 2026-08-27 — catálogo mobile-first (ciclo 3)

- `/portfolio` passou a derivar identidade, segmento e tipo do catálogo canônico.
- Adicionados filtro por tipo, ordenação A–Z, query params e carregamento incremental de cards.
- Mantido o fallback visual legado durante a migração de conteúdo, evitando regressão de imagens/copy.
- Gates de catálogo, boundaries, metadata e performance aprovados.

- Criado `src/config/portfolio-catalog.json` com metadados de descoberta para 10 itens.
- Adicionado `validate:portfolio-catalog` ao prebuild e ao workflow de gates.
- O gate verifica campos obrigatórios, slugs únicos/válidos, tags e cobertura de clientes registrados.
- A migração dos cards da rota para essa fonte única fica planejada para o próximo ciclo, evitando alterar dados históricos sem revisão.

- Skills aplicadas: `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates` e padrão oficial de clientes.
- Implementado: captura nativa de LCP/CLS/INP por slug, ingestão server-side limitada, Lighthouse CI para todos os slugs registrados e upload de relatórios JSON/HTML.
- Validação: `validate:portfolio-boundaries`, `validate:portfolio-meta` e `validate:portfolio-performance` aprovados. Build local iniciou e regenerou `routeTree.gen.ts`; typecheck completo ficou limitado pelo tempo do ambiente.
- Publicação: depende de `LHCI_TARGET_URL` apontando para o deploy/preview; nenhuma credencial ou deploy foi inventado.

# 2026-08-28 — catálogo canônico, Web Vitals e gates (ciclo 4)

## 2026-08-28 — novo portfolio LK Alvenaria

- **Tarefa:** criar site independente para construção civil, fundação, alvenaria, concretagem, revestimentos, drywall, calçadas e reformas.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, motion/responsivo e otimização mobile-first de imagens.
- **Alterações:** slug `lk-alvenaria`, página exclusiva, catálogo, sitemap, SEO local, imagem social/ícone próprios, galeria real da obra em WebP, funil de orçamento individual, prova social e crédito 0WEB.
- **Conteúdo:** contrato, emissão de nota fiscal, garantia, compromisso, transparência e orçamento personalizado conforme material fornecido.
- **Privacidade:** telefone e e-mail não entram no bundle; produção requer secret server-side `LK_ALVENARIA_WHATSAPP_NUMBER`.
- **Validação:** executar boundaries, meta, catálogo, assets, typecheck e diff antes do PR.

## 2026-08-28 — novo portfolio Vila da Capivara

- **Tarefa:** criar site independente para confeitaria, kits festa, bolos, brigadeiros gourmet e salgados em Campo Comprido, Curitiba.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, motion/responsivo e otimização mobile-first de imagens.
- **Alterações:** slug `vila-da-capivara`, página exclusiva, catálogo, sitemap, SEO local, imagem social/ícone próprios, galeria de kits reais em WebP, funil individual, prova social e crédito 0WEB.
- **Conteúdo:** kits para 10, 20, 50, 70 e 100 pessoas com preços fornecidos; domínio `viladacapivara.com` e Instagram oficial informados pelo cliente.
- **Privacidade:** telefone não entra no bundle; produção requer secret server-side `VILA_DA_CAPIVARA_WHATSAPP_NUMBER`.
- **Validação:** executar boundaries, meta, catálogo, assets, typecheck e diff antes do PR.

## 2026-08-28 — novo portfolio A&G Electrical Services

- **Tarefa:** criar site independente de elétrica geral, infraestrutura de redes, cabeamento UTP, CFTV e organização de racks.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, motion/responsivo e otimização mobile-first de imagens.
- **Alterações:** slug `ag-electrical-services`, página exclusiva, catálogo, sitemap, SEO local, logo/OG próprios, portfólio Laserway real otimizado em WebP, funil técnico individual, prova social e crédito 0WEB.
- **Conteúdo:** soluções residenciais, prediais, comerciais e industriais; galeria de racks e infraestrutura fornecida pelo cliente.
- **Privacidade:** telefone fornecido não entra no bundle; produção requer secret server-side `AG_ELECTRICAL_SERVICES_WHATSAPP_NUMBER`.
- **Validação:** executar boundaries, meta, catálogo, assets, typecheck e diff antes do PR.

## 2026-08-28 — novo portfolio Refrigeração Maresia

- **Tarefa:** criar site independente para manutenção e conserto de geladeiras e freezers em Curitiba e Região Metropolitana.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, motion/responsivo e otimização mobile-first de imagens.
- **Alterações:** slug `refrigeracao-maresia`, página exclusiva, catálogo, sitemap, SEO local, ícone/OG próprios, imagem real otimizada em WebP, funil de diagnóstico individual, prova social e crédito 0WEB.
- **Conteúdo:** recarga de gás, troca de motor, troca de sensor, manutenção preventiva/corretiva e valor inicial de R$ 150 conforme arte fornecida.
- **Privacidade:** telefone fornecido não entra no bundle; produção requer secret server-side `REFRIGERACAO_MARESIA_WHATSAPP_NUMBER`.
- **Validação:** executar boundaries, meta, catálogo, assets, typecheck e diff antes do PR.

## 2026-08-28 — novo portfolio Studio de Cílios

- **Tarefa:** criar página independente para extensão de cílios com os serviços Mega Brasileiro, Mega Egípcio, Mega Fox Eyes e Fio a Fio.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, motion/responsivo e otimização mobile-first de imagens.
- **Alterações:** slug `studio-de-cilios`, página exclusiva, catálogo, sitemap, SEO, ícone/OG próprios, galeria real otimizada em WebP, CTA/funil individual, prova social e crédito 0WEB.
- **Conteúdo:** preços reais das artes (R$ 130 e R$ 100), navegação por estilos, galeria de referências, processo de atendimento e agendamento.
- **Privacidade:** telefone fornecido não entra no bundle; produção requer secret server-side `STUDIO_DE_CILIOS_WHATSAPP_NUMBER`. Nome comercial/cidade não foram inventados além do título neutro informado.
- **Validação:** executar boundaries, meta, catálogo, assets, typecheck e diff antes do PR.

## 2026-08-28 — novo portfolio MP Festas e Eventos

- **Tarefa:** criar site independente para decoração de festas em Araucária e região, com pacotes Festa na Mesa, Clássica e Premium.
- **Skills:** `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, motion/responsivo e otimização mobile-first de imagens.
- **Alterações:** slug `mp-festas-eventos`, página exclusiva, catálogo, sitemap, SEO local, ícone/OG próprios, galeria real otimizada para WebP, CTA/funil individual, prova social e crédito de hospedagem.
- **Conteúdo:** hero de conversão, preços informados pelo cliente (R$ 160/R$ 250/R$ 350), galeria de temas, atendimento local, agenda limitada e link oficial do Instagram informado no material.
- **Privacidade:** telefone e destinatário não entram no bundle; produção requer secret server-side `MP_FESTAS_EVENTOS_WHATSAPP_NUMBER`. Link de Facebook em formato share não foi publicado como rede oficial.
- **Validação:** `validate-portfolio-boundaries`, `validate-portfolio-meta`, `validate-portfolio-catalog`, `validate-portfolio-assets` e `git diff --check` executados; todos os gates passaram após correção de whitespace.

## 2026-08-28 — RJ Serviços de Drywall

- Task: novo site independente em `/portfolio/rj-servicos-drywall`, com identidade, imagens, funil, SEO local e motion próprios.
- Skills: `0web-skill-router`, `0web-skill-discovery`, `0web-design-system`, `0web-ui-quality-gates`, Apple HIG e `imagegen`.
- Findings: contato da arte de referência permaneceu fora do bundle; prova social sem métricas inventadas; imagens otimizadas; `prefers-reduced-motion` respeitado.
- Changes: cliente/catálogo/registry, página exclusiva, tema semântico, SEO local, dois assets próprios, migration e roteamento server-side do WhatsApp.
- Skills externas de landing/CRO rejeitadas por redundância e ausência de auditoria upstream; nenhum template instalado.

- Integrada a branch `codex/portfolio-catalog-cycle4` preservando as alterações existentes.
- Migration `20260828001000_create_portfolio_web_vitals.sql` aplicada (RLS, acesso público revogado, service_role apenas, índices por slug/métrica/data).
- Novo painel `/painel-web-vitals` com p75 de LCP/CLS/INP, amostras e alertas por slug (`src/lib/portfolio-vitals-metrics.functions.ts`, guarda de admin).
- `/portfolio` passou a derivar os cards do catálogo canônico com tipagem explícita; filtros de segmento, tipo, busca e ordenação persistidos na URL.
- `LHCI_TARGET_URL` corrigido para o domínio real de produção; Lighthouse CI cobre todos os slugs registrados e publica relatórios JSON/HTML como artefatos.
- Regressão visual estabilizada (espera por rede ociosa e imagens decodificadas) — 16 capturas em 0,00% de diferença.
- Gates executados: catálogo, boundaries, meta, scaffold, performance, `bun test` (230), `bun run build`, a11y, E2E de popup e de funis, regressão visual.

## 2026-08-28 — correção de CTA superior no funil

- Task: corrigir funis abertos por CTAs no topo que ficavam atrás do cabeçalho/preview em alguns `/portfolio/<slug>`.
- Skills: `0web-skill-router`, `0web-ui-quality-gates`, padrão oficial de clientes e revisão de acessibilidade Radix Dialog.
- Finding: `FunnelModalWrapper` usava o mesmo nível `z-50` do shell de preview; em stacking contexts aninhados o overlay e o painel eram parcialmente encobertos.
- Change: camada parametrizada do modal (`z-[100]`, conteúdo `z-[101]`, fechar `z-[102]`) com comentário de contrato, preservando fallback sem JavaScript e foco/ESC do Dialog.
- Auditoria transversal: removida a duplicação de rodapé nos clientes que já possuem footer editorial e adicionado `PortfolioBackToTop` universal, com alvo de toque de 44px e posição acima do CTA flutuante.

## 2026-08-28 — performance de portfolios (ciclo 1)

- Skills aplicadas: `0web-skill-router`, `0web-ui-quality-gates` e Vercel React Best Practices.
- Auditoria: 8 rotas HTTP 200; HTML SSR entre 30–88 KB; assets raster críticos acima de 1,9 MB identificados; gate de imagens passou.
- Próximo ciclo engatilhado em `docs/PERFORMANCE_PORTFOLIO_AUDIT.md`: conversão WebP/AVIF, budgets LCP/CLS/INP, waterfall de hidratação e QA funcional por slug.

## 2026-08-28 — modal de CTA portalizado

- Finding: CTAs superiores dentro do preview eram renderizados em stacking contexts transformados; o `position: fixed` podia calcular o painel fora da viewport.
- Change: `BeautyBookingQuiz` agora monta o diálogo em `document.body` via portal, mantendo o mesmo funil, foco, fechamento e fallback.
- Validation: reprodução Playwright confirmou bounding box negativo antes da correção; boundaries, diff e hooks de pre-commit passaram após a correção.

## 2026-08-28 — performance parametrizada (ciclo 2 iniciado)

- Criado `src/config/portfolio-performance.json` com budgets de LCP/CLS/INP, limites de bytes, formatos preferidos e política de adiamento de overlays/telemetria.
- Documentação atualizada para que novos clientes herdem os mesmos limites e exceções sejam explícitas por slug.
- Geradas 8 variantes WebP com Sharp; referências públicas atualizadas, com reduções de até 95% e originais preservados.

## 2026-08-28 — assets e prova social por cliente

- Criado `src/config/portfolio-assets.json` como contrato único de ícone, imagem social, política mobile-first e copy de prova social por slug.
- A rota passou a resolver favicon/OG image pelo contrato; `PortfolioStandardShell` garante prova social própria com guard anti-duplicação.

## 2026-08-28 — gate automático de assets

- Criado `validate:portfolio-assets` e incluído no `prebuild`.
- O gate bloqueia clientes sem `icon`, `socialImage` ou `proof`, além de verificar a existência dos arquivos públicos referenciados.

## 2026-08-28 — contexto global no handoff de portfolios

- Mensagens do WhatsApp agora começam com `Vim pela página da *<cliente>*...`, incluem URL completa e uma linha de contexto de experiência.
- O handler server-side do funil de portfolio captura cidade/região por geolocalização aproximada do IP e inclui bairro somente quando o provedor fornece `district`, `suburb` ou `neighborhood`.
- IP, user-agent e identificadores internos continuam fora da mensagem; o fallback permanece sem localização quando a consulta falhar.

## 2026-08-28 — catálogo compacto e navegação mobile-first

- A vitrine `/portfolio` foi compactada para grade responsiva (2 colunas mobile, 3 tablet, 4 desktop e até 6 em telas amplas), cards com resumo truncado e mídia menor.
- Hero da vitrine teve espaçamento reduzido para acelerar descoberta e diminuir rolagem.
- Gates de boundaries, meta, assets e diff passaram; a priorização geográfica por cidade/IP fica como etapa posterior, condicionada a consentimento e dados confiáveis.
## 2026-08-28 — priorização local silenciosa no catálogo

- **Tarefa:** próximo ciclo do `/portfolio`, favorecendo projetos da cidade estimada do visitante.
- **Skills:** `0web-skill-router`, `0web-ui-quality-gates`, acessibilidade/responsivo e performance.
- **Achados:** o catálogo já tinha localização estruturada por projeto, mas a ordenação ignorava a cidade do visitante.
- **Alteração:** resolução IP em background, usando cache de sessão e falha silenciosa; quando a cidade coincide, os cards locais sobem apenas na ordenação padrão. Busca, filtros e ordem alfabética permanecem determinísticos.
- **Privacidade:** não solicita GPS, não exibe o endereço estimado e não envia a cidade ao cliente; sem retorno do provedor, mantém a ordem original.
- **Validação:** `validate:portfolio-boundaries`, `validate:portfolio-meta`, `validate:portfolio-assets` e `git diff --check`.
## 2026-08-28 — carregamento progressivo das imagens do catálogo

- **Tarefa:** novo ciclo de performance para a vitrine `/portfolio`.
- **Skills:** `0web-skill-router`, `0web-ui-quality-gates` e performance/responsivo.
- **Alteração:** somente os dois primeiros cards recebem prioridade alta; demais imagens usam lazy-loading, `decoding=async` e `sizes` coerentes com 2/3/4/6 colunas.
- **Resultado esperado:** menor custo de rede e renderização inicial em mobile, sem remover conteúdo indexável.
- **Validação:** gates de portfolios, metadados e assets aprovados; pre-commit com Schema.org, canonicals e rotas.
## 2026-08-28 — conteúdo rico do Mestre dos Serviços

- Corrigido o nome público do cliente no catálogo para **Mestre dos Serviços**; “marido de aluguel” permanece como categoria/termo SEO.
- Hero, navegação, rodapé e copy atualizados para a marca correta.
- Adicionada seção de presença social com links oficiais do Instagram e Facebook, imagem de case e microanimação com respeito ao reduced-motion global.
- Domínio oficial `mestredosservicos.com.br` permanece visível e clicável.

## 2026-08-28 — novo portfolio JKL Marcenaria

- Criada página exclusiva para móveis sob medida em MDF, com hero, soluções, diferenciais, CTA guiado e prova social temática.
- Skills aplicadas: `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`, direção mobile-first e motion acessível.
- Arte real da cozinha otimizada para WebP e registrada como ícone/imagem social do slug.
- Funil individual `funnel-jkl-marcenaria` criado; contato resolvido server-side por `JKL_MARCENARIA_WHATSAPP_NUMBER`.

## 2026-08-28 — auditoria global de overlays, funis e catálogo

- Contato flutuante agora se oculta quando o rodapé entra na viewport, sem cobrir o crédito 0WEB; retorno ao topo segue acessível.
- Fallback de `PortfolioCTAQuiz` passou a briefing de serviço; campanha só é usada com `proposalKind: "campaign"` explícito (D.Y.Z parametrizado).
- Catálogo raiz mantém blocos responsivos e adiciona carregamento incremental ao aproximar-se do fim; CTA reduzido para “Carregar mais”.

## 2026-08-28 — correção de rota Studio de Cílios

- Adicionado o segmento `beleza` ao mapa de verticais compartilhado; `/portfolio/studio-de-cilios` deixa de cair em 404 e mantém seus metadados e componente exclusivos.
- Validados boundaries, metadados, catálogo e TypeScript.
## 2026-08-28 — ciclo 1/4: isolamento semântico global dos funis

- **Tarefa:** eliminar a mistura de copy de panfletagem nos CTAs de `/portfolio/<slug>` e preservar URL, localidade aproximada e elogio à página no handoff.
- **Skills:** `0web-skill-router`, `0web-skill-discovery`, `0web-design-system`, Apple Design/accessibility, `0web-ui-quality-gates` e regras de `PORTFOLIO_FUNNELS`.
- **Descoberta/seleção:** o stack local cobre integralmente formulário, isolamento de cliente, acessibilidade e QA React; skills externas foram rejeitadas como redundantes para este bugfix e nenhuma dependência foi adicionada.
- **Achado:** o componente distinguia serviço na lista de opções, mas quatro subtítulos, o título da mensagem e o “Próximo passo” ainda dependiam apenas de `mode="proposal"`; o servidor também não persistia o tipo semântico da solicitação.
- **Alteração:** criada uma fonte única de copy para `booking`, `service` e `campaign`; serviço virou o fallback seguro, campanha exige `proposalKind="campaign"`; prévia, metadata do lead e handoff final agora preservam o mesmo tipo.
- **Proteção contra regressão:** testes garantem que serviço nunca contenha “promotores/campanha/panfletagem” e que a D.Y.Z mantenha a linguagem própria de campanha.
- **Validação:** 20 testes unitários, TypeScript, boundaries (29), meta (6), catálogo (32/29), scaffold (29), assets (29), build SSR, canonicals (194/0), privacidade do bundle e dist sem contato operacional. QA mobile a 393 px: Chyrley sem overflow e mensagem correta; D.Y.Z com opt-in de campanha; console sem erros/avisos.

## 2026-08-28 — ciclo 2/4: indexabilidade e identidade SEO por cliente

- **Tarefa:** auditar globalmente as rotas públicas de `/portfolio/<slug>` e impedir regressões de 404, canonical, robots, sitemap, imagem social, ícone e Schema.org.
- **Skills:** `0web-skill-router`, `0web-skill-discovery`, `0web-design-system`, Apple Design/accessibility, `0web-ui-quality-gates` e padrões de cliente/SEO do portfólio.
- **Achados:** `studio-de-cilios` já responde HTTP 200 e consta no sitemap publicado; 26 páginas da rota compartilhada ainda exibem “Portfólio 0WEB” no `<title>` público, contrariando a identidade independente do cliente; a descrição do Paraíso do Hot Dog excedia o budget recomendado.
- **Alterações:** removida a marca 0WEB dos títulos, `og:title` e nome do `WebPage` dos clientes; criada descrição/keywords específicas para o Paraíso do Hot Dog; adicionada auditoria automática por slug em `scripts/audit-portfolio-indexability.mjs` e comando `audit:portfolio-indexability`.
- **Proteção contra regressão:** a auditoria deriva os 29 clientes do cadastro canônico e exige HTTP 200 sem desvio, canonical/`og:url` próprios, robots indexável, title/description, Open Graph completo, ícone não global, JSON-LD válido e entrada no sitemap.
- **Validação:** ambiente local/SSR aprovado em 29/29 rotas, sem falhas e sem avisos; relatório em `seo-reports/portfolio-indexability-latest.json`. A produção atual ainda reprova os 26 títulos antigos até receber este deploy.
## 2026-08-28 — Santos Montador de Móveis

- Tarefa: novo site independente em `/portfolio/santos-montador-de-moveis`, com funil, SEO local, imagem autoral e motion.
- Stack: `0web-skill-router`, `0web-skill-discovery`, `0web-design-system`, Imagegen, Apple Design/acessibilidade, motion, Vercel React Best Practices e `0web-ui-quality-gates`.
- Decisão: direção “oficina residencial premium”, identidade própria em azul-marinho, laranja e marfim; foto hero gerada sem texto ou contato; CTAs usam `clientKey` e resolução server-side.
- Skills externas: nenhuma instalada; as referências locais cobriram direção, engenharia, acessibilidade, performance e QA sem introduzir dependências ou risco adicional.
- Validação: registrada ao final da execução após boundaries, catálogo, metadados, testes, build e QA visual.
## 2026-09-01 — ciclos finais de portfólio: presença, SEO e OG

- **Tarefa:** concluir a parametrização transversal de presença, conteúdo e prévias sociais para os portfólios publicados.
- **Skills aplicadas:** `0web-skill-router`, `0web-skill-discovery`, `0web-design-system`, `0web-ui-quality-gates` e os padrões de cliente, presença e conversão/SEO.
- **Decisão visual:** o Kit de Presença é gerado a partir de nome, segmento, cidade e serviços do próprio slug; cartão e panfleto são identificados como conceito, sem usar contato, preço ou identidade de outro cliente.
- **SEO/OG:** a auditoria confirmou que a produção ainda não contém os commits novos (SOS responde 404 até o deploy). O conversor de OG deixou de depender de ImageMagick local e passa a usar `sharp`, dependência declarada do projeto, para gerar JPEG 1200×630 e cache-busting durante o prebuild.
- **Skills externas:** nenhuma instalada. A camada local cobriu arquitetura, acessibilidade e QA; uma skill externa seria redundante e adicionaria superfície de segurança sem resolver a ausência de runtime de imagem nesta máquina.
- **Validação:** catálogo, boundaries, scaffold, rota, privacidade e performance aprovados; a validação de OG local fica condicionada à instalação das dependências do projeto, que é executada no build de deploy.

## 2026-09-01 — prospecção Rua Quirino Zagonel

- **Tarefa:** mapear oportunidades de portfólio no Jardim Itália, São José dos Pinhais, para a próxima leva de projetos.
- **Skills aplicadas:** `0web-skill-router`, `0web-skill-discovery`, `0web-design-system` e `0web-ui-quality-gates`.
- **Decisão:** registrar 12 candidatos em documento oficial; 10 estão prontos para briefing e 2 dependem de confirmação do nome/atividade atual. Nenhum candidato foi publicado automaticamente com dados especulativos.
- **Validação:** fontes públicas cruzadas por endereço e atividade; duplicidades do nº 1374 foram agrupadas como uma única oportunidade até confirmação.
- **Expansão:** segunda varredura adicionou quatro pistas (Supermercado Itália, Mercado Sol Nascente, empresa de sinalização no nº 130 e organização no nº 257), elevando o universo bruto para 16 registros sem publicar duplicatas.

## 2026-09-01 — primeiro ciclo de projetos Quirino Zagonel

- **Tarefa:** estruturar os quatro primeiros candidatos prioritários: Marmitaria Dom Diego, Beto Pastéis, Woodhouse Hambúrgueres e D’Lara.
- **Skills aplicadas:** `sites-building`, `0web-skill-router`, `0web-skill-discovery`, `0web-design-system`, `0web-ui-quality-gates` e `imagegen`.
- **Alterações:** componentes exclusivos, pastas próprias de assets, imagens conceituais sem texto/contato, funis individuais, chaves privadas, catálogo, registry, narrativas e divulgação por slug.
- **Decisão:** os quatro registros entram como `draft` e `indexable: false` até confirmação comercial; nenhuma página publica preço, telefone, avaliação ou promessa não confirmada.
- **Validação:** catálogo 38 itens/35 clientes, scaffold 35/35, performance 35/35 e assets 35/35 aprovados.

## 2026-09-01 — guia comercial regional indexável

- **Tarefa:** conectar projetos a bairro, cidade, estado e ramo para navegação regional e descoberta por proximidade.
- **Alterações:** Jardim Itália (São José dos Pinhais) adicionado ao mapa de bairros; páginas `/portfolio/<segmento>/<bairro>` agora priorizam a região metropolitana e exibem projetos canônicos associados ao local.
- **SEO:** a rota regional mantém canonical, robots indexável, geo metadata, BreadcrumbList, LocalBusiness/Service e ItemList; drafts continuam não indexáveis individualmente.
- **Validação:** boundaries, catálogo e scaffold aprovados após a inclusão da camada regional.

## 2026-09-01 — descoberta regional na vitrine principal

- **Tarefa:** permitir que o visitante encontre a região do Jardim Itália diretamente em `/portfolio/`.
- **Alterações:** adicionada seção de guia comercial regional com link para o cluster indexável e cards dos projetos canônicos associados à Rua Quirino Zagonel.
- **Validação:** catálogo, boundaries, metadados e rotas aprovados após a alteração.

## 2026-09-01 — refinamento dos quatro drafts regionais

- **Tarefa:** retirar placeholders genéricos dos quatro projetos da Rua Quirino Zagonel.
- **Alterações:** heróis, descrições, cards de serviço e CTA foram particularizados para Marmitaria Dom Diego, Beto Pastéis, Woodhouse e D’Lara; imagens foram alinhadas ao formato real `.png`.
- **Proteção:** o texto continua declarando conceito demonstrativo e não cria preço, contato, avaliação ou promessa comercial.
- **Validação:** performance, boundaries, catálogo e assets aprovados para 35 projetos.

## 2026-09-01 — equilíbrio nacional do guia comercial

- **Tarefa:** corrigir a apresentação do catálogo para representar o alcance nacional do guia comercial.
- **Alterações:** a vitrine `/portfolio/` deixou de destacar uma única rua/região e passou a exibir uma grade equilibrada de bairros/cidades de PR e MG, com link para explorar todas as regiões.
- **Regra:** regiões específicas permanecem acessíveis por clusters próprios, mas nenhuma é tratada como centro do catálogo nacional.
- **Validação:** rotas, catálogo e boundaries aprovados.

## 2026-09-01 — portão obrigatório de localização

- **Tarefa:** impedir que novos projetos entrem sem contexto geográfico e comercial.
- **Alterações:** criado `validate:portfolio-regional`, integrado ao `prebuild`, exigindo ramo, bairro/região, cidade e estado em todos os registros; cinco projetos legados tiveram a localização textual normalizada.
- **Validação:** 38 projetos aprovados no guia regional e catálogo canônico íntegro.

## 2026-09-01 — onda Curitiba: pequenos comércios e brechós

- **Tarefa:** iniciar nova leva de projetos locais em Curitiba com foco em brechós e pequenos comércios.
- **Projetos:** Toquinho de Gente (Sítio Cercado), REuse House (Jardim das Américas), Brechó São Francisco (São Francisco) e Angel Mix (Novo Mundo).
- **Alterações:** componentes, imagens conceituais, assets, narrativas, divulgação, funis e localização regional próprios; todos entram como `draft` e `noindex` até confirmação.
- **Validação:** catálogo 42 itens/39 clientes, boundaries 39/39, assets 39/39 e regional 42/42 aprovados.

## 2026-09-01 — amostras públicas para apresentação comercial

- **Tarefa:** disponibilizar as oito amostras locais no catálogo público para demonstração e venda de soluções web.
- **Alterações:** Marmitaria Dom Diego, Beto Pastéis, Woodhouse, D’Lara e os quatro brechós passaram de `draft`/`noindex` para `published`/indexáveis; cada ficha mantém o selo **Amostra demonstrativa**.
- **Transparência:** os projetos são conceitos demonstrativos, sem inventar contatos, preços, avaliações ou vínculo de contratação.
- **Validação:** catálogo, boundaries, assets e guia regional executados após a publicação.

## 2026-09-01 — prospecção Curitiba: pequenos negócios e prestadores

- **Tarefa:** mapear novas referências públicas para futuras amostras comerciais em Curitiba.
- **Alterações:** documentados oito perfis de oportunidade, distribuídos por bairros e categorias; cada perfil recebeu estrutura de página, regra de confirmação e conexão com o guia nacional.
- **Proteção:** a prospecção não transforma diretórios em clientes e não inventa dados operacionais.

## 2026-09-01 — expansão nacional: Guaratuba, Mirassol e Minas Gerais

- **Tarefa:** iniciar a dispersão do catálogo por novos estados e cidades brasileiras.
- **Alterações:** oito amostras públicas foram cadastradas com ramo, bairro, cidade e estado próprios; quatro em Guaratuba/PR, duas em Mirassol/SP e duas em Minas Gerais.
- **Proteção:** nomes e ofertas são conceitos demonstrativos; nenhum contato, preço, avaliação ou vínculo comercial foi inventado.

## 2026-09-01 — separação entre amostras e prospecção real

- **Tarefa:** corrigir a distinção entre projetos conceituais e empresas que podem ser contatadas.
- **Alterações:** criada lista de oito empresas reais de Guaratuba, Mirassol, Belo Horizonte e Uberlândia, com contatos publicados e fontes verificáveis.
- **Regra:** nenhuma marca, foto, depoimento ou dado de empresa real entra no portal sem autorização; as páginas conceituais permanecem explicitamente demonstrativas.
- **Adição:** Lolipa Arte em Festas Decor foi incluída como prospecto real de Curitiba, usando o Linktree oficial como fonte de contato inicial.

## 2026-09-01 — projeto Lolipa Arte em Festas Decor

- **Adição:** projeto público `/portfolio/lolipa-arte-em-festas` com galeria exclusiva, serviços de decoração completa, criação sob medida, pegue e monte e mimos informados pela marca.
- **Assets:** cinco imagens fornecidas pela cliente foram vinculadas exclusivamente ao slug; uma prévia social paisagem foi gerada por IA sem texto, contatos ou promessas inventadas.
- **Governança:** dados de contato operacional permanecem fora do bundle público; CTAs usam o funil parametrizado. O projeto é um negócio real; somente os mockups de papelaria são identificados como conceito até aprovação de impressão.

## 2026-09-01 — prospecção de novas categorias locais

- **Pesquisa:** confirmadas fontes públicas para Ateliê da Lyka (costura, Cajuru), Praça dos Bichos (pet shop, Curitiba) e Mercado Maxbier (mercado de bairro, Abranches).
- **Próxima leva:** as três empresas entram na fila de páginas oficiais com dados próprios, funil server-only e validação de assets antes da publicação.

## 2026-09-01 — kit de presença visual em todos os projetos

- **Tarefa:** garantir cartão de visita e panfleto digital visíveis em cada `/portfolio/<slug>`.
- **Alterações:** adicionada base bitmap gerada com `imagegen`, integrada ao mockup responsivo por slug; textos, segmento, cidade e serviços continuam derivados exclusivamente do catálogo canônico. O catálogo agora exibe o selo “Kit de Presença · cartão + panfleto”.
- **Transparência:** toda peça exibe “Conceito de presença e papelaria” e não inclui contatos operacionais, preços, depoimentos ou métricas inventados.
- **Gate:** criado `validate:portfolio-presence-kit`, incluído no `prebuild`, cobrindo os 50 projetos atuais e novos registros automaticamente.

## 2026-09-01 — logo própria como requisito global

- **Tarefa:** tornar a marca visual um requisito estrutural de todo `/portfolio/<slug>`.
- **Alterações:** `portfolio-assets.json.icon` passou a ser o ativo canônico da logo; cada arquivo precisa viver em `public/images/<slug>/`, sem reutilização entre clientes. Criado o gate `validate:portfolio-logos` e incluído no `prebuild`.
- **Identidades vinculadas:** as marcas fornecidas de Lolipa Arte em Festas Decor e Confeitaria Sabor da Realeza foram adicionadas aos diretórios corretos e exibidas nos cabeçalhos das respectivas páginas.
- **Regra futura:** quando não houver marca aprovada, gerar um conceito original relacionado ao projeto e identificá-lo como conceito até aprovação; nunca usar logo genérica ou de outro cliente.

## 2026-09-01 — Manu Pastéis

- **Adição:** projeto oficial `/portfolio/manu-pasteis` para pastéis recheados e quentinhos.
- **Operação:** cardápio real Brendi, horários e formas de pagamento informados pela loja.
- **Conversão:** logo própria, funil, CTA e divulgação exclusivos; contato operacional mantido somente no servidor.

## 2026-09-01 — inspeção da pilha de elementos flutuantes

- **Auditoria:** revisados os projetos `/portfolio/<slug>` e a montagem do catálogo para detectar botões duplicados, colisões entre prova social, contato e retorno ao topo.
- **Correções:** D.Y.Z Promo e Renata Beauty deixaram de montar CTAs flutuantes próprios em paralelo ao botão universal; todos os controles compartilhados agora usam slots únicos com `safe-area` e espaçamento vertical.
- **Proteção:** a prova social sobe para o slot 3 e desaparece junto ao rodapé; o retorno ao topo usa o slot secundário da coluna direita. Isso evita sobreposição em telas estreitas sem alterar o CTA, a mensagem ou a identidade de cada cliente.
## 2026-09-01 — sitemap dinâmico de portfólio e indexação automática

- **Tarefa:** eliminar a edição manual do sitemap para lotes aprovados/publicados e conectar a atualização ao GSC e ao IndexNow.
- **Skills:** `0web-skill-router`, `0web-skill-discovery`, SEO técnico do projeto e gates de privacidade/rotas.
- **Implementação:** `sitemap-portfolio.xml` agora deriva os clientes do catálogo aprovado e dos overrides publicados de `portfolio_client_settings`, com deduplicação e remoção imediata de itens despublicados.
- **Automação:** publicação/despublicação no painel dispara sincronização; o hook protegido `/api/public/hooks/portfolio-sitemap-sync` e o workflow horário/deploy reenviam o sitemap ao Search Console e as URLs alteradas ao IndexNow.
- **Segurança:** hook exige `CRON_SECRET`, aceita apenas slugs validados e mantém contatos/segredos fora do bundle público.

## 2026-09-01 — Assistência Técnica Microondas Santos

- **Adição:** projeto público `/portfolio/assistencia-microondas-santos` para conserto a domicílio, restauração contra ferrugem e venda de micro-ondas revisados.
- **Identidade:** logo própria gerada com `imagegen`, imagem social horizontal exclusiva e flyer fornecido pela empresa vinculado somente ao slug correto.
- **Conversão:** funil de avaliação parametrizado para defeito, restauração, compra e atendimento; contatos operacionais ficam somente no ambiente server-side.
- **SEO/catálogo:** ramo, cidade (São José dos Pinhais/PR), serviços, narrativa de conversão e divulgação exclusiva adicionados às fontes canônicas.

## 2026-09-01 — Artesanatos Darléia Oliveira

- **Adição:** projeto público `/portfolio/artesanatos-darleia-oliveira` para coadores de café 100% algodão, reutilizáveis e feitos à mão.
- **Identidade:** logo e imagem social horizontal exclusivas geradas com `imagegen`, além do flyer real fornecido pela artesã, vinculados somente ao slug correto.
- **Conversão:** CTA e funil próprios para estampa, ocasião, quantidade e forma de recebimento; Instagram oficial em bloco dedicado e contato operacional mantido somente no ambiente server-side.
- **SEO/catálogo:** segmento, localização regional, serviços, narrativa de conversão e texto de divulgação exclusivos adicionados às fontes canônicas; o catálogo marca o projeto como publicado e real.

## 2026-09-01 — Thays Camilla Personalizados

- **Adição:** projeto público `/portfolio/thays-camilla` para canecas e azulejos personalizados, incluindo o kit promocional informado de caneca + azulejo 15x15 cm.
- **Identidade:** logo exclusiva gerada com `imagegen`, OG horizontal própria e material promocional real vinculado somente ao slug correto.
- **Conversão:** funil próprio para mensagem, imagem, ocasião, quantidade e entrega; valores e disponibilidade aparecem como informados e podem ser confirmados no atendimento.
- **SEO/catálogo:** segmento, localização regional, produtos, narrativa e texto de divulgação exclusivos adicionados às fontes canônicas; contato operacional permanece apenas no ambiente server-side.

## 2026-09-01 — Refrigeração Maresia (atualização de material real)

- **Atualização:** material promocional real recebido foi incorporado ao projeto público `/portfolio/refrigeracao-maresia`, sem criar duplicata ou variante.
- **Identidade:** logo exclusiva e imagem social OG horizontal geradas com `imagegen`; flyer original vinculado somente ao slug da Maresia.
- **Conversão:** hero, serviços e narrativa agora refletem resposta rápida no WhatsApp, peças originais, garantia de serviço e atendimento em toda a região; botão de orçamento usa o funil universal.
- **Privacidade:** telefone operacional permanece apenas no ambiente server-side; nenhum contato foi adicionado ao bundle público.

## 2026-09-01 — Catálogo público sem filtro por imagem

- **Correção:** o índice `/portfolio/` deixou de ocultar projetos publicados que ainda não tinham imagem editorial no registro canônico.
- **Fallback seguro:** cada slug usa seu ícone/imagem social própria quando disponível e `og-default.jpg` somente como último fallback visual; registros com `status: published` passam a ser tratados como públicos no catálogo.
- **Resultado:** os 61 itens canônicos passam a aparecer no catálogo e no contador de projetos/sites publicados, mantendo a separação por slug e sem duplicar clientes.

## 2026-09-01 — Fernanda & Amaral · Instalação de Drywall

- **Adição:** projeto público `/portfolio/fernanda-amaral-drywall`, com identidade própria e serviços informados: drywall, pinturas, reformas, móveis e madeira, corte de grama e pequenos fretes.
- **Assets:** logo, imagem social OG e imagens de serviços vinculadas exclusivamente ao slug; o material recebido foi otimizado sem inserir contatos no código público.
- **Conversão/SEO:** narrativa, divulgação, localização regional e funil server-only adicionados às fontes canônicas; a página usa o shell universal, botão de copiar divulgação e Kit de Presença.
- **Privacidade:** o telefone é referenciado somente pela chave de ambiente `FERNANDA_AMARAL_DRYWALL_WHATSAPP_NUMBER`; nenhum contato operacional é enviado ao bundle público.
- **Validação:** gates de boundaries, catálogo, conversão, meta, scaffold, regional, presença, logos, assets, ícones, performance, quiz e privacidade aprovados; build Vite/Nitro de produção concluído.

## 2026-09-01 — mockups reais no Kit de Presença (correção global)

- **Problema encontrado:** a seção compartilhada ainda aplicava uma imagem-base translúcida e deixava cartão e panfleto com aspecto de espaço reservado.
- **Correção:** `PortfolioPresenceKit` passou a montar um cartão visual completo com a logo própria do slug e um panfleto preenchido com a imagem social OG própria, nome, segmento, serviços e região de cada projeto.
- **Escopo:** a alteração é parametrizada para os 62 itens do catálogo e novos clientes que entrarem nas fontes canônicas; não copia identidade, imagem ou conteúdo entre negócios.
- **Transparência:** as peças continuam identificadas como “Conceito de presença e papelaria” até aprovação do cliente, sem inventar contatos operacionais.
- **Cobertura legada:** 12 itens do catálogo que não tinham assets próprios receberam logo conceitual e OG JPEG exclusivos por slug; o gerador `scripts/generate-portfolio-identity-assets.mjs` mantém a regra para novos registros.
- **Gates fortalecidos:** assets, logos, ícones e presença agora conferem o catálogo canônico inteiro, evitando que um projeto publicado volte a renderizar um cartão ou panfleto vazio.
