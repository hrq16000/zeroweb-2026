# Shared performance correction — 24/11/2026

Doce Coração run 45433982064: three shards failed real Lighthouse assertions, not receipt transport. 210 reports delivered, zero failed across all four shards. Diagnostics repeatedly show approximately 219–231 kB unused JS in the shared index bundle, render-blocking CSS and oversized imagery (including institutional logo). See jobs 138586789452, 138586789583, 138586789769. Shard 3 PASS. No budget changed. First bounded correction: defer the heavy shared FunnelRunner implementation from the modal shell until a funnel definition is available. Maintain dialog, client key, prefill, context, completion, and server logic. Existing funnel E2E, hydration, visual and Lighthouse gates must validate the candidate. Static test verifies source wiring only; bundle/score benefit not yet proven. Protected brand assets unchanged. No changes to production or remote data. Do not repeat previous measurements to investigate authentication.


## Evidence review — first deferred runner attempt

Artifacts from the existing Lighthouse runs were compared on 25 matching routes (50 samples per run):
- Main entry raw bytes: 1,940,176 → 1,901,114 (-39,062 bytes).
- Main entry transfer: 562,260 → 553,089 (-9,171 bytes).
- Mean script transfer: 650,099 → 643,387 (-6,712 bytes).
- Mean unused JavaScript: 228,899 → 221,739 (-7,160 bytes).
- Mean LCP: 1,517 → 1,570 ms (+52 ms); mean TBT: 0.8 → 12 ms; mean CLS remained approximately 0.001.

Conclusion: deferring FunnelRunner created a real but small split; it did not resolve the shared Lighthouse failures. Do not merge on this evidence.

## Additional shared causes verified from the same artifacts

1. `RouteLoader` always rendered `BrandLogo priority` inside an opacity-hidden fixed overlay. Lighthouse still fetched `/0web-logo.png` on every page: 149,726 resource bytes, 149,925 transfer bytes, and 139,607 bytes flagged as responsive-image savings. The logo was not the LCP element in the sampled routes, but this eager non-critical request competes with page resources. The asset itself is protected and unchanged.
2. `src/routes/__root.tsx` statically imported `Header` and `Footer` only for the 404 component. Their module graphs were therefore reachable from the shared entry on successful routes.
3. The shared CSS remained 69,294 bytes with an observed 415 ms blocking interval; Google Fonts CSS was 1,363 bytes with a 290 ms blocking interval. No font or global CSS changes were made because they risk brand/FOIT/CLS regressions and the existing audit did not establish safe unused rules.

## Bounded correction added to this candidate

- Keep the 3 px progress indicator and branded overlay for slow client-side navigation only; do not mount the full-screen overlay or request its eager logo during the initial SSR page load.
- Defer the 404-only Header/Footer modules with React.lazy + Suspense. Their component files, brand assets, typography and rendered 404 content are unchanged.
- Add focused tests for initial-load state and 404-only code splitting.
- No image conversion, threshold changes, production data, new dependency or production deployment.

## Skill review

Used the locally approved `react-best-practices` skill (`APPROVED_GLOBAL`) and its bundle-dynamic-imports, bundle-conditional and hydration-no-flicker rules. No external code or dependency was installed. Brand assets and client-specific compositions remain untouched.

Pending: rerun only the affected PR gates on this new HEAD, then compare actual Lighthouse and bundle artifacts before considering merge.
