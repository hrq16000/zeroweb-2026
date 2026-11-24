import {
  PUBLICATION_TARGET, parsePublicationCommits, parsePublicationProject,
  parsePublicationDeployments, parsePublicationChecks,
  type ConnectionStatus, type PublicationOverview,
} from "./publication-policy";

const GATEWAY_URL = "https://connector-gateway.lovable.dev";
type Credentials = { lovableKey: string; githubKey: string; vercelKey: string };
type ReadResult = { ok: true; data: unknown; status: ConnectionStatus } | { ok: false; status: ConnectionStatus };
const missing: ConnectionStatus = { state: "unconfigured", httpStatus: null, code: "not_configured", message: "Conexão não configurada." };
const invalid: ConnectionStatus = { state: "error", httpStatus: 200, code: "invalid_response", message: "Resposta não corresponde ao projeto esperado." };

async function readGateway(connector: "github" | "udc_vercel_api", key: string, lovableKey: string, path: string, request: typeof fetch): Promise<ReadResult> {
  if (!key || !lovableKey) return { ok: false, status: missing };
  try {
    const response = await request(`${GATEWAY_URL}/${connector}${path}`, {
      method: "GET", headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": key, Accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`[publication] ${connector} HTTP ${response.status}: ${text}`);
      let code = "provider_error";
      try {
        const body: unknown = JSON.parse(text);
        if (body && typeof body === "object" && "error" in body && body.error && typeof body.error === "object" && "code" in body.error && typeof body.error.code === "string") code = body.error.code.slice(0, 80);
      } catch { /* A provider can return non-JSON errors. */ }
      const message = response.status === 403 ? "Acesso recusado pela conexão." : response.status === 404 ? "Projeto ou recurso não acessível." : response.status === 401 ? "A conexão precisa ser reautorizada." : "Não foi possível consultar o serviço.";
      return { ok: false, status: { state: "error", httpStatus: response.status, code, message } };
    }
    const data: unknown = await response.json();
    return { ok: true, data, status: { state: "connected", httpStatus: response.status, code: "ok", message: "Acesso de leitura confirmado." } };
  } catch {
    return { ok: false, status: { state: "error", httpStatus: null, code: "unavailable", message: "Serviço indisponível; tente novamente." } };
  }
}

export async function loadPublicationOverview(credentials: Credentials, request: typeof fetch = fetch): Promise<PublicationOverview> {
  const query = new URLSearchParams({ teamId: PUBLICATION_TARGET.teamId });
  const [github, vercel] = await Promise.all([
    readGateway("github", credentials.githubKey, credentials.lovableKey, `/repos/${PUBLICATION_TARGET.repository}/commits?sha=main&per_page=50`, request),
    readGateway("udc_vercel_api", credentials.vercelKey, credentials.lovableKey, `/v9/projects/${PUBLICATION_TARGET.projectId}?${query}`, request),
  ]);
  const result: PublicationOverview = {
    checkedAt: new Date().toISOString(), github: github.status, vercel: vercel.status,
    deploymentsStatus: { state: "error", httpStatus: null, code: "not_checked", message: "Histórico não consultado sem acesso ao projeto." },
    commits: [], deployments: [],
  };
  if (github.ok) {
    try { result.commits = parsePublicationCommits(github.data); } catch { result.github = invalid; }
  }
  if (!vercel.ok) return result;
  try { parsePublicationProject(vercel.data); } catch { result.vercel = invalid; return result; }
  const deployments = await readGateway("udc_vercel_api", credentials.vercelKey, credentials.lovableKey,
    `/v6/deployments?${new URLSearchParams({ teamId: PUBLICATION_TARGET.teamId, projectId: PUBLICATION_TARGET.projectId, limit: "10" })}`, request);
  result.deploymentsStatus = deployments.status;
  if (deployments.ok) {
    try { result.deployments = parsePublicationDeployments(deployments.data); } catch { result.deploymentsStatus = invalid; }
  }
  return result;
}

export async function loadPublicationChecks(credentials: Credentials, sha: string) {
  const membership = await readGateway("github", credentials.githubKey, credentials.lovableKey,
    `/repos/${PUBLICATION_TARGET.repository}/compare/${sha}...main`, fetch);
  if (!membership.ok) return { status: membership.status, checks: [] };
  const comparison = membership.data;
  if (!comparison || typeof comparison !== "object" || !("status" in comparison) || !["ahead", "identical"].includes(String(comparison.status))) {
    return { status: { ...invalid, code: "not_on_main", message: "O commit não está integrado à main." }, checks: [] };
  }
  const response = await readGateway("github", credentials.githubKey, credentials.lovableKey,
    `/repos/${PUBLICATION_TARGET.repository}/commits/${sha}/check-runs?per_page=100`, fetch);
  if (!response.ok) return { status: response.status, checks: [] };
  try { return { status: response.status, checks: parsePublicationChecks(response.data) }; }
  catch { return { status: invalid, checks: [] }; }
}