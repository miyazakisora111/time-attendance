#!/usr/bin/env node

/**
 * OpenAPI → PHP Backed Enum 自動生成
 *
 * openapi/components/enums/*.yaml → back/app/__Generated__/Enums/*.php
 *
 * 使い方: node openapi/scripts/generators/php-enums.mjs
 */

import path from 'node:path';
import { run } from '../lib/runner.mjs';
import { collectYamlEntries, writeFile } from '../lib/io.mjs';
import { render } from '../lib/template.mjs';
import { enumsDir, phpEnumsDir } from '../lib/paths.mjs';

/** camelCase → UPPER_SNAKE_CASE */
const toUpperSnake = (value) =>
    String(value).replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();

run('PHP Enum generation', async () => {
    const entries = await collectYamlEntries(enumsDir);
    const enums = entries.filter((e) => Array.isArray(e.schema.enum));

    if (enums.length === 0) {
        console.log('⚠️  No enum YAML files found.');
        return;
    }

    for (const { name, schema } of enums) {
        const cases = schema.enum
            .map((v) => `    case ${toUpperSnake(v)} = '${v}';`)
            .join('\n');

        const code = await render('php-enum.tpl', {
            name,
            description: schema.description ?? `${name} 列挙型`,
            cases,
        });
        await writeFile(path.join(phpEnumsDir, `${name}.php`), code);
    }

    console.log(`✅ PHP enums generated: ${enums.length}`);
    for (const { name, schema } of enums) {
        console.log(`   ${name}: [${schema.enum.join(', ')}]`);
    }
});
