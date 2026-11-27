# Growth R1 — revisão visual de release R9 (2026-11-27)

## Evidência e escopo
- PR #565, candidato `d7de76223605b8d19ea030b41d3dfb920c35bbb7`.
- Run GitHub Actions 46042280041; artefato portfolio-gates-evidence 15221611814.
- SHA-256 do ZIP baixado e conferido: `e94ebb04ae93e6621e95a66adff8ba2c42f53c80e536b5dfa5e59c3db3f636b0`.
- Comparação visual lado a lado com os PNGs históricos: cinco capturas reprovadas, somente estas aprovadas por hash exato RGBA. Nenhum threshold, teste, rota, preço ou funil alterado por este registro.
- R Beauty desktop (27,13%): composição editorial, peça promocional inteira em moldura e CTA preservado. Tablet (24,15%) e mobile (16,83%): baseline antes quase toda vazia; conteúdo e reserva agora visíveis. A condição comercial existente continua sujeita a confirmação.
- RJ Drywall tablet (24,20%) e mobile (27,07%): overlay mais escuro e texto legível; marca, títulos, botões, foto e hierarquia preservados. Desktop (1,05%) permanece no limite normal, sem nova aprovação.
- Os demais gates aprovados do run anterior não substituem a reexecução do candidato atualizado. Merge e deploy somente após confirmação dos checks aplicáveis.
- Candidato não representa por si só publicação no domínio oficial.

| Rota | Viewport | Dimensão | SHA-256 dos pixels |
|---|---|---|---|
| r_beauty | desktop | 1280×900 | `b07a6e27f84ba562e9e3c44980fcaf12d30edf8d3acced7a9392fd81413e199a` |
| r_beauty | tablet | 834×1112 | `c515683158e4f28a9607fb598ff41b83582374d6e124704f76f9e424b18df889` |
| r_beauty | mobile | 393×852 | `3cf326a76754e12fc67c97dcda95f41fe84f597e0ce75c8130d6ea3d50fbc664` |
| rj-servicos-drywall | tablet | 834×1112 | `761bfa5c19a4f2ecc60feb05fead4de054b8946ea15b723d62950594dd994829` |
| rj-servicos-drywall | mobile | 393×852 | `33807c2758a8a64941859884fea1a18e0082b5271f0b992e1b10080224e79d65` |

## Histórico substituído
A aprovação mobile anterior de RJ Drywall (2026-10-02) continua recuperável no Git. Registro anterior completo:
```json
{
  "reason": "Baseline mobile confirmada durante a migração de segurança TanStack. A PR diagnóstica #321 reproduziu no main o mesmo desvio histórico acima de 2%; #320 manteve pixels idênticos ao main em quatro canários e DyzPromo variou apenas 0,48% entre as execuções. Capturas revisadas; o limite global permanece 2%.",
  "reviewedAt": "2026-10-02",
  "evidence": {
    "baselineRunId": 36947857468,
    "baselineArtifactId": 11204245307,
    "candidateRunId": 36953577456,
    "candidateArtifactId": 11205495676,
    "headSha": "ac39bc4073888b9f56cdaa1735f0c5724d453263"
  },
  "viewports": {
    "mobile": {
      "width": 393,
      "height": 852,
      "pixelSha256": "0744a285f3e6caebdba57040f03e4db33b3a0b74882676107a64b93ecea4c030"
    }
  }
}
```
