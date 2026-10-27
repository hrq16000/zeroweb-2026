# Diagnóstico da publicação — /servicos/google-ads-299 (somente leitura)

## Comprovado (lido agora, 27/10 03:58 UTC)
- Código atual: HEAD `e5ad5b33` (inclui #449–#451). Último build: sem erro registrado.
- Varredura de segurança: zero achados críticos. Nada bloqueia a publicação por segurança.
- A produção responde com uma versão publicada própria (código de publicação `psr2.742c9230…`).
- O HTML no ar já inclui `/assets/blog-google-ads-….jpg`, que é a imagem editorial de substituição da correção. **Portanto, a versão no ar já tem a correção da galeria.**
- O próprio código atual ainda cita os endereços `/__l5e/assets-v1/...google-ads-299-capa.png` e `...-horizontal.png`:
  - em `src/assets/google-ads-299-capa.png.asset.json`;
  - na lista de imagens "BROKEN" de `src/lib/service-gallery-recovery.ts`;
  - e possivelmente no cadastro do serviço no banco.
- Na hospedagem do Lovable, esses dois endereços **respondem 200 (imagem PNG válida)**. Eles só quebram fora do Lovable (Vercel), porque `/__l5e/` é um caminho exclusivo da hospedagem do Lovable.

## Conclusão
- **Certeza:** não há publicação travada nem falha de deploy comprovável. A publicação está atualizada.
- **Certeza:** a presença de `/__l5e/` no HTML do Lovable é esperada, porque o código e os dados atuais apontam para ela, e as imagens carregam.
- **Hipótese:** a Vercel mostra `/assets/cover-google-ads-….jpg` porque lá a imagem `/__l5e` falha e a capa reserva entra no lugar, ou porque o build da Vercel resolve o arquivo de imagem de outro jeito. Não verifiquei o HTML da Vercel.
- **Não acessível para mim:** histórico interno das chamadas `deploy_project` com status `pending` e logs da fila de hospedagem. Não há ferramenta de leitura para isso.

## Ação específica e verificável (sem novo deploy)
1. Abrir https://0web.com.br/servicos/google-ads-299 no navegador e confirmar que a capa e a galeria aparecem, sem imagem quebrada. Se aparecem, nenhum passo é necessário.
2. Se o objetivo for que a produção do Lovable sirva **exatamente** o JPEG `cover-google-ads`, isso exige mudar o código ou o cadastro, não republicar. Seria preciso trocar a capa do serviço `google-ads-299`, salva no banco ou no `.asset.json`, para o JPEG versionado. Essa mudança só seria feita com sua aprovação explícita, num pedido separado.

## Fora do escopo
Nenhuma edição, commit, redeploy, DNS, domínio, secrets ou banco.
