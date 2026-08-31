/**
 * Integration test: RLS on sensitive tables (lead_submissions, service_catalog).
 *
 * Covers three roles:
 *   - anon (no session)
 *   - authenticated common user (no admin role)
 *   - admin (app_role = 'admin')
 *
 * Temporary data is always removed in `finally`.
 *
 * Run:
 *   bun run test:rls-sensitive
 *
 * Requires server env (NEVER commit these):
 *   SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * The test SKIPS (exit 0) with a clear message when they are missing.
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
const ANON = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
const SRK = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!URL || !ANON || !SRK) {
  const missing = [
    !URL && "SUPABASE_URL",
    !ANON && "SUPABASE_PUBLISHABLE_KEY",
    !SRK && "SUPABASE_SERVICE_ROLE_KEY",
  ].filter(Boolean);
  console.log(`SKIP rls-sensitive — variáveis de ambiente ausentes: ${missing.join(", ")}`);
  process.exit(0);
}

const admin = createClient(URL, SRK, { auth: { persistSession: false } });

let failures = 0;
function ok(label: string) {
  console.log("✓", label);
}
function bad(label: string, extra?: unknown) {
  failures++;
  console.error("✗", label, extra ?? "");
}
function check(cond: boolean, okLabel: string, badLabel: string, extra?: unknown) {
  if (cond) ok(okLabel);
  else bad(badLabel, extra);
}

async function signedClient(email: string, password: string) {
  const c = createClient(URL!, ANON!, { auth: { persistSession: false } });
  const { error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`login falhou (${email}): ${error.message}`);
  return c;
}

async function main() {
  const stamp = Date.now();
  const password = "Rls-Sens!123";
  const userEmail = `rls-user-${stamp}@example.com`;
  const adminEmail = `rls-admin-${stamp}@example.com`;

  let userId: string | undefined;
  let adminId: string | undefined;
  let leadId: string | undefined;
  let catalogId: string | undefined;

  try {
    const { data: u1, error: e1 } = await admin.auth.admin.createUser({
      email: userEmail,
      password,
      email_confirm: true,
    });
    if (e1) throw new Error(e1.message);
    userId = u1.user!.id;

    const { data: u2, error: e2 } = await admin.auth.admin.createUser({
      email: adminEmail,
      password,
      email_confirm: true,
    });
    if (e2) throw new Error(e2.message);
    adminId = u2.user!.id;
    await admin.from("user_roles").insert({ user_id: adminId, role: "admin" });

    // Temporary rows (service role bypasses RLS).
    const { data: lead, error: le } = await admin
      .from("lead_submissions")
      .insert({ name: "RLS Test", source: "rls-test" })
      .select("id")
      .single();
    if (le) throw new Error(`seed lead: ${le.message}`);
    leadId = lead.id as string;

    const { data: svc, error: se } = await admin
      .from("service_catalog")
      .insert({ code: `rls_test_${stamp}`, name: "RLS Test Service", active: false })
      .select("id")
      .single();
    if (se) throw new Error(`seed service_catalog: ${se.message}`);
    catalogId = svc.id as string;

    const anonClient = createClient(URL!, ANON!, { auth: { persistSession: false } });
    let userClient, adminClient;
    try {
      userClient = await signedClient(userEmail, password);
      adminClient = await signedClient(adminEmail, password);
    } catch (e) {
      const msg = (e as Error).message;
      if (/Email logins are disabled|email_provider_disabled/i.test(msg)) {
        console.log(
          "SKIP rls-sensitive — login por e-mail/senha está desabilitado neste projeto (auth Google-only). " +
            "Habilite temporariamente o provedor de e-mail para executar este teste.",
        );
        return;
      }
      throw e;
    }

    // --- anon ---
    const anonLead = await anonClient.from("lead_submissions").select("id").eq("id", leadId);
    check(
      anonLead.error || (anonLead.data ?? []).length === 0,
      "anon NÃO lê lead_submissions",
      "anon leu lead_submissions", anonLead.data,
    );

    const anonSvc = await anonClient.from("service_catalog").select("id").eq("id", catalogId);
    check(
      anonSvc.error || (anonSvc.data ?? []).length === 0,
      "anon NÃO lê service_catalog",
      "anon leu service_catalog", anonSvc.data,
    );

    // --- usuário comum ---
    const userLead = await userClient.from("lead_submissions").select("id").eq("id", leadId);
    check(
      userLead.error || (userLead.data ?? []).length === 0,
      "usuário comum NÃO lê lead_submissions",
      "usuário comum leu lead_submissions", userLead.data,
    );

    const userSvc = await userClient.from("service_catalog").select("id").eq("id", catalogId);
    check(
      userSvc.error || (userSvc.data ?? []).length === 0,
      "usuário comum NÃO lê service_catalog",
      "usuário comum leu service_catalog", userSvc.data,
    );

    const userWrite = await userClient
      .from("service_catalog")
      .update({ name: "hack" })
      .eq("id", catalogId)
      .select("id");
    check(
      userWrite.error || (userWrite.data ?? []).length === 0,
      "usuário comum NÃO escreve em service_catalog",
      "usuário comum escreveu em service_catalog",
    );

    // --- admin ---
    const adminLead = await adminClient.from("lead_submissions").select("id").eq("id", leadId);
    check(
      !adminLead.error && (adminLead.data ?? []).length === 1,
      "admin lê lead_submissions",
      "admin não leu lead_submissions", adminLead.error?.message,
    );

    const adminSvc = await adminClient.from("service_catalog").select("id").eq("id", catalogId);
    check(
      !adminSvc.error && (adminSvc.data ?? []).length === 1,
      "admin lê service_catalog",
      "admin não leu service_catalog", adminSvc.error?.message,
    );

    const adminLeadWrite = await adminClient
      .from("lead_submissions")
      .update({ status: "em_atendimento" })
      .eq("id", leadId)
      .select("id");
    check(
      !adminLeadWrite.error && (adminLeadWrite.data ?? []).length === 1,
      "admin atualiza lead_submissions",
      "admin não atualizou lead_submissions", adminLeadWrite.error?.message,
    );
  } finally {
    if (leadId) await admin.from("lead_submissions").delete().eq("id", leadId);
    if (catalogId) await admin.from("service_catalog").delete().eq("id", catalogId);
    if (adminId) {
      await admin.from("user_roles").delete().eq("user_id", adminId);
      await admin.auth.admin.deleteUser(adminId);
    }
    if (userId) await admin.auth.admin.deleteUser(userId);
  }

  if (failures > 0) {
    console.error(`\n${failures} verificação(ões) de RLS falharam.`);
    process.exit(1);
  }
  console.log("\n✓ RLS sensível OK");
}

main().catch((e) => {
  console.error("erro inesperado:", (e as Error).message);
  process.exit(1);
});
