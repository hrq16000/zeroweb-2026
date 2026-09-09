# Zona Congelada 0WEB — o que é blindado e o que é livre

Status: **BLINDADA (imutável)** · Atualizado em 2026-09-09

A zona congelada é o conjunto de arquivos que definem a identidade institucional
da 0WEB. Eles **nunca** podem ser alterados em tarefas de portfólio, catálogo,
funil, SEO, performance ou manutenção de cliente.

## 1. Arquivos blindados

| Arquivo | O que protege |
|---|---|
| `public/0web-logo.png` | Logo oficial publicada |
| `src/assets/logo-0web.png.asset.json` | Fingerprint do asset da logo |
| `src/components/site/BrandLogo.tsx` | Renderização da marca |
| `src/components/site/Header.tsx` | Cabeçalho e navegação institucional |
| `src/components/site/Footer.tsx` | Rodapé institucional e contatos oficiais |
| `src/styles.css` | Tokens globais: cores, tipografia, espaçamento, motion |
| `src/config/brand-integrity.json` | Manifesto de hashes que valida tudo acima |

Verificação obrigatória: `bun run validate:brand-integrity`
(também roda no `prebuild` e no hook `pre-commit`).

## 2. O que NÃO pode ser alterado

- Logo, proporções, cores e variações da marca 0WEB.
- Tipografia e tokens globais do sistema de design.
- Cabeçalho e rodapé institucionais (estrutura, links, contatos oficiais).
- Qualquer arquivo fora de `/portfolio/<slug>` a pretexto de ajuste de cliente.
- Substituir o manifesto de hashes para "fazer o gate passar".

Exceção: apenas com autorização explícita do responsável, registro em
`docs/skills/CHANGELOG.md` e revisão visual da raiz.

## 3. O que PODE ser alterado em cada projeto `/portfolio/<slug>`

Cada projeto é um site independente do cliente. É livre e esperado personalizar:

- Identidade local: paleta, tipografia escopada, logo do cliente, ícones.
- Layout, ordem de seções, composição do hero, componentes autorais.
- Motion e intensidade (`SUBTLE | BALANCED | EXPRESSIVE | IMMERSIVE`).
- Conteúdo: textos, serviços, preços, FAQ, prova social verificável.
- Fotos e capas próprias do cliente (material real e autorizado).
- Funil individual, CTA, perguntas e destinatário do lead.
- SEO próprio: título, descrição, canonical, imagem social, ícone.

## 4. Regras que continuam valendo dentro do projeto

- Nunca importar `Header`, `Footer` ou navegação da 0WEB para dentro da
  identidade do cliente.
- Nunca expor telefone, e-mail ou `wa.me` no bundle público — contato é
  resolvido no servidor por `clientKey`.
- Nunca publicar avaliação, depoimento, número ou resultado sem fonte real.
- Nunca publicar imagem que finja ser foto real do cliente sem material oficial.
- Padronizar a engenharia, nunca a criatividade: não clonar o layout de outro
  cliente e apenas recolorir.

## 5. Gates que protegem tudo isso

```
bun run validate:brand-integrity
bun run validate:portfolio-boundaries
bun run check:portfolio-originality
bun run check:experience-standard
```
