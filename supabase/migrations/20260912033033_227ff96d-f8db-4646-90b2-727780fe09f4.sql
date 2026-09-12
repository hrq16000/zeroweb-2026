CREATE OR REPLACE FUNCTION public.partners_self_update_is_safe(_id uuid, _status partner_status, _approved_by uuid, _approved_at timestamptz, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.partners p
    WHERE p.id = _id
      AND p.status IS NOT DISTINCT FROM _status
      AND p.approved_by IS NOT DISTINCT FROM _approved_by
      AND p.approved_at IS NOT DISTINCT FROM _approved_at
      AND p.user_id IS NOT DISTINCT FROM _user_id
  );
$$;

DROP POLICY IF EXISTS "partners_self_update" ON public.partners;

CREATE POLICY "partners_admin_update" ON public.partners
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR is_super_admin(auth.uid()))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR is_super_admin(auth.uid()));

CREATE POLICY "partners_self_update_safe_columns" ON public.partners
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND public.partners_self_update_is_safe(id, status, approved_by, approved_at, user_id)
);