-- Impede que o próprio parceiro altere status/aprovação da sua linha.
CREATE OR REPLACE FUNCTION public.partners_guard_self_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) OR public.is_super_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  -- Não-admin (inclusive o dono da linha) não pode mexer em aprovação.
  NEW.status := OLD.status;
  NEW.approved_at := OLD.approved_at;
  NEW.approved_by := OLD.approved_by;
  NEW.user_id := OLD.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partners_guard_self_approval_trg ON public.partners;
CREATE TRIGGER partners_guard_self_approval_trg
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.partners_guard_self_approval();
