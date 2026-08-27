CREATE OR REPLACE FUNCTION public.wa_funnel_update_session(p_id uuid, p_session_id text, p_current_step integer DEFAULT NULL::integer, p_answers jsonb DEFAULT NULL::jsonb, p_completed boolean DEFAULT NULL::boolean, p_completed_at timestamp with time zone DEFAULT NULL::timestamp with time zone)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_old public.wa_funnel_sessions%ROWTYPE;
  v_new public.wa_funnel_sessions%ROWTYPE;
  v_changed text[] := ARRAY[]::text[];
  v_old_json jsonb := '{}'::jsonb;
  v_new_json jsonb := '{}'::jsonb;
  v_updated int := 0;
  v_success boolean := false;
BEGIN
  IF p_id IS NULL THEN RETURN false; END IF;
  IF p_session_id IS NULL OR length(p_session_id) < 8 OR length(p_session_id) > 128 THEN
    RETURN false;
  END IF;
  IF p_session_id !~ '^[A-Za-z0-9_\-]+$' THEN
    RETURN false;
  END IF;
  IF p_current_step IS NOT NULL AND (p_current_step < 0 OR p_current_step > 500) THEN
    RETURN false;
  END IF;
  IF p_answers IS NOT NULL AND jsonb_typeof(p_answers) <> 'object' THEN
    RETURN false;
  END IF;
  IF p_answers IS NOT NULL AND pg_column_size(p_answers) > 32768 THEN
    RETURN false;
  END IF;
  IF p_completed_at IS NOT NULL AND (p_completed_at > now() + interval '5 minutes'
                                     OR p_completed_at < now() - interval '24 hours') THEN
    RETURN false;
  END IF;

  SELECT * INTO v_old
    FROM public.wa_funnel_sessions
   WHERE id = p_id
     AND session_id = p_session_id
     AND created_at > now() - interval '24 hours';

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  UPDATE public.wa_funnel_sessions
     SET current_step = COALESCE(p_current_step, current_step),
         answers_json = COALESCE(p_answers, answers_json),
         completed = COALESCE(p_completed, completed),
         completed_at = COALESCE(p_completed_at, completed_at)
   WHERE id = p_id
     AND session_id = p_session_id
     AND created_at > now() - interval '24 hours'
  RETURNING * INTO v_new;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  v_success := v_updated > 0;

  IF v_success THEN
    IF v_new.current_step IS DISTINCT FROM v_old.current_step THEN
      v_changed := array_append(v_changed, 'current_step');
      v_old_json := v_old_json || jsonb_build_object('current_step', v_old.current_step);
      v_new_json := v_new_json || jsonb_build_object('current_step', v_new.current_step);
    END IF;
    IF v_new.answers_json IS DISTINCT FROM v_old.answers_json THEN
      v_changed := array_append(v_changed, 'answers_json');
      v_old_json := v_old_json || jsonb_build_object('answers_keys', (SELECT jsonb_agg(k) FROM jsonb_object_keys(COALESCE(v_old.answers_json,'{}'::jsonb)) k));
      v_new_json := v_new_json || jsonb_build_object('answers_keys', (SELECT jsonb_agg(k) FROM jsonb_object_keys(COALESCE(v_new.answers_json,'{}'::jsonb)) k));
    END IF;
    IF v_new.completed IS DISTINCT FROM v_old.completed THEN
      v_changed := array_append(v_changed, 'completed');
      v_old_json := v_old_json || jsonb_build_object('completed', v_old.completed);
      v_new_json := v_new_json || jsonb_build_object('completed', v_new.completed);
    END IF;
    IF v_new.completed_at IS DISTINCT FROM v_old.completed_at THEN
      v_changed := array_append(v_changed, 'completed_at');
      v_old_json := v_old_json || jsonb_build_object('completed_at', v_old.completed_at);
      v_new_json := v_new_json || jsonb_build_object('completed_at', v_new.completed_at);
    END IF;

    IF array_length(v_changed, 1) > 0 THEN
      INSERT INTO public.wa_funnel_update_audit(
        session_row_id, session_id, actor, changed_fields, old_values, new_values, success
      ) VALUES (
        p_id, p_session_id, auth.uid(), v_changed, v_old_json, v_new_json, true
      );
    END IF;
  END IF;

  RETURN v_success;
END
$function$;