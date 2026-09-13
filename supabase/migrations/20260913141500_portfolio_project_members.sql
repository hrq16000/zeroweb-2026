-- Project-level authorization for the autonomous portfolio factory.
-- This migration is intentionally additive: existing admin/super-admin flows keep working.
-- A project membership may be created BEFORE the managed project itself so a super admin
-- can authorize a client to create their own project using the reserved client_key.

create table if not exists public.portfolio_project_members (
  id uuid primary key default gen_random_uuid(),
  client_key text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz,
  constraint portfolio_project_members_client_user_key unique (client_key, user_id)
);

create index if not exists idx_portfolio_project_members_user_active
  on public.portfolio_project_members (user_id, client_key)
  where revoked_at is null;

create index if not exists idx_portfolio_project_members_client_active
  on public.portfolio_project_members (client_key, role)
  where revoked_at is null;

alter table public.portfolio_project_members enable row level security;

-- Central server/RLS predicate. Global admins retain access. Non-admin users only receive
-- access to explicit memberships and never inherit another client's project.
create or replace function public.can_access_portfolio_project(
  _uid uuid,
  _client_key text,
  _write boolean default false
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _role text;
begin
  if _uid is null or nullif(trim(_client_key), '') is null then
    return false;
  end if;

  if public.is_super_admin(_uid) or public.has_role(_uid, 'admin') then
    return true;
  end if;

  select ppm.role
    into _role
  from public.portfolio_project_members ppm
  where ppm.user_id = _uid
    and ppm.client_key = _client_key
    and ppm.revoked_at is null
  limit 1;

  if _role is null then
    return false;
  end if;

  if _write then
    return _role in ('owner', 'editor');
  end if;

  return _role in ('owner', 'editor', 'viewer');
end;
$$;

revoke all on function public.can_access_portfolio_project(uuid, text, boolean) from public;
grant execute on function public.can_access_portfolio_project(uuid, text, boolean) to authenticated;
grant execute on function public.can_access_portfolio_project(uuid, text, boolean) to service_role;

-- Users can inspect their own active memberships. Global admins can inspect all.
drop policy if exists "portfolio members read own or admin" on public.portfolio_project_members;
create policy "portfolio members read own or admin"
on public.portfolio_project_members
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_super_admin(auth.uid())
  or public.has_role(auth.uid(), 'admin')
);

-- Membership grants/revocations are controlled by global administration. Project owners
-- deliberately cannot grant themselves access to another client.
drop policy if exists "portfolio members admin insert" on public.portfolio_project_members;
create policy "portfolio members admin insert"
on public.portfolio_project_members
for insert
to authenticated
with check (
  public.is_super_admin(auth.uid())
  or public.has_role(auth.uid(), 'admin')
);

drop policy if exists "portfolio members admin update" on public.portfolio_project_members;
create policy "portfolio members admin update"
on public.portfolio_project_members
for update
to authenticated
using (
  public.is_super_admin(auth.uid())
  or public.has_role(auth.uid(), 'admin')
)
with check (
  public.is_super_admin(auth.uid())
  or public.has_role(auth.uid(), 'admin')
);

drop policy if exists "portfolio members admin delete" on public.portfolio_project_members;
create policy "portfolio members admin delete"
on public.portfolio_project_members
for delete
to authenticated
using (
  public.is_super_admin(auth.uid())
  or public.has_role(auth.uid(), 'admin')
);

comment on table public.portfolio_project_members is
  'Project-level access control. super/admin are global; owner/editor/viewer are scoped to client_key.';
comment on column public.portfolio_project_members.client_key is
  'Stable project/client identity. May be reserved before the managed project is created.';
comment on column public.portfolio_project_members.revoked_at is
  'Soft revocation used to preserve an auditable access history.';
