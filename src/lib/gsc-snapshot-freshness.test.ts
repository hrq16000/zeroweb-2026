import { describe, expect, it } from "bun:test";
import { assessGscSnapshotFreshness } from "./gsc-snapshot-freshness";

describe("actualidade do snapshot real do Search Console", () => {
  const today = Date.parse("2026-10-27T05:00:00Z");

  it("bloqueia o snapshot real de setembro como fonte de ranking de outubro", () => {
    expect(assessGscSnapshotFreshness("2026-09-02T04:30:00.000Z", today)).toEqual({
      stale: true,
      ageDays: 55,
    });
  });

  it("aceita coleta recente e rastreia dias de idade", () => {
    expect(assessGscSnapshotFreshness("2026-10-26T05:00:00Z", today)).toEqual({
      stale: false,
      ageDays: 1,
    });
  });

  it("não inventa frescor quando não existe coleta ou data é inválida", () => {
    expect(assessGscSnapshotFreshness(null, today)).toEqual({ stale: true, ageDays: null });
    expect(assessGscSnapshotFreshness("invalid", today)).toEqual({ stale: true, ageDays: null });
  });

  it("não aceita uma data futura como evidência real", () => {
    expect(assessGscSnapshotFreshness("2026-10-29T05:00:00Z", today)).toEqual({
      stale: true,
      ageDays: null,
    });
  });

  it("respeita o limite de sete dias sem considerar data exata de corte stale", () => {
    expect(assessGscSnapshotFreshness("2026-10-20T05:00:00Z", today).stale).toBe(false);
    expect(assessGscSnapshotFreshness("2026-10-20T04:59:59Z", today).stale).toBe(true);
  });
});
