#!/usr/bin/env node

/**
 * OpenAPI → TypeScript Enum 自動生成スクリプト
 *
 * openapi/components/enums/*.yaml から
 * front/src/__generated__/enums.ts を生成する。
 *
 * 出力形式:
 *   - const オブジェクト（値 → 値 のマッピング）
 *   - Union 型 (type ClockAction = 'in' | 'out' | ...)
 *   - values 配列 (readonly string[])
 *
 * 使い方:
 *   node scripts/generate-ts-enums.mjs
 *
 * ⚠️ 生成先の TS ファイルは自動生成物のため手動編集禁止。
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const enumsDir = path.join(rootDir, 'openapi/components/enums');
const outputPath = path.join(rootDir, 'front/src/__generated__/enums.ts');

// ────────────────────────────────────────
// ヘルパー
// ────────────────────────────────────────

/** "break_start" → "BreakStart" */
const toPascalCase = (value) =>
    String(value)
        .split(/[_\-\s]+/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
        .join('');

/** ディレクトリが存在しなければ作成 */
const ensureDir = async (filePath) => {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
};

// ────────────────────────────────────────
// YAML → TypeScript 変換
// ────────────────────────────────────────

/**
 * 単一の enum を TypeScript コードブロックに変換
 *
 * @param {string} name     enum 名 (例: "ClockAction")
 * @param {object} schema   パース済み YAML スキーマ
 * @returns {string}        TypeScript ソースコード断片
 */
const renderTsEnum = (name, schema) => {
    const values = schema.enum ?? [];
    const description = schema.description ?? name;

    // const object entries: { BreakStart: 'break_start' as const, ... }
    const constEntries = values
        .map((v) => `  ${toPascalCase(v)}: '${v}' as const,`)
        .join('\n');

    // Union type: 'in' | 'out' | 'break_start' | 'break_end'
    const unionType = values.map((v) => `'${v}'`).join(' | ');

    // values 配列
    const valuesArray = values.map((v) => `'${v}'`).join(', ');

    return `
/**
 * ${description}
 * @source openapi/components/enums/${name}.yaml
 */
export const ${name} = {
${constEntries}
} as const;
export type ${name} = (typeof ${name})[keyof typeof ${name}];
export const ${name}Values = [${valuesArray}] as const;
`;
};

// ────────────────────────────────────────
// メイン
// ────────────────────────────────────────

const main = async () => {
    const files = (await fs.readdir(enumsDir)).filter((f) => f.endsWith('.yaml'));

    if (files.length === 0) {
        console.log('⚠️  No enum YAML files found.');
        return;
    }

    await ensureDir(outputPath);

    const header = `/**
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/*.yaml
 */

/* eslint-disable */
/* prettier-ignore */
`;

    const blocks = [];

    for (const file of files.sort()) {
        const content = await fs.readFile(path.join(enumsDir, file), 'utf-8');
        const parsed = YAML.parse(content);
        const name = Object.keys(parsed)[0];
        const schema = parsed[name];

        if (!schema?.enum) {
            console.warn(`⚠️  ${file}: enum 配列が見つかりません。スキップします。`);
            continue;
        }

        blocks.push(renderTsEnum(name, schema));
    }

    const output = header + blocks.join('\n');
    await fs.writeFile(outputPath, output, 'utf-8');

    console.log(`✅ TypeScript enums generated: ${blocks.length} → ${outputPath}`);
};

main().catch((err) => {
    console.error('❌ TypeScript enum generation failed:', err);
    process.exit(1);
});
