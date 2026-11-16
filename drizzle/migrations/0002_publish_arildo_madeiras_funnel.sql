DO $$
DECLARE fid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM public.dynamic_forms WHERE slug = 'funnel-arildo-madeiras') THEN RETURN; END IF;
  INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
  VALUES ('funnel-arildo-madeiras', 'Arildo Madeiras · Orçamento de madeiras', 'Funil individual da Arildo Madeiras (Pinhais — PR)', 'published', '{"auto_advance_ms": 250}'::jsonb, '{"enabled": true}'::jsonb)
  RETURNING id INTO fid;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, placeholder, required, order_index, options_json) VALUES
  (fid,'material','radio','O que você procura?',NULL,true,0,'[{"label":"Madeiras em geral","value":"madeiras_geral"},{"label":"Portas","value":"portas"},{"label":"Janelas","value":"janelas"},{"label":"Forros","value":"forros"},{"label":"Madeira de Cambará","value":"cambara"},{"label":"Móveis rústicos / banquetas","value":"moveis_rusticos"}]'::jsonb),
  (fid,'aplicacao','radio','Onde esse material entra no seu projeto?',NULL,true,1,'[{"label":"Construção","value":"construcao"},{"label":"Reforma","value":"reforma"},{"label":"Acabamento","value":"acabamento"},{"label":"Projeto residencial ou comercial","value":"projeto"},{"label":"Quero orientação para escolher","value":"orientacao"}]'::jsonb),
  (fid,'atendimento','radio','Como prefere continuar?',NULL,true,2,'[{"label":"Vou até a loja em Pinhais","value":"loja"},{"label":"Quero combinar a forma de atendimento","value":"combinar"},{"label":"Ainda estou planejando","value":"planejando"}]'::jsonb),
  (fid,'prazo','radio','Quando pretende avançar?',NULL,true,3,'[{"label":"Quero orçamento agora","value":"agora"},{"label":"Nesta semana","value":"esta_semana"},{"label":"Nas próximas semanas","value":"proximas_semanas"},{"label":"Estou pesquisando","value":"pesquisando"}]'::jsonb),
  (fid,'observacoes','long_text','Passe as medidas ou detalhes que já tiver','Ex.: tipo de peça, medidas aproximadas, quantidade e aplicação.',false,4,'[]'::jsonb),
  (fid,'nome','short_text','Como podemos chamar você?',NULL,true,5,'[]'::jsonb),
  (fid,'telefone','phone','Qual WhatsApp para retornarmos?',NULL,true,6,'[]'::jsonb);
END $$;