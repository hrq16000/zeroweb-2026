CREATE TABLE public.portfolio_place_seo (
  slug TEXT PRIMARY KEY,
  meta_title TEXT,
  meta_description TEXT,
  intro TEXT,
  local_business JSONB,
  published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.portfolio_place_seo TO anon;
GRANT SELECT ON public.portfolio_place_seo TO authenticated;
GRANT ALL ON public.portfolio_place_seo TO service_role;

ALTER TABLE public.portfolio_place_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_place_seo_public_read"
ON public.portfolio_place_seo FOR SELECT
TO anon, authenticated
USING (published = true);

CREATE POLICY "portfolio_place_seo_admin_all"
ON public.portfolio_place_seo FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER update_portfolio_place_seo_updated_at
BEFORE UPDATE ON public.portfolio_place_seo
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();