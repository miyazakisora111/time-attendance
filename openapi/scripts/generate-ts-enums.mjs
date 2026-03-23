#!/usr/bin/env node

/**
 * OpenAPI → TypeScript Enum 自動生成スクリプト
 *
 * openapi/components/enums/*.yaml から
 * front/src/__generated__/enums.ts を生成する。
 *
 * 出力形式:
 *   - const 配列 (readonly tuple)
 *   - Union 型 (type X = (typeof X)[number])
 *
 * 使い方:
 *   node openapi/scripts/generate-ts-enums.mjs
 *
 * ⚠️ 生成先の TS ファイルは自動生成物のため手動編集禁止。
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { render } from './render.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const enumsDir = path.join(rootDir, 'openapi/components/enums');
const outputPath = path.join(rootDir, 'front/src/__generated__/enums.ts');

// ────────────────────────────────────────
// ヘルパー
// ────────────────────────────────────────

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
 * @returns {Promise<string>}  TypeScript ソースコード断片
 */
const renderTsEnum = async (name, schema) => {
    const values = schema.enum ?? [];
    const description = schema.description ?? name;

    // const array entries: 'in', 'out', ...
    const cases = values
        .map((v) => `  '${v}',`)
        .join('\n');

    return render('ts-enum.tpl', { name, description, cases });
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

    const header = await render('ts-enum-header.tpl', {});

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

        blocks.push(await renderTsEnum(name, schema));
    }

    const output = header + blocks.join('\n');
    await fs.writeFile(outputPath, output, 'utf-8');

    console.log(`✅ TypeScript enums generated: ${blocks.length} → ${outputPath}`);
};

main().catch((err) => {
    console.error('❌ TypeScript enum generation failed:', err);
    process.exit(1);
});
