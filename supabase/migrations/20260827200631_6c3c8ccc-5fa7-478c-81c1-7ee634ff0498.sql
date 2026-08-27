DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-rm-fretes';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-rm-fretes', 'Pedido de frete · RM Fretes', 'Funil individual de orçamento de frete da RM Fretes', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Pedido de frete · RM Fretes' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;

  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos organizar seu frete 🚚', 'Responda algumas perguntas rápidas para a RM Fretes calcular seu orçamento.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'tipo_servico', 'radio', 'O que você precisa transportar?', NULL, NULL, 1, true, jsonb_build_array(
      jsonb_build_object('value','frete_rapido','label','Frete rápido / entrega'),
      jsonb_build_object('value','carreto','label','Carreto (móveis, eletrodomésticos)'),
      jsonb_build_object('value','mudanca','label','Pequena mudança'),
      jsonb_build_object('value','carga_especial','label','Carga especial'))),
    (v_form_id, 'origem', 'short_text', 'Qual o endereço de coleta?', 'Rua, número e bairro.', 'Origem', 2, true, '[]'::jsonb),
    (v_form_id, 'destino', 'short_text', 'Qual o endereço de entrega?', 'Rua, número e bairro.', 'Destino', 3, true, '[]'::jsonb),
    (v_form_id, 'itens', 'long_text', 'O que será transportado?', 'Liste os itens, quantidades e tamanhos aproximados.', 'Ex.: 1 geladeira, 4 caixas médias', 4, true, '[]'::jsonb),
    (v_form_id, 'acesso', 'radio', 'Como é o acesso nos dois endereços?', 'Isso ajuda a definir equipe e tempo.', NULL, 5, true, jsonb_build_array(
      jsonb_build_object('value','terreo','label','Térreo nos dois'),
      jsonb_build_object('value','elevador','label','Tem elevador'),
      jsonb_build_object('value','escadas','label','Escadas'),
      jsonb_build_object('value','nao_sei','label','Não sei informar'))),
    (v_form_id, 'ajudante', 'radio', 'Precisa de ajudante para carregar?', NULL, NULL, 6, true, jsonb_build_array(
      jsonb_build_object('value','sim','label','Sim, preciso de ajuda'),
      jsonb_build_object('value','nao','label','Não, só o transporte'))),
    (v_form_id, 'data', 'short_text', 'Para quando é o frete?', 'Data e período desejados.', 'Ex.: sábado de manhã', 7, true, '[]'::jsonb),
    (v_form_id, 'pagamento', 'radio', 'Forma de pagamento preferida', 'Confirmada no atendimento.', NULL, 8, true, jsonb_build_array(
      jsonb_build_object('value','pix','label','Pix'),
      jsonb_build_object('value','dinheiro','label','Dinheiro'),
      jsonb_build_object('value','cartao','label','Cartão de crédito ou débito'))),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 9, true, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para confirmar o frete?', NULL, '(41) 99999-9999', 10, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Pedido enviado!', 'A RM Fretes vai confirmar rota, valor e horário pelo WhatsApp.', NULL, 11, false, '[]'::jsonb);
END $$;