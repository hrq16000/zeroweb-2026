CREATE TABLE public.lgpd_requests (
  id uuid primary key default gen_random_uuid(),
  protocol text not null unique,
  request_type text not null,
  full_name text not null,
  email text,
  whatsapp text,
  document_hint text,
  message text,
  status text not null default 'received',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT ALL ON public.lgpd_requests TO service_role;

ALTER TABLE public.lgpd_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lgpd_requests_admin_read" ON public.lgpd_requests
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

GRANT SELECT ON public.lgpd_requests TO authenticated;

CREATE TRIGGER update_lgpd_requests_updated_at
BEFORE UPDATE ON public.lgpd_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();