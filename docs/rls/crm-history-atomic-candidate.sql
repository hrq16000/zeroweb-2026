-- PREPARATION ONLY: outside migrations; do not apply to an existing backend.
-- Promotion requires explicit migration/permission authorization and review.
-- Called ONLY from the authenticated admin handler via its privileged client.
-- No SECURITY DEFINER, new RLS policies, or changes to existing table grants.
BEGIN;
CREATE FUNCTION public.crm_add_history_atomic(
  p_lead_id uuid, p_portal_id uuid, p_kind text, p_note text, p_actor text
) RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, public AS $$
DECLARE
  target public.lead_submissions%ROWTYPE;
  history_id uuid;
BEGIN
  IF p_kind IS NULL OR p_kind NOT IN ('note', 'contact', 'action')
     OR p_note IS NULL OR length(btrim(p_note)) < 1 OR length(p_note) > 5000
     OR p_actor IS NULL OR length(p_actor) < 1 OR length(p_actor) > 120 THEN
    RAISE EXCEPTION 'Invalid interaction' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO target FROM public.lead_submissions
    WHERE id = p_lead_id AND portal_id IS NOT DISTINCT FROM p_portal_id
    FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found in expected portal' USING ERRCODE = 'P0002'; END IF;
  -- A close committed before this lock is never overwritten or reactivated.
  IF target.status IN ('fechado', 'perdido', 'arquivado', 'won', 'lost') THEN
    RAISE EXCEPTION 'Terminal lead preserved' USING ERRCODE = '55000';
  END IF;
  INSERT INTO public.lead_history(lead_id, kind, note, actor)
    VALUES (target.id, p_kind, p_note, p_actor) RETURNING id INTO history_id;
  UPDATE public.lead_submissions SET last_interaction = clock_timestamp()
    WHERE id = target.id AND portal_id IS NOT DISTINCT FROM p_portal_id;
  RETURN history_id;
END;
$$;
-- These grants are ONLY a proposal; no permission was changed in this round.
REVOKE ALL ON FUNCTION public.crm_add_history_atomic(uuid, uuid, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_add_history_atomic(uuid, uuid, text, text, text) TO service_role;
COMMIT;