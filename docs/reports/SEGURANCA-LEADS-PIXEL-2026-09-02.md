# Relatório — Segurança, Leads de clientes e Pixel do quiz (2026-09-02)

## 1. Findings de segurança

### 1.1 `license_audit_usage_no_check` (ERROR) — resolvido
- **Causa raiz:** `getLicenseAudit` e `getLicenseUsage` em `src/lib/licenses.functions.ts`
  consultavam `license_audit_log` / `license_usage_metrics` com o cliente de serviço
  (RLS ignorada) apenas com `requireSupabaseAuth`, sem a checagem de super admin /
  membro do portal que as demais funções do arquivo aplicam. Qualquer usuário
  autenticado com um `license_id` podia ler o histórico e o uso de outro portal.
- **Correção:** novo helper `authorizeLicenseRead(userId, licenseId)` — libera para
  super admin ou para membro do `portal_id` dono da licença; caso contrário lança
  `forbidden`. Aplicado nas duas funções antes de qualquer consulta.
- **Evidência:** `bun test` 245/245 verde; build sem erros; funções sem caminho de
  leitura sem autorização (revisão linha a linha do arquivo).

### 1.2 `health_db_unauth_reload` (WARN) — resolvido
- **Causa raiz:** `/api/public/health-db?reload=1` chamava `pgrst_reload_schema`
  com o cliente de serviço sem autenticação nem rate limit.
- **Correção:** o ramo de reload agora exige o mesmo segredo (`x-cron-secret`) dos
  hooks de manutenção via `requireCronSecret`; sem o cabeçalho o endpoint só
  responde ao health-check somente-leitura.

### 1.3 Licenças de dependências
- Nenhuma dependência nova foi adicionada nesta entrega; o lockfile (`bun.lock`)
  permanece intacto.

## 2. `/app/leads` — dados reais e conversão
- A tela já consome o banco real (`vw_unified_leads`, `dynamic_form_leads`,
  `whatsapp_redirect_tokens`), não apenas leads do quiz.
- Métricas de conversão: painel "Conversão do quiz" (lead → intenção → contato real)
  e o novo painel **Pixel do quiz** (sessões, abandono por etapa, respostas clicadas,
  taxa de conversão até o WhatsApp).

## 3. `/app/leads-clientes`
- Lista todos os leads com telefone, com busca por nome/telefone/segmento e filtros
  por segmento e etapa.
- Ficha lateral (`getLeadDossier`) com dados, respostas do diagnóstico e histórico
  completo de interações: captura, geração de link de WhatsApp, abertura real,
  eventos do pixel e ações administrativas de auditoria.
- Botão "Conversa" monta a URL do WhatsApp no servidor a partir do telefone do
  próprio lead (admin-only, registrado em `audit_logs`).

## 4. Pixel do quiz (LGPD)
- Tabela `quiz_pixel_events`: apenas identificador anônimo de sessão
  (`sessionStorage`, sem cookie), quiz, etapa, tipo de evento e rótulo da alternativa.
- **Não grava** nome, telefone, e-mail, IP ou user-agent.
- RLS: inserção pública validada por política (tamanho e tipo de evento);
  leitura somente pelo portal admin através de server functions com checagem de papel.
- Eventos: `quiz_view`, `step_view`, `answer_click`, `step_complete`, `abandon`,
  `submit`, `whatsapp_intent`, `whatsapp_open`.

## 5. Portfólio
- O bloco "Sobre o projeto" foi movido para **depois** do conteúdo do cliente em
  `PortfolioStandardShell`; o hero e o CTA do cliente voltam a abrir a página.
- `bun run validate:portfolio-boundaries` → OK, 56 sites isolados.

## Manutenção
- Para reload do schema: `curl -H "x-cron-secret: $CRON_SECRET" ".../api/public/health-db?reload=1"`.
- Retenção sugerida do pixel: expurgar `quiz_pixel_events` com mais de 180 dias.

## 6. Adenda 2026-09-02 (turno de publicação)

- **Licenças:** nova varredura de segurança não retorna mais o finding de
  `license_audit`/`license_usage` — correção confirmada.
- **Adulteração de preço:** triggers `guard_orders_customer_update` e
  `guard_cart_funnel_amount_update` bloqueiam alteração de `items`, `total`,
  `total_amount` e `payment_status` por usuários finais; apenas `service_role`
  e super admin podem alterá-los.
- **Search Console:** consulta real à propriedade verificada
  `https://0web.com.br/` (04/08–31/08) retornou zero linhas — o site ainda não
  acumulou impressões. O snapshot registra data/período reais; nenhum número é
  inventado. Painel `/app/seo` ganhou o bloco "Palavras-chave monitoradas"
  (inclui "criação de site institucional") e mantém alertas de queda de
  cliques/impressões/posição com limiar configurável.
- **Build:** o import de `gsc-latest.json` já usa `@/data/...` (dentro de `src/`,
  empacotável pelo worker); `bun run build` conclui sem erros.
