const HOST = process.env.INDEXNOW_HOST || "0web.com.br";
const KEY = process.env.INDEXNOW_KEY || "6a0c6d4f2b8e4a1c9f7d3e5b1a2c8d4e";
const KEY_LOCATION = process.env.INDEXNOW_KEY_LOCATION || `https://${HOST}/${KEY}.txt`;
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";

function collectRawUrls() {
  const envUrls = process.env.INDEXNOW_URLS || "";
  const args = process.argv.slice(2).join("\n");
  return [envUrls, args]
    .join("\n")
    .split(/[\n,\s]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeUrl(value) {
  const input = /^https?:\/\//i.test(value)
    ? value
    : `https://${HOST}${value.startsWith("/") ? value : `/${value}`}`;
  const url = new URL(input);
  if (url.hostname !== HOST) {
    throw new Error(`URL fora do host permitido: ${url.href}`);
  }
  url.hash = "";
  return url.href;
}

const urls = [...new Set(collectRawUrls().map(normalizeUrl))];

if (!urls.length) {
  console.error("Nenhuma URL informada. Use INDEXNOW_URLS ou passe URLs/paths como argumentos.");
  process.exit(2);
}

if (urls.length > 10000) {
  console.error(`IndexNow aceita no máximo 10.000 URLs por requisição; recebidas: ${urls.length}`);
  process.exit(2);
}

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
};

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

const body = await response.text();

if (!response.ok) {
  console.error(`IndexNow falhou: HTTP ${response.status} ${body}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      endpoint: ENDPOINT,
      host: HOST,
      keyLocation: KEY_LOCATION,
      submitted: urls.length,
      urls,
      status: response.status,
    },
    null,
    2,
  ),
);
