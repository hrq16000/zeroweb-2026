create table if not exists public.portfolio_destination_requests (
  id uuid primary key default gen_random_uuid(),
  client_key text not null,
  slug text,
  channel text not null default 'whatsapp',
  sent_at timestamptz not null default now(),
  sent_note text,
  status text not null default 'ENVIADO'
    check (status in ('ENVIADO','RESPONDIDO','SEM_RESPOSTA','RECUSADO','NUMERO_RECEBIDO')),
  response_at timestamptz,
  response_note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_destination_requests_client_idx
  on public.portfolio_destination_requests (client_key, sent_at desc);

grant select, insert, update, delete on public.portfolio_destination_requests to authenticated;
grant all on public.portfolio_destination_requests to service_role;

alter table public.portfolio_destination_requests enable row level security;

drop policy if exists "admins manage destination requests" on public.portfolio_destination_requests;
create policy "admins manage destination requests"
  on public.portfolio_destination_requests
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.is_super_admin(auth.uid()))
  with check (public.has_role(auth.uid(), 'admin') or public.is_super_admin(auth.uid()));

drop trigger if exists portfolio_destination_requests_touch on public.portfolio_destination_requests;
create trigger portfolio_destination_requests_touch
  before update on public.portfolio_destination_requests
  for each row execute function public.touch_updated_at();