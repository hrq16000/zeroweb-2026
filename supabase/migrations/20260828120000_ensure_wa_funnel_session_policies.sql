-- Restore the anonymous funnel write contract without exposing PII reads.
GRANT INSERT ON TABLE public.wa_funnel_sessions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wa_funnel_update_session(uuid, text, integer, jsonb, boolean, timestamptz) TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_waf" ON public.wa_funnel_sessions;
DROP POLICY IF EXISTS "auth_insert_waf" ON public.wa_funnel_sessions;
CREATE POLICY "anon_insert_waf" ON public.wa_funnel_sessions
  FOR INSERT TO anon WITH CHECK (session_id IS NOT NULL AND length(session_id) BETWEEN 8 AND 120);
CREATE POLICY "auth_insert_waf" ON public.wa_funnel_sessions
  FOR INSERT TO authenticated WITH CHECK (session_id IS NOT NULL AND length(session_id) BETWEEN 8 AND 120);

REVOKE SELECT ON TABLE public.wa_funnel_sessions FROM anon, authenticated;
