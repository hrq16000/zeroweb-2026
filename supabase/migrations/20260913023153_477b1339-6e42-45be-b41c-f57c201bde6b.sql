-- Block public submitters from setting internal CRM/routing fields.
-- Server-side inserts use the service role (RLS bypass), so these
-- constraints only affect anon/authenticated direct inserts.

-- 1) dynamic_form_leads
DROP POLICY IF EXISTS "anyone can submit leads to published forms" ON public.dynamic_form_leads;
CREATE POLICY "anyone can submit leads to published forms"
ON public.dynamic_form_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM dynamic_forms f
    WHERE f.id = dynamic_form_leads.form_id
      AND f.status = 'published'
  )
  AND score = 0
  AND score_breakdown = '{}'::jsonb
  AND tags = '{}'::text[]
  AND intent_level = 'cold'
  AND pipeline_stage = 'novo'
  AND assigned_to IS NULL
);

-- 2) lead_submissions
DROP POLICY IF EXISTS anon_insert_leads ON public.lead_submissions;
DROP POLICY IF EXISTS auth_insert_leads ON public.lead_submissions;

CREATE POLICY anon_insert_leads
ON public.lead_submissions
FOR INSERT
TO anon
WITH CHECK (
  (name IS NULL OR length(name) <= 200)
  AND (email IS NULL OR length(email) <= 200)
  AND (phone IS NULL OR length(phone) <= 40)
  AND status = 'new'
  AND assignee IS NULL
  AND score = 0
  AND score_label = 'baixa'
  AND portal_id IS NULL
  AND temperature IS NULL
);

CREATE POLICY auth_insert_leads
ON public.lead_submissions
FOR INSERT
TO authenticated
WITH CHECK (
  (name IS NULL OR length(name) <= 200)
  AND (email IS NULL OR length(email) <= 200)
  AND (phone IS NULL OR length(phone) <= 40)
  AND status = 'new'
  AND assignee IS NULL
  AND score = 0
  AND score_label = 'baixa'
  AND portal_id IS NULL
  AND temperature IS NULL
);

-- 3) service_requests
DROP POLICY IF EXISTS service_requests_insert_with_ownership ON public.service_requests;
CREATE POLICY service_requests_insert_with_ownership
ON public.service_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (
    (auth.uid() IS NULL AND requester_user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND requester_user_id = auth.uid())
  )
  AND status = 'open'
  AND portal_id IS NULL
);