-- MEASUREMENT_TRUTH V2 — consulta operacional de funil (somente leitura).
-- Não existe painel novo: esta query é a fonte de leitura de referência.
--
-- Estágios e fontes canônicas:
--   SESSION   = analytics_events.session_id distinto
--   PAGE_VIEW = analytics_events.event_name = 'page_view'      (V2)
--   CTA       = analytics_events.event_name IN ('funnel_open','wa_funnel_open')
--   LEAD      = dynamic_form_leads (atribuído por metadata_json->>page_url, fallback client_key)
--   WHATSAPP  = whatsapp_redirect_tokens.used_at IS NOT NULL
--
-- Separação V1/V2: eventos V2 têm metadata_json->>'tv' = '2'.
-- Nunca somar períodos que cruzem o cutover sem exibir a divisão.

\set cutover '2026-09-05T22:00:00Z'
\set days 30

with base as (
  select
    path,
    session_id,
    event_name,
    metadata_json->>'tv'           as tv,
    metadata_json->>'traffic_type' as traffic_type,
    coalesce(utm_source, 'unknown') as first_touch_source,
    utm_campaign,
    metadata_json->>'portfolio_slug' as project_slug,
    metadata_json->>'service_slug'   as service_slug
  from analytics_events
  where created_at >= now() - (:'days' || ' days')::interval
),
v2 as (select * from base where tv = '2' and traffic_type = 'human'),
page as (
  select
    path,
    first_touch_source,
    utm_campaign,
    count(distinct session_id)                                              as human_sessions,
    count(*) filter (where event_name = 'page_view')                        as page_views,
    count(*) filter (where event_name in ('funnel_open','wa_funnel_open'))  as cta
  from v2
  group by 1,2,3
),
leads as (
  select
    coalesce(
      substring(metadata_json->>'page_url' from '/portfolio/([^/?#]+)'),
      nullif(trim(metadata_json->>'client_key'), '')
    ) as slug,
    count(*) as leads,
    count(*) filter (
      where exists (
        select 1 from whatsapp_redirect_tokens t
        where t.lead_id = dynamic_form_leads.id and t.used_at is not null
      )
    ) as whatsapp
  from dynamic_form_leads
  where created_at >= now() - (:'days' || ' days')::interval
  group by 1
)
select
  p.path,
  p.first_touch_source,
  p.utm_campaign,
  p.human_sessions,
  p.page_views,
  p.cta,
  coalesce(l.leads, 0)    as leads,
  coalesce(l.whatsapp, 0) as whatsapp
from page p
left join leads l
  on l.slug = substring(p.path from '/portfolio/([^/?#]+)')
order by p.human_sessions desc, p.page_views desc
limit 200;

-- Divisão explícita PRE_V2 x V2 no mesmo período:
-- select coalesce(metadata_json->>'tv','1') as telemetry_version, count(*)
-- from analytics_events where created_at >= now() - interval '30 days' group by 1;
