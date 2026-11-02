DO $$
DECLARE fid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM public.dynamic_forms WHERE slug = 'funnel-dona-garimpeira-brecho') THEN RETURN; END IF;
  INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
  VALUES ('funnel-dona-garimpeira-brecho', 'Dona Garimpeira — comprar, vender ou doar', 'Pré-atendimento da loja física em São José dos Pinhais. A loja confirma reservas, avaliação de roupas e recebimento de doações individualmente.', 'draft', '{"kind":"portfolio","leadOnlyUntilValidated":true}'::jsonb, '{"enabled": false}'::jsonb)
  RETURNING id INTO fid;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, placeholder, required, order_index, options_json) VALUES
  (fid,'interesse','radio','Como podemos ajudar?',NULL,true,0,'[{"value":"comprar","label":"Comprar ou consultar uma peça"},{"value":"vender","label":"Vender roupas usadas"},{"value":"doar","label":"Doar roupas"}]'::jsonb),
  (fid,'detalhes','long_text','Conte um pouco mais sobre o que procura ou deseja trazer','Ex.: tipo de peça, tamanho, quantidade ou dúvida. Não garantimos disponibilidade.',false,1,'[]'::jsonb),
  (fid,'nome','short_text','Como podemos chamar você?',NULL,true,2,'[]'::jsonb),
  (fid,'whatsapp','phone','Seu WhatsApp com DDD para contato',NULL,true,3,'[]'::jsonb),
  (fid,'privacidade','checkbox','Li o aviso de privacidade e autorizo o uso dos dados para responder a este contato',NULL,true,4,'[{"value":"ciente","label":"Estou ciente do uso dos dados para esta solicitação"}]'::jsonb);
END $$;