ALTER TABLE public.popup_configs
  ADD COLUMN IF NOT EXISTS sample_rate numeric NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS simulation_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notify_channels jsonb NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'popup_configs_sample_rate_range'
  ) THEN
    ALTER TABLE public.popup_configs
      ADD CONSTRAINT popup_configs_sample_rate_range CHECK (sample_rate >= 0 AND sample_rate <= 1);
  END IF;
END $$;