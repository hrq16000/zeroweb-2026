#!/usr/bin/env node
/**
 * Executa um comando de CI com o artefato real de produção ativo no mesmo
 * processo supervisor. O comando só é repetido quando o runtime de preview
 * encerra inesperadamente; falhas reais do teste continuam falhando sem retry.
 *
 * Uso:
 *   node scripts/ci-with-prod-preview.mjs -- bun run test:e2e:portfolio-popup
 */
import { spawn } from "node:child_process";
import { createWriteStream, readFileSync } from "node:fs";

const separator = process.argv.indexOf("--");
const command = separator >= 0 ? process.argv.slice(separator + 1) : process.argv.slice(2);
if (!command.length) {
  console.error("[ci-preview] comando ausente");
  process.exit(2);
}

const host = "127.0.0.1";
const explicitPort = process.env.PREVIEW_PORT || "";
const basePort = 18080 + (process.pid % 700);
const maxAttempts = Math.max(
  1,
  Number(process.env.CI_PREVIEW_ATTEMPTS || (process.env.CI ? 3 : 1)),
);

function stopGroup(child, signal = "SIGTERM") {
  if (!child?.pid) return;
  try {
    if (process.platform !== "win32") process.kill(-child.pid, signal);
    else child.kill(signal);
  } catch {}
}

async function waitReady(baseUrl, preview, timeoutMs = 120_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (preview.exitCode !== null) {
      throw new Error(`preview encerrou antes de ficar pronto (code=${preview.exitCode})`);
    }
    try {
      const response = await fetch(`${baseUrl}/`, { redirect: "manual" });
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error(`preview não respondeu em ${baseUrl} dentro de ${timeoutMs}ms`);
}

async function runAttempt(attempt) {
  const port = explicitPort || String(basePort + attempt - 1);
  const baseUrl = `http://${host}:${port}`;
  const logPath = `/tmp/0web-preview-${process.pid}-${attempt}.log`;
  const logStream = createWriteStream(logPath, { flags: "w" });

  function tailLog(lines = 180) {
    try {
      const content = readFileSync(logPath, "utf8");
      const tail = content.split("\n").slice(-lines).join("\n");
      if (tail.trim()) {
        console.error("\n[ci-preview] últimas linhas do servidor:");
        console.error(tail);
      }
    } catch {}
  }

  const preview = spawn("bun", ["run", "preview:prod"], {
    env: { ...process.env, PREVIEW_PORT: port },
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  preview.stdout.pipe(logStream, { end: false });
  preview.stderr.pipe(logStream, { end: false });

  let commandProcess = null;
  let previewExitedEarly = false;
  preview.on("exit", (code, signal) => {
    if (commandProcess && commandProcess.exitCode === null) {
      previewExitedEarly = true;
      console.error(
        `[ci-preview] runtime encerrou durante o gate (code=${code ?? "null"}, signal=${signal ?? "null"})`,
      );
      stopGroup(commandProcess, "SIGTERM");
    }
  });

  let exitCode = 1;
  try {
    await waitReady(baseUrl, preview);
    console.log(`[ci-preview] servidor pronto em ${baseUrl} (tentativa ${attempt}/${maxAttempts})`);

    commandProcess = spawn(command[0], command.slice(1), {
      env: {
        ...process.env,
        E2E_BASE_URL: process.env.E2E_BASE_URL || baseUrl,
        BASE_URL: process.env.BASE_URL || baseUrl,
      },
      stdio: "inherit",
      detached: process.platform !== "win32",
    });

    exitCode = await new Promise((resolve) => {
      commandProcess.on("exit", (code, signal) => resolve(signal ? 1 : (code ?? 1)));
    });
  } catch (error) {
    previewExitedEarly = preview.exitCode !== null;
    console.error(`[ci-preview] ${error instanceof Error ? error.message : String(error)}`);
    exitCode = 1;
  } finally {
    stopGroup(commandProcess, "SIGTERM");
    stopGroup(preview, "SIGTERM");
    await new Promise((resolve) => setTimeout(resolve, 500));
    stopGroup(commandProcess, "SIGKILL");
    stopGroup(preview, "SIGKILL");
    logStream.end();
  }

  if (exitCode !== 0) tailLog();
  return { exitCode, previewExitedEarly };
}

let finalCode = 1;
for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  const result = await runAttempt(attempt);
  finalCode = result.exitCode;
  if (finalCode === 0) break;
  if (!result.previewExitedEarly) break;
  if (attempt < maxAttempts) {
    console.warn("[ci-preview] falha de infraestrutura do preview; repetindo o gate do zero.");
  }
}

process.exit(finalCode);
