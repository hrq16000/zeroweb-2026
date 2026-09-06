# Frente editorial do portfólio

Este documento transforma o inventário de capas em uma fila de trabalho auditável.
Ele não autoriza transformar arte gerada, logo, flyer, QR code ou peça com telefone
em “foto real” do cliente.

## Ordem de prioridade

1. **CONTACT_OR_PII (7)** — substituir por fotografia própria sem telefone,
   endereço, e-mail, QR code ou preço visível.
2. **PROMOTIONAL_MATERIAL (2)** — separar imagem editorial de promoção, preço e
   campanha.
3. **UNCERTAIN_ORIGIN (5)** — registrar origem, enquadramento e aprovação humana.
4. **LOGO_ONLY (10)** — solicitar foto real do produto, ambiente ou processo; até
   lá, manter a identidade social sem simular prova editorial.
5. **NO_REAL_ASSET (14)** — solicitar material próprio. Arte autoral pode ser
   usada como identidade social, mas não como evidência de obra, equipe, cliente
   ou local real.

## Critério de aceite

Cada capa só pode virar `VALID` quando:

- existe arquivo editorial dentro do diretório do próprio slug;
- a imagem não contém contato operacional, QR code, endereço ou preço;
- a origem foi registrada em `portfolio-visual-review.json`;
- o enquadramento foi revisado em 390px e 1440px;
- `bun run check:portfolio-cover-status` e `bun run check:portfolio-originality`
  permanecem verdes.

## Estado atual

- 83 projetos auditados.
- 45 capas válidas.
- 38 pendências editoriais, sem impacto sobre rotas, identidade ou WhatsApp.
- Os projetos continuam com logo, imagem social e Kit de Presença próprios.

O painel `/app/portfolio/originalidade` exibe agora a próxima ação recomendada
para cada pendência, mantendo a fila sincronizada com o contrato canônico.
