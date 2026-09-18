-- Impede definitivamente que o próprio parceiro altere status/aprovação,
-- mesmo que a função auxiliar seja alterada no futuro.
REVOKE UPDATE ON public.partners FROM authenticated;
GRANT UPDATE (name, company, email, phone, city, state, areas, specialties, bio)
  ON public.partners TO authenticated;

DROP POLICY IF EXISTS partners_self_update_safe_columns ON public.partners;
CREATE POLICY partners_self_update_safe_columns
  ON public.partners
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND partners_self_update_is_safe(id, status, approved_by, approved_at, user_id)
  );