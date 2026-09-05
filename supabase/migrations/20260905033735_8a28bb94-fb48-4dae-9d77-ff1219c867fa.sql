CREATE OR REPLACE FUNCTION public.guard_listing_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) OR public.is_super_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pendente';
    NEW.verified := false;
    NEW.rating_avg := 0;
    NEW.rating_count := 0;
    NEW.views_count := 0;
    RETURN NEW;
  END IF;

  NEW.status := OLD.status;
  NEW.verified := OLD.verified;
  NEW.rating_avg := OLD.rating_avg;
  NEW.rating_count := OLD.rating_count;
  NEW.views_count := OLD.views_count;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.guard_listing_privileged_columns() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS companies_guard_privileged_columns ON public.companies;
CREATE TRIGGER companies_guard_privileged_columns
BEFORE INSERT OR UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.guard_listing_privileged_columns();

DROP TRIGGER IF EXISTS providers_guard_privileged_columns ON public.providers;
CREATE TRIGGER providers_guard_privileged_columns
BEFORE INSERT OR UPDATE ON public.providers
FOR EACH ROW EXECUTE FUNCTION public.guard_listing_privileged_columns();