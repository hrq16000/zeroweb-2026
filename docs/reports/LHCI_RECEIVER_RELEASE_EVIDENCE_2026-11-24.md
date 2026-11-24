# Release evidence / Lighthouse receiver — 24/11/2026

Reference main: e356ae62916ed49984761e161cf91c024db5daab; previous READY: 58032d30991b9203ebdadb4501d83acaafd1a3a8 / dpl_FcL5kPsArmdCToF47oCzeRu61GGA. No deployment requested.

Recovered run 45418525441 from actual diagnostics: 167 measurements across 85 distinct paths; 25 samples below 0.90 across 15 paths. All 167 receipt submissions failed HTTP 401. Four collect steps cancelled, no completed assert gate. Artifacts 14935251004, 14934975851, 14934561158, 14933803585 remain available. These data are partial, not release PASS.

The READY source uses app_settings lhci.hmac_secret before process.env and legacy token fallback; main receiver uses only LHCI_HMAC_SECRET and strict HMAC. This is a proven source-code divergence, not proof of the effective host or actual secret mismatch. Do not add legacy fallback, expose keys, or claim authentication repaired. The new probe sends malformed JSON with invalid and correct signatures to the configured official receiver. 401/400 confirms auth contract only; both requests cannot persist a valid receipt in the inspected receiver implementations. No real lead/receipt created. No thresholds, current Lighthouse workflow or receipt requirement changed.

Next: if probe 401/401, authorized operator must align configured receiver secret or route the canonical host to the approved receiver through the existing authorized release process (no DNS change authorized). Do not retry hundreds of receipts or new collection just to diagnose auth. After auth and release gates are green, recover existing reports using original run metadata; no duplicate measurements or synthetic PASS. Main-only release rule in docs/0WEB_GIT_FIRST_RELEASE_AND_SEO_POLICY.md prohibits deploying an isolated old-base branch as final production. No force push/revert of main.

Below-floor paths: dyzpromo, paulo-mestre-de-obras, miro-tech, jc-revestimentos, sos-presentes-cosmeticos, woodhouse-hamburgueres, brecho-sao-francisco, manu-pasteis, thays-camilla, r_beauty, sscons, toquinho-de-gente-brecho, assistencia-microondas-santos, papelemi-personalizados, centro-mega.
