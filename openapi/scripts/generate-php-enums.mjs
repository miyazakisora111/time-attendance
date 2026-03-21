#!/usr/bin/env node

/**
 * OpenAPI → PHP Backed Enum 自動生成スクリプト
 *
 * openapi/components/enums/*.yaml から
 * back/app/Enums/Generated/*.php を生成する。
 *
 * 使い方:
 *   node openapi/scripts/generate-php-enums.mjs
 *
 * ⚠️ 生成先の PHP ファイルは自動生成物のため手動編集禁止。
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { render } from './templates/render.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const enumsDir = path.join(rootDir, 'openapi/components/enums');
const outputDir = path.join(rootDir, 'back/app/__Generated__/Enums');

// ────────────────────────────────────────
// ヘルパー
// ────────────────────────────────────────

/** snake_case → UPPER_SNAKE_CASE */
const toUpperSnake = (value) =>
    value.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();

/** enum 値 → PHP case 名 (小文字アンダースコア区切り → UPPER_SNAKE) */
const toCaseName = (value) => toUpperSnake(String(value));

/** ディレクトリが存在しなければ作成 */
const ensureDir = async (filePath) => {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
};

// ────────────────────────────────────────
// YAML → PHP 変換
// ────────────────────────────────────────

/**
 * 単一の enum YAML を PHP string-backed enum に変換
 *
 * @param {string} name        enum 名 (例: "ClockAction")
 * @param {object} schema      パース済み YAML オブジェクト
 * @returns {Promise<string>}  PHP ソースコード
 */
const renderPhpEnum = async (name, schema) => {
    const values = schema.enum ?? [];
    const description = schema.description ?? `${name} 列挙型`;

    const cases = values
        .map((v) => `    case ${toCaseName(v)} = '${v}';`)
        .join('\n');

    return render('php-enum.tpl', { name, description, cases });
};

// ────────────────────────────────────────
// メイン
// ────────────────────────────────────────

const main = async () => {
    // enum ディレクトリの YAML を列挙
    const files = (await fs.readdir(enumsDir)).filter((f) => f.endsWith('.yaml'));

    if (files.length === 0) {
        console.log('⚠️  No enum YAML files found.');
        return;
    }

    await ensureDir(path.join(outputDir, '_'));

    const generated = [];

    for (const file of files.sort()) {
        const content = await fs.readFile(path.join(enumsDir, file), 'utf-8');
        const parsed = YAML.parse(content);
        const name = Object.keys(parsed)[0];
        const schema = parsed[name];

        if (!schema?.enum) {
            console.warn(`⚠️  ${file}: enum 配列が見つかりません。スキップします。`);
            continue;
        }

        const phpCode = await renderPhpEnum(name, schema);
        const outPath = path.join(outputDir, `${name}.php`);
        await fs.writeFile(outPath, phpCode, 'utf-8');
        generated.push({ name, values: schema.enum, file });
    }

    // サマリー出力
    console.log(`✅ PHP enums generated: ${generated.length}`);
    for (const { name, values } of generated) {
        console.log(`   ${name}: [${values.join(', ')}]`);
    }
};

main().catch((err) => {
    console.error('❌ PHP enum generation failed:', err);
    process.exit(1);
});
