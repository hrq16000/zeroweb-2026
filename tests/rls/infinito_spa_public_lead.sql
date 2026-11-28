-- Run only against a disposable database with the versioned migrations applied.
-- No service-role API key, no external WhatsApp request and no durable QA record.
BEGIN;
SET LOCAL ROLE anon;
INSERT INTO public.lead_submissions
  (id, name, phone, source, company, utm_source, utm_campaign, payload_json)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'QA SYNTHETIC', '00000000000',
   'portfolio:infinito-spa', 'Infinito Spa', 'qa', 'infinito-spa-rls',
   '{"clientKey":"infinito-spa","consentAccepted":true}');
DO $$
BEGIN
  BEGIN
    PERFORM id FROM public.lead_submissions;
    RAISE EXCEPTION 'anon was able to read lead_submissions';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.lead_submissions (name, phone, source, payload_json)
    VALUES ('QA spoof', '00000000000', 'portfolio:infinito-spa',
            '{"clientKey":"another-client","consentAccepted":true}');
    RAISE EXCEPTION 'wrong client was accepted';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
END $$;
RESET ROLE;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.lead_submissions l
    WHERE l.id = '11111111-1111-4111-8111-111111111111'
      AND l.source = 'portfolio:infinito-spa'
      AND l.payload_json->>'clientKey' = 'infinito-spa'
      AND l.utm_source = 'qa' AND l.utm_campaign = 'infinito-spa-rls'
      AND l.status = 'new' AND l.score = 0 AND l.score_label = 'baixa'
      AND l.temperature IS NULL AND l.assignee IS NULL AND l.portal_id IS NULL
      AND EXISTS (SELECT 1 FROM public.lead_history h WHERE h.lead_id = l.id AND h.kind = 'created')
  ) THEN
    RAISE EXCEPTION 'synthetic lead or audit event missing';
  END IF;
END $$;
ROLLBACK;
