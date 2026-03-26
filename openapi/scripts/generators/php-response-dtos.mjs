#!/usr/bin/env node

/**
 * OpenAPI → PHP Response DTO 自動生成
 *
 * openapi/components/schemas/**\/*.yaml （Request 除外）
 *   → back/app/__Generated__/Responses/*.php
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
 */
const resolveType = (propName, schema, parentClass) => {
    const result = {
        phpType: 'mixed',
        nullable: schema.nullable === true,
        enumImports: [],
        childDtos: [],
        paramAnnotation: null,
    };

    if (schema.$ref) {
        const name = extractRefName(schema.$ref);
        result.phpType = name;
        if (isEnumRef(schema.$ref)) result.enumImports.push(name);
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
                if (isEnumRef(items.$ref)) result.enumImports.push(n);
                result.paramAnnotation = `${n}[]`;
            } else if (items.type === 'object' && items.properties) {
                const child = `${parentClass}${toPascalCase(propName)}Item`;
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
            const child = `${parentClass}${toPascalCase(propName)}`;
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

const buildDto = async (className, schema) => {
    const properties = schema.properties ?? {};
    const requiredSet = new Set(schema.required ?? []);
    const description = schema.description ?? `${className} DTO`;

    const enumImports = new Set();
    const childDtos = [];
    const propInfos = [];

    for (const [propName, propSchema] of Object.entries(properties)) {
        const resolved = resolveType(propName, propSchema, className);
        for (const imp of resolved.enumImports) enumImports.add(imp);
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

    const useLines = [...enumImports].sort()
        .map((n) => `use App\\__Generated__\\Enums\\${n};`);

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
    const queue = entries.map((e) => ({
        className: e.name,
        schema: e.schema,
        sourceFile: `openapi/${e.sourceFile}`,
    }));

    const generated = [];
    const seen = new Set();

    while (queue.length > 0) {
        const { className, schema, sourceFile } = queue.shift();
        if (seen.has(className)) continue;
        seen.add(className);

        if (!schema.properties || Object.keys(schema.properties).length === 0) {
            console.warn(`⚠️  ${className}: properties が空のためスキップ`);
            continue;
        }

        const { code, childDtos } = await buildDto(className, schema);
        await writeFile(path.join(phpResponseDtosDir, `${className}.php`), code);
        generated.push({ name: className, source: sourceFile ?? '(inline object)' });

        for (const child of childDtos) {
            if (!seen.has(child.name)) {
                queue.push({ className: child.name, schema: child.schema, sourceFile: null });
            }
        }
    }

    console.log(`\n✅ Response DTOs generated: ${generated.length}`);
    for (const { name, source } of generated.sort((a, b) => a.name.localeCompare(b.name))) {
        console.log(`   ${name}  ← ${source}`);
    }
});
