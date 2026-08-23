ALTER TABLE public.landing_overrides_history
  DROP CONSTRAINT IF EXISTS landing_overrides_history_action_check;

ALTER TABLE public.landing_overrides_history
  ADD CONSTRAINT landing_overrides_history_action_check
  CHECK (action = ANY (ARRAY['publish','unpublish','rollback','draft','preview']));

ALTER TABLE public.landing_overrides_history
  ADD COLUMN IF NOT EXISTS changed_fields text[] NOT NULL DEFAULT ARRAY[]::text[];