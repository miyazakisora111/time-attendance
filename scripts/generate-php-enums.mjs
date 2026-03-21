#!/usr/bin/env node

/**
 * OpenAPI → PHP Backed Enum 自動生成スクリプト
 *
 * openapi/components/enums/*.yaml から
 * back/app/Enums/Generated/*.php を生成する。
 *
 * 使い方:
 *   node scripts/generate-php-enums.mjs
 *
 * ⚠️ 生成先の PHP ファイルは自動生成物のため手動編集禁止。
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const enumsDir = path.join(rootDir, 'openapi/components/enums');
const outputDir = path.join(rootDir, 'back/app/Enums/Generated');

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
 * @returns {string}           PHP ソースコード
 */
const renderPhpEnum = (name, schema) => {
    const values = schema.enum ?? [];
    const description = schema.description ?? `${name} 列挙型`;

    const cases = values
        .map((v) => `    case ${toCaseName(v)} = '${v}';`)
        .join('\n');

    const labelEntries = values
        .map((v) => `            self::${toCaseName(v)} => '${v}',`)
        .join('\n');

    const valuesArray = values
        .map((v) => `            self::${toCaseName(v)},`)
        .join('\n');

    return `<?php

declare(strict_types=1);

namespace App\\Enums\\Generated;

/**
 * ${description}
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/${name}.yaml
 */
enum ${name}: string
{
${cases}

    /**
     * 表示用ラベルを返す
     */
    public function label(): string
    {
        return match ($this) {
${labelEntries}
        };
    }

    /**
     * 全ケースの値配列を返す
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(
            static fn (self $case): string => $case->value,
            self::cases(),
        );
    }
}
`;
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

        const phpCode = renderPhpEnum(name, schema);
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
