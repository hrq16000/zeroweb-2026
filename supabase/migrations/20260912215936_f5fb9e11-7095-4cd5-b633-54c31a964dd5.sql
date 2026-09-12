CREATE TABLE IF NOT EXISTS public.portfolio_funnel_recipient_backup (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  taken_at timestamptz NOT NULL DEFAULT now(),
  label text NOT NULL DEFAULT '',
  client_key text NOT NULL,
  slug text NOT NULL DEFAULT '',
  funnel_recipient text NOT NULL DEFAULT '',
  funnel_enabled boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.portfolio_funnel_recipient_backup TO service_role;
ALTER TABLE public.portfolio_funnel_recipient_backup ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read funnel recipient backup"
  ON public.portfolio_funnel_recipient_backup FOR SELECT TO authenticated
  USING (public.is_admin_or_super(auth.uid()));