/**
 * Leitura do histórico de rotinas agendadas (`ops_job_runs` / `ops_job_control`).
 * A RLS libera a consulta apenas para admins; o painel usa isso para exibir
 * execuções, falhas, pausa manual e estado do circuit breaker.
 */
import { supabase } from "@/integrations/supabase/client";

export type OpsJobRun = {
  id: string;
  job: string;
  status: string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  error: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
};

export type OpsJobControl = {
  job: string;
  paused: boolean;
  consecutive_failures: number;
  circuit_open_until: string | null;
  running_since: string | null;
};

export async function fetchOpsJobRuns(limit = 25): Promise<OpsJobRun[]> {
  const { data, error } = await supabase
    .from("ops_job_runs")
    .select("id,job,status,started_at,finished_at,duration_ms,error,metadata")
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as OpsJobRun[];
}

export async function fetchOpsJobControl(): Promise<OpsJobControl[]> {
  const { data, error } = await supabase
    .from("ops_job_control")
    .select("job,paused,consecutive_failures,circuit_open_until,running_since")
    .order("job");
  if (error) return [];
  return (data ?? []) as OpsJobControl[];
}
