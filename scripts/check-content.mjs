import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import YAML from 'yaml';
import { countPlaygroundModes, isInteractiveOperation } from './lib/playground-policy.mjs';

const forbidden = [
  /prov\.tahsil\.dev/i,
  /openapi-partner/i,
  /openapi-backoffice/i,
  /Tahsil Partner API/i,
  /x-api-secret/i,
  /key_[a-z0-9]{8,}/i,
  /secret_[a-z0-9]{8,}/i,
];

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesIn(path)));
    else files.push(path);
  }
  return files;
}

const contentRoots = [
  new URL('../index.mdx', import.meta.url),
  new URL('../baslangic/', import.meta.url),
  new URL('../rehberler/', import.meta.url),
  new URL('../referans/', import.meta.url),
  new URL('../degisiklikler.mdx', import.meta.url),
  new URL('../openapi/', import.meta.url),
  new URL('../docs.json', import.meta.url),
  new URL('../README.md', import.meta.url),
];
const files = [];
for (const contentRoot of contentRoots) {
  if (contentRoot.pathname.endsWith('/')) files.push(...(await filesIn(contentRoot.pathname)));
  else files.push(contentRoot.pathname);
}

for (const file of files) {
  const content = await readFile(file, 'utf8').catch(() => '');
  for (const pattern of forbidden) {
    if (pattern.test(content)) {
      throw new Error(`Yayınlanmaması gereken içerik bulundu: ${file} (${pattern})`);
    }
  }
}

const openapiPath = new URL('../openapi/openapi.yaml', import.meta.url);
const document = YAML.parse(await readFile(openapiPath, 'utf8'));
let operationCount = 0;
for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    const operation = pathItem?.[method];
    if (!operation) continue;
    operationCount += 1;

    const expected = isInteractiveOperation(method, path) ? 'interactive' : 'simple';
    const actual = operation['x-mint']?.metadata?.playground;
    if (actual !== expected) {
      throw new Error(`Playground politikası hatalı: ${method.toUpperCase()} ${path} (${actual ?? 'yok'})`);
    }
  }
}

if (operationCount !== 57) {
  throw new Error(`Müşteri API operasyon sayısı 57 olmalı, bulunan: ${operationCount}`);
}
if (document.servers?.[0]?.url !== 'https://api.tahsil.dev') {
  throw new Error('OpenAPI production server adresi hatalı');
}

if (document.paths?.['/core/companies'] || document.paths?.['/auth/bootstrap']) {
  throw new Error('Private platform operasyonları müşteri sözleşmesine sızdı');
}
if (document.components?.securitySchemes?.apiSecretAuth) {
  throw new Error('Özel entegrasyon credential şeması müşteri sözleşmesine sızdı');
}

const playgroundCounts = countPlaygroundModes(document);
console.log(
  `İçerik ve müşteri API sınırı doğrulandı (${operationCount} operasyon; ${playgroundCounts.interactive} canlı, ${playgroundCounts.simple} salt örnek).`,
);
