DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-mp-festas-eventos';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-mp-festas-eventos', 'Orçamento · MP Festas e Eventos', 'Funil de orçamento para decoração de festas em Araucária e região', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Orçamento · MP Festas e Eventos', description = 'Funil de orçamento para decoração de festas em Araucária e região' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos criar uma festa linda ✨', 'Escolha o pacote e conte os detalhes da sua data.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'pacote', 'radio', 'Qual decoração combina com a sua festa?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','mesa','label','Festa na Mesa · a partir de R$ 160'), jsonb_build_object('value','classica','label','Decoração Clássica · a partir de R$ 250'), jsonb_build_object('value','premium','label','Decoração Premium · a partir de R$ 350'), jsonb_build_object('value','especial','label','Casamento ou evento especial'), jsonb_build_object('value','orientacao','label','Quero uma sugestão'))),
    (v_form_id, 'ocasiao', 'radio', 'Que momento vamos celebrar?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','infantil','label','Aniversário infantil'), jsonb_build_object('value','adulto','label','Aniversário adulto'), jsonb_build_object('value','casamento','label','Casamento ou noivado'), jsonb_build_object('value','evento','label','Evento especial'))),
    (v_form_id, 'local', 'radio', 'Onde será o evento?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','araucaria','label','Araucária'), jsonb_build_object('value','regiao','label','Curitiba e região'), jsonb_build_object('value','confirmar','label','Ainda vou confirmar o local'))),
    (v_form_id, 'data', 'radio', 'Quando é a sua data?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','30dias','label','Nos próximos 30 dias'), jsonb_build_object('value','semestre','label','Neste semestre'), jsonb_build_object('value','planejando','label','Estou planejando'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte um pouco mais', 'Tema, cores, convidados e referências ajudam a preparar uma orientação melhor.', 'Ex.: tema, quantidade de pessoas e endereço', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para confirmar o orçamento?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Pedido recebido! 🎉', 'A equipe da MP Festas e Eventos vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
