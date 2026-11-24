/**
 * Integration test: RLS on sensitive tables (lead_submissions, service_catalog).
 *
 * Generic `bun test` must never terminate the whole suite when credentials are
 * unavailable. The dedicated RLS workflow performs a hard preflight and only
 * reaches this file when SUPABASE_SERVICE_ROLE_KEY exists.
 */
import { test } from "bun:test";
import { assertDenied, assertHidden, rlsClient, rlsEnvironment, RLS_TEST_TIMEOUT_MS } from "./helpers";

const environment = rlsEnvironment();
const HAS_RLS_ENV = environment !== null;

const rlsTest = HAS_RLS_ENV ? test : test.skip;

rlsTest("RLS sensível — anon, usuário comum e admin", async () => {
  if (!environment) throw new Error("RLS_BLOCKED_MISSING_SECRET");
  const { url, publishableKey, serviceKey } = environment;
  const admin = rlsClient(url, serviceKey);
  const stamp = Date.now();
  const password = crypto.randomUUID();
  const userEmail = `rls-user-${stamp}@example.com`;
  const adminEmail = `rls-admin-${stamp}@example.com`;

  let userId: string | undefined;
  let adminId: string | undefined;
  let leadId: string | undefined;
  let catalogId: string | undefined;
  const failures: string[] = [];

  const check = (condition: boolean, okLabel: string, badLabel: string, extra?: unknown) => {
    if (condition) {
      console.log("✓", okLabel);
      return;
    }
    const suffix = extra ? ` — ${String(extra)}` : "";
    failures.push(`${badLabel}${suffix}`);
    console.error("✗", badLabel, extra ?? "");
  };

  const signedClient = async (email: string) => {
    const client = rlsClient(url, publishableKey);
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      if (/Email logins are disabled|email_provider_disabled/i.test(error.message)) {
        throw new Error(
          "RLS_BLOCKED_AUTH_PROVIDER_DISABLED: login por e-mail/senha está desabilitado; " +
            "o gate dedicado não pode comprovar autorização authenticated.",
        );
      }
      throw new Error(`login de teste falhou: ${error.message}`);
    }
    return client;
  };

  try {
    const { data: u1, error: e1 } = await admin.auth.admin.createUser({
      email: userEmail,
      password,
      email_confirm: true,
    });
    if (e1) throw new Error(e1.message);
    if (!u1.user) throw new Error("create user returned no user");
    userId = u1.user.id;

    const { data: u2, error: e2 } = await admin.auth.admin.createUser({
      email: adminEmail,
      password,
      email_confirm: true,
    });
    if (e2) throw new Error(e2.message);
    if (!u2.user) throw new Error("create admin returned no user");
    adminId = u2.user.id;

    const { error: roleError } = await admin
      .from("user_roles")
      .insert({ user_id: adminId, role: "admin" });
    if (roleError) throw new Error(`seed admin role: ${roleError.message}`);

    const { data: lead, error: leadError } = await admin
      .from("lead_submissions")
      .insert({ name: "RLS Test", source: "rls-test" })
      .select("id")
      .single();
    if (leadError) throw new Error(`seed lead: ${leadError.message}`);
    leadId = lead.id as string;

    const { data: svc, error: svcError } = await admin
      .from("service_catalog")
      .insert({ code: `rls_test_${stamp}`, name: "RLS Test Service", active: false })
      .select("id")
      .single();
    if (svcError) throw new Error(`seed service_catalog: ${svcError.message}`);
    catalogId = svc.id as string;

    const anonClient = rlsClient(url, publishableKey);
    const userClient = await signedClient(userEmail);
    const adminClient = await signedClient(adminEmail);

    for (const [client, label] of [[anonClient, "anon"], [userClient, "usuário comum"], [adminClient, "admin"]] as const) {
      const history = await client.from("lead_history").select("id").eq("lead_id", leadId);
      assertHidden(history, `${label} não lê histórico protegido diretamente`);
      const directWrite = await client.from("lead_history").insert({ lead_id: leadId, kind: "status_change", actor: "forged" });
      assertDenied(directWrite.error, `${label} não forja histórico`);
    }

    const anonLead = await anonClient
      .from("lead_submissions")
      .select("id")
      .eq("id", leadId);
    assertHidden(anonLead, "anon NÃO lê lead_submissions");

    const anonSvc = await anonClient.from("service_catalog").select("id").eq("id", catalogId);
    assertHidden(anonSvc, "anon NÃO lê service_catalog");

    const userLead = await userClient
      .from("lead_submissions")
      .select("id")
      .eq("id", leadId);
    assertHidden(userLead, "usuário comum NÃO lê lead_submissions");

    const userSvc = await userClient
      .from("service_catalog")
      .select("id")
      .eq("id", catalogId);
    assertHidden(userSvc, "usuário comum NÃO lê service_catalog");

    const userWrite = await userClient
      .from("service_catalog")
      .update({ name: "hack" })
      .eq("id", catalogId)
      .select("id");
    check(
      userWrite.error ? userWrite.error.code === "42501" : (userWrite.data ?? []).length === 0,
      "usuário comum NÃO escreve em service_catalog",
      "usuário comum escreveu em service_catalog",
    );

    const adminLead = await adminClient
      .from("lead_submissions")
      .select("id")
      .eq("id", leadId);
    check(
      !adminLead.error && (adminLead.data ?? []).length === 1,
      "admin lê lead_submissions",
      "admin não leu lead_submissions",
      adminLead.error?.message,
    );

    const adminSvc = await adminClient
      .from("service_catalog")
      .select("id")
      .eq("id", catalogId);
    check(
      !adminSvc.error && (adminSvc.data ?? []).length === 1,
      "admin lê service_catalog",
      "admin não leu service_catalog",
      adminSvc.error?.message,
    );

    const adminLeadWrite = await adminClient
      .from("lead_submissions")
      .update({ status: "em_atendimento" })
      .eq("id", leadId)
      .select("id");
    check(
      !adminLeadWrite.error && (adminLeadWrite.data ?? []).length === 1,
      "admin atualiza lead_submissions",
      "admin não atualizou lead_submissions",
      adminLeadWrite.error?.message,
    );

    if (!adminLeadWrite.error) {
      const saved = await admin.from("lead_submissions").select("status").eq("id", leadId).single();
      check(!saved.error && saved.data?.status === "em_atendimento", "status persistido", "status não persistido");
      const history = await admin.from("lead_history").select("from_value,to_value,actor").eq("lead_id", leadId).eq("kind", "status_change");
      check(!history.error && history.data?.length === 1 && history.data[0]?.to_value === "em_atendimento" && history.data[0]?.actor === "admin", "histórico gravado uma única vez pelo trigger", "histórico ausente ou divergente");
    }

    if (failures.length > 0) {
      throw new Error(`RLS sensível falhou: ${failures.join(" | ")}`);
    }
  } finally {
    if (leadId) await admin.from("lead_submissions").delete().eq("id", leadId);
    if (catalogId) await admin.from("service_catalog").delete().eq("id", catalogId);
    if (adminId) {
      await admin.from("user_roles").delete().eq("user_id", adminId);
      await admin.auth.admin.deleteUser(adminId);
    }
    if (userId) await admin.auth.admin.deleteUser(userId);
  }
}, RLS_TEST_TIMEOUT_MS);

if (!HAS_RLS_ENV) {
  console.log(
    "SKIP rls-sensitive — credenciais ausentes no bun test genérico; " +
      "use o workflow RLS Security Gate para validação obrigatória.",
  );
}
