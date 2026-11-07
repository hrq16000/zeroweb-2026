/**
 * Google-only booking authorization predicate.
 *
 * Receives user data fetched from Supabase Auth by a trusted server, plus
 * independently validated JWT claims. Never accept these values directly
 * from browser input. Linked Google identity alone is NOT enough: the
 * current session must actually have an OAuth authentication method.
 *
 * This is a prerequisite for backend authorization, NOT an OAuth login.
 */
export type BookingAuthUser = Readonly<{
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
  identities?: readonly Readonly<{
    provider: string;
    identity_data?: Readonly<{ email?: unknown }> | null;
  }>[] | null;
}>;

function email(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function oauthMethodWasUsed(claims: unknown): boolean {
  if (!claims || typeof claims !== "object" || Array.isArray(claims)) return false;
  const amr = (claims as Record<string, unknown>).amr;
  if (!Array.isArray(amr)) return false;
  return amr.some((item: unknown) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    return (item as Record<string, unknown>).method === "oauth";
  });
}

export function isVerifiedGoogleBookingSession(
  claims: unknown,
  user: BookingAuthUser | null,
): boolean {
  if (!user?.id || !user.email_confirmed_at || !oauthMethodWasUsed(claims)) return false;
  if (!claims || typeof claims !== "object" || Array.isArray(claims)) return false;
  if ((claims as Record<string, unknown>).sub !== user.id) return false;
  const confirmedEmail = email(user.email);
  if (!confirmedEmail) return false;

  // An OAuth AMR confirms the *method*, not its social provider. A user
  // with linked Google + GitHub identities could otherwise log in via GitHub
  // and pass. Until the originating provider is securely asserted by the
  // auth server, allow only Google-only identities (strict, fail-closed).
  const identities = user.identities;
  if (!identities || identities.length !== 1) return false;
  const identity = identities[0];
  return identity.provider === "google" &&
    email(identity.identity_data?.email) === confirmedEmail;
}
