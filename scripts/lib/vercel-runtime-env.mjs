const normalize = (value) => String(value ?? "").trim().toLowerCase();

// Vercel exposes VERCEL_ENV/VERCEL_URL even when VERCEL is not the literal "1".
export function isVercelBuild(env = process.env) {
  const flag = normalize(env.VERCEL);
  const environment = normalize(env.VERCEL_ENV);
  const deploymentUrl = normalize(env.VERCEL_URL);
  return flag === "1" || flag === "true" ||
    ["production", "preview", "development"].includes(environment) ||
    deploymentUrl.length > 0;
}
