import { describe, expect, test } from "bun:test";
import { isVerifiedGoogleBookingSession } from "../../src/lib/portfolio-booking-google-auth";

const user = {
  id: "user-1",
  email: "Proprietario@Exemplo.com",
  email_confirmed_at: "2026-11-07T00:00:00Z",
  identities: [{
    provider: "google",
    identity_data: { email: "proprietario@exemplo.com" },
  }],
};
const googleOAuth = { sub: "user-1", amr: [{ method: "oauth", timestamp: 123 }] };

describe("booking: Google-only identity gate", () => {
  test("permite Google OAuth com identidade e e-mail confirmados", () => {
    expect(isVerifiedGoogleBookingSession(googleOAuth, user)).toBe(true);
  });

  test("nega senha com conta Google apenas vinculada", () => {
    expect(isVerifiedGoogleBookingSession({ amr: [{ method: "password" }] }, user)).toBe(false);
  });

  test("nega sessão sem prova de OAuth ou método de login", () => {
    expect(isVerifiedGoogleBookingSession({}, user)).toBe(false);
    expect(isVerifiedGoogleBookingSession({ amr: null }, user)).toBe(false);
    expect(isVerifiedGoogleBookingSession(null, user)).toBe(false);
  });

  test("nega e-mail não confirmado e identidade Google inconsistente", () => {
    expect(isVerifiedGoogleBookingSession(googleOAuth, { ...user, email_confirmed_at: null })).toBe(false);
    expect(isVerifiedGoogleBookingSession(googleOAuth, { ...user, email: "outra@exemplo.com" })).toBe(false);
    expect(isVerifiedGoogleBookingSession(googleOAuth, {
      ...user, identities: [{ provider: "email", identity_data: { email: "proprietario@exemplo.com" } }],
    })).toBe(false);
    expect(isVerifiedGoogleBookingSession(googleOAuth, { ...user, identities: [] })).toBe(false);
    expect(isVerifiedGoogleBookingSession(googleOAuth, null)).toBe(false);
  });

  test("nega identities inválidas mesmo com campo AMR parecido com OAuth", () => {
    expect(isVerifiedGoogleBookingSession({ amr: [{ method: "oauth-email" }] }, user)).toBe(false);
    expect(isVerifiedGoogleBookingSession({ amr: ["oauth"] }, user)).toBe(false);
    expect(isVerifiedGoogleBookingSession({ amr: [{ value: "oauth" }] }, user)).toBe(false);
  });
});
