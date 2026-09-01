-- Sensitive-data RLS hardening: only administrators can read the global
-- service catalog, while lead updates stay scoped to an authorized portal.
DROP POLICY IF EXISTS "leads_admin_write" ON public.lead_submissions;
CREATE POLICY "leads_admin_write" ON public.lead_submissions
FOR UPDATE TO authenticated
USING (
  is_super_admin(auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR ((portal_id IS NOT NULL) AND is_portal_member(auth.uid(), portal_id))
)
WITH CHECK (
  is_super_admin(auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR ((portal_id IS NOT NULL) AND is_portal_member(auth.uid(), portal_id))
);

DROP POLICY IF EXISTS "service_catalog authenticated read" ON public.service_catalog;
CREATE POLICY "service_catalog_admin_read" ON public.service_catalog
FOR SELECT TO authenticated
USING (
  is_super_admin(auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);
