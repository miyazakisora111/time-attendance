#!/usr/bin/env node

/**
 * OpenAPI → PHP Response DTO 自動生成スクリプト
 *
 * openapi/components/schemas/ 配下の Response 用スキーマから
 * back/app/__Generated__/Responses/*.php を生成する。
 *
 * 使い方:
 *   node openapi/scripts/generate-php-response-dtos.mjs
 *
 * ⚠️ 生成先の PHP ファイルは自動生成物のため手動編集禁止。
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { render } from './render.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const schemasDir = path.join(rootDir, 'openapi/components/schemas');
const outputDir = path.join(rootDir, 'back/app/__Generated__/Responses');

// ────────────────────────────────────────
// ヘルパー
// ────────────────────────────────────────

/** ディレクトリが無ければ作成 */
const ensureDir = async (dirPath) => {
    await fs.mkdir(dirPath, { recursive: true });
};

/** camelCase / snake_case → PascalCase */
const toPascalCase = (str) =>
    str
        .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, (_, c) => c.toUpperCase());

/** $ref 文字列から末尾のスキーマ名を抽出 */
const extractRefName = (ref) => {
    const fragment = ref.split('#/').at(-1) ?? '';
    return fragment.split('/').at(-1) ?? '';
};

/** $ref が Enum 参照か判定 */
const isEnumRef = (ref) => ref.includes('/enums/');

// ────────────────────────────────────────
// 型解決
// ────────────────────────────────────────

/** OpenAPI primitive type → PHP 型名 */
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
 * OpenAPI プロパティスキーマ → PHP 型情報
 *
 * @param {string} propName        プロパティ名
 * @param {object} schema          OpenAPI プロパティスキーマ
 * @param {string} parentClassName 親 DTO クラス名（inline object 命名用）
 * @returns {{
 *   phpType: string,
 *   nullable: boolean,
 *   enumImports: string[],
 *   childDtos: Array<{ name: string, schema: object }>,
 *   paramAnnotation: string|null
 * }}
 */
const resolveType = (propName, schema, parentClassName) => {
    const result = {
        phpType: 'mixed',
        nullable: schema.nullable === true,
        enumImports: [],
        childDtos: [],
        paramAnnotation: null,
    };

    // ── $ref ──
    if (schema.$ref) {
        const refName = extractRefName(schema.$ref);
        result.phpType = refName;
        if (isEnumRef(schema.$ref)) {
            result.enumImports.push(refName);
        }
        return result;
    }

    // ── Primitive ──
    if (['integer', 'number', 'boolean', 'string'].includes(schema.type)) {
        result.phpType = primitivePhpType(schema.type);
        return result;
    }

    // ── Array ──
    if (schema.type === 'array') {
        result.phpType = 'array';
        const items = schema.items;
        if (items) {
            if (items.$ref) {
                const itemName = extractRefName(items.$ref);
                if (isEnumRef(items.$ref)) {
                    result.enumImports.push(itemName);
                }
                result.paramAnnotation = `${itemName}[]`;
            } else if (items.type === 'object' && items.properties) {
                const childName = `${parentClassName}${toPascalCase(propName)}Item`;
                result.childDtos.push({ name: childName, schema: items });
                result.paramAnnotation = `${childName}[]`;
            } else if (items.type) {
                result.paramAnnotation = `${primitivePhpType(items.type)}[]`;
            }
        }
        return result;
    }

    // ── Object ──
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
            const childName = `${parentClassName}${toPascalCase(propName)}`;
            result.childDtos.push({ name: childName, schema });
            result.phpType = childName;
            return result;
        }
        result.phpType = 'array';
        return result;
    }

    return result;
};

// ────────────────────────────────────────
// スキーマ収集
// ────────────────────────────────────────

/**
 * openapi/components/schemas/ 配下を走査し Response 用スキーマを収集。
 * *Request で終わるスキーマは除外する。
 *
 * @returns {Promise<Map<string, { schema: object, sourceFile: string }>>}
 */
const collectSchemas = async () => {
    const schemas = new Map();
    const subdirs = await fs.readdir(schemasDir, { withFileTypes: true });

    for (const entry of subdirs.filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
        const dirPath = path.join(schemasDir, entry.name);
        const files = (await fs.readdir(dirPath)).filter((f) => f.endsWith('.yaml')).sort();

        for (const file of files) {
            const raw = await fs.readFile(path.join(dirPath, file), 'utf-8');
            const parsed = YAML.parse(raw);
            if (!parsed) continue;

            const name = Object.keys(parsed)[0];
            if (!name) continue;

            // Request スキーマは除外
            if (name.endsWith('Request')) continue;

            schemas.set(name, {
                schema: parsed[name],
                sourceFile: `openapi/components/schemas/${entry.name}/${file}`,
            });
        }
    }

    return schemas;
};

// ────────────────────────────────────────
// PHP コード生成
// ────────────────────────────────────────

/**
 * 単一スキーマからDTO クラスの PHP コードを生成する。
 * inline object が見つかった場合はサブ DTO として返す。
 *
 * @returns {Promise<{ code: string, childDtos: Array<{ name: string, schema: object }> }>}
 */
const buildDto = async (className, schema) => {
    const properties = schema.properties ?? {};
    const requiredSet = new Set(schema.required ?? []);
    const description = schema.description ?? `${className} DTO`;

    const enumImports = new Set();
    const childDtos = [];

    // ── プロパティ情報を収集 ──
    const propInfos = [];

    for (const [propName, propSchema] of Object.entries(properties)) {
        const resolved = resolveType(propName, propSchema, className);

        for (const imp of resolved.enumImports) enumImports.add(imp);
        childDtos.push(...resolved.childDtos);

        const isRequired = requiredSet.has(propName);
        const isNullable = resolved.nullable || !isRequired;
        const hasDefault = !isRequired;

        propInfos.push({
            propName,
            phpType: resolved.phpType,
            isNullable,
            hasDefault,
            paramAnnotation: resolved.paramAnnotation,
        });
    }

    // required（default なし）を先に、optional（= null）を後に
    propInfos.sort((a, b) => {
        if (a.hasDefault !== b.hasDefault) return a.hasDefault ? 1 : -1;
        return 0;
    });

    // ── use 文 ──
    const useLines = [...enumImports]
        .sort()
        .map((name) => `use App\\__Generated__\\Enums\\${name};`);

    // ── @param 行（型付き配列 / 連想配列用）──
    const paramLines = propInfos
        .filter((p) => p.paramAnnotation)
        .map((p) => ` * @param ${p.paramAnnotation}${p.isNullable ? '|null' : ''} $${p.propName}`);

    // ── コンストラクタ引数 ──
    const ctorLines = propInfos.map((p) => {
        const typeStr = p.isNullable ? `?${p.phpType}` : p.phpType;
        const defaultStr = p.hasDefault ? ' = null' : '';
        return `        public ${typeStr} $${p.propName}${defaultStr},`;
    });

    // ── head ブロック（use 文 + docblock）構築 ──
    let head = '';

    if (useLines.length > 0) {
        head += '\n' + useLines.join('\n') + '\n';
    }

    head += '\n/**';
    head += `\n * ${description}`;
    head += '\n *';

    if (paramLines.length > 0) {
        head += '\n' + paramLines.join('\n');
        head += '\n *';
    }

    head += '\n * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.';
    head += '\n * Re-run: just openapi-php-dto';
    head += '\n */';

    const code = await render('php-response-dto.tpl', {
        head,
        className,
        properties: ctorLines.join('\n'),
    });

    return { code, childDtos };
};

// ────────────────────────────────────────
// メイン
// ────────────────────────────────────────

const main = async () => {
    const schemas = await collectSchemas();

    if (schemas.size === 0) {
        console.log('⚠️  No response schemas found.');
        return;
    }

    await ensureDir(outputDir);

    // DTO 生成キュー（初期 = YAML スキーマ、動的に inline サブ DTO を追加）
    const queue = [...schemas.entries()].map(([name, { schema, sourceFile }]) => ({
        className: name,
        schema,
        sourceFile,
    }));

    const generated = [];
    const seen = new Set();

    while (queue.length > 0) {
        const { className, schema, sourceFile } = queue.shift();

        if (seen.has(className)) continue;
        seen.add(className);

        // プロパティが無いスキーマはスキップ
        if (!schema.properties || Object.keys(schema.properties).length === 0) {
            console.warn(`⚠️  ${className}: properties が空のためスキップ`);
            continue;
        }

        const { code, childDtos } = await buildDto(className, schema);
        const outPath = path.join(outputDir, `${className}.php`);
        await fs.writeFile(outPath, code, 'utf-8');
        generated.push({ name: className, source: sourceFile ?? '(inline object)' });

        // サブ DTO をキューに追加
        for (const child of childDtos) {
            if (!seen.has(child.name)) {
                queue.push({ className: child.name, schema: child.schema, sourceFile: null });
            }
        }
    }

    // サマリー
    console.log(`\n✅ Response DTOs generated: ${generated.length}`);
    for (const { name, source } of generated.sort((a, b) => a.name.localeCompare(b.name))) {
        console.log(`   ${name}  ← ${source}`);
    }
};

main().catch((err) => {
    console.error('❌ Response DTO generation failed:', err);
    process.exit(1);
});
