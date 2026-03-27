#!/usr/bin/env node

/**
 * OpenAPI → PHP Response DTO 自動生成
 *
 * openapi/components/schemas/**\/*.yaml （Request 除外）
 *   → back/app/__Generated__/Responses/{Resource}/{ClassName}.php
 *
 * ── 設計方針 ──
 * namespace の基準を「リソース名」（PascalCase の先頭単語）にすることで、
 * 同一ドメインの DTO を同じ namespace にまとめ、
 * クラス名に冗長なプレフィックスを持たせない。
 *
 * リソース名はスキーマ名の先頭 PascalCase 単語として算出する。
 *   例: DashboardTodayRecord → リソース名 Dashboard
 *        → namespace App\__Generated__\Responses\Dashboard
 *        → 出力先   Responses/Dashboard/DashboardTodayRecord.php
 *
 * inline object は親のリソース namespace 配下に純粋な概念名で生成される。
 *   例: UserResponse.user.settings
 *        → Responses/User/Settings.php  (namespace App\__Generated__\Responses\User)
 *
 * 使い方: node openapi/scripts/generators/php-response-dtos.mjs
 */

import path from 'node:path';
import { run } from '../lib/runner.mjs';
import { collectYamlEntriesRecursive, ensureDirExists, writeFile } from '../lib/io.mjs';
import { render } from '../lib/template.mjs';
import { schemasDir, phpResponseDtosDir, rootDir } from '../lib/paths.mjs';

// ────────────────────────────────────────
// 型解決ヘルパー
// ────────────────────────────────────────

const toPascalCase = (str) =>
    str.replace(/[-_](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (_, c) => c.toUpperCase());

const extractRefName = (ref) => {
    const frag = ref.split('#/').at(-1) ?? '';
    return frag.split('/').at(-1) ?? '';
};

const isEnumRef = (ref) => ref.includes('/enums/');

/**
 * スキーマ名から「リソース名」を算出する。
 * PascalCase の先頭単語を抽出し、namespace のディレクトリ基準として使う。
 *
 * ── なぜ先頭単語をリソース名にするか ──
 * 同一ドメインのスキーマ（DashboardResponse, DashboardStats, DashboardUser 等）を
 * すべて Dashboard/ 配下にまとめることで、ドメイン単位の一覧性を確保する。
 *
 * 例: DashboardTodayRecord → Dashboard
 *     AttendanceResponse   → Attendance
 *     UserResponse         → User
 *     CalendarDay          → Calendar
 *     SettingsProfile      → Settings
 *     PageInfo             → Page
 */
const toResourceName = (schemaName) => {
    // PascalCase を単語境界で分割し、先頭の単語をリソース名とする
    const words = schemaName.match(/[A-Z][a-z]*/g);
    return words?.[0] ?? schemaName;
};

const primitivePhpType = (type) => {
    switch (type) {
        case 'integer': return 'int';
        case 'number': return 'float';
        case 'boolean': return 'bool';
        case 'string': return 'string';
        default: return 'mixed';
    }
};

/**
 * OpenAPI プロパティスキーマ → PHP 型情報を解決する。
 *
 * クラス名は「プロパティ名の PascalCase」のみ使用し、
 * 親クラス名をプレフィックスに含めない（namespace で分離するため）。
 */
const resolveType = (propName, schema) => {
    const result = {
        phpType: 'mixed',
        nullable: schema.nullable === true,
        enumImports: [],
        dtoImports: [],      // 他のリソース namespace への $ref（use 文が必要）
        childDtos: [],
        paramAnnotation: null,
    };

    if (schema.$ref) {
        const name = extractRefName(schema.$ref);
        result.phpType = name;
        if (isEnumRef(schema.$ref)) {
            result.enumImports.push(name);
        } else {
            // 別リソース namespace に属する DTO → use 文で import
            result.dtoImports.push(name);
        }
        return result;
    }

    if (['integer', 'number', 'boolean', 'string'].includes(schema.type)) {
        result.phpType = primitivePhpType(schema.type);
        return result;
    }

    if (schema.type === 'array') {
        result.phpType = 'array';
        const items = schema.items;
        if (items) {
            if (items.$ref) {
                const n = extractRefName(items.$ref);
                if (isEnumRef(items.$ref)) {
                    result.enumImports.push(n);
                } else {
                    result.dtoImports.push(n);
                }
                result.paramAnnotation = `${n}[]`;
            } else if (items.type === 'object' && items.properties) {
                // 親クラス名を含めず、プロパティ名のみで命名
                const child = `${toPascalCase(propName)}Item`;
                result.childDtos.push({ name: child, schema: items });
                result.paramAnnotation = `${child}[]`;
            } else if (items.type) {
                result.paramAnnotation = `${primitivePhpType(items.type)}[]`;
            }
        }
        return result;
    }

    if (schema.type === 'object') {
        if (schema.additionalProperties) {
            result.phpType = 'array';
            const ap = schema.additionalProperties;
            if (typeof ap === 'object' && ap.type === 'array' && ap.items?.type) {
                result.paramAnnotation = `array<string, ${primitivePhpType(ap.items.type)}[]>`;
            } else if (typeof ap === 'object' && ap.type) {
                result.paramAnnotation = `array<string, ${primitivePhpType(ap.type)}>`;
            }
            return result;
        }
        if (schema.properties) {
            // 親クラス名を含めず、プロパティ名の PascalCase のみ
            const child = toPascalCase(propName);
            result.childDtos.push({ name: child, schema });
            result.phpType = child;
            return result;
        }
        result.phpType = 'array';
        return result;
    }

    return result;
};

// ────────────────────────────────────────
// DTO クラス生成
// ────────────────────────────────────────

/**
 * @param {string} className  クラス名（純粋な概念名）
 * @param {object} schema     OpenAPI スキーマ
 * @param {string} namespace  PHP namespace（スクリプト側で算出して渡す）
 */
const buildDto = async (className, schema, namespace) => {
    const properties = schema.properties ?? {};
    const requiredSet = new Set(schema.required ?? []);
    const description = schema.description ?? `${className} DTO`;

    const enumImports = new Set();
    const dtoImports = new Set();
    const childDtos = [];
    const propInfos = [];

    for (const [propName, propSchema] of Object.entries(properties)) {
        const resolved = resolveType(propName, propSchema);
        for (const imp of resolved.enumImports) enumImports.add(imp);
        for (const imp of resolved.dtoImports) dtoImports.add(imp);
        childDtos.push(...resolved.childDtos);

        const isRequired = requiredSet.has(propName);
        propInfos.push({
            propName,
            phpType: resolved.phpType,
            isNullable: resolved.nullable || !isRequired,
            hasDefault: !isRequired,
            paramAnnotation: resolved.paramAnnotation,
        });
    }

    // required（default なし）を先に、optional（= null）を後に
    propInfos.sort((a, b) => (a.hasDefault === b.hasDefault ? 0 : a.hasDefault ? 1 : -1));

    // use 文: Enum + 他リソース namespace の DTO（$ref 経由）
    // $ref 先は toResourceName() で namespace を算出する
    const useLines = [
        ...[...enumImports].sort()
            .map((n) => `use App\\__Generated__\\Enums\\${n};`),
        ...[...dtoImports].sort()
            .map((n) => `use App\\__Generated__\\Responses\\${toResourceName(n)}\\${n};`),
    ];

    const paramLines = propInfos
        .filter((p) => p.paramAnnotation)
        .map((p) => ` * @param ${p.paramAnnotation}${p.isNullable ? '|null' : ''} $${p.propName}`);

    const ctorLines = propInfos.map((p) => {
        const type = p.isNullable ? `?${p.phpType}` : p.phpType;
        const def = p.hasDefault ? ' = null' : '';
        return `        public ${type} $${p.propName}${def},`;
    });

    let head = '';
    if (useLines.length > 0) head += '\n' + useLines.join('\n') + '\n';
    head += '\n/**';
    head += `\n * ${description}`;
    head += '\n *';
    if (paramLines.length > 0) head += '\n' + paramLines.join('\n') + '\n *';
    head += '\n * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.';
    head += '\n * Re-run: just openapi-php-dto';
    head += '\n */';

    // namespace はテンプレートへ動的に渡す（固定文字列は使わない）
    const code = await render('php-response-dto.tpl', {
        namespace,
        head,
        className,
        properties: ctorLines.join('\n'),
    });

    return { code, childDtos };
};

// ────────────────────────────────────────
// メイン
// ────────────────────────────────────────

run('PHP Response DTO generation', async () => {
    const openapiBase = path.join(rootDir, 'openapi');
    const rawEntries = await collectYamlEntriesRecursive(schemasDir, openapiBase);

    // Request スキーマを除外
    const entries = rawEntries.filter((e) => !e.name.endsWith('Request'));

    if (entries.length === 0) {
        console.log('⚠️  No response schemas found.');
        return;
    }

    await ensureDirExists(phpResponseDtosDir);

    // BFS キュー（初期 = YAML スキーマ、inline object は動的追加）
    // resourceName: スキーマ名から "Response" を除去した「リソース名」。
    //   namespace・ディレクトリの基準として使用し、
    //   inline 子 DTO は親の resourceName を引き継ぐ。
    const queue = entries.map((e) => ({
        className: e.name,
        schema: e.schema,
        sourceFile: `openapi/${e.sourceFile}`,
        resourceName: toResourceName(e.name),
    }));

    const generated = [];
    // resourceName::className で一意性を管理（異なるリソースで同名クラスを許容）
    const seen = new Set();

    while (queue.length > 0) {
        const { className, schema, sourceFile, resourceName } = queue.shift();
        const seenKey = `${resourceName}::${className}`;
        if (seen.has(seenKey)) continue;
        seen.add(seenKey);

        if (!schema.properties || Object.keys(schema.properties).length === 0) {
            console.warn(`⚠️  ${className}: properties が空のためスキップ`);
            continue;
        }

        // namespace = App\__Generated__\Responses\{resourceName}
        const namespace = `App\\__Generated__\\Responses\\${resourceName}`;
        // 出力先 = Responses/{resourceName}/{className}.php
        const outputPath = path.join(phpResponseDtosDir, resourceName, `${className}.php`);

        const { code, childDtos } = await buildDto(className, schema, namespace);
        await writeFile(outputPath, code);
        generated.push({ name: className, source: sourceFile ?? '(inline object)', resource: resourceName });

        // inline 子 DTO は同じ resourceName を引き継ぐ
        for (const child of childDtos) {
            const childKey = `${resourceName}::${child.name}`;
            if (!seen.has(childKey)) {
                queue.push({
                    className: child.name,
                    schema: child.schema,
                    sourceFile: null,
                    resourceName,
                });
            }
        }
    }

    console.log(`\n✅ Response DTOs generated: ${generated.length}`);
    for (const { name, source, resource } of generated.sort((a, b) => a.name.localeCompare(b.name))) {
        console.log(`   ${resource}/${name}  ← ${source}`);
    }
});
