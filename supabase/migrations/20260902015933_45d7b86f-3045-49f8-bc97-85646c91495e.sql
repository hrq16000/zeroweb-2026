-- Trava auto-aprovação de parceiros: campos de status/aprovação só mudam por admin.
CREATE OR REPLACE FUNCTION public.partners_guard_privileged_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) OR public.is_super_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Somente administradores podem alterar status/aprovação de parceiros';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partners_guard_privileged_columns_trg ON public.partners;
CREATE TRIGGER partners_guard_privileged_columns_trg
BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.partners_guard_privileged_columns();