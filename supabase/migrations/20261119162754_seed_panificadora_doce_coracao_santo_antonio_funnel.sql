-- Funil próprio da Panificadora Doce Coração (Santo Antônio).
-- Intenção comercial salva com protocolo ANTES da rota WhatsApp isolada;
-- nenhum pedido, encomenda, preço ou disponibilidade é confirmado pelo site.
-- Destino validado contra número comercial da ficha pública e referência
-- encaminhada pelo operador; cadastro canônico em portfolio-whatsapp.json.
DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id
  FROM public.dynamic_forms WHERE slug = 'funnel-panificadora-doce-coracao-santo-antonio';

  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES (
      'funnel-panificadora-doce-coracao-santo-antonio',
      'Consulta · Panificadora Doce Coração',
      'Consulta de produtos e disponibilidade; após registro de intenção, o visitante pode iniciar a conversa com o WhatsApp comercial da padaria.',
      'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb
    ) RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET
      name = 'Consulta · Panificadora Doce Coração',
      description = 'Consulta de produtos e disponibilidade; após registro de intenção, o visitante pode iniciar a conversa com o WhatsApp comercial da padaria.',
      status = 'published',
      whatsapp_config = '{"enabled":true}'::jsonb
    WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;

  INSERT INTO public.dynamic_form_questions
    (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
  VALUES
    (v_form_id, 'boas_vindas', 'statement',
      'Doce Coração: vamos preparar sua consulta',
      'Este formulário registra sua intenção na 0WEB e abre a conversa pelo WhatsApp comercial informado publicamente. Não é uma compra ou encomenda confirmada.', null, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Como podemos chamar você?', null, 'Seu primeiro nome', 1, true, '[]'::jsonb),
    (v_form_id, 'categoria', 'radio', 'O que gostaria de consultar?', null, null, 2, true,
      '[{"value":"paes","label":"Pães e café da manhã"},{"value":"salgados","label":"Salgados ou lanche"},{"value":"bolos","label":"Bolos"},{"value":"doces","label":"Doces"},{"value":"encomenda","label":"Possibilidade de encomenda"},{"value":"horarios","label":"Horários e atendimento"},{"value":"outro","label":"Outra informação"}]'::jsonb),
    (v_form_id, 'momento', 'radio', 'Para quando você precisa?', null, null, 3, true,
      '[{"value":"hoje","label":"Hoje"},{"value":"amanha","label":"Amanhã"},{"value":"planejamento","label":"Outra data, vou combinar com a padaria"},{"value":"so_consulta","label":"Só quero informações"}]'::jsonb),
    (v_form_id, 'detalhes', 'long_text', 'Conte algum detalhe?', 'Opcional: produto, quantidade ou dúvida. Os valores e a disponibilidade são confirmados pela padaria.', 'Descreva sua consulta', 4, false, '[]'::jsonb),
    (v_form_id, 'conclusao', 'statement',
      'Sua intenção foi registrada',
      'Agora você poderá iniciar a conversa no WhatsApp da Panificadora Doce Coração. A equipe confirma disponibilidade, preço e condições diretamente.', null, 5, false, '[]'::jsonb);
END $$;
