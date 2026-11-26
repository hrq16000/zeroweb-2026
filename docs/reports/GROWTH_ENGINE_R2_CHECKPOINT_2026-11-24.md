# 0WEB — Rodada 2: correção mínima e candidatos, sem release

## Resultado e limites

**Rodada 2 parcialmente executada; NO-GO para integração/publicação.** Reutilizado o inventário R1 (`880a1cb7`), sem novo inventário global. Nenhuma execução da Rodada 3/4, publicação, mudança de DNS, reconexão, segredo, configuração de autenticação ou desativação de agente. Deduplicação/ledger permanecem intactos, conforme resposta «Somente registrar achados».

Houve alteração autorizada no banco existente: o trigger de histórico foi corrigido e foram removidas fixtures estritamente sintéticas. Não confundir isso com a preparação anterior, que não aplicou migração.

## Histórico / RLS

- Autorização específica: somente `public.leads_after_change()`; arquivo produzido pela ferramenta: `drizzle/migrations/0008_fix_lead_history_trigger_access.sql`, snapshot e journal correspondentes.
- Preflight exige função trigger e owner `postgres`; `SECURITY DEFINER`, `search_path=pg_catalog, public`; EXECUTE apenas owner e `service_role`. Nenhuma policy de leitura ou grant em tabela foi aberto.
- Metadata pós-aplicação confirmou owner, search path, elevação e ACL exata. Os dois testes RLS isolados passaram: leitura própria A/B, negação cruzada, atualização autorizada persistida e um único evento de histórico. Anônimo/usuário/admin continuam impedidos de ler ou forjar diretamente histórico protegido.
- Última execução **isolada**: 2 PASS / 0 FAIL, 14,76s; execução imediatamente após aplicação também 2 PASS / 0 FAIL, 18,66s.
- Isso não substitui o gate GitHub. Workflow da main `58e5f5ee` continua **BLOCKED_MISSING_SECRET** antes dos testes; método autorizado no runner ainda necessário. Não solicitar chave inacessível ao proprietário nem converter SKIP em PASS.

## Limpeza sintética autorizada às 07:10 UTC

- Portais exatos `t-a-1795408221054` e `t-b-1795408221054`, nomes Test Portal A/B, não default. Conferidos IDs, origem e status `new` dos dois leads, duas associações de membro e eventos `view_a/view_b`; históricos eram somente `created/system → new`.
- Conferidos todos os campos de referência portal/lead, inclusive ledger, atribuições, encaminhamentos, pedidos, licenças e sessões. Operação transacional repetiu os guards e abortaria diante de qualquer dependência inesperada.
- Removidos 2 portais, 2 leads, 2 históricos vinculados, 2 eventos, 2 memberships. Read-back confirmou zero nos cinco conjuntos.
- Duas contas correspondentes verificadas por identidade sintética exata; referências públicas por campos e FKs auditadas: somente 2 profiles restantes, nenhum agente/role/pedido/projeto ou referência operacional. Exclusão pelo método oficial Auth; read-back confirmou ausência das duas contas e dos dois profiles.
- Não removidos dados reais, registros encerrados, agentes, ledger ou referências de outros clientes. Não há limpeza genérica por prefixo.

## Lighthouse: dez candidatos locais, não score homologado

O diagnóstico reaproveita os 24 LHR das 12 páginas do R1; não houve rerun LHCI nem alteração dos thresholds.

- `MotionFirstPaint` é opt-in sem DOM: somente a primeira seção de Angel Mix, Auto Socorro Dentinho, Centro Mega, Dlara, Embalar, Mania de Limpeza, Dom Diego, Maresia e Your Brutus. Política pura garante visibilidade após hidratação mesmo sem callback do observer. Default e seções posteriores permanecem iguais.
- Paulo Mestre: `initial={false}` somente no título e painel de mídia iniciais de `motion/react`; demais animações preservadas.
- O opt-in não injeta wrappers horizontal/mask desnecessários. A prova encontrou `<div>` descendente de `<p>` no reveal horizontal inicial da Centro Mega, causando hydration error. Remover esse wrapper apenas no opt-in eliminou o erro observado; não houve alteração de texto, classe, imagem ou composição.
- **Carecas Infotec e JKL Decor não foram modificados:** pilotos dependem do Blueprint congelado. Experimento de opt-in no renderer/tipo/config foi descartado; nenhum delta nesses arquivos. Seus atrasos permanecem bloqueados para uma solução autorizada fora dessa superfície congelada.
- `src/styles.css`, Header/Footer/logo/fontes/manifests institucionais, renderer Blueprint, preço, contato, SEO, catálogo e agentes intactos.
- A animação institucional existente de `main` (520ms) também atrasa a exibição: não foi alterada. A prova do opt-in aguarda seu término e mantém o IntersectionObserver retido. Portanto não prova eliminação de todo render delay nem score ≥90.
- Imagens derivadas ausentes no sandbox foram reconstruídas pelo gerador existente; originais e lockfile preservados. Não houve novos assets oficiais ou substituição editorial.

### Evidência local

| Verificação | Resultado |
| --- | --- |
| 10 páginas, larguras 360/393/430/768/1024/1440/1920 + reduced-motion | 80 verificações PASS; zero overflow/pageerror; título crítico não reocultado com observer retido |
| Imagens priority dessas páginas | Todas carregadas após reconstrução local prevista pelo projeto |
| Funil individual | 10 aberturas/fechamentos PASS; nenhum envio de lead/mensagem/pedido |
| JavaScript desabilitado | 10 títulos críticos presentes e visíveis |
| Testes motion/performance/Centro Mega pertinentes | 35 PASS / 0 FAIL, 7 arquivos |
| Brand integrity | PASS, 6 assets protegidos |
| Portfolio boundaries | PASS, 98 clientes isolados |
| Portfolio metadata | PASS, 2 rotas canônicas |
| Harness build | Última entrada `build OK`; nenhum build manual redundante |

As capturas de Angel Mix desktop/mobile e Centro Mega mobile foram inspecionadas. A prova não altera baseline, não autoriza release nem comprova envio de contato em produção. Nova medição e gate visual completo devem rodar no HEAD reconciliado pelo CI autorizado.

### Suíte geral: FAIL preservado

`bun test`: **1221 PASS / 2 FAIL**, 1223 testes/219 arquivos, 46s. Falhas: `user_ref` 100 invocações (timeout 5s) e criação do usuário A no teste portal (timeout/request ECONNRESET). Stack deste último mostra fetch/AbortSignal substituído por happy-dom ao executar a suíte inteira. Reproduzido PASS dos 2 testes RLS quando executados separadamente; não reclassificar suíte FAIL como PASS. Um agrupamento intermediário também misturou ambiente DOM com módulo server-only; 17 PASS/1 FAIL/1 ERROR, resultado rejeitado como homologação. Nenhum timeout, threshold ou assert enfraquecido.

Bun disponível 1.4.4, requisito 1.4.0; versões/dependências não alteradas. Build/Bun 1.4.0 canônico aguardam CI na candidata reconciliada. Root AGENTS já excede o budget e contém regras do usuário: nenhuma compressão ou inclusão de decisão técnica nesse arquivo foi permitida; regra de implementação descrita aqui para revisão.

## GitHub/Vercel e fila reaproveitada

- #548 HEAD `a3d44a7930817eebbeb2659119758f021d438117`, Draft, 4 commits exclusivos / 1 atrás da main conferida `58e5f5ee`. Build/estáticos/hidratação/compatibilidade aprovados; gate compartilhado terminou SUCCESS às 07:02:22 UTC, [job 138268989534](https://github.com/hrq16000/zeroweb-2026/actions/runs/45342313309/job/138268989534). Lighthouse/novo portfolio pulados por escopo, não PASS universal.
- #530 HEAD `6cf27155c709bff5c130e65e2284a335e378373b`, Draft, 21 exclusivos / 9 atrás no compare consultado. QA individual Doce Coração aprovado; gate visual e três shards globais reprovados. Implementação não alterada ou descartada.
- Atualização de ambas as branches respondeu HTTP 403 citando restrições de OAuth App da organização; não contornado por Git/CLI/outro ator. **Bloqueio externo para reconciliação e PR→main**; nenhum merge realizado.
- Vercel agora acessível em leitura; projeto TanStack Start/Node 24.x confirmado. Production consultada `873a1938` permanece ERROR, não repetida; último READY histórico `58032d30` permanece referência, não release desta rodada.
- Rodada 3 preparada pela fila R1: #548 reconciliada/gates → Doce/BPL → Fran/Marli/Toop/Letícia → Relopar original → Dona Garimpeira somente após material real; São Francisco/Moreira em reconciliações separadas. Não iniciada.

## Próximos passos bloqueados

1. Organização GitHub liberar a integração autorizada para reconciliar #548/#530 sem perder deltas; não tentar bypass.
2. CI obter método seguro de comprovação RLS e executar gates no HEAD reconciliado, preservando FAIL/SKIP reais.
3. Carecas/JKL requerem solução respeitando o Blueprint congelado; dez candidatos ainda precisam LHCI/visual canônicos. A animação institucional medida permanece intocada.
4. Suíte geral necessita diagnóstico de isolamento DOM/rede e user_ref sem afrouxar testes; build completo na versão Bun exigida permanece externo.
5. Sem integração/publicação/rodada comercial até os gates de release aprovarem.