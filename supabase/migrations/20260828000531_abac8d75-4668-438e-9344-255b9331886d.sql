create table if not exists public.portfolio_web_vitals (
  id uuid primary key default gen_random_uuid(),
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9_-]{0,80}$'),
  metric text not null check (metric in ('LCP', 'CLS', 'INP')),
  value numeric not null check (value >= 0 and value <= 120000),
  metric_id text not null check (char_length(metric_id) <= 80),
  path text not null check (char_length(path) <= 200),
  captured_at timestamptz not null default now()
);
create index if not exists portfolio_web_vitals_slug_metric_idx on public.portfolio_web_vitals (slug, metric, captured_at desc);
create index if not exists portfolio_web_vitals_captured_at_idx on public.portfolio_web_vitals (captured_at desc);
alter table public.portfolio_web_vitals enable row level security;
revoke all on public.portfolio_web_vitals from anon, authenticated;
grant select, insert on public.portfolio_web_vitals to service_role;