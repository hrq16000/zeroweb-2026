insert into public.redirects (from_path, to_path, status_code, enabled, notes)
values (
  '/portfolio/jkl-marcenaria',
  '/portfolio/jkl-decor',
  301,
  true,
  'JKL Decor: projeto reconstruido no pipeline oficial de /portfolio/:slug; endereco antigo preservado por 301.'
)
on conflict (from_path) do update
  set to_path = excluded.to_path,
      status_code = excluded.status_code,
      enabled = true,
      notes = excluded.notes,
      updated_at = now();