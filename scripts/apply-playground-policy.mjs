import { readFile, writeFile } from 'node:fs/promises';
import YAML from 'yaml';
import { applyPlaygroundPolicy, countPlaygroundModes } from './lib/playground-policy.mjs';

const target = new URL('../openapi/openapi.yaml', import.meta.url);
const document = YAML.parse(await readFile(target, 'utf8'));
applyPlaygroundPolicy(document);
await writeFile(target, YAML.stringify(document, { lineWidth: 100 }));

const counts = countPlaygroundModes(document);
console.log(`Playground politikası uygulandı (${counts.interactive} canlı, ${counts.simple} salt örnek).`);
