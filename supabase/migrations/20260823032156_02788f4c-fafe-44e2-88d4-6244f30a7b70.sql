CREATE TABLE public.url_index_watch (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL UNIQUE,
  section text NOT NULL DEFAULT 'portfolio',
  sitemap text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_checked_at timestamptz,
  indexed boolean NOT NULL DEFAULT false,
  indexed_at timestamptz,
  coverage_state text,
  last_error text,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.url_index_watch TO authenticated;
GRANT ALL ON public.url_index_watch TO service_role;

ALTER TABLE public.url_index_watch ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins manage url_index_watch"
ON public.url_index_watch FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE INDEX idx_url_index_watch_section ON public.url_index_watch (section, indexed);