DROP POLICY IF EXISTS "dist target update" ON public.request_distributions;
CREATE POLICY "dist target update" ON public.request_distributions FOR UPDATE TO authenticated
USING (
  (target_type='provider' AND EXISTS(SELECT 1 FROM public.providers p WHERE p.id=target_id AND p.user_id=auth.uid()))
  OR (target_type='company' AND EXISTS(SELECT 1 FROM public.companies c WHERE c.id=target_id AND c.user_id=auth.uid()))
)
WITH CHECK (
  (target_type='provider' AND EXISTS(SELECT 1 FROM public.providers p WHERE p.id=target_id AND p.user_id=auth.uid()))
  OR (target_type='company' AND EXISTS(SELECT 1 FROM public.companies c WHERE c.id=target_id AND c.user_id=auth.uid()))
);