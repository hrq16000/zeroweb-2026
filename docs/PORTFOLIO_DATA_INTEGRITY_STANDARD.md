# 0WEB · Portfolio Data Integrity Standard

Status: CANONICAL · blocking rule for new portfolio work

## Purpose

A `/portfolio/:slug` project is a durable client entity, not a collection of loosely related UI fields. Client identity, funnel, operational destination, services, media and analytics must remain bound by stable identifiers even when layouts, arrays, files, environment variables or deployments change.

The failure class this standard prevents is **association loss**: the platform still knows the project but forgets which phone, image, service or funnel belongs to it.

## Canonical identity

Every project must have one stable `clientKey`.

`clientKey` is the durable join key for:

- project identity;
- slug/route aliases;
- funnel context;
- lead attribution;
- operational destination;
- destination provenance/revisions;
- services;
- media bindings;
- analytics.

A slug may redirect or change. Array order may change. Component names may change. The `clientKey` binding must not silently change.

## Funnel and WhatsApp contract

Public contact remains funnel-first:

`CTA -> project funnel -> qualification -> lead persisted -> server-side destination resolution -> client WhatsApp`

Rules:

1. Client phone must never become a public `wa.me` or `tel:` bypass.
2. The client commercial destination is operational data, not an API credential. It may remain server-only, but the **association** `clientKey -> destination` must be durable.
3. API keys/tokens/secrets remain secrets. A deployment secret must not be the only memory that a phone belongs to a client.
4. If no verified destination exists, the lead is still persisted and a recoverable return contact is collected before final completion.
5. Never route a client project to the institutional 0WEB number as an implicit fallback.
6. Never route project A to project B.
7. A generated WhatsApp URL or browser redirect is a handoff attempt, not proof that a message was sent by the visitor.

## Destination source of truth

Target architecture:

1. A verified durable client binding, keyed by `clientKey`, is canonical.
2. Destination revisions/provenance are append-only audit evidence and do not duplicate full PII.
3. Legacy environment variables are compatibility/import sources only.
4. While legacy compatibility exists, a disagreement between a verified durable binding and a legacy environment value must never be silently accepted.
5. An unverified/failed/pending durable candidate must not become operational merely because it exists in the database.

Required states must distinguish at least:

- destination configured;
- destination verified;
- destination evidence found but unconfirmed;
- destination conflict;
- destination unresolved;
- delivery/recoverability state.

`FUNNEL_OPERATIONAL` is not equivalent to `DESTINATION_VERIFIED`.

## Legacy aliases

Legacy WhatsApp environment aliases are catalogued in:

`src/config/portfolio-whatsapp-env-aliases.json`

That file exists so runtime/gates/audits do not each invent a different alias map. A shared alias used by multiple `clientKey`s is a conflict candidate unless explicitly approved as a shared operational destination.

Known shared aliases must never be auto-promoted during migration.

## Recovery and migration

Recovery must be evidence-led. Allowed evidence can include:

- client-provided source material;
- original project brief/intake;
- previous repository history;
- already configured operational value;
- official business source;
- explicit owner/admin confirmation.

Never infer a destination solely from similar names, geography, array position or a generic institutional contact.

Recovered candidates are classified before persistence. A migration must be dry-run capable and must not auto-promote ambiguous/conflicting evidence.

## Media/service bindings

The same integrity rule applies to content assets.

Forbidden:

`services[2] -> images[2]`

Required concept:

`serviceId -> mediaId`

Reordering services or images must not change ownership/meaning. Project media must remain linked by stable semantic IDs, not list position.

## Originality is separate from infrastructure

Shared platform infrastructure does not authorize a shared visible client template.

Shared:

- route host;
- funnel engine;
- destination resolver;
- analytics;
- accessibility/performance primitives;
- platform layer;
- gates/security.

Project-specific:

- composition;
- hero;
- section topology;
- visual rhythm;
- media narrative;
- motion narrative;
- conversion presentation;
- identity.

Fixing data integrity must not mass-redesign client pages, and fixing visual originality must not rewrite client destination bindings.

## Blocking invariants

Before a new project reaches READY/PUBLISHED:

- stable `clientKey` exists;
- funnel binds to that same `clientKey`;
- lead persistence works before handoff;
- destination state is explicit;
- no cross-client destination is silently accepted;
- no direct public WhatsApp bypass exists;
- missing destination has recoverability fallback;
- media/service associations use stable identifiers where structured bindings exist.

## Change discipline

For integrity work:

- smallest surgical change first;
- no mass migration before dry-run inventory;
- no promotion without evidence;
- no full phone in reports/logs/analytics/public bundle;
- preserve provenance and previous state;
- conflicts fail safe;
- legacy projects remain operational through compatibility until migrated deliberately.
