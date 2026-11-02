import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const json = (path: string) => JSON.parse(read(path));
const slug = "dona-garimpeira-brecho";

describe("Dona Garimpeira — funnel onboarding (not published)", () => {
  test("the contact belongs to exactly the intended future portfolio", () => {
    const contacts = json("src/config/portfolio-whatsapp.json").contacts;
    const reserved = json("docs/portfolio/drafts/dona-garimpeira-brecho-contact.json");
    const ledger = json("src/config/portfolio-funnel-destinations.json").entries;
    expect(contacts[slug]).toBeUndefined();
    expect(reserved.operationalContact.whatsapp).toBe("5541998379642");
    expect(reserved.provenance.status).toBe("CONFIGURED_UNVERIFIED");
    expect(reserved.stage).toBe("draft");
    expect(ledger[slug].status).toBe("CONFIGURED_UNVERIFIED");
    expect(ledger[slug].source).toBe("CLIENT_SUPPLIED");
    expect(ledger[slug].verifiedAt).toBeUndefined();
    expect(Object.entries(contacts).filter(([, entry]) =>
      (entry as { whatsapp: string | null }).whatsapp === "5541998379642",
    )).toEqual([]);
  });

  test("not a published/registered client or available public form", () => {
    const keys = read("src/lib/portfolio-client-keys.ts");
    const catalog = json("src/config/portfolio-catalog.json");
    const manifest = json("src/config/portfolio-project-manifests.json");
    expect(keys).not.toContain(`"${slug}"`);
    expect(catalog.some((x: { slug: string }) => x.slug === slug)).toBe(false);
    expect(manifest.projects[slug]).toBeUndefined();
    const form = json("docs/portfolio/drafts/dona-garimpeira-brecho-funnel-contract.json");
    expect(form.slug).toBe(`funnel-${slug}`);
    expect(form.status).toBe("draft");
    expect(form.publicationAllowed).toBe(false);
    expect(form.whatsapp_config.enabled).toBe(false);
  });

  test("the three intents are captured without promising inventory", () => {
    const form = json("docs/portfolio/drafts/dona-garimpeira-brecho-funnel-contract.json");
    const interest = form.questions.find((q: { key: string }) => q.key === "interesse");
    expect(interest.required).toBe(true);
    expect(interest.options.map((x: { value: string }) => x.value)).toEqual(["comprar", "vender", "doar"]);
    expect(form.questions.find((q: { key: string }) => q.key === "whatsapp").required).toBe(true);
    expect(form.questions.find((q: { key: string }) => q.key === "nome").required).toBe(true);
    expect(form.questions.find((q: { key: string }) => q.key === "privacidade").required).toBe(true);
    expect(form.description).toContain("confirma reservas");
  });

  test("existing server implementation stores the lead before trying token redirect", () => {
    const source = read("src/lib/dynamic-funnel.functions.ts");
    const insertLead = source.indexOf('.from("dynamic_form_leads")\n      .insert(');
    const createToken = source.indexOf("await createWhatsAppRedirectToken({");
    expect(insertLead).toBeGreaterThan(-1);
    expect(createToken).toBeGreaterThan(insertLead);
    expect(source).toContain('.eq("status", "published")');
    // This is a source-contract check, NOT evidence of database writes/E2E.
  });
});
