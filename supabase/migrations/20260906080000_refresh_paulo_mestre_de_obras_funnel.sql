DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-paulo-mestre-de-obras';
  IF v_form_id IS NULL THEN
    RAISE EXCEPTION 'Funil Paulo Mestre de Obras não encontrado';
  END IF;

  UPDATE public.dynamic_forms
  SET status = 'published',
      name = 'Orçamento · Paulo Mestre de Obras',
      description = 'Funil individual para pedreiro, azulejista, reformas e reparos em Curitiba e região'
  WHERE id = v_form_id;

  DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
  DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;

  INSERT INTO public.dynamic_form_questions
    (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
  VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos planejar seu reparo 🧱', 'Conte o serviço e receba um orçamento personalizado.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual serviço você precisa?', NULL, NULL, 2, true, jsonb_build_array(
      jsonb_build_object('value','eletrica','label','Elétrica'),
      jsonb_build_object('value','hidraulica','label','Hidráulica'),
      jsonb_build_object('value','azulejista','label','Azulejista'),
      jsonb_build_object('value','pisos-revestimentos','label','Pisos e revestimentos'),
      jsonb_build_object('value','pequena-reforma','label','Pequena reforma'),
      jsonb_build_object('value','pequeno-reparo','label','Pequeno reparo'),
      jsonb_build_object('value','portas','label','Instalação de portas'),
      jsonb_build_object('value','janelas','label','Venda e instalação de janelas'))),
    (v_form_id, 'projeto', 'radio', 'Que tipo de atendimento é?', NULL, NULL, 3, true, jsonb_build_array(
      jsonb_build_object('value','residencial','label','Residencial'),
      jsonb_build_object('value','comercial','label','Comercial'),
      jsonb_build_object('value','acabamento','label','Acabamento ou revestimento'),
      jsonb_build_object('value','manutencao','label','Manutenção ou reparo'))),
    (v_form_id, 'local', 'radio', 'Onde será o serviço?', NULL, NULL, 4, true, jsonb_build_array(
      jsonb_build_object('value','curitiba-regiao','label','Curitiba e região'),
      jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'),
      jsonb_build_object('value','definindo','label','Ainda estou definindo o local'))),
    (v_form_id, 'quando', 'radio', 'Quando pretende começar?', NULL, NULL, 5, true, jsonb_build_array(
      jsonb_build_object('value','breve','label','Preciso começar em breve'),
      jsonb_build_object('value','planejando','label','Estou planejando'),
      jsonb_build_object('value','avaliacao','label','Quero uma avaliação primeiro'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes do serviço', 'Fotos, medidas, etapa atual e prazo ajudam no orçamento.', 'Descreva o que precisa ser feito', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'Paulo vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
