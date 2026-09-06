DO $$
DECLARE
  v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id
    FROM public.dynamic_forms
   WHERE slug = 'funnel-js-eletrica-manutencao'
   LIMIT 1;

  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
    VALUES (
      'funnel-js-eletrica-manutencao',
      'Orçamento técnico · JS Elétrica e Manutenção',
      'published',
      'Organize as informações do atendimento antes do contato seguro.',
      '{"clientKey":"js-eletrica-manutencao","mode":"proposal"}'::jsonb,
      '{"enabled":true}'::jsonb
    )
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms
       SET name = 'Orçamento técnico · JS Elétrica e Manutenção',
           description = 'Organize as informações do atendimento antes do contato seguro.',
           status = 'published',
           config_json = '{"clientKey":"js-eletrica-manutencao","mode":"proposal"}'::jsonb
     WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;

  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
  VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos entender seu atendimento ⚡', 'Conte o que precisa instalar, reparar ou modernizar.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Como podemos chamar você?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual solução você precisa?', NULL, NULL, 2, true, jsonb_build_array(
      jsonb_build_object('value','residencial','label','Instalação e manutenção residencial'), jsonb_build_object('value','comercial_predial','label','Instalação comercial ou predial'),
      jsonb_build_object('value','industrial','label','Manutenção industrial'), jsonb_build_object('value','padrao_copel','label','Padrão Copel e quadros'),
      jsonb_build_object('value','solar','label','Sistema solar / fotovoltaico'), jsonb_build_object('value','ar_condicionado','label','Ar-condicionado'),
      jsonb_build_object('value','motores_bombas','label','Motores, bombas e iluminação'), jsonb_build_object('value','reparo','label','Reparo elétrico em geral'))),
    (v_form_id, 'ambiente', 'radio', 'Em qual tipo de ambiente?', NULL, NULL, 3, true, jsonb_build_array(
      jsonb_build_object('value','residencial','label','Residencial'), jsonb_build_object('value','comercial','label','Comercial'),
      jsonb_build_object('value','predial','label','Predial / condomínio'), jsonb_build_object('value','industrial','label','Industrial'))),
    (v_form_id, 'local', 'radio', 'Onde será o serviço?', NULL, NULL, 4, true, jsonb_build_array(
      jsonb_build_object('value','curitiba','label','Curitiba'), jsonb_build_object('value','rmc','label','Região Metropolitana'),
      jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),
    (v_form_id, 'quando', 'radio', 'Quando você precisa?', NULL, NULL, 5, true, jsonb_build_array(
      jsonb_build_object('value','urgente','label','Preciso avaliar com urgência'), jsonb_build_object('value','dias','label','Nos próximos dias'),
      jsonb_build_object('value','planejando','label','Estou planejando'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes do atendimento', NULL, 'Ex.: equipamento, defeito, quantidade de pontos, foto do quadro ou prazo.', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp devemos usar para retornar?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'A JS vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
