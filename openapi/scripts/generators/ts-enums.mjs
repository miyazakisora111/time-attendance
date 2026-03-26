#!/usr/bin/env node

/**
 * OpenAPI → TypeScript Enum 自動生成
 *
 * openapi/components/enums/*.yaml → front/src/__generated__/enums.ts
 *
 * 使い方: node openapi/scripts/generators/ts-enums.mjs
 */

import { run } from '../lib/runner.mjs';
import { collectYamlEntries, writeFile } from '../lib/io.mjs';
import { render } from '../lib/template.mjs';
import { enumsDir, tsEnumsPath } from '../lib/paths.mjs';

run('TypeScript Enum generation', async () => {
    const entries = await collectYamlEntries(enumsDir);
    const enums = entries.filter((e) => Array.isArray(e.schema.enum));

    if (enums.length === 0) {
        console.log('⚠️  No enum YAML files found.');
        return;
    }

    const header = await render('ts-enum-header.tpl', {});
    const blocks = [];

    for (const { name, schema } of enums) {
        const cases = schema.enum.map((v) => `  '${v}',`).join('\n');
        blocks.push(
            await render('ts-enum.tpl', {
                name,
                description: schema.description ?? name,
                cases,
            }),
        );
    }

    await writeFile(tsEnumsPath, header + blocks.join('\n'));
    console.log(`✅ TypeScript enums generated: ${enums.length} → ${tsEnumsPath}`);
});
