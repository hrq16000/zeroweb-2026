CREATE TABLE public.gsc_page_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  page text NOT NULL,
  page_type text NOT NULL DEFAULT 'other',
  clicks integer NOT NULL DEFAULT 0,
  impressions integer NOT NULL DEFAULT 0,
  ctr numeric NOT NULL DEFAULT 0,
  position numeric NOT NULL DEFAULT 0,
  query text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (date, page, query)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gsc_page_metrics TO authenticated;
GRANT ALL ON public.gsc_page_metrics TO service_role;
ALTER TABLE public.gsc_page_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage gsc_page_metrics" ON public.gsc_page_metrics FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_gsc_page_metrics_date ON public.gsc_page_metrics (date DESC);
CREATE INDEX idx_gsc_page_metrics_type ON public.gsc_page_metrics (page_type, date DESC);

CREATE TABLE public.gsc_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  site_url text,
  status text NOT NULL DEFAULT 'ok',
  rows_count integer NOT NULL DEFAULT 0,
  error_message text,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gsc_sync_log TO authenticated;
GRANT ALL ON public.gsc_sync_log TO service_role;
ALTER TABLE public.gsc_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage gsc_sync_log" ON public.gsc_sync_log FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.seo_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'warning',
  url text,
  title text NOT NULL,
  probable_cause text,
  suggested_fix text,
  fix_link text,
  notified_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_alerts TO authenticated;
GRANT ALL ON public.seo_alerts TO service_role;
ALTER TABLE public.seo_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage seo_alerts" ON public.seo_alerts FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_seo_alerts_open ON public.seo_alerts (resolved_at, created_at DESC);

CREATE TABLE public.indexnow_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  engine text NOT NULL DEFAULT 'indexnow',
  status text NOT NULL DEFAULT 'pending',
  response_code integer,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.indexnow_submissions TO authenticated;
GRANT ALL ON public.indexnow_submissions TO service_role;
ALTER TABLE public.indexnow_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage indexnow_submissions" ON public.indexnow_submissions FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_indexnow_created ON public.indexnow_submissions (created_at DESC);