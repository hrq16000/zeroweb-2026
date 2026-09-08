DO $$
DECLARE fid uuid;
BEGIN
  SELECT id INTO fid FROM public.dynamic_forms WHERE slug = 'funnel-manu-pasteis';
  IF fid IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status)
    VALUES ('funnel-manu-pasteis', 'Contato · Manu Pastéis', 'Pedido e atendimento da Manu Pastéis', 'published')
    RETURNING id INTO fid;

    INSERT INTO public.dynamic_form_questions (form_id, key, label, hint, placeholder, type, required, order_index, options_json, validation_json) VALUES
      (fid, 'pedido', 'O que você quer pedir?', 'Escolha o que mais combina com o seu momento.', NULL, 'radio', true, 0,
        '[{"label":"Pastéis salgados","value":"pasteis-salgados"},{"label":"Pastéis doces","value":"pasteis-doces"},{"label":"Bebidas","value":"bebidas"},{"label":"Quero ver o cardápio","value":"cardapio"}]'::jsonb, '{}'::jsonb),
      (fid, 'atendimento', 'Como prefere receber?', NULL, NULL, 'radio', true, 1,
        '[{"label":"Vou consumir no local","value":"local"},{"label":"Quero retirar","value":"retirada"},{"label":"Preciso de entrega","value":"entrega"}]'::jsonb, '{}'::jsonb),
      (fid, 'quando', 'Para quando você precisa?', NULL, NULL, 'radio', true, 2,
        '[{"label":"Agora","value":"agora"},{"label":"Hoje","value":"hoje"},{"label":"Outro dia","value":"outro-dia"}]'::jsonb, '{}'::jsonb),
      (fid, 'nome', 'Qual é o seu nome?', NULL, 'Seu nome', 'short_text', true, 3, '[]'::jsonb, '{}'::jsonb),
      (fid, 'whatsapp', 'Qual WhatsApp devemos chamar?', 'Usamos este número somente para responder seu pedido.', '(00) 00000-0000', 'phone', true, 4, '[]'::jsonb, '{}'::jsonb);
  END IF;
END $$;