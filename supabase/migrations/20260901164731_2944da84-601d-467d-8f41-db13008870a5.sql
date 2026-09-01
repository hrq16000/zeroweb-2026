CREATE TABLE public.blog_seo_overrides (
  slug TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  schema_extra JSONB,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT blog_seo_overrides_title_len CHECK (title IS NULL OR char_length(title) BETWEEN 10 AND 120),
  CONSTRAINT blog_seo_overrides_description_len CHECK (description IS NULL OR char_length(description) BETWEEN 50 AND 320),
  CONSTRAINT blog_seo_overrides_schema_shape CHECK (schema_extra IS NULL OR jsonb_typeof(schema_extra) = 'object')
);

GRANT SELECT ON public.blog_seo_overrides TO anon;
GRANT SELECT ON public.blog_seo_overrides TO authenticated;
GRANT ALL ON public.blog_seo_overrides TO service_role;

ALTER TABLE public.blog_seo_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_seo_overrides_public_read"
  ON public.blog_seo_overrides FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "blog_seo_overrides_admin_insert"
  ON public.blog_seo_overrides FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "blog_seo_overrides_admin_update"
  ON public.blog_seo_overrides FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "blog_seo_overrides_admin_delete"
  ON public.blog_seo_overrides FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

GRANT UPDATE, INSERT, DELETE ON public.blog_seo_overrides TO authenticated;

CREATE TRIGGER blog_seo_overrides_touch
  BEFORE UPDATE ON public.blog_seo_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();