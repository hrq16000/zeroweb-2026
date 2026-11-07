# Agropet Filt — preview failure analysis

Scope: `feat/agropet-filt-preview-20261104`, starting at `6eefff1` and inspecting the subsequent attempts through `da963a8`. PR #489 was already squash-merged; this repair reconciles current main `70547c6` into the requested preview branch, preserving subsequent clients, dedicated demo scoping, Lighthouse demo handling and booking work. It does not authorize another production merge.

## Failures and causes

| Checks / commit | Cause | Resolution |
| --- | --- | --- |
| Build, hydration, Agropet visual QA, portfolio QA / `6eefff1` | Literal backslash-n tokens around the final `.af-symbol img` rule caused Lightning CSS `Unexpected end of input` at `agropet-filt-preview.css:226:92`. Browser assertions never ran. | Already fixed by `15c4f9e4`. |
| Build prerequisites and Vercel / `f6754a48` | Discovery claims `consulta de banho e tosa` and `Paraná` were absent from the approved business copy. | Already aligned to `banho e tosa` / `PR` by `20b3c8ad`. |
| Build prerequisites / `20b3c8ad` | Generated admin seed still declared Agropet unpublished. | Already synchronized by `747e710a`. |
| Portfolio contract / earlier attempts | Draft publication/embed/funnel evidence was incomplete; structural families were outside the controlled vocabulary and component topology could not be extracted. | Later commits registered publication, hosted-form evidence, topology and valid family names. |
| Agropet screenshots / publication transition | QA expected `noindex` after the commercial route became published and indexable. | Already corrected by `da963a8`; Vercel preview edge `x-robots-tag: noindex` remains appropriate. |
| Structural readiness / `da963a8` | `split-editorial` and `floating-persistent` misclassified the illustrated poster and category-entry journey, colliding with Moreira/Autoescola. | Add reusable, documented `illustrated-poster` and `category-entry-dialog` families reflecting the actual JSX. Existing collision thresholds remain intact. |
| Portfolio visual QA / `da963a8` | Registration and per-client configuration changes forced a global run against obsolete historical baselines (31 differences). | Verify per-client changes against both Git revisions, include the changed catalog index, and keep global fallback for shared rendering/default changes. |
| Lighthouse / `da963a8` | Global scoping measured unrelated historical pages: Paulo (88), Angel Mix (83, LCP ~2.67s), Moreira (88), R Beauty (81, LCP ~2.72s), SSCons (89). | Use the same verified affected scope; preserve all performance, LCP, accessibility and SEO budgets. |
| Live form in READY preview | CSP omitted `https://form.jotform.com`; QA checked iframe DOM presence without loading its document. | Allow the exact frame origin, retain same-origin `form-action`, and navigate a deterministic iframe probe through the real parent CSP. No form submission occurs. |

Missing preview logs and screenshot artifacts in early jobs were consequences of the failed build. Canceled superseded attempts are not additional code failures. Original Vercel deployment `dpl_HgKnWz8ersDvVpX3ebJp6rM3FbrP` now returns 404, so its precise platform log cannot be independently recovered. The matching GitHub jobs retain the CSS failure evidence.

## Evidence and validation

- Original build: https://github.com/hrq16000/zeroweb-2026/actions/runs/41871436284
- Latest failing portfolio QA inspected: https://github.com/hrq16000/zeroweb-2026/actions/runs/41943827062
- Latest failing Lighthouse inspected: https://github.com/hrq16000/zeroweb-2026/actions/runs/41943827076
- Before this repair, Vercel `da963a8` was READY and returned HTTP 200 with SSR payload and canonical; the form CSP defect remained.
- Local Bun 1.4.0 suite after restoring canonical LF checkout bytes: 1088 passed, 6 credential-dependent tests skipped, 0 failed. Skipped database tests do not establish RLS validation.
- After main reconciliation: 1109 passed, 6 credential-dependent tests skipped, 0 failed. The iframe-origin repair scopes to Agropet and Cantinho, the two verified Jotform consumers, with unchanged QA budgets.
- Agropet quality matrix: PASS. Agropet readiness: READY, zero blockers. Structural regression tests also keep Autoescola passing and reject repeated new families.
- All 23 Node scope regressions and 24 existing Bun scope tests pass, including rejection of broad CSP sources, unrelated header changes, other-client changes, and output generators; main's dedicated demo behavior remains covered.
- Reviewed the original Linux CI artifact `13378867160` at desktop/tablet/mobile. The index binary baseline still shows the old centered hero; the actual gallery shows the current discovery layout and Agropet card. Updated only the index's exact pixel approvals with the run, commit and artifact digest. All other screenshots retain their existing references and the 2% threshold.
- Browser/build evidence is checked separately against the repaired preview; this source report does not assert remote CI completion ahead of its results.

## Skills and scope decisions

Applied `0web-skill-router`, `0web-ui-quality-gates`, and Vercel `deployments-cicd`. This is a CI/security/metadata repair; no new design, imagery, contact destination, lead submission, database migration, or production release is introduced. Design marketplace discovery and a new creative brief are not applicable because the rendered client composition is preserved. No institutional brand assets are changed.
