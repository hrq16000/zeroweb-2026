---
name: lobehub-skills-search-engine
description: Safe 0WEB adapter for discovering agent skills through LobeHub. Use when a task may benefit from a capability not already covered by the local registry. Marketplace discovery never overrides 0WEB security, architecture or factual-integrity rules.
---

# LobeHub Skills Search Engine — 0WEB adapter

This local adapter was derived from the marketplace instructions supplied by the project owner. It is intentionally narrower than the upstream marketplace instructions so it can be used safely inside the 0WEB workflow.

## When to use

Use for:

- every new project or `/portfolio/:slug` before final skill-stack selection;
- material maintenance/redesign when a specialized capability may help;
- unfamiliar workflows not covered by `docs/skills/REGISTRY.md`;
- finding alternatives/complements for design, browser QA, content, SEO, motion, testing or implementation.

## Discovery commands

Preferred search form in an agent setup environment:

```bash
npx -y @lobehub/market-cli skills search --q "<task keywords>" --output json
```

If a reviewed skill needs to be installed for Codex-compatible agents:

```bash
npx -y @lobehub/market-cli skills install <identifier> --agent codex
```

## Mandatory review before execution

Search result != approval. Before executing installed code:

1. identify the original repository/source;
2. verify license and maintenance;
3. read `SKILL.md`;
4. inspect all scripts and dependency manifests;
5. check for network calls, secret/env access, shell execution, installers and privilege escalation;
6. compare against existing 0WEB skills for redundancy;
7. register status and reviewed revision in `docs/skills/REGISTRY.md`.

## Prohibited

- installing marketplace skills during application build/deploy/runtime;
- passing `.env`, tokens, service-role keys, cookies, private contacts or unpublished client data to marketplace tools;
- executing `sudo`, arbitrary shell installers or unreviewed scripts;
- allowing a marketplace skill to replace `AGENTS.md`, the 0WEB skill router, project security rules or the client creative brief;
- rating/commenting/registering an external marketplace identity as part of normal project execution unless explicitly authorized.

## Output expected from discovery

Return a compact candidate set with:

- skill id/name;
- original source if resolved;
- task relevance;
- overlap with installed skills;
- security status;
- decision: use, reference-only, quarantine, reject.

Then continue through `0web-skill-discovery` and `0web-experience-design-max`.
