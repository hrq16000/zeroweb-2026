# Contrato de execução contínua do 0WEB

Este documento é obrigatório para qualquer pessoa, agente ou ferramenta que
altere o portal ou qualquer `/portfolio/<slug>` — Lovable, ChatGPT/Codex,
Claude Code, Cursor ou outra ferramenta.

## Leitura obrigatória

Antes de agir, ler `AGENTS.md`, este contrato, os padrões de portfólio
relevantes e as skills roteadas. A execução deve continuar a partir do estado
real do Git, nunca de memória ou de uma cópia externa.

O Git remoto `origin/main` é a única fonte operacional de verdade. Cada ciclo
começa com `git fetch origin --prune` e atualização fast-forward; cada ciclo
termina com working tree limpo. Artefatos locais temporários, stashes, worktrees
e cópias externas não podem se transformar em uma segunda fonte de conteúdo ou
publicação.

## Padrão de qualidade

Cada `/portfolio/<slug>` é um mini-site comercial independente e o `/portfolio`
é um catálogo premium. Novos projetos e revisões devem usar o máximo de skills
relevantes do repositório, incluindo direção de arte, design system, semântica,
responsividade, motion com redução de movimento, acessibilidade, performance,
segurança, conversão/WhatsApp, SEO local e legibilidade por mecanismos de busca
e LLMs. Capacidades só entram quando resolvem uma necessidade real; não há
template visual obrigatório.

Todo projeto deve ter identidade própria, logo quando disponível, imagem social,
metadata completa, canonical, dados estruturados adequados, CTA funcional e
contato seguro. O catálogo deve priorizar descoberta, comparação, prova visual,
clareza de segmento/região e conversão — não apenas contar projetos.

## SEO e IA

Indexabilidade é requisito contínuo, não promessa de ranking: conteúdo relevante
no HTML/SSR, headings semânticos, metadados únicos, links internos, sitemap,
robots, schema válido, imagens sociais e dados locais devem ser verificados no
portal e em cada projeto. O texto precisa ser factual e útil para pessoas e
agentes de IA, sem conteúdo fabricado ou duplicado.

## Publicação obrigatória

Toda atualização concluída deve ser validada, registrada no changelog/relatório,
publicada imediatamente no repositório oficial
`https://github.com/hrq16000/zeroweb-2026.git` e integrada em `main` por PR.
Não deixar alterações apenas locais, em Lovable, em `chatgpt.site` ou em outra
hospedagem. Ao final, confirmar branch, commit, build, gates e working tree.

## Evolução contínua

Cada inspeção deve transformar achados em correções ou backlog priorizado e
documentado. P0/P1 de segurança, funcionamento, acessibilidade, SEO e WhatsApp
precedem polimento visual. Nenhuma alteração de logo ou identidade pode ocorrer
sem autorização explícita — ver `docs/BRAND_ASSET_POLICY.md`.

Capacidades e entendimentos são cumulativos: uma entrega não pode remover ou
generalizar silenciosamente uma identidade, funil, fonte factual, SEO local,
asset, Kit de Presença, requisito de privacidade ou mecanismo de conversão que
já esteja aprovado. Para discovery por nome e pacotes comerciais, seguir
`docs/0WEB_AI_PROSPECTING_PLATFORM_STANDARD.md`.
