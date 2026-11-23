# Curadoria de 17 projetos GitHub — uso seletivo no ecossistema (20/11/2026)

**Estado:** `REFERENCE_ONLY` / `ADOTADO_COMO_PRINCIPIO`. Nenhum repositório externo instalado, nenhuma licença concedida automaticamente, nenhuma integração com produção. Os 17 repositórios abaixo foram conferidos como existentes no GitHub em 20/11/2026; isso **não** é auditoria de segurança, licença, versão ou compatibilidade do código.

**Aplicação:** 0WEB (`hrq16000/zeroweb-2026`), Encontre um Técnico, O Técnico de Informática e demais projetos, sempre conforme o `AGENTS.md`, a stack e os contratos de cada repositório. A documentação da 0WEB serve como curadoria compartilhada; **não** concede acesso ou autorização técnica entre projetos.

## Matriz de decisão

| Lista | Origem conferida | Capacidade aproveitável | 0WEB / outros projetos | Decisão |
|---|---|---|---|---|
| 17 Omarchy Spaces | [tornikegomareli/omarchy-spaces](https://github.com/tornikegomareli/omarchy-spaces) | visibilidade de áreas de trabalho e continuidade | padrões de contexto para operações internas; não é UI web | `REFERENCE_ONLY` |
| 16 AudioSmith | [hehehai/AudioSmith](https://github.com/hehehai/AudioSmith) | locução, edição e transcrição local em Apple Silicon | mídia autorizada para guias e demos; não colocar no frontend | `APPROVED_CONDITIONAL` (piloto offline) |
| 15 Hatoba | [scarletkc/Hatoba](https://github.com/scarletkc/Hatoba) | cliente SSH e sincronização própria | operação interna apenas com credenciais mínimas; GitHub/Vercel seguem canônicos | `REFERENCE_ONLY` |
| 14 M-Film | [HNGSeries/mfilm-canon-film-simulation](https://github.com/HNGSeries/mfilm-canon-film-simulation) | fluxo narrativo e metáfora de filme/fotografia | referência editorial para cases visuais originais, não componente web | `REFERENCE_ONLY` |
| 13 Glass Home | [victaphu/glass-home-samsung-tv](https://github.com/victaphu/glass-home-samsung-tv) | composição limpa, fotos e hierarquia | inspiração opcional de mídia e contraste; não reutilizar skin/tela de TV | `REFERENCE_ONLY` |
| 12 Appflare | [appflare/appflare](https://github.com/appflare/appflare) | ferramentas Cloudflare e controle de recursos | hipótese de serviço auxiliar isolado; **não** migrar sites da Vercel | `SECURITY_REVIEW_REQUIRED` |
| 11 UNCUT | [Balanov/uncut](https://github.com/Balanov/uncut) | falhar explicitamente em truncamento de outputs | incorporar como princípio de auditoria de diffs/logs/artefatos; sem agente novo obrigatório | `ADOTADO_COMO_PRINCIPIO` |
| 10 Valdrada | [mkturkcan/valdrada](https://github.com/mkturkcan/valdrada) | proveniência de dados geográficos e simulação urbana | apenas princípio de fonte e rastreabilidade; GIS pesado desnecessário | `REFERENCE_ONLY` |
| 9 Fluvy | [acosta290/fluvy](https://github.com/acosta290/fluvy) | consistência entre cards, temas e dashboards | revisar paineis de 0WEB/EUT sem adicionar dependência do Home Assistant | `ADOTADO_COMO_PRINCIPIO` |
| 8 ServerBox | [madeye/ServerBox](https://github.com/madeye/ServerBox) | laboratório Linux em Android usado, sem root | ambiente de teste pessoal condicional; não runner oficial/de produção | `REFERENCE_ONLY` |
| 7 sqlmux | [kackerx/sqlmux](https://github.com/kackerx/sqlmux) | inspeção PostgreSQL/SQL no terminal | possível piloto de leitura isolada e credenciais mínimas; nunca acesso irrestrito ao Supabase oficial | `SECURITY_REVIEW_REQUIRED` |
| 6 Chums | [lcoutodemos/chums](https://github.com/lcoutodemos/chums) | interface remota para agentes Mac/Apple | opcional pessoal; nenhuma ação autônoma sobre produção | `REFERENCE_ONLY` |
| 5 whiteboard-animation-vi | [letuandat131/whiteboard-animation-vi](https://github.com/letuandat131/whiteboard-animation-vi) | vídeos educativos whiteboard | produção offline de explicativos para 0WEB/O Técnico; revisar licenças de assets/áudio | `APPROVED_CONDITIONAL` (piloto offline) |
| 4 AI Builder | [HeyPuter/builder](https://github.com/HeyPuter/builder) | prototipação IA de sites e apps | piloto isolado comparável ao Lovable; não substituir GitHub/Codex, router, RLS ou Vercel | `APPROVED_CONDITIONAL` (piloto isolado) |
| 3 prismantis | [NahumLitvin/prismantis](https://github.com/NahumLitvin/prismantis) | tema de terminal e legibilidade de status | apenas conforto local, não dependência dos sites | `REFERENCE_ONLY` |
| 2 Plume Launcher | [aradhyas8/Plume_Launcher](https://github.com/aradhyas8/Plume_Launcher) | navegação simples em Android TV | fora da stack web atual | `REDUNDANT` / `NOT_APPLICABLE` |
| 1 WatchPointer | [umarz317/WatchPointer](https://github.com/umarz317/WatchPointer) | controle por Apple Watch/Mac | fora do escopo web | `NOT_APPLICABLE` |

**Atenção:** `APPROVED_CONDITIONAL` acima aprova a **avaliação de um piloto**, não execução. Licença, requisitos, custos, segredos, retenção, interoperabilidade, autoria e rollback devem ser revistos na versão/SHA escolhidos. Não copiar mídia, interface ou código de terceiros automaticamente.

## 0WEB — como usar skills em **todos** os portfólios

O pipeline já tem o `0web-skill-router`, `0web-skill-discovery`, `0web-experience-design-max`, `0web-portfolio-art-direction`, `0web-landing-page-premium`, `0web-landing-experience`, `0web-design-system`, `0web-ui-quality-gates` e os padrões de SEO/funil. **Maximizar competências pertinentes não significa executar 17 aplicativos nem aplicar efeitos sem função.** Para cada novo portfólio, derivativo ou revisão material, aplicar:

1. **Discovery e segurança:** descobrir skills locais e externas complementares, escolher somente as necessárias; documentar redundâncias, licenças e recursos bloqueados. Sem instaladores automáticos.
2. **Identidade e conteúdo:** pesquisa factual, mídia/autoria, direção criativa distinta por cliente, prova real, sem template genérico ou dados inventados.
3. **Experiência e engenharia:** layout Flexbox/Grid responsivo, UX/CRO, copy, motion contextual com `prefers-reduced-motion`, legibilidade, cards, formulários, estados de erro e feedback. As referências Fluvy/Glass Home/M-Film servem como *pistas conceituais*, não identidade copiada.
4. **Funcionalidade e indexabilidade:** funil e destino legítimos, isolamento `clientKey`/RLS, SEO SSR e entidade individual, metadados/OG/canonical/robots/sitemap, validação factual. Não usar `sqlmux` para contornar auth/RLS.
5. **Evidência e fechamento:** registrar skills efetivamente aplicadas e `NOT_APPLICABLE` com motivo; executar gates de originalidade, limites do cliente, acessibilidade 390/768/1440, teclado, mídia/SEO, privacidade, testes, build e browser QA da **versão candidata**. Preferir travar o processo a omitir erros/logs truncados, conforme princípio UNCUT.

**Escopo de prática:** o portfólio existente não ganha estado `PASS` só porque a lista de skills está documentada; registrar evidências por slug e por derivativo (capa, preview, OG, mobile). Ações sobre clientes exigem seus dados de origem, consentimento e validação; demos devem estar identificadas como tal.

## Aplicação transversal sem duplicação

- **Encontre um Técnico:** usar princípio UNCUT em revisão de PR/CI, Fluvy apenas para hierarquia do painel e sqlmux somente em investigação read-only autorizada. Cadastro, filtros, operações, RLS e contatos privados seguem contratos existentes.
- **O Técnico de Informática:** priorizar produção editorial original e mídia offline, com vídeos educacionais sem voz/mídia não autorizada. Não injetar motores de vídeo no frontend.
- **0WEB e clientes:** priorizar kit de skills já existente e composição própria de cada portfólio; AI Builder apenas para protótipo sem dados reais; Appflare apenas quando serviço isolado e ganho real forem demonstrados.
- **Demais projetos:** reaplicar metodologia de seleção, não o conjunto de dependências. Nenhum banco, cookie, lead, credencial ou mídia passa entre projetos sem contrato próprio.

## Critério de adoção e próximos passos

`REFERENCE_ONLY` → identificar problema real → verificar ferramenta equivalente já presente → licença/custo/permissões → piloto de **um** fluxo com dados sintéticos → gates → PR revisada → integração/publicação específica, se justificadas. Fora disso, fica somente como repertório.

Nenhum pacote, workflow, GitHub Action, worker, feature flag, endpoint, SQL, Vercel, DNS ou arquivo de cliente deve ser alterado por esta curadoria.
