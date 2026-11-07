-- 0WEB portfolio booking: núcleo transacional isolado por client_key.
-- DRAFT de infraestrutura: NÃO habilita agendas públicas nem acesso do cliente.
-- A migração deve ser aplicada no backend compartilhado oficial e testada com
-- RLS real antes de expor endpoints, login ou reservas.
--
-- Deliberadamente sem políticas para anon/authenticated nesta rodada:
-- todo acesso fica fechado por padrão; somente o backend confiável pode
-- provisionar dados até que as RPCs com OAuth e RLS sejam homologadas.
-- Referência: docs/PORTFOLIO_BOOKING_CLIENT_ADMIN_STANDARD.md

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create table if not exists public.portfolio_booking_tenants (
  client_key text primary key,
  timezone text not null default 'America/Sao_Paulo',
  enabled boolean not null default false,
  min_notice_minutes integer not null default 60
    check (min_notice_minutes between 0 and 10080),
  max_advance_days integer not null default 90
    check (max_advance_days between 1 and 365),
  step_minutes integer not null default 15
    check (step_minutes between 5 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_tenant_key_format
    check (client_key ~ '^[a-z0-9][a-z0-9_-]{1,100}$'),
  constraint booking_tenant_timezone_required check (length(btrim(timezone)) > 0)
);

create table if not exists public.portfolio_booking_memberships (
  client_key text not null references public.portfolio_booking_tenants(client_key),
  user_id uuid not null references auth.users(id) on delete cascade,
  google_email text not null,
  role text not null check (role in ('owner','manager','staff')),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (client_key, user_id),
  constraint booking_membership_google_email_normalized
    check (google_email = lower(btrim(google_email)) and position('@' in google_email) > 1)
);

create index if not exists booking_memberships_by_user
  on public.portfolio_booking_memberships (user_id, active);

create table if not exists public.portfolio_booking_services (
  id uuid primary key default gen_random_uuid(),
  client_key text not null references public.portfolio_booking_tenants(client_key),
  name text not null check (length(btrim(name)) between 2 and 160),
  description text,
  duration_minutes integer not null check (duration_minutes between 5 and 720),
  buffer_minutes integer not null default 0 check (buffer_minutes between 0 and 120),
  price_cents integer check (price_cents is null or price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (client_key, id)
);

create table if not exists public.portfolio_booking_professionals (
  id uuid primary key default gen_random_uuid(),
  client_key text not null references public.portfolio_booking_tenants(client_key),
  display_name text not null check (length(btrim(display_name)) between 2 and 160),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (client_key, id)
);

create table if not exists public.portfolio_booking_professional_services (
  client_key text not null,
  professional_id uuid not null,
  service_id uuid not null,
  primary key (client_key, professional_id, service_id),
  foreign key (client_key, professional_id)
    references public.portfolio_booking_professionals (client_key, id) on delete cascade,
  foreign key (client_key, service_id)
    references public.portfolio_booking_services (client_key, id) on delete cascade
);

create table if not exists public.portfolio_booking_work_hours (
  id uuid primary key default gen_random_uuid(),
  client_key text not null,
  professional_id uuid not null,
  weekday integer not null check (weekday between 0 and 6),
  starts_local time not null,
  ends_local time not null,
  constraint booking_work_hours_positive check (starts_local < ends_local),
  foreign key (client_key, professional_id)
    references public.portfolio_booking_professionals (client_key, id) on delete cascade
);

create index if not exists booking_work_hours_lookup
  on public.portfolio_booking_work_hours (client_key, professional_id, weekday);

create table if not exists public.portfolio_booking_exceptions (
  id uuid primary key default gen_random_uuid(),
  client_key text not null references public.portfolio_booking_tenants(client_key),
  professional_id uuid,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint booking_exceptions_positive check (starts_at < ends_at),
  foreign key (client_key, professional_id)
    references public.portfolio_booking_professionals (client_key, id) on delete cascade
);

create index if not exists booking_exceptions_lookup
  on public.portfolio_booking_exceptions (client_key, starts_at, ends_at);

create table if not exists public.portfolio_booking_appointments (
  id uuid primary key default gen_random_uuid(),
  client_key text not null references public.portfolio_booking_tenants(client_key),
  professional_id uuid not null,
  service_id uuid not null,
  customer_id uuid not null references auth.users(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reserved_until timestamptz not null,
  status text not null default 'requested'
    check (status in ('requested','confirmed','completed','cancelled','no_show')),
  idempotency_key text not null check (length(idempotency_key) between 16 and 128),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_appointments_positive
    check (starts_at < ends_at and ends_at <= reserved_until),
  unique (client_key, id),
  unique (client_key, customer_id, idempotency_key),
  foreign key (client_key, professional_id)
    references public.portfolio_booking_professionals (client_key, id),
  foreign key (client_key, service_id)
    references public.portfolio_booking_services (client_key, id),
  foreign key (client_key, professional_id, service_id)
    references public.portfolio_booking_professional_services
      (client_key, professional_id, service_id)
);

-- PostgreSQL exclusion é atômico inclusive sob concorrência entre transações:
-- não é possível manter duas reservas ativas sobrepostas para o profissional.
-- [) permite agendamentos adjacentes no exato fim do bloqueio.
alter table public.portfolio_booking_appointments
  add constraint booking_no_overlapping_active_slots
  exclude using gist (
    client_key with =,
    professional_id with =,
    tstzrange(starts_at, reserved_until, '[)') with &&
  )
  where (status in ('requested', 'confirmed'));

create index if not exists booking_appointments_customer
  on public.portfolio_booking_appointments (customer_id, starts_at desc);
create index if not exists booking_appointments_calendar
  on public.portfolio_booking_appointments (client_key, professional_id, starts_at);

create table if not exists public.portfolio_booking_audit (
  id bigint generated always as identity primary key,
  client_key text not null references public.portfolio_booking_tenants(client_key),
  appointment_id uuid,
  actor_user_id uuid references auth.users(id),
  action text not null check (length(btrim(action)) between 3 and 80),
  prior_status text,
  next_status text,
  created_at timestamptz not null default now(),
  foreign key (client_key, appointment_id)
    references public.portfolio_booking_appointments (client_key, id)
);

create index if not exists booking_audit_by_tenant
  on public.portfolio_booking_audit (client_key, created_at desc);

-- Nenhuma tabela nova é aberta ao visitante pelo mero fato de existir.
alter table public.portfolio_booking_tenants enable row level security;
alter table public.portfolio_booking_memberships enable row level security;
alter table public.portfolio_booking_services enable row level security;
alter table public.portfolio_booking_professionals enable row level security;
alter table public.portfolio_booking_professional_services enable row level security;
alter table public.portfolio_booking_work_hours enable row level security;
alter table public.portfolio_booking_exceptions enable row level security;
alter table public.portfolio_booking_appointments enable row level security;
alter table public.portfolio_booking_audit enable row level security;

-- Impede privilégios legados por default privileges no schema public.
revoke all on table
  public.portfolio_booking_tenants,
  public.portfolio_booking_memberships,
  public.portfolio_booking_services,
  public.portfolio_booking_professionals,
  public.portfolio_booking_professional_services,
  public.portfolio_booking_work_hours,
  public.portfolio_booking_exceptions,
  public.portfolio_booking_appointments,
  public.portfolio_booking_audit
from public, anon, authenticated;

revoke all on sequence public.portfolio_booking_audit_id_seq from public, anon, authenticated;

comment on table public.portfolio_booking_appointments is
  '0WEB: núcleo reservado sem endpoint público; confirmar agenda somente após OAuth Google, políticas RLS, validação server-side e E2E real.';
