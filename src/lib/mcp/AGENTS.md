# MCP boundaries

- Use the generated TanStack SDK routes; keep implementations here so transport stays SDK-owned.
- Verify delegated OAuth client claims and use only the caller-scoped database client; never add anonymous/admin fallback or caller-selected identity.
- Expose only active, priced non-solution catalog rows and explicit public fields; lead, membership and checkout data are outside this integration.
- Keep runtime configuration lazy and handlers bounded; manifest extraction must work without runtime secrets.