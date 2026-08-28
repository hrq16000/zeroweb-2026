/**
 * Runner de rotinas agendadas (pg_cron / scheduler externo) com:
 *  - single-flight lock (evita execuções concorrentes da mesma rotina)
 *  - pausa manual por rotina (`ops_job_control.paused`)
 *  - circuit breaker (abre após N falhas consecutivas, com cooldown)
 *  - histórico persistido em `ops_job_runs` (exibido no /painel-auditorias)
 *
 * Server-only: usa o cliente admin do backend.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type JobOutcome = {
  ok: boolean;
  skipped?: "paused" | "circuit_open" | "already_running";
  runId?: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
};

export async function runJob(
  job: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: () => Promise<Record<string, any>>,
  opts: { staleSeconds?: number; failureThreshold?: number; cooldownSeconds?: number } = {},
): Promise<JobOutcome> {
  const { data, error } = await supabaseAdmin.rpc("ops_job_try_start", {
    _job: job,
    _stale_seconds: opts.staleSeconds ?? 900,
  });
  if (error) return { ok: false, error: error.message };

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.allowed) {
    return { ok: false, skipped: (row?.reason ?? "already_running") as JobOutcome["skipped"] };
  }

  const runId = row.run_id as string;
  try {
    const result = await fn();
    await supabaseAdmin.rpc("ops_job_finish", {
      _run_id: runId,
      _status: "ok",
      _metadata: result ?? {},
      _error: undefined,
      _failure_threshold: opts.failureThreshold ?? 3,
      _cooldown_seconds: opts.cooldownSeconds ?? 3600,
    });
    return { ok: true, runId, result };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await supabaseAdmin.rpc("ops_job_finish", {
      _run_id: runId,
      _status: "failed",
      _metadata: {},
      _error: message.slice(0, 1000),
      _failure_threshold: opts.failureThreshold ?? 3,
      _cooldown_seconds: opts.cooldownSeconds ?? 3600,
    });
    return { ok: false, runId, error: message };
  }
}
