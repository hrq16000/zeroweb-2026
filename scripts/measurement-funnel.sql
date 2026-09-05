-- MEASUREMENT_TRUTH V2 — consulta operacional de funil (somente leitura).
-- Fonte de leitura de referência. Não existe painel novo.
--
-- CUTOVER OFICIAL: 2026-09-05T22:00:00Z (constante única em
-- src/lib/telemetry-v2.ts → MEASUREMENT_TRUTH_V2_CUTOVER). Este arquivo é a
-- única réplica operacional dela, para uso em SQL.
--
-- Estágios (fontes distintas, nunca inferidas umas das outras):
--   SESSION           = analytics_events.session_id distinto
--   PAGE_VIEW         = event_name = 'page_view'
--   CTA_CLICK         = intenção: funnel_open | wa_funnel_open | cta_click |
--                       contact_cta_click | checkout_started
--   LEAD_CREATED      = dynamic_form_leads (registro real)
--   WHATSAPP_REDIRECT = whatsapp_redirect_tokens.used_at (consumo server-side)
--   ORDER             = orders (quando aplicável)
--
-- Filtro comercial padrão: tv = '2', traffic_type = 'human', >= cutover.
-- Bot/automation/internal/unknown NÃO são apagados: audite trocando :traffic.

\set cutover '2026-09-05 22:00:00+00'
\set traffic 'human'

with v2 as (
  select
    session_id,
    event_name,
    path,
    created_at,
    metadata_json->>'traffic_type'                as traffic_type,
    coalesce(metadata_json->>'ft_channel','unknown')  as ft_channel,
    coalesce(metadata_json->>'ft_source','unknown')   as ft_source,
    coalesce(metadata_json->>'ft_medium','none')      as ft_medium,
    coalesce(metadata_json->>'ft_campaign','none')    as ft_campaign,
    substring(path from '/portfolio/([^/?#]+)')   as project_slug,
    substring(path from '/servicos/([^/?#]+)')    as service_slug
  from analytics_events
  where created_at >= timestamptz :'cutover'
    and metadata_json->>'tv' = '2'
    and metadata_json->>'traffic_type' = :'traffic'
),
surface as (
  select
    path,
    project_slug,
    service_slug,
    ft_channel, ft_source, ft_medium, ft_campaign,
    count(distinct session_id) as sessions,
    count(*) filter (where event_name = 'page_view') as page_views,
    count(distinct session_id) filter (
      where event_name in ('funnel_open','wa_funnel_open','cta_click',
                           'contact_cta_click','checkout_started')
    ) as cta_sessions
  from v2
  group by 1,2,3,4,5,6,7
),
-- LEAD e WHATSAPP vêm das suas próprias tabelas, nunca de eventos de clique.
lead_stage as (
  select
    coalesce(
      substring(l.metadata_json->>'page_url' from '/portfolio/([^/?#]+)'),
      nullif(trim(l.metadata_json->>'client_key'), '')
    ) as project_slug,
    nullif(l.metadata_json->>'session_id','') as session_id,
    count(*) as leads,
    count(*) filter (
      where exists (
        select 1 from whatsapp_redirect_tokens t
        where t.lead_id = l.id and t.used_at is not null
      )
    ) as whatsapp_redirects
  from dynamic_form_leads l
  where l.created_at >= timestamptz :'cutover'
  group by 1,2
),
leads_by_project as (
  select project_slug,
         sum(leads) as leads,
         sum(whatsapp_redirects) as whatsapp_redirects,
         sum(leads) filter (where session_id is not null) as leads_with_session
  from lead_stage group by 1
),
maturity as (
  select case
    when extract(epoch from (now() - timestamptz :'cutover')) < 86400 then 'INSUFFICIENT'
    when extract(epoch from (now() - timestamptz :'cutover')) < 7*86400 then 'EARLY'
    else 'USABLE'
  end as data_maturity
)
select
  s.path,
  coalesce(s.project_slug, s.service_slug, '—') as entity,
  s.ft_channel, s.ft_source, s.ft_medium, s.ft_campaign,
  s.sessions,
  s.page_views,
  s.cta_sessions,
  coalesce(l.leads, 0)              as leads_created,
  coalesce(l.leads_with_session, 0) as leads_with_session_link,
  coalesce(l.whatsapp_redirects, 0) as whatsapp_redirects,
  -- taxas só existem com denominador; nunca zero fabricado
  case when s.sessions > 0 then round(s.cta_sessions::numeric / s.sessions, 4) end as cta_rate,
  (select data_maturity from maturity) as data_maturity,
  case when s.sessions < 30 then 'LOW_SAMPLE' else 'OK' end as sample_status
from surface s
left join leads_by_project l on l.project_slug = s.project_slug
order by s.sessions desc, s.page_views desc
limit 200;

-- Auditoria explícita (não comercial): trocar \set traffic para
-- 'bot' | 'automation' | 'internal' | 'unknown'.
--
-- Separação V1/V2 no mesmo período (nunca somar silenciosamente):
-- select coalesce(metadata_json->>'tv','1') as telemetry_version,
--        count(*), count(distinct session_id)
-- from analytics_events
-- where created_at >= timestamptz '2026-09-05 22:00:00+00'
-- group by 1;
--
-- Prova social por sessão (contrato: no máximo 1 por sessão/contexto):
-- select round(count(*) filter (where event_name like '%social_proof_view')::numeric
--        / greatest(count(distinct session_id),1), 2) as social_proof_per_session
-- from analytics_events
-- where created_at >= timestamptz '2026-09-05 22:00:00+00'
--   and metadata_json->>'tv' = '2';
