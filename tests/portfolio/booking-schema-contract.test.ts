import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";

const sql = readFileSync(
  new URL("../../supabase/migrations/20261105090000_portfolio_booking_schema_v1.sql", import.meta.url),
  "utf8",
).toLowerCase();

const TABLES = [
  "tenants",
  "memberships",
  "services",
  "professionals",
  "professional_services",
  "work_hours",
  "exceptions",
  "appointments",
  "audit",
] as const;

describe("portfolio booking: contrato do schema v1 fechado por padrão", () => {
  test("todas as tabelas existem com RLS explicitamente ativada", () => {
    for (const name of TABLES) {
      const table = `public.portfolio_booking_${name}`;
      expect(sql).toContain(`create table if not exists ${table}`);
      expect(sql).toContain(`alter table ${table} enable row level security`);
      expect(sql).toMatch(new RegExp(`revoke all on table[\\s\\S]*?${table}`));
    }
    expect(sql).toMatch(/from public, anon, authenticated;/);
    expect(sql).not.toMatch(/create policy|grant\s+(select|insert|update|delete|all)\s+on\s+/);
  });

  test("nenhum tenant nasce com agenda habilitada", () => {
    expect(sql).toContain("enabled boolean not null default false");
    expect(sql).toContain("client_key text primary key");
  });

  test("cadastra equipe e serviços sem referências entre empresas", () => {
    expect(sql).toContain("foreign key (client_key, professional_id)");
    expect(sql).toContain("foreign key (client_key, service_id)");
    expect(sql).toContain("foreign key (client_key, professional_id, service_id)");
    expect(sql).toContain("references public.portfolio_booking_professional_services");
  });

  test("evita double-booking e repetição da mesma tentativa de pagamento/reserva", () => {
    expect(sql).toContain("create extension if not exists btree_gist");
    expect(sql).toContain("exclude using gist");
    expect(sql).toContain("tstzrange(starts_at, reserved_until, '[)') with &&");
    expect(sql).toContain("where (status in ('requested', 'confirmed'))");
    expect(sql).toContain("unique (client_key, customer_id, idempotency_key)");
  });

  test("horários em UTC são distintos dos expedientes locais da empresa", () => {
    expect(sql).toContain("timezone text not null default 'america/sao_paulo'");
    expect(sql).toContain("starts_local time not null");
    expect(sql).toContain("ends_local time not null");
    expect(sql).toContain("starts_at timestamptz not null");
    expect(sql).toContain("reserved_until timestamptz not null");
  });
});
