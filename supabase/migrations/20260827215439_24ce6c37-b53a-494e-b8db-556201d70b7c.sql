CREATE TABLE public.popup_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT true,
  kicker text,
  title text,
  description text,
  highlight text,
  cta_label text,
  dismiss_label text,
  funnel_slug text,
  bullets text[],
  rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  alert_thresholds jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.popup_configs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.popup_configs TO authenticated;
GRANT ALL ON public.popup_configs TO service_role;

ALTER TABLE public.popup_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "popup_configs_public_read_enabled"
  ON public.popup_configs FOR SELECT TO anon, authenticated
  USING (enabled = true);

CREATE POLICY "popup_configs_admin_read"
  ON public.popup_configs FOR SELECT TO authenticated
  USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "popup_configs_admin_insert"
  ON public.popup_configs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE POLICY "popup_configs_admin_update"
  ON public.popup_configs FOR UPDATE TO authenticated
  USING (public.is_admin_or_super(auth.uid()))
  WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE POLICY "popup_configs_admin_delete"
  ON public.popup_configs FOR DELETE TO authenticated
  USING (public.is_admin_or_super(auth.uid()));

CREATE TRIGGER trg_popup_configs_updated_at
  BEFORE UPDATE ON public.popup_configs
  FOR EACH ROW EXECUTE FUNCTION public.mk_touch_updated_at();

CREATE TABLE public.popup_config_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  actor uuid,
  action text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.popup_config_audit TO authenticated;
GRANT ALL ON public.popup_config_audit TO service_role;

ALTER TABLE public.popup_config_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "popup_config_audit_admin_read"
  ON public.popup_config_audit FOR SELECT TO authenticated
  USING (public.is_admin_or_super(auth.uid()));

CREATE OR REPLACE FUNCTION public.popup_configs_audit_trg()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.popup_config_audit(slug, actor, action, old_values, new_values)
      VALUES (NEW.slug, auth.uid(), 'create', NULL, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.popup_config_audit(slug, actor, action, old_values, new_values)
      VALUES (NEW.slug, auth.uid(), 'update', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSE
    INSERT INTO public.popup_config_audit(slug, actor, action, old_values, new_values)
      VALUES (OLD.slug, auth.uid(), 'delete', to_jsonb(OLD), NULL);
    RETURN OLD;
  END IF;
END $$;

CREATE TRIGGER trg_popup_configs_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.popup_configs
  FOR EACH ROW EXECUTE FUNCTION public.popup_configs_audit_trg();