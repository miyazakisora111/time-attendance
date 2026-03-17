#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const zodFilePath = path.join(rootDir, 'front/src/__generated__/zod.ts');

const patchContent = (source) => {
  return source
    .replaceAll('z.record(z.array(z.string()))', 'z.record(z.string(), z.array(z.string()))')
    .replaceAll('z.record(z.unknown())', 'z.record(z.string(), z.unknown())');
};

const main = async () => {
  const current = await fs.readFile(zodFilePath, 'utf-8');
  const next = patchContent(current);

  if (next !== current) {
    await fs.writeFile(zodFilePath, next, 'utf-8');
    console.log(`Patched: ${path.relative(rootDir, zodFilePath)}`);
  }
};

await main();
