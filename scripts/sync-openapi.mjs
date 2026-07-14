import { readFile, writeFile } from 'node:fs/promises';
import YAML from 'yaml';

const source = process.env.TAHSIL_OPENAPI_URL ?? 'https://api.tahsil.dev/openapi';
const target = new URL('../openapi/openapi.yaml', import.meta.url);

const response = await fetch(source, {
  headers: { accept: 'application/yaml, text/yaml, application/json' },
  signal: AbortSignal.timeout(30_000),
});
if (!response.ok) throw new Error(`OpenAPI indirilemedi: HTTP ${response.status}`);

const document = YAML.parse(await response.text());
if (document?.openapi !== '3.1.0' || !document?.paths) {
  throw new Error('Beklenen OpenAPI 3.1 kullanıcı sözleşmesi alınamadı');
}

const methods = new Set(['get', 'post', 'put', 'patch', 'delete']);
let operationCount = 0;
for (const pathItem of Object.values(document.paths)) {
  for (const method of Object.keys(pathItem)) {
    if (methods.has(method)) operationCount += 1;
  }
}
if (operationCount !== 57) {
  throw new Error(`Eksik kullanıcı sözleşmesi: yalnız ${operationCount} operasyon bulundu`);
}
if (document.paths?.['/core/companies'] || document.paths?.['/auth/bootstrap']) {
  throw new Error('Private platform operasyonları müşteri sözleşmesine sızdı');
}
if (document.components?.securitySchemes?.apiSecretAuth) {
  throw new Error('Özel entegrasyon credential şeması müşteri sözleşmesine sızdı');
}

const next = YAML.stringify(document, { lineWidth: 100 });
const current = await readFile(target, 'utf8').catch(() => '');
if (next === current) {
  console.log(`OpenAPI güncel (${operationCount} operasyon).`);
  process.exit(0);
}

await writeFile(target, next);
console.log(`OpenAPI güncellendi (${operationCount} operasyon).`);
