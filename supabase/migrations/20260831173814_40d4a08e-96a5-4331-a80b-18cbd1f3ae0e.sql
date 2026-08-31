CREATE TABLE IF NOT EXISTS public.portfolio_client_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key text NOT NULL UNIQUE,
  slug text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  seo_keywords text NOT NULL DEFAULT '',
  canonical_url text NOT NULL DEFAULT '',
  social_image_url text NOT NULL DEFAULT '',
  funnel_recipient text NOT NULL DEFAULT '',
  funnel_enabled boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT false,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.portfolio_client_settings_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key text NOT NULL,
  field text NOT NULL,
  old_value text,
  new_value text,
  actor uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolio_client_settings_history_key_idx
  ON public.portfolio_client_settings_history (client_key, created_at DESC);

GRANT SELECT ON public.portfolio_client_settings TO authenticated;
GRANT SELECT ON public.portfolio_client_settings_history TO authenticated;
GRANT ALL ON public.portfolio_client_settings TO service_role;
GRANT ALL ON public.portfolio_client_settings_history TO service_role;

ALTER TABLE public.portfolio_client_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_client_settings_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_client_settings_admin_read"
  ON public.portfolio_client_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_super_admin(auth.uid()));

CREATE POLICY "portfolio_client_settings_history_admin_read"
  ON public.portfolio_client_settings_history FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_super_admin(auth.uid()));