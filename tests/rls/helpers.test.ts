import { describe, expect, it } from "bun:test";
import { assertDenied, assertHidden } from "./helpers";

describe("RLS evidence must fail closed", () => {
  it("accepts an empty successful read", () => {
    expect(() => assertHidden({ data: [], error: null }, "lead")).not.toThrow();
  });
  it("rejects visible protected rows", () => {
    expect(() => assertHidden({ data: [{ id: "synthetic" }], error: null }, "lead")).toThrow("protected rows");
  });
  it("does not call a network/server failure isolation PASS", () => {
    expect(() => assertHidden({ data: null, error: { code: "500", message: "unavailable" } }, "lead")).toThrow("request failed");
  });
  it("accepts PostgreSQL permission denial", () => {
    expect(() => assertHidden({ data: null, error: { code: "42501", message: "denied" } }, "lead")).not.toThrow();
    expect(() => assertDenied({ code: "42501", message: "denied" }, "write")).not.toThrow();
  });
  it("fails if a forbidden write succeeds", () => {
    expect(() => assertDenied(null, "write")).toThrow("received success");
  });
  it("does not mistake a broken fixture for denied access", () => {
    expect(() => assertDenied({ code: "23503", message: "missing FK" }, "write")).toThrow("23503");
  });
});