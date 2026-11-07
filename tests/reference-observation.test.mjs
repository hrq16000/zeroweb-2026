import test from "node:test";
import assert from "node:assert/strict";
import { checkedTarget, allowsPassiveRequest } from "../scripts/reference-observation.mjs";

test("permite somente URL pública exata dos domínios da 0WEB", () => {
  assert.equal(checkedTarget("https://0web.com.br/portfolio"), "https://0web.com.br/portfolio");
  assert.equal(checkedTarget("https://zeroweb-2026.vercel.app/"), "https://zeroweb-2026.vercel.app/");
});

test("bloqueia origens arbitrárias e redes locais", () => {
  for (const url of [
    "http://0web.com.br/", "https://0web.com.br.evil.test/",
    "https://127.0.0.1/", "https://169.254.169.254/", "file:///etc/passwd",
    "https://0web.com.br:8443/", "https://user:pass@0web.com.br/",
  ]) {
    assert.throws(() => checkedTarget(url), url);
  }
});

test("evita capturar tokens em query e fragmentos", () => {
  assert.throws(() => checkedTarget("https://0web.com.br/portfolio?token=foo"));
  assert.throws(() => checkedTarget("https://0web.com.br/portfolio#secret"));
});

test("somente GET e HEAD dentro do escopo; nunca envia formulários", () => {
  assert.equal(allowsPassiveRequest("GET", "https://0web.com.br/portfolio"), true);
  assert.equal(allowsPassiveRequest("HEAD", "https://0web.com.br/assets/logo.svg"), true);
  assert.equal(allowsPassiveRequest("POST", "https://0web.com.br/api/leads"), false);
  assert.equal(allowsPassiveRequest("PUT", "https://0web.com.br/api/leads"), false);
  assert.equal(allowsPassiveRequest("GET", "https://example.org/api"), false);
  assert.equal(allowsPassiveRequest("GET", "https://0web.com.br/api?key=redacted"), false);
});
