/**
 * Integration test: RLS isolation across portals.
 *
 * Generic `bun test` skips only this test when credentials are unavailable;
 * it must never call process.exit() and terminate unrelated tests.
 */
import { test } from "bun:test";
import { createClient } from "@supabase/supabase-js";

const URL = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
const ANON =
  process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
const SRK = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const HAS_RLS_ENV = Boolean(URL && ANON && SRK);

const rlsTest = HAS_RLS_ENV ? test : test.skip;

rlsTest("RLS multi-tenant — isolamento entre portais", async () => {
  const admin = createClient(URL!, SRK!, { auth: { persistSession: false } });
  const stamp = Date.now();
  const emailA = `rls-a-${stamp}@example.com`;
  const emailB = `rls-b-${stamp}@example.com`;
  const password = "Rls-Test!123";

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
    uidA = ua.user!.id;

    const { data: ub, error: eb } = await admin.auth.admin.createUser({
      email: emailB,
      password,
      email_confirm: true,
    });
    if (eb) throw new Error(`create user B: ${eb.message}`);
    uidB = ub.user!.id;

    const { data: portals, error: ep } = await admin
      .from("portals")
      .insert([
        { slug: `t-a-${stamp}`, name: "Test Portal A", is_default: false },
        { slug: `t-b-${stamp}`, name: "Test Portal B", is_default: false },
      ])
      .select("id, slug");
    if (ep) throw new Error(`insert portals: ${ep.message}`);
    pA = portals![0].id;
    pB = portals![1].id;

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

    const clientA = createClient(URL!, ANON!, { auth: { persistSession: false } });
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

    const { data: leadsSeen } = await clientA
      .from("lead_submissions")
      .select("id, portal_id")
      .eq("portal_id", pB);
    ensure((leadsSeen?.length ?? 0) === 0, "user A não lê leads do portal B", leadsSeen);

    const { data: eventsSeen } = await clientA
      .from("analytics_events")
      .select("id")
      .eq("portal_id", pB);
    ensure((eventsSeen?.length ?? 0) === 0, "user A não lê eventos do portal B", eventsSeen);

    const { error: writeBError } = await clientA
      .from("lead_submissions")
      .insert({ portal_id: pB, name: "x", email: "x@x.com", source: "form" });
    ensure(Boolean(writeBError), "user A não escreve leads no portal B");

    const clientB = createClient(URL!, ANON!, { auth: { persistSession: false } });
    const { error: signB } = await clientB.auth.signInWithPassword({ email: emailB, password });
    if (signB) throw new Error(`sign-in B: ${signB.message}`);

    const { data: leadsB } = await clientB
      .from("lead_submissions")
      .select("id")
      .eq("portal_id", pA);
    ensure((leadsB?.length ?? 0) === 0, "user B não lê leads do portal A", leadsB);

    const { error: trackingSeedError } = await admin.from("visitantes_rastreio").upsert(
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
      { onConflict: "ip_hash,day" },
    );
    if (trackingSeedError) throw new Error(`seed visitantes_rastreio: ${trackingSeedError.message}`);

    const { data: trackingB } = await clientA
      .from("visitantes_rastreio")
      .select("id")
      .eq("portal_id", pB);
    ensure(
      (trackingB?.length ?? 0) === 0,
      "user A não lê visitantes_rastreio do portal B",
      trackingB,
    );
  } finally {
    await admin
      .from("visitantes_rastreio")
      .delete()
      .in("ip_hash", [`hash-a-${stamp}`, `hash-b-${stamp}`]);

    if (pA || pB) {
      await admin.from("lead_submissions").delete().in("portal_id", [pA, pB].filter(Boolean));
      await admin.from("analytics_events").delete().in("portal_id", [pA, pB].filter(Boolean));
    }
    if (uidA || uidB) {
      await admin.from("portal_members").delete().in("user_id", [uidA, uidB].filter(Boolean));
    }
    if (pA || pB) {
      await admin.from("portals").delete().in("id", [pA, pB].filter(Boolean));
    }
    if (uidA) await admin.auth.admin.deleteUser(uidA);
    if (uidB) await admin.auth.admin.deleteUser(uidB);
  }
});

if (!HAS_RLS_ENV) {
  console.log(
    "SKIP rls-portal-isolation — credenciais ausentes no bun test genérico; " +
      "use o workflow RLS Security Gate para validação obrigatória.",
  );
}
