# Contrato de execução contínua do 0WEB

Este documento é obrigatório para qualquer pessoa, agente ou ferramenta que
altere o portal ou qualquer `/portfolio/<slug>` — Lovable, ChatGPT/Codex,
Claude Code, Cursor ou outra ferramenta.

## Leitura obrigatória

Antes de agir, ler `AGENTS.md`, este contrato, os padrões de portfólio
relevantes e as skills roteadas. **Toda tarefa de desenvolvimento, release ou
SEO também deve seguir `docs/0WEB_GIT_FIRST_RELEASE_AND_SEO_POLICY.md`.**
A execução deve continuar a partir do estado real do Git, nunca de memória
ou de uma cópia externa.

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

Para qualquer nova landing, redesign material ou tarefa que receba site de
referência, também é obrigatória a leitura de
`docs/PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD.md`. Referências devem
ser decompostas em matrizes de papel/composição/ritmo/anti-cópia; limites reais
e dados voláteis devem passar por truth/freshness. O resultado nunca pode ser
uma reprodução de silhueta nem a mesma jornada com nova marca/conteúdo.

### Empenho obrigatório em recursos relevantes

Em portfolio, “usar o máximo de recursos” significa obrigatoriamente descobrir,
avaliar e tentar o maior conjunto **relevante e não redundante** de recursos
capaz de melhorar verdade, decisão, identidade, conversão e qualidade. Seguir
`docs/PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md`.

Não é permitido escolher a implementação mais pobre apenas por ser mais rápida
quando já existe recurso adequado de pesquisa, mídia, skill, decision aid,
layout/interação, SEO, acessibilidade, performance, funil, analytics ou QA.
Também não é permitido ligar recursos indiscriminadamente. Toda omissão material
deve ser justificável como `REJECTED`, `ATTEMPTED_BLOCKED` ou
`NOT_APPLICABLE`.

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

Toda atualização concluída deve ser validada, registrada no changelog/relatório
e enviada ao repositório oficial `https://github.com/hrq16000/zeroweb-2026.git`
em branch de trabalho. **Integração em `main` por PR apenas depois dos gates
aplicáveis e aprovação; versão finalizada é o único artefato destinado à
publicação em Vercel e ao host oficial.** Não disparar deploy para cada commit
de pesquisa, documentação, experimento ou correção ainda não validada.
Não deixar alterações apenas locais, em Lovable, em `chatgpt.site` ou em outra
hospedagem. Ao final, confirmar branch, commit, build, gates e working tree.
O host `0web.com.br` e a Vercel são verificados separadamente enquanto o DNS
não for migrado; `READY` na Vercel não comprova publicação no domínio oficial.

### Revalidação imediatamente antes do merge

Imediatamente antes de integrar qualquer branch de portfolio, reler o estado atual de `origin/main` e comparar a branch candidata. Se o mesmo `slug`/`client_key` já tiver sido incorporado por outra execução, ou se a branch estiver atrás/divergida em relação ao `main`, é proibido fazer merge cego do trabalho antigo. Nesse caso, reconciliar somente o delta ainda necessário a partir de uma branch fresca do `main` atual ou abandonar a branch obsoleta.

O preview e os gates de publicação precisam corresponder ao **head candidato após essa reconciliação**. Depois do merge, confirmar produção, rota real, funil, destino e isolamento do cliente. Uma branch antiga nunca prevalece sobre uma implementação posterior já validada em `main` apenas por ter sido criada primeiro.

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


## Evidência de RLS no CI

CI funcional verde não autoriza afirmar que RLS foi validado quando testes foram
pulados por ausência de credenciais. A evidência canônica é
`docs/RLS_CI_SECURITY_GATE.md` + `.github/workflows/rls-security.yml`.
`SUPABASE_SERVICE_ROLE_KEY` ausente deve produzir status explícito de bloqueio,
nunca ser interpretado como PASS.

## Entregas de restaurante: classificação e readiness transacional

Se a tarefa pedir "delivery", "cardápio com pedido", "pizzaria com compra" ou sistema operacional de restaurante, classificar primeiro o **escopo contratado**, sem transformar uma landing/funil em checkout. Fluxo: `docs/DELIVERY_PROJECT_ONBOARDING_PLAYBOOK.md` → `docs/DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md` → `docs/DELIVERY_OPERATIONAL_VALIDATION_STANDARD.md`.

Novo projeto com escopo transacional pode receber `--delivery-transactional` no scaffold para gerar somente um **manifesto de readiness BLOCKED**, sem pedidos, gateway ou loja ativa. `--funnel-type pedido` isoladamente continua registrando intenção de contato. Nunca declarar delivery publicado/homologado a partir de CI geral verde ou preenchimento manual de `PASS`; exigir implementação real de preço/quote/order, banco, painel/cozinha, autorização entre lojas, pagamento conforme configuração e E2E homologado, por estabelecimento. As regras antigas de funil e SEO não são afrouxadas por esta adição.

As 8 rodadas de documentação não equivalem à implementação dos módulos. Não habilitar `orderEnabled` sem autorização de implantação e gate de produção comprovado.
