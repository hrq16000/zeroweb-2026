-- Oferta comercial enviada pelo proprietário do catálogo.
INSERT INTO public.services (
  slug, name, category, title, h1, description, service_type,
  benefits, process, faq, keywords, cta_label,
  price, price_period, delivery_days, conditions,
  image_path, image_alt, is_active, is_featured, display_order, is_solution
) VALUES (
  'site-profissional-197',
  'Site Profissional',
  'Web',
  'Site Profissional por R$ 197,99 · 0WEB',
  'Sua empresa ainda não tem site? Como assim?',
  'Site profissional, moderno, rápido e responsivo para colocar sua empresa no digital com mais credibilidade e uma estrutura estratégica para gerar contatos.',
  'Site institucional promocional',
  '[
    "Registro do domínio incluso por 1 ano",
    "Design profissional",
    "Layout responsivo para computador, tablet e celular",
    "Site rápido e otimizado",
    "Estrutura estratégica para gerar contatos",
    "Presença digital profissional"
  ]'::jsonb,
  '[
    {"step":"Briefing","desc":"Entendemos sua empresa, público e objetivo principal."},
    {"step":"Criação","desc":"Montamos o site com design profissional e responsivo."},
    {"step":"Publicação","desc":"Publicamos no domínio e deixamos sua presença digital pronta."}
  ]'::jsonb,
  '[
    {"q":"O que está incluso?","a":"Design profissional, site responsivo, otimização de velocidade, estrutura para gerar contatos e registro do domínio por 1 ano."},
    {"q":"O valor é mensal?","a":"Não. A condição é R$ 197,99 à vista pelo primeiro ano, conforme disponibilidade da oferta."},
    {"q":"A oferta é limitada?","a":"Sim. A condição é válida para os primeiros 10 contratos e por tempo determinado."}
  ]'::jsonb,
  '["site profissional","criação de sites","site responsivo","presença digital","site para pequena empresa","domínio incluso"]'::jsonb,
  'Quero colocar minha empresa no digital',
  197.99,
  'ano',
  'Publicação após briefing',
  'Condição especial válida para os primeiros 10 contratos. Oferta por tempo determinado. R$ 197,99 à vista pelo primeiro ano, com registro do domínio incluso.',
  NULL,
  'Capa da oferta Site Profissional 0WEB por R$ 197,99',
  true,
  true,
  5,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  h1 = EXCLUDED.h1,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  process = EXCLUDED.process,
  faq = EXCLUDED.faq,
  keywords = EXCLUDED.keywords,
  cta_label = EXCLUDED.cta_label,
  price = EXCLUDED.price,
  price_period = EXCLUDED.price_period,
  delivery_days = EXCLUDED.delivery_days,
  conditions = EXCLUDED.conditions,
  image_alt = EXCLUDED.image_alt,
  is_active = true,
  is_featured = true,
  display_order = EXCLUDED.display_order,
  is_solution = false,
  updated_at = now();
