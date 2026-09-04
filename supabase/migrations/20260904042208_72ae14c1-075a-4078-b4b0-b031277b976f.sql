alter table public.portfolio_client_settings
  add column if not exists project_kind text not null default 'legacy',
  add column if not exists preset text not null default 'editorial',
  add column if not exists services jsonb not null default '[]'::jsonb,
  add column if not exists gallery_items jsonb not null default '[]'::jsonb,
  add column if not exists content_blocks jsonb not null default '{}'::jsonb,
  add column if not exists catalog_cover_url text not null default '',
  add column if not exists cover_focal jsonb not null default '{}'::jsonb,
  add column if not exists hero_focal jsonb not null default '{}'::jsonb,
  add column if not exists ready_at timestamptz;

alter table public.portfolio_client_settings drop constraint if exists portfolio_client_settings_lifecycle_status_check;
alter table public.portfolio_client_settings
  add constraint portfolio_client_settings_lifecycle_status_check
  check (lifecycle_status in ('imported','draft','ready','published','archived'));

alter table public.portfolio_client_settings drop constraint if exists portfolio_client_settings_project_kind_check;
alter table public.portfolio_client_settings
  add constraint portfolio_client_settings_project_kind_check
  check (project_kind in ('legacy','managed'));

create index if not exists portfolio_client_settings_kind_lifecycle_idx
  on public.portfolio_client_settings (project_kind, lifecycle_status);
create unique index if not exists portfolio_client_settings_slug_key
  on public.portfolio_client_settings (slug);