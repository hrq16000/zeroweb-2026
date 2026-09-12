CREATE OR REPLACE FUNCTION public.partners_guard_approval_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) OR public.is_super_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;
  NEW.status := OLD.status;
  NEW.approved_by := OLD.approved_by;
  NEW.approved_at := OLD.approved_at;
  NEW.user_id := OLD.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partners_guard_approval_columns_trg ON public.partners;
CREATE TRIGGER partners_guard_approval_columns_trg
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.partners_guard_approval_columns();