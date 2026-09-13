CREATE OR REPLACE FUNCTION public.guard_cart_funnel_amount_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.is_super_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF NEW.total_amount IS DISTINCT FROM OLD.total_amount THEN
    RAISE EXCEPTION 'total_amount do carrinho só pode ser alterado pelo servidor'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
    RAISE EXCEPTION 'payment_status do carrinho só pode ser alterado pelo servidor'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF NEW.payment_channel IS DISTINCT FROM OLD.payment_channel THEN
    RAISE EXCEPTION 'payment_channel do carrinho só pode ser alterado pelo servidor'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF NEW.payment_ref IS DISTINCT FROM OLD.payment_ref THEN
    RAISE EXCEPTION 'payment_ref do carrinho só pode ser alterado pelo servidor'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.guard_orders_customer_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin')
     OR public.has_role(auth.uid(), 'super_admin') THEN
    RETURN NEW;
  END IF;

  -- Cliente nunca altera preço, itens, forma de pagamento ou confirmação de pagamento.
  NEW.total := OLD.total;
  NEW.items := OLD.items;
  NEW.payment_method := OLD.payment_method;
  NEW.paid_at := OLD.paid_at;

  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status NOT IN ('cancelled', 'pending', 'awaiting_payment') THEN
    RAISE EXCEPTION 'not allowed to set order status to %', NEW.status
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN NEW;
END;
$$;