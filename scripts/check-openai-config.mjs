const onVercel = process.env.VERCEL === "1";

if (!onVercel) {
  console.log("[openai-config] non-Vercel environment: secret gate skipped.");
  process.exit(0);
}

if (!process.env.OPENAI_API_KEY?.trim()) {
  console.error(
    "[openai-config] OPENAI_API_KEY is not available to this Vercel deployment. " +
      "Link the Sensitive Shared Environment Variable to this project for Preview/Production.",
  );
  process.exit(1);
}

console.log("[openai-config] OPENAI_API_KEY is available to this Vercel deployment.");
