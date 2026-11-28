/**
 * Integration test: RLS isolation across portals.
 *
 * Generic `bun test` skips only this test when credentials are unavailable;
 * it must never call process.exit() and terminate unrelated tests.
 */
import { test } from "bun:test";
import { assertDenied, assertHidden, rlsClient, rlsEnvironment, RLS_TEST_TIMEOUT_MS } from "./helpers";

const environment = rlsEnvironment();
const HAS_RLS_ENV = environment !== null;

const rlsTest = HAS_RLS_ENV ? test : test.skip;

rlsTest("RLS multi-tenant — isolamento entre portais", async () => {
  if (!environment) throw new Error("RLS_BLOCKED_MISSING_SECRET");
  const { url, publishableKey, serviceKey } = environment;
  const admin = rlsClient(url, serviceKey);
  const stamp = Date.now();
  const emailA = `rls-a-${stamp}@example.com`;
  const emailB = `rls-b-${stamp}@example.com`;
  const password = crypto.randomUUID();

  let uidA: string | undefined;
  let uidB: string | undefined;
  let pA: string | undefined;
  let pB: string | undefined;

  const ensure = (condition: unknown, label: string, extra?: unknown) => {
    if (!condition) {
      throw new Error(`${label}${extra ? ` — ${String(extra)}` : ""}`);
    }
    console.log("✓", label);
  };

  try {
    const { data: ua, error: ea } = await admin.auth.admin.createUser({
      email: emailA,
      password,
      email_confirm: true,
    });
    if (ea) throw new Error(`create user A: ${ea.message}`);
    if (!ua.user) throw new Error("create user A returned no user");
    uidA = ua.user.id;

    const { data: ub, error: eb } = await admin.auth.admin.createUser({
      email: emailB,
      password,
      email_confirm: true,
    });
    if (eb) throw new Error(`create user B: ${eb.message}`);
    if (!ub.user) throw new Error("create user B returned no user");
    uidB = ub.user.id;

    const { data: portals, error: ep } = await admin
      .from("portals")
      .insert([
        { slug: `t-a-${stamp}`, name: "Test Portal A", is_default: false },
        { slug: `t-b-${stamp}`, name: "Test Portal B", is_default: false },
      ])
      .select("id, slug");
    if (ep) throw new Error(`insert portals: ${ep.message}`);
    const portalA = portals?.find((row) => row.slug === `t-a-${stamp}`);
    const portalB = portals?.find((row) => row.slug === `t-b-${stamp}`);
    if (!portalA || !portalB) throw new Error("insert portals returned incomplete fixtures");
    pA = portalA.id;
    pB = portalB.id;

    const { error: memberError } = await admin.from("portal_members").insert([
      { user_id: uidA, portal_id: pA, role: "portal_admin" },
      { user_id: uidB, portal_id: pB, role: "portal_admin" },
    ]);
    if (memberError) throw new Error(`insert portal_members: ${memberError.message}`);

    const { error: leadSeedError } = await admin.from("lead_submissions").insert([
      { portal_id: pA, name: "A", email: "a@a.com", source: "form" },
      { portal_id: pB, name: "B", email: "b@b.com", source: "form" },
    ]);
    if (leadSeedError) throw new Error(`seed lead_submissions: ${leadSeedError.message}`);

    const { error: eventSeedError } = await admin.from("analytics_events").insert([
      { portal_id: pA, event_name: "view_a" },
      { portal_id: pB, event_name: "view_b" },
    ]);
    if (eventSeedError) throw new Error(`seed analytics_events: ${eventSeedError.message}`);

    const clientA = rlsClient(url, publishableKey);
    const { error: signA } = await clientA.auth.signInWithPassword({ email: emailA, password });
    if (signA) {
      if (/Email logins are disabled|email_provider_disabled/i.test(signA.message)) {
        throw new Error(
          "RLS_BLOCKED_AUTH_PROVIDER_DISABLED: não é possível comprovar isolamento authenticated " +
            "com login por senha desabilitado.",
        );
      }
      throw new Error(`sign-in A: ${signA.message}`);
    }

    const ownLeads = await clientA.from("lead_submissions").select("id").eq("portal_id", pA);
    ensure(!ownLeads.error && ownLeads.data?.length === 1, "user A lê seu próprio lead");
    const leadsSeen = await clientA
      .from("lead_submissions")
      .select("id, portal_id")
      .eq("portal_id", pB);
    assertHidden(leadsSeen, "user A não lê leads do portal B");

    const eventsSeen = await clientA
      .from("analytics_events")
      .select("id")
      .eq("portal_id", pB);
    assertHidden(eventsSeen, "user A não lê eventos do portal B");

    const { error: writeBError } = await clientA
      .from("lead_submissions")
      .insert({ portal_id: pB, name: "x", email: "x@x.com", source: "form" });
    assertDenied(writeBError, "user A não escreve leads no portal B");

    const clientB = rlsClient(url, publishableKey);
    const { error: signB } = await clientB.auth.signInWithPassword({ email: emailB, password });
    if (signB) throw new Error(`sign-in B: ${signB.message}`);

    const ownLeadsB = await clientB.from("lead_submissions").select("id").eq("portal_id", pB);
    ensure(!ownLeadsB.error && ownLeadsB.data?.length === 1, "user B lê seu próprio lead");
    const leadsB = await clientB
      .from("lead_submissions")
      .select("id")
      .eq("portal_id", pA);
    assertHidden(leadsB, "user B não lê leads do portal A");

    // Each run uses unique fixture hashes; no assumed (ip_hash,day) constraint.
    const { error: trackingSeedError } = await admin.from("visitantes_rastreio").insert(
      [
        {
          ip_hash: `hash-a-${stamp}`,
          day: new Date().toISOString().slice(0, 10),
          portal_id: pA,
          path: "/a",
        },
        {
          ip_hash: `hash-b-${stamp}`,
          day: new Date().toISOString().slice(0, 10),
          portal_id: pB,
          path: "/b",
        },
      ],
    );
    if (trackingSeedError) throw new Error(`seed visitantes_rastreio: ${trackingSeedError.message}`);

    const trackingB = await clientA
      .from("visitantes_rastreio")
      .select("id")
      .eq("portal_id", pB);
    assertHidden(trackingB, "user A não lê visitantes_rastreio do portal B");
  } finally {
    await admin
      .from("visitantes_rastreio")
      .delete()
      .in("ip_hash", [`hash-a-${stamp}`, `hash-b-${stamp}`]);

    if (pA || pB) {
      const portalIds = [pA, pB].filter((id): id is string => typeof id === "string");
      await admin.from("lead_submissions").delete().in("portal_id", portalIds);
      await admin.from("analytics_events").delete().in("portal_id", portalIds);
    }
    if (uidA || uidB) {
      await admin.from("portal_members").delete().in("user_id", [uidA, uidB].filter((id): id is string => typeof id === "string"));
    }
    if (pA || pB) {
      await admin.from("portals").delete().in("id", [pA, pB].filter((id): id is string => typeof id === "string"));
    }
    if (uidA) await admin.auth.admin.deleteUser(uidA);
    if (uidB) await admin.auth.admin.deleteUser(uidB);
  }
}, RLS_TEST_TIMEOUT_MS);

if (!HAS_RLS_ENV) {
  console.log(
    "SKIP rls-portal-isolation — credenciais ausentes no bun test genérico; " +
      "use o workflow RLS Security Gate para validação obrigatória.",
  );
}
