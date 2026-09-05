-- Hardening: customers must not be able to move their own order to a paid/completed state,
-- nor change money/payment columns. Only admins (existing "admins update all orders" policy)
-- and service_role may do that.

CREATE OR REPLACE FUNCTION public.guard_orders_customer_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- service_role and admins bypass this guard
  IF auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin')
     OR public.has_role(auth.uid(), 'super_admin') THEN
    RETURN NEW;
  END IF;

  NEW.total := OLD.total;
  NEW.paid_at := OLD.paid_at;

  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status NOT IN ('cancelled', 'pending', 'awaiting_payment') THEN
    RAISE EXCEPTION 'not allowed to set order status to %', NEW.status
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_guard_customer_update ON public.orders;
CREATE TRIGGER orders_guard_customer_update
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.guard_orders_customer_update();

DROP POLICY IF EXISTS "users update own pending orders" ON public.orders;
CREATE POLICY "users update own pending orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status IN ('pending', 'awaiting_payment'))
  WITH CHECK (
    auth.uid() = user_id
    AND status IN ('pending', 'awaiting_payment', 'cancelled')
  );