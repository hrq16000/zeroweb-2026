-- Impede adulteração de preço/itens/status de pagamento por usuários finais.
CREATE OR REPLACE FUNCTION public.guard_orders_customer_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- service_role e admins seguem sem restrição
  IF auth.role() = 'service_role' OR public.is_super_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF NEW.items IS DISTINCT FROM OLD.items THEN
    RAISE EXCEPTION 'items do pedido só podem ser alterados pelo servidor';
  END IF;
  IF NEW.total IS DISTINCT FROM OLD.total THEN
    RAISE EXCEPTION 'total do pedido só pode ser alterado pelo servidor';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_orders_customer_update ON public.orders;
CREATE TRIGGER trg_guard_orders_customer_update
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.guard_orders_customer_update();

CREATE OR REPLACE FUNCTION public.guard_cart_funnel_amount_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.is_super_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF NEW.total_amount IS DISTINCT FROM OLD.total_amount THEN
    RAISE EXCEPTION 'total_amount do carrinho só pode ser alterado pelo servidor';
  END IF;
  IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
    RAISE EXCEPTION 'payment_status do carrinho só pode ser alterado pelo servidor';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_cart_funnel_amount_update ON public.cart_funnel_progress;
CREATE TRIGGER trg_guard_cart_funnel_amount_update
BEFORE UPDATE ON public.cart_funnel_progress
FOR EACH ROW EXECUTE FUNCTION public.guard_cart_funnel_amount_update();