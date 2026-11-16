DROP POLICY IF EXISTS "anon_insert_gps_consent" ON public.gps_consent_log;
CREATE POLICY "anon_insert_gps_consent" ON public.gps_consent_log FOR INSERT TO anon, authenticated
WITH CHECK (decision IN ('granted','denied','dismissed') AND coalesce(length(visitor_id),0) <= 100 AND coalesce(length(session_id),0) <= 100 AND coalesce(length(page),0) <= 500 AND coalesce(length(user_agent),0) <= 500);