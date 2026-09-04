ALTER TABLE public.portfolio_client_settings
  ADD COLUMN IF NOT EXISTS segment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS state text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS summary text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS logo_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_image_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_headline text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_subheadline text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS brand_colors jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS cta_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS share_copy text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS social_version text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'imported',
  ADD COLUMN IF NOT EXISTS content_version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS source_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'portfolio_client_settings_lifecycle_status_check'
  ) THEN
    ALTER TABLE public.portfolio_client_settings
      ADD CONSTRAINT portfolio_client_settings_lifecycle_status_check
      CHECK (lifecycle_status IN ('imported','draft','published','archived'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS portfolio_client_settings_lifecycle_idx
  ON public.portfolio_client_settings (lifecycle_status);
