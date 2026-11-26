-- Repair only the Infinito Spa public lead intake without changing the anon_insert_leads RLS policy.
-- No new database, service-role client, public read grants or dynamic_forms dependency.
CREATE OR REPLACE FUNCTION public.leads_before_insert()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  s_score integer; s_label text;
  cfg public.crm_settings%ROWTYPE;
  next_idx integer;
BEGIN
  -- Public intake must retain the neutral values checked by anon_insert_leads.
  -- Do not grant access to CRM settings or allow caller-controlled internal fields.
  IF current_user = 'anon' AND NEW.source = 'portfolio:infinito-spa' THEN
    IF NEW.status IS DISTINCT FROM 'new' OR NEW.assignee IS NOT NULL
      OR NEW.score IS DISTINCT FROM 0 OR NEW.score_label IS DISTINCT FROM 'baixa'
      OR NEW.portal_id IS NOT NULL OR NEW.temperature IS NOT NULL
      OR NEW.payload_json->>'clientKey' IS DISTINCT FROM 'infinito-spa'
      OR NEW.payload_json->'consentAccepted' IS DISTINCT FROM 'true'::jsonb
      OR NEW.name IS NULL OR length(trim(NEW.name)) = 0
      OR NEW.phone IS NULL OR length(trim(NEW.phone)) = 0
    THEN
      RAISE EXCEPTION 'invalid public lead' USING ERRCODE = 'check_violation';
    END IF;
    NEW.last_interaction := now();
    RETURN NEW;
  END IF;
  SELECT score, label INTO s_score, s_label FROM public.compute_lead_score(NEW);
  NEW.score := s_score; NEW.score_label := s_label;
  NEW.temperature := CASE WHEN s_score >= 70 THEN 'quente' WHEN s_score >= 40 THEN 'morno' ELSE 'frio' END;
  IF NEW.last_interaction IS NULL THEN NEW.last_interaction := now(); END IF;

  IF NEW.assignee IS NULL THEN
    SELECT * INTO cfg FROM public.crm_settings WHERE singleton = true LIMIT 1;
    IF cfg.distribution_mode = 'fixed' AND cfg.fixed_assignee IS NOT NULL THEN
      NEW.assignee := cfg.fixed_assignee;
    ELSIF cfg.distribution_mode = 'round_robin' AND array_length(cfg.assignees, 1) > 0 THEN
      next_idx := (cfg.round_robin_pointer % array_length(cfg.assignees, 1)) + 1;
      NEW.assignee := cfg.assignees[next_idx];
      UPDATE public.crm_settings SET round_robin_pointer = cfg.round_robin_pointer + 1, updated_at = now() WHERE singleton = true;
    END IF;
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.leads_after_change()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- The scoped audit trigger below writes the history for this public intake.
    IF current_user = 'anon' AND NEW.source = 'portfolio:infinito-spa' THEN
      RETURN NEW;
    END IF;
    INSERT INTO public.lead_history(lead_id, kind, to_value, note, actor)
    VALUES (NEW.id, 'created', NEW.status, COALESCE('Origem: ' || NEW.source, 'Lead criado'), 'system');
    IF NEW.assignee IS NOT NULL THEN
      INSERT INTO public.lead_history(lead_id, kind, to_value, actor) VALUES (NEW.id, 'assignment', NEW.assignee, 'system');
    END IF;
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.lead_history(lead_id, kind, from_value, to_value, actor)
    VALUES (NEW.id, 'status_change', OLD.status, NEW.status, 'admin');
    NEW.last_interaction := now();
  END IF;
  IF NEW.assignee IS DISTINCT FROM OLD.assignee THEN
    INSERT INTO public.lead_history(lead_id, kind, from_value, to_value, actor)
    VALUES (NEW.id, 'assignment', OLD.assignee, NEW.assignee, 'admin');
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;

-- This trigger can write a fixed audit event, never arbitrary user-supplied history.
CREATE OR REPLACE FUNCTION public.audit_infinito_spa_public_lead()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.lead_history(lead_id, kind, to_value, note, actor)
  VALUES (NEW.id, 'created', 'new', 'Origem: portfolio:infinito-spa', 'system');
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.audit_infinito_spa_public_lead() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_audit_infinito_spa_public_lead ON public.lead_submissions;
CREATE TRIGGER trg_audit_infinito_spa_public_lead
AFTER INSERT ON public.lead_submissions
FOR EACH ROW WHEN (NEW.source = 'portfolio:infinito-spa' AND current_user = 'anon')
EXECUTE FUNCTION public.audit_infinito_spa_public_lead();
