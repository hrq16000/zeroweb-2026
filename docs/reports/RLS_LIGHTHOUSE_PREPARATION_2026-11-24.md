# RLS e Lighthouse — correções preparadas, sem publicação

Pedido de 24/11/2026 às 06:00 UTC. Base: `880a1cb7`.
**Sem deploy, merge, migração aplicada, mudança de DNS, auth, agentes, funis,
portfólios, preços, SEO, marca ou baseline.** Esta entrega prepara correções de
testes, candidato SQL e remediação de desempenho; não declara release aprovada.

## 1. RLS: reprodução e causa confirmada

| Etapa | Resultado | Evidência |
| --- | --- | --- |
| Testes antigos, limite padrão | FAIL nos dois testes | 5000 ms ocultavam parte dos resultados e interrompiam cleanup |
| Testes antigos com janela de 90 s | FAIL nos dois testes, causas expostas | `visitantes_rastreio`: falta de constraint para ON CONFLICT; UPDATE admin: `lead_history` rejeita INSERT |
| Teste de isolamento corrigido, backend existente | **PASS** | Leitura dos próprios leads A/B; sem leitura cruzada de leads/eventos/telemetria; escrita cruzada negada com SQLSTATE 42501 |
| Teste sensível fortalecido, backend existente | **FAIL real, preservado** | Admin lê lead e catálogo, mas atualizar status exige histórico e continua falhando; anon/comum/admin não leem nem forjam histórico direto |
| Candidato SQL em PostgreSQL local descartável | **PASS local** | Reproduz erro antes; depois persiste status, cria exatamente um histórico, mantém negativas e revoga EXECUTE público |
| Mutações do candidato | **2 PASS** | Retirar SECURITY DEFINER ou REVOKE faz o teste falhar; os asserts não são tautológicos |
| Suíte completa final | **1187 PASS / 1 FAIL**, 1188 testes | Único FAIL: atualização autorizada bloqueada pelo histórico ainda não corrigido no banco real |

Metadata confirmada, sem dados pessoais:

- `public.leads_after_change()`: retorna trigger, owner `postgres`, SECURITY
  INVOKER, search_path `public`; três gravações de histórico, sem SQL dinâmico.
- `trg_leads_after_insert` e `trg_leads_before_update` chamam essa mesma função.
- `public.lead_history`: RLS habilitado, apenas SELECT `lead_history_locked`
  com USING(false), sem policy INSERT. Existem grants para anon/authenticated;
  eles não substituem a negativa RLS.
- `visitantes_rastreio` tem índice de deduplicação com path normalizado. Inserções
  de teste são únicas por execução e não precisam de UPSERT nem de nova constraint.

### Correções prontas no código de testes

1. Janela de 180 s por teste para a sequência de rede e 10 s por requisição com
   AbortSignal; timeout não é convertido em PASS.
2. Guards substituem non-null assertions; fixture A/B localizada pelo slug, não
   pela ordem das linhas retornadas. Senhas sintéticas aleatórias, sem logs.
3. Leituras negativas rejeitam erro inesperado; escrita negativa exige 42501,
   não erro genérico de rede, validação ou FK. Leituras positivas dos próprios
   leads impedem um teste falso que negue acesso a todos.
4. Teste sensível verifica as negativas diretas de `lead_history` para três
   perfis e, após UPDATE aprovado, lê status/histórico com autorização de fixture.
5. Workflow usa `bun test`, não execução direta do arquivo; o isolamento também
   executa após FAIL do teste sensível se o preflight/instalação chegaram até ele.
   Sem credencial, o workflow continua bloqueado: nenhuma verificação enfraquecida.

### Candidato de correção do histórico — não aplicar automaticamente

Arquivo: `docs/rls/lead-history-trigger-candidate.sql`, **fora de migrations**.

- Verificar proprietário `postgres` e tipo trigger antes de qualquer alteração.
- Elevar apenas `leads_after_change()` a SECURITY DEFINER, com search_path
  `pg_catalog, public`; corpo existente usa tabelas `public` explícitas.
- Revogar EXECUTE de PUBLIC/anon/authenticated; manter somente service_role.
  PostgreSQL executa os triggers já instalados mesmo sem EXECUTE do chamador.
- Não criar SELECT/INSERT públicos, não mudar policy do lead pai, papéis,
  auxiliares de membership, número de WhatsApp ou contato de qualquer cliente.
- Revisão deve confirmar o corpo/proprietário atual e ausência de novas chamadas
  da função antes de promover o SQL a uma migração autorizada. Repetir o teste
  sensível real e confirmar o read-back do histórico após aplicação autorizada.

Teste local feito com PGlite/PostgreSQL WASM em memória, instalado apenas em
`/tmp`, sem dependência adicionada ao app ou novo backend conectado. Executou a
fixture SQL com substituição **ancorada e por função** da linha APPLY_CANDIDATE.
O primeiro runner falhou na substituição de delimitadores $$; foi corrigido antes
do PASS. Tentativas de iniciar PostgreSQL nativo esbarraram em usuário de SO
ausente; não mexeram no backend e não contaram como validação.

As fixtures do backend foram sintéticas e limpas. Dois usuários deixados pelo
timeout inicial foram removidos por padrão de e-mail/stamp exclusivo desta rodada;
sem seleção, logs ou alteração de clientes reais.

### Bloqueio remoto separado

O último gate remoto lido na Rodada 1 parou no preflight por ausência de
credencial. Nenhum rerun foi disparado aqui. A credencial temporária disponível
ao ambiente autorizado de testes **não demonstra** que o GitHub Actions a tenha.
Lovable Cloud não fornece a chave de serviço ao proprietário: não solicitá-la.
Preparar um método autorizado de sessão/fixtures para o runner é necessário,
mantendo FAIL/BLOCKED até a homologação real; não abrir endpoint público de QA.

## 2. Lighthouse: leitura dos LHR reais, não novos scores

Foram baixados os três artifacts existentes do run `45323530198`, SHA
`6cf27155c709bff5c130e65e2284a335e378373b`, sem rerun nem upload.
São **24 LHR, duas medições por página**, de 12 páginas já publicadas; não são
reprovações individuais da Doce Coração. Não atribuir esses scores a 880a1cb7.

Artifacts: shard 0 `14889801980`, shard 1 `14889920910`, shard 2 `14889103816`.
Fonte: Henrique's GitHub API, listagem HTTP 200 e arquivos não expirados.

| Página | Performance (2 runs) | LCP min–max (ms) | Render delay min–max (ms) | Elemento medido / correção preparada |
| --- | --- | --- | --- | --- |
| angel-mix-brecho | 82–83 | 2671,84–2724,47 | 2536,98–2583,26 | H1 dentro de máscara; reconciliar delta #539 e manter texto crítico visível, sem refazer identidade |
| auto-socorro-dentinho | 88 | 1984,80–2007,49 | 1845,97–1866,95 | H1; revisar reveal crítico e derivados da foto diagnostic, mantendo fonte real |
| carecas-infotec | 88–89 | 1985,58–1990,16 | 1848,06–1853,73 | Filho do H1 mascarado; não esconder o texto crítico, dimensionar notebook/logo/fotos aos slots |
| centro-mega | 88–89 | 1857,88–1943,85 | 1721,82–1802,53 | Parágrafo principal; preservar texto inicial e derivar imagem Dunk (~1,33 MB evitáveis) sem alterar preço/prova |
| dlara-pizzaria | 87–88 | 2076,02–2080,00 | 1402,23–1856,67 | Imagem mascarada; manter primeira pintura da imagem e dimensionar capa aos slots |
| embalar-embalagens | 85–87 | 2281,57–2423,90 | 1683,48–1948,70 | Imagem de loja; dimensionar original e separar reveal decorativo da imagem crítica |
| jkl-decor | 88 | 2000,20–2054,12 | 1859,14–1909,17 | Filho de H1 mascarado; manter título legível e derivar fotos de trabalhos sem mexer nos aliases |
| mania-de-limpeza | 86–89 | 1938,04–2225,60 | 1303,10–1986,58 | Imagem principal; dimensionar hero PNG e evitar reocultação após hidratação |
| marmitaria-dom-diego | 88–89 | 1934,60–1978,11 | 1796,35–1836,56 | H1; manter texto crítico e derivar capa real sem tocar no menu/funil |
| paulo-mestre-de-obras | 88 | 1984,49–2009,33 | 1654,42–1869,21 | Imagem principal; primeiro paint sem espera decorativa, variante de hero dimensionada |
| refrigeracao-maresia | 86–87 | 2147,42–2178,63 | 1538,93–1987,92 | Imagem mascarada; preservar WebP já existente, reduzir somente display/reveal crítico |
| your-brutus-burguer | 86–87 | 2217,27–2288,05 | 1579,23–1894,33 | Imagem principal; derivados proporcionais de hero/flyer/cartão, sem inventar fotos |

O CSV adjacente guarda os seletores exatos. O parser antigo tentava encontrar
`.details.items[0].node`, mas os LHR têm tabelas/listas aninhadas; por isso não
exibia a evidência do elemento real. **Isso foi corrigido** em
`scripts/lib/lhci-diagnostics.mjs` e `scripts/report-lhci-diagnostics.mjs`, com seis
testes funcionais e exportação de métricas sem origem/query strings.

### Certeza e hipótese

- **Confirmado:** Angel Mix tem 95% do LCP em render delay, não download da imagem.
  Outros casos também têm atraso de exibição dominante ou misto. TBT e CLS nos
  24 relatórios são zero. Não é correto chamar a imagem de causa única para tudo.
- **Confirmado:** chunk index transfere 556266 bytes e estima 218533–228805 bytes
  não utilizados; CSS ~69325 bytes e folha Google Fonts ~1363 bytes aparecem como
  bloqueantes. Estes são achados de laboratório, não causalidade isolada.
- **Hipótese a testar:** revelações/mascaras após hidratação e conteúdo crítico
  esperando o carregamento global explicam boa parte do render delay. É preciso
  observar BEFORE/DURING/AFTER e reduced-motion por composição; não desligar o
  sistema global de motion ou remover conteúdo para subir scores.
- **Hipótese a testar:** carregar drawer/modal e dados auxiliares sob demanda
  pode reduzir o chunk global. Exige auditoria do grafo e preservação do caminho
  de clique/erro/SSR; não remover MCP/OAuth, auth, catálogo ou telemetria necessária.

### Execução preparada para a rodada de aplicação

1. Reconciliar #539 com main, preservar correções já existentes e não considerar
   seu score histórico 85/90 um PASS para os doze sites.
2. Por cada linha da matriz, manter o conteúdo/imagem LCP visível no SSR e não o
   reocultar no mount; realocar a assinatura animada para elementos não críticos
   da mesma composição, sem diminuir riqueza, apagar motion ou copiar outro site.
3. Derivar mídia da fonte existente com width/srcset/sizes exatos ao display;
   preservar originais, identidade, crop, lightbox e overrides administrativos.
4. Só depois de confirmar ganho por LHR, avaliar divisão sob demanda do chunk;
   fontes, Header/Footer, logo e styles institucionais seguem congelados.
5. Rodar LHCI no artefato do SHA candidato para as páginas afetadas, mantendo
   performance >=90, LCP <=2500 ms, TBT <=200 ms, CLS <=0,1 e SEO/A11y >=95.
   Em seguida revisar regressões visuais, 390/768/1440 e reduced-motion; somente
   então os gates completos aplicáveis. Não trocar baselines nem excluir páginas.

**Nenhuma página foi modificada nesta preparação. Lighthouse permanece pendente
de implementação e medição do candidato; não houve nova execução do Lighthouse.**
O diagnóstico melhorado foi rodado sobre os 24 LHR já existentes.

## 3. Validações e continuidade

- 6 testes de evidência RLS e 6 de diagnóstico Lighthouse: PASS.
- Fixture PostgreSQL local e duas mutações negativas: PASS local.
- Suíte inteira: 1187 PASS / 1 FAIL real de backend; não reduzida nem ocultada.
- Brand integrity, portfolio-boundaries e diff whitespace: PASS.
- Harness: build OK; nenhum build/typecheck manual foi disparado.
- Nenhuma mudança em `src/routes`, `src/lib/mcp`, SDK MCP, login/roles de agentes,
  env, dependências do projeto, schema real ou configuração de publicação.
- Bloqueios restantes: aplicação autorizada do candidato de histórico, método
  autorizado para o gate RLS remoto, implementação/QA da matriz Lighthouse e
  reconciliação #548 para compatibilidade Vercel. #548 não foi duplicada/integrada.

Entrega Git de preparação, não release. As pendências antigas de publicação,
Doce Coração, outros clientes e integrações continuam fora desta rodada.

Complemento: [conferência dos caminhos relacionados](RLS_LIGHTHOUSE_FLOW_SWEEP_2026-11-24.md)
registra produtores/consumidores, composições alternativas e defeitos adicionais
submetidos à autorização, sem alterar o comportamento de produção.