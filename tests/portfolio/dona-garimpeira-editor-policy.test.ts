import { describe, expect, it } from "bun:test";
import {
  DONA_GARIMPEIRA_TENANT,
  authorizeDonaGarimpeira,
  donaGarimpeiraNeedsOwnerEmail,
  planDonaGarimpeiraAuditEvent,
  type AuthorizationRequest,
  type DonaGarimpeiraMembership,
  type VerifiedProviderSession,
} from "@/lib/dona-garimpeira-editor-policy";

const nowMs = 1793640000000;
const owner = "google-owner-id";
const admin = "google-admin-id";
const editor = "google-editor-id";

function membership(
  subject: string,
  role: DonaGarimpeiraMembership["role"],
  status: DonaGarimpeiraMembership["status"] = "active"
): DonaGarimpeiraMembership {
  return { tenant: DONA_GARIMPEIRA_TENANT, subject, role, status };
}

const members = [
  membership(owner, "owner"),
  membership(admin, "platform_admin"),
  membership(editor, "editor"),
];

function session(subject: string, overrides: Partial<VerifiedProviderSession> = {}): VerifiedProviderSession {
  return {
    provider: "google",
    subject,
    emailVerified: true,
    expiresAtMs: nowMs + 60_000,
    ...overrides,
  };
}

function request(
  subject: string,
  action: AuthorizationRequest["action"],
  overrides: Partial<AuthorizationRequest> = {}
): AuthorizationRequest {
  return {
    tenant: DONA_GARIMPEIRA_TENANT,
    session: session(subject),
    action,
    memberships: members,
    nowMs,
    ...overrides,
  };
}

describe("Dona Garimpeira — RBAC preparatório seguro", () => {
  it("nega sessão ausente, e-mail não verificado e sessão vencida", () => {
    expect(authorizeDonaGarimpeira(request(owner, "content:publish", { session: null, fields: ["gallery"] })).allow).toBe(false);
    expect(authorizeDonaGarimpeira(request(owner, "content:publish", { session: session(owner, { emailVerified: false }), fields: ["gallery"] })).allow).toBe(false);
    expect(authorizeDonaGarimpeira(request(owner, "content:publish", { session: session(owner, { expiresAtMs: nowMs }), fields: ["gallery"] })).allow).toBe(false);
  });

  it("nega identidades não cadastradas e membresias revogadas", () => {
    expect(authorizeDonaGarimpeira(request("stranger-google-id", "content:publish", { fields: ["gallery"] }))).toEqual({ allow: false, reason: "MEMBERSHIP_UNRESOLVED" });
    expect(authorizeDonaGarimpeira(request(editor, "content:publish", {
      fields: ["gallery"],
      memberships: [membership(editor, "editor", "revoked")],
    })).allow).toBe(false);
  });

  it("nega duas associações simultâneas para o mesmo sujeito", () => {
    const decision = authorizeDonaGarimpeira(request(editor, "content:publish", {
      fields: ["gallery"],
      memberships: [membership(editor, "editor"), membership(editor, "platform_admin")],
    }));
    expect(decision).toEqual({ allow: false, reason: "MEMBERSHIP_UNRESOLVED" });
  });

  it("nega acesso de um usuário de outro tenant, mesmo com role owner", () => {
    const foreign = {
      tenant: "portfolio-outro-cliente",
      subject: owner,
      role: "owner",
      status: "active",
    } as unknown as DonaGarimpeiraMembership;
    expect(authorizeDonaGarimpeira(request(owner, "content:publish", {
      memberships: [foreign], fields: ["gallery"],
    })).allow).toBe(false);
    expect(authorizeDonaGarimpeira(request(owner, "content:publish", {
      tenant: "portfolio-outro-cliente", fields: ["gallery"],
    })).toEqual({ allow: false, reason: "TENANT_MISMATCH" });
  });

  it("permite publicação direta só de campos públicos aos colaboradores", () => {
    const allowed = authorizeDonaGarimpeira(request(editor, "content:publish", {
      fields: ["gallery", "descriptions", "public_copy"],
    }));
    expect(allowed).toEqual({ allow: true, role: "editor" });
    expect(authorizeDonaGarimpeira(request(editor, "content:publish", {
      fields: ["business_contact"],
    })).toEqual({ allow: false, reason: "FIELD_NOT_ALLOWED" });
    expect(authorizeDonaGarimpeira(request(editor, "media:manage", {
      fields: ["users"],
    })).allow).toBe(false);
    expect(authorizeDonaGarimpeira(request(editor, "content:publish")).allow).toBe(false);
  });

  it("editor não concede usuário, não revoga, não restaura histórico nem muda configurações", () => {
    const target = { tenant: DONA_GARIMPEIRA_TENANT, subject: "google-other-editor-id", role: "editor" as const };
    for (const action of ["users:grant", "users:revoke", "content:restore", "settings:update", "history:read"] as const) {
      expect(authorizeDonaGarimpeira(request(editor, action, { target, fields: ["business_contact"] })).allow).toBe(false);
    }
  });

  it("owner e 0WEB podem gerenciar colaboradores, mas nunca remover owner ou outro admin", () => {
    const targetEditor = { tenant: DONA_GARIMPEIRA_TENANT, subject: editor, role: "editor" as const };
    const targetOwner = { tenant: DONA_GARIMPEIRA_TENANT, subject: owner, role: "owner" as const };
    const targetAdmin = { tenant: DONA_GARIMPEIRA_TENANT, subject: admin, role: "platform_admin" as const };
    expect(authorizeDonaGarimpeira(request(owner, "users:grant", { target: targetEditor })).allow).toBe(true);
    expect(authorizeDonaGarimpeira(request(admin, "users:revoke", { target: targetEditor })).allow).toBe(true);
    expect(authorizeDonaGarimpeira(request(admin, "users:revoke", { target: targetOwner })).allow).toBe(false);
    expect(authorizeDonaGarimpeira(request(owner, "users:revoke", { target: targetAdmin })).allow).toBe(false);
    expect(authorizeDonaGarimpeira(request(owner, "users:revoke", {
      target: { tenant: DONA_GARIMPEIRA_TENANT, subject: owner, role: "editor" },
    })).allow).toBe(false);
  });

  it("alterações críticas exigem perfil elevado e campo permitido", () => {
    expect(authorizeDonaGarimpeira(request(owner, "settings:update", {
      fields: ["business_address", "business_contact"],
    })).allow).toBe(true);
    expect(authorizeDonaGarimpeira(request(admin, "settings:update", {
      fields: ["identity"],
    })).allow).toBe(true);
    expect(authorizeDonaGarimpeira(request(admin, "settings:update", {
      fields: ["users"],
    })).allow).toBe(false);
    expect(authorizeDonaGarimpeira(request(editor, "settings:update", {
      fields: ["business_address"],
    })).allow).toBe(false);
  });

  it("o plano de auditoria só existe após autorização e revisão válida", () => {
    const allowedRequest = request(editor, "content:publish", { fields: ["gallery"] });
    const allowed = authorizeDonaGarimpeira(allowedRequest);
    expect(planDonaGarimpeiraAuditEvent(allowedRequest, allowed, 7)).toEqual({
      tenant: DONA_GARIMPEIRA_TENANT,
      actorSubject: editor,
      action: "content:publish",
      timestamp: new Date(nowMs).toISOString(),
      revisionBefore: 7,
      revisionAfter: 8,
      fields: ["gallery"],
    });
    expect(planDonaGarimpeiraAuditEvent(allowedRequest, { allow: false, reason: "DENIED" }, 7)).toBeNull();
    expect(planDonaGarimpeiraAuditEvent(allowedRequest, allowed, -1)).toBeNull();
  });

  it("classifica somente alterações importantes para notificação por e-mail", () => {
    expect(donaGarimpeiraNeedsOwnerEmail("content:publish", ["gallery"])).toBe(false);
    expect(donaGarimpeiraNeedsOwnerEmail("content:publish", ["public_copy"])).toBe(false);
    expect(donaGarimpeiraNeedsOwnerEmail("content:publish", ["business_contact"])).toBe(true);
    expect(donaGarimpeiraNeedsOwnerEmail("users:grant")).toBe(true);
    expect(donaGarimpeiraNeedsOwnerEmail("users:revoke")).toBe(true);
    expect(donaGarimpeiraNeedsOwnerEmail("settings:update")).toBe(true);
  });
});
