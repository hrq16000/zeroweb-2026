-- Dona Garimpeira: formulário individual SOMENTE DRAFT.
-- Não ativa CTA nem encaminhamento automático. Nenhuma credencial ou telefone é armazenado aqui.
-- Requer configuração server-side de destino, perguntas, persistência e testes antes de publicar.
insert into public.dynamic_forms (slug, name, status, description)
values (
  'funnel-dona-garimpeira-brecho',
  'Dona Garimpeira — comprar, vender ou doar',
  'draft',
  'Atendimento presencial no brechó: consultar peças e reservas, vender roupas usadas ou entregar doações.'
)
on conflict (slug) do nothing;
