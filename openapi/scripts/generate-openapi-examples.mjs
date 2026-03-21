#!/usr/bin/env node
// ┌─────────────────────────────────────────────────────────────────────┐
// │  ⚠️  AUTO-GENERATED — DO NOT EDIT MANUALLY                        │
// │  This script generates example JSON files from OpenAPI definitions │
// │  using openapi-sampler. Re-run: make openapi-examples             │
// └─────────────────────────────────────────────────────────────────────┘

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAPISampler from 'openapi-sampler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const bundleJsonPath = path.join(rootDir, 'openapi/build/bundle.json');
const examplesDir = path.join(rootDir, 'openapi/examples');

const HEADER_COMMENT = '⚠️  AUTO-GENERATED — DO NOT EDIT MANUALLY. Re-run: make openapi-examples';

// ────────────────────────────────────────
// Helpers
// ────────────────────────────────────────

/** operationId → kebab-case (e.g. "loginApi" → "login-api") */
const toKebab = (s) =>
    s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Tag name → lower-case directory name */
const tagToDir = (tag) => tag.toLowerCase();

/** Ensure directory exists */
const ensureDir = async (dir) => {
    await fs.mkdir(dir, { recursive: true });
};

/** Write JSON with header comment */
const writeExample = async (filePath, data) => {
    const json = JSON.stringify({ _comment: HEADER_COMMENT, ...data }, null, 2);
    await fs.writeFile(filePath, json + '\n', 'utf-8');
};

// ────────────────────────────────────────
// Main
// ────────────────────────────────────────

const main = async () => {
    const bundleRaw = await fs.readFile(bundleJsonPath, 'utf-8');
    const spec = JSON.parse(bundleRaw);

    // Clean examples directory (fresh generation)
    await fs.rm(examplesDir, { recursive: true, force: true });

    const generated = [];

    for (const [pathStr, methods] of Object.entries(spec.paths)) {
        for (const [method, operation] of Object.entries(methods)) {
            if (typeof operation !== 'object' || !operation.operationId) continue;

            const tag = operation.tags?.[0] || 'other';
            const dir = path.join(examplesDir, tagToDir(tag));
            await ensureDir(dir);

            const baseName = toKebab(operation.operationId);

            // ── Request body example ──
            const bodySchema =
                operation.requestBody?.content?.['application/json']?.schema;
            if (bodySchema) {
                const sample = OpenAPISampler.sample(bodySchema, {}, spec);
                const filePath = path.join(dir, `${baseName}.request.json`);
                await writeExample(filePath, sample);
                generated.push(path.relative(rootDir, filePath));
            }

            // ── Response examples (success 2xx only) ──
            for (const [code, resp] of Object.entries(operation.responses || {})) {
                if (!code.startsWith('2')) continue;

                const respSchema = resp?.content?.['application/json']?.schema;
                if (!respSchema) continue;

                const sample = OpenAPISampler.sample(respSchema, {}, spec);
                const suffix = code === '200' ? '' : `.${code}`;
                const filePath = path.join(dir, `${baseName}${suffix}.response.json`);
                await writeExample(filePath, sample);
                generated.push(path.relative(rootDir, filePath));
            }
        }
    }

    // ── Error response examples ──
    const commonDir = path.join(examplesDir, 'common');
    await ensureDir(commonDir);

    const schemas = spec.components?.schemas || {};
    for (const name of ['ErrorResponse', 'ValidationErrorResponse']) {
        if (!schemas[name]) continue;
        const sample = OpenAPISampler.sample(schemas[name], {}, spec);
        const filePath = path.join(commonDir, `${toKebab(name)}.json`);
        await writeExample(filePath, sample);
        generated.push(path.relative(rootDir, filePath));
    }

    console.log(`✅ Generated ${generated.length} example files:`);
    generated.forEach((f) => console.log(`   ${f}`));
};

main().catch((err) => {
    console.error('❌ Example generation failed:', err);
    process.exit(1);
});
