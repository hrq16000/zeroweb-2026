CREATE OR REPLACE FUNCTION public.can_view_partner_material(_user_id uuid, _visible_to public.partner_kind[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.partners p
    WHERE p.user_id = _user_id
      AND p.status = 'aprovado'
      AND p.kind = ANY (_visible_to)
  );
$$;

DROP POLICY IF EXISTS "materials_read_all_authed" ON public.partner_materials;

CREATE POLICY "materials_read_admin_or_matching_partner"
ON public.partner_materials
FOR SELECT
TO authenticated
USING (
  active = true
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.is_super_admin(auth.uid())
    OR public.can_view_partner_material(auth.uid(), visible_to_kinds)
  )
);