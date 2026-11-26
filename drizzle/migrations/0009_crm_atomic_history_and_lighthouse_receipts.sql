CREATE FUNCTION public.crm_add_history_atomic(p_lead_id uuid, p_portal_id uuid, p_kind text, p_note text, p_actor text) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, public AS $$
DECLARE target public.lead_submissions%ROWTYPE; history_id uuid;
BEGIN
 IF p_kind IS NULL OR p_kind NOT IN ('note','contact','action') OR p_note IS NULL OR length(btrim(p_note)) < 1 OR length(p_note) > 5000 OR p_actor IS NULL OR length(p_actor) < 1 OR length(p_actor) > 120 THEN RAISE EXCEPTION 'Invalid interaction' USING ERRCODE='22023'; END IF;
 SELECT * INTO target FROM public.lead_submissions WHERE id=p_lead_id AND portal_id IS NOT DISTINCT FROM p_portal_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found in expected portal' USING ERRCODE='P0002'; END IF;
 IF target.status IN ('fechado','perdido','arquivado','won','lost') THEN RAISE EXCEPTION 'Terminal lead preserved' USING ERRCODE='55000'; END IF;
 INSERT INTO public.lead_history(lead_id,kind,note,actor) VALUES(target.id,p_kind,p_note,p_actor) RETURNING id INTO history_id;
 UPDATE public.lead_submissions SET last_interaction=clock_timestamp() WHERE id=target.id AND portal_id IS NOT DISTINCT FROM p_portal_id;
 RETURN history_id;
END;
$$;
REVOKE ALL ON FUNCTION public.crm_add_history_atomic(uuid,uuid,text,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.crm_add_history_atomic(uuid,uuid,text,text,text) TO service_role;
ALTER TABLE public.lhci_runs ADD COLUMN measured_at timestamptz;
ALTER TABLE public.lhci_runs ADD COLUMN ingestion_key text;
CREATE UNIQUE INDEX lhci_runs_ingestion_key_unique ON public.lhci_runs(ingestion_key);
COMMENT ON COLUMN public.lhci_runs.measured_at IS 'Original Lighthouse fetchTime, separate from reception time; historical values remain unchanged.';
COMMENT ON COLUMN public.lhci_runs.ingestion_key IS 'Stable identity of a received measurement; automatic retries do not overwrite prior decisions.';