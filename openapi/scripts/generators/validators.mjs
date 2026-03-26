#!/usr/bin/env node

/**
 * OpenAPI → Zod Validation + Laravel Validation Rules 自動生成
 *
 * openapi/build/bundle.json + front/src/__generated__/zod.ts
 *   → front/src/__generated__/zod.validation.ts
 *   → front/src/__generated__/field-labels.json
 *   → back/app/__Generated__/OpenApiGeneratedRules.php
 *
 * 使い方: node openapi/scripts/generators/validators.mjs
 */

import { run } from '../lib/runner.mjs';
import { readJson, readYaml, readText, writeFile } from '../lib/io.mjs';
import { render } from '../lib/template.mjs';
import {
    bundleJsonPath,
    fieldsYamlPath,
    zodGeneratedPath,
    zodValidationPath,
    fieldLabelsPath,
    phpValidationPath,
} from '../lib/paths.mjs';

// ────────────────────────────────────────
// 文字列ユーティリティ
// ────────────────────────────────────────

const escapeSingleQuote = (v) => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const escapeRegexForLaravel = (v) => v.replace(/\//g, '\\/');

// ────────────────────────────────────────
// Zod ファイル正規化
// ────────────────────────────────────────

/**
 * openapi-zod が生成した z.record() を
 * z.record(z.string(), ...) 形式に正規化する。
 */
const normalizeZodRecords = (content) => {
    let cursor = 0;
    let out = '';

    while (cursor < content.length) {
        const idx = content.indexOf('z.record(', cursor);
        if (idx === -1) {
            out += content.slice(cursor);
            break;
        }

        out += content.slice(cursor, idx);

        const argsStart = idx + 'z.record('.length;
        let depth = 1;
        let hasTopComma = false;
        let i = argsStart;

        while (i < content.length && depth > 0) {
            const ch = content[i];
            if (ch === '(') depth++;
            else if (ch === ')') depth--;
            else if (ch === ',' && depth === 1) hasTopComma = true;
            i++;
        }

        const raw = content.slice(argsStart, i - 1).trim();
        out += hasTopComma ? `z.record(${raw})` : `z.record(z.string(), ${raw})`;
        cursor = i;
    }

    return out;
};

/**
 * Zod 生成ファイルを正規化して書き戻し、内容を返す。
 */
const normalizeZodFile = async () => {
    const original = await readText(zodGeneratedPath);
    const normalized = normalizeZodRecords(original);
    if (normalized !== original) {
        await writeFile(zodGeneratedPath, normalized);
    }
    return normalized;
};

// ────────────────────────────────────────
// fields.yaml → フィールド定義マップ
// ────────────────────────────────────────

const normalizeFieldType = (type) => {
    switch (type) {
        case 'uuid': case 'email': case 'password': case 'time':
        case 'date': case 'datetime': case 'timezone': case 'text': case 'enum':
            return 'string';
        case 'integer': return 'integer';
        case 'number': return 'number';
        case 'boolean': return 'boolean';
        case 'array': return 'array';
        case 'object': return 'object';
        default: return 'string';
    }
};

const buildFieldSpecMap = (fieldsDoc) => {
    const byKey = {};
    for (const group of Object.values(fieldsDoc ?? {})) {
        if (!group || typeof group !== 'object') continue;
        for (const [key, spec] of Object.entries(group)) {
            if (!spec || typeof spec !== 'object') continue;
            byKey[key] = {
                type: typeof spec.type === 'string' ? spec.type : undefined,
                label: typeof spec.label === 'string' ? spec.label : undefined,
                required: typeof spec.required === 'boolean' ? spec.required : undefined,
            };
        }
    }
    return byKey;
};

// ────────────────────────────────────────
// OpenAPI $ref リゾルバ
// ────────────────────────────────────────

const getRefName = (ref) => ref.split('/').at(-1) ?? '';

const createResolver = (schemas) => {
    const resolve = (schema, seen = new Set()) => {
        if (!schema || typeof schema !== 'object') return schema;

        if (typeof schema.$ref === 'string') {
            const name = getRefName(schema.$ref);
            if (!name || seen.has(name)) return schema;
            const resolved = schemas[name];
            if (!resolved) return schema;
            const merged = { ...resolve(resolved, new Set([...seen, name])) };
            const local = { ...schema };
            delete local.$ref;
            return { ...merged, ...local };
        }

        if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
            let merged = resolve(schema.allOf[0], seen);
            for (let i = 1; i < schema.allOf.length; i++) {
                merged = { ...(merged ?? {}), ...(resolve(schema.allOf[i], seen) ?? {}) };
            }
            const local = { ...schema };
            delete local.allOf;
            return { ...(merged ?? {}), ...local };
        }

        return schema;
    };
    return resolve;
};

// ────────────────────────────────────────
// ラベルマップ構築
// ────────────────────────────────────────

const fieldKey = (parts) => parts[parts.length - 1] ?? 'field';

const buildLabelMap = (schemaNames, schemas, resolve, fieldSpecs) => {
    const labels = {};

    const set = (key, fieldSchema) => {
        if (!key || labels[key]) return;
        if (fieldSpecs[key]?.label) { labels[key] = fieldSpecs[key].label; return; }
        if (fieldSchema?.['x-label']) { labels[key] = fieldSchema['x-label']; return; }
        labels[key] = key;
    };

    const walk = (raw, parts = []) => {
        const s = resolve(raw) ?? {};
        if (s.properties && typeof s.properties === 'object') {
            for (const [k, v] of Object.entries(s.properties)) {
                set(k, v);
                walk(v, [...parts, k]);
            }
            return;
        }
        if (s.items) { walk(s.items, [...parts, 'item']); return; }
        if (s.additionalProperties && s.additionalProperties !== true) {
            walk(s.additionalProperties, [...parts, 'value']);
        }
    };

    for (const name of schemaNames) walk(schemas[name], [name]);
    return labels;
};

// ────────────────────────────────────────
// Zod バリデーション式ビルダー
// ────────────────────────────────────────

const createZodBuilder = (resolve) => {
    const wrap = (expr, required, nullable) => {
        let r = expr;
        if (nullable) r += '.nullable()';
        if (!required) r += '.optional()';
        return r;
    };

    const stringRules = (schema, required, parts) => {
        const key = fieldKey(parts);
        const ref = `labelOf(${JSON.stringify(key)})`;
        const tpl = `\${${ref}}`;
        let e = 'z.string().trim()';

        const minLen = typeof schema.minLength === 'number' ? schema.minLength : undefined;
        const maxLen = typeof schema.maxLength === 'number' ? schema.maxLength : undefined;
        const fmt = typeof schema.format === 'string' ? schema.format : undefined;
        const pat = typeof schema.pattern === 'string' ? schema.pattern : undefined;

        if (required) {
            e += fmt === 'password'
                ? `.min(1, \`${tpl}は必須です。\`)`
                : `.min(${Math.max(minLen ?? 0, 1)}, \`${tpl}は必須です。\`)`;
        } else if (typeof minLen === 'number' && minLen > 0) {
            e += `.min(${minLen}, \`${tpl}は${minLen}文字以上で入力してください。\`)`;
        }

        if (fmt === 'email') e += `.email(\`${tpl}の形式が正しくありません。\`)`;
        if (fmt === 'password') {
            const min = Math.max(minLen ?? 0, 8);
            e += `.min(${min}, \`${tpl}は${min}文字以上で入力してください。\`)`;
            e += ".regex(/[A-Za-z]/, 'パスワードに英字を1文字以上含めてください。')";
            e += ".regex(/\\d/, 'パスワードに数字を1文字以上含めてください。')";
        }
        if (typeof maxLen === 'number') e += `.max(${maxLen}, \`${tpl}は${maxLen}文字以内で入力してください。\`)`;
        if (pat) e += `.regex(new RegExp(${JSON.stringify(pat)}), \`${tpl}の形式が正しくありません。\`)`;
        return e;
    };

    const toExpr = (raw, required, parts) => {
        const s = resolve(raw) ?? {};

        if (typeof s.$ref === 'string') {
            const name = getRefName(s.$ref);
            if (name) return wrap(`generatedComponents.schemas.${name}`, required, Boolean(s.nullable));
        }

        if (Array.isArray(s.enum) && s.enum.length > 0) {
            const inner = s.enum.every((v) => typeof v === 'string')
                ? `z.enum([${s.enum.map((v) => `'${escapeSingleQuote(v)}'`).join(', ')}])`
                : `z.union([${s.enum.map((v) => `z.literal(${JSON.stringify(v)})`).join(', ')}])`;
            return wrap(inner, required, Boolean(s.nullable));
        }

        if (s.type === 'string') return wrap(stringRules(s, required, parts), required, Boolean(s.nullable));

        if (s.type === 'integer') {
            let e = 'z.number().int()';
            if (typeof s.minimum === 'number') e += `.min(${s.minimum})`;
            if (typeof s.maximum === 'number') e += `.max(${s.maximum})`;
            return wrap(e, required, Boolean(s.nullable));
        }

        if (s.type === 'number') {
            let e = 'z.number()';
            if (typeof s.minimum === 'number') e += `.min(${s.minimum})`;
            if (typeof s.maximum === 'number') e += `.max(${s.maximum})`;
            return wrap(e, required, Boolean(s.nullable));
        }

        if (s.type === 'boolean') return wrap('z.boolean()', required, Boolean(s.nullable));

        if (s.type === 'array') {
            const item = toExpr(s.items ?? {}, true, [...parts, 'item']);
            let e = `z.array(${item})`;
            if (typeof s.minItems === 'number') e += `.min(${s.minItems})`;
            if (typeof s.maxItems === 'number') e += `.max(${s.maxItems})`;
            return wrap(e, required, Boolean(s.nullable));
        }

        if (s.type === 'object' || s.properties || s.additionalProperties) {
            if (s.properties && typeof s.properties === 'object') {
                const req = new Set(Array.isArray(s.required) ? s.required : []);
                const entries = Object.entries(s.properties).map(([k, v]) => {
                    const child = toExpr(v, req.has(k), [...parts, k]);
                    return `  ${k}: ${child},`;
                });
                return wrap(['z.object({', ...entries, '})'].join('\n'), required, Boolean(s.nullable));
            }
            if (s.additionalProperties) {
                const val = s.additionalProperties === true
                    ? 'z.unknown()'
                    : toExpr(s.additionalProperties, true, [...parts, 'value']);
                return wrap(`z.record(z.string(), ${val})`, required, Boolean(s.nullable));
            }
            return wrap('z.record(z.string(), z.unknown())', required, Boolean(s.nullable));
        }

        return wrap('z.unknown()', required, Boolean(s.nullable));
    };

    return toExpr;
};

// ────────────────────────────────────────
// Laravel バリデーションルールビルダー
// ────────────────────────────────────────

const createLaravelBuilder = (resolve, fieldSpecs) => {
    const push = (rules, path, val) => {
        if (!rules[path]) rules[path] = [];
        if (!rules[path].includes(val)) rules[path].push(val);
    };

    const presence = (rules, path, required, nullable) => {
        push(rules, path, required ? 'required' : 'sometimes');
        if (nullable) push(rules, path, 'nullable');
    };

    const stringRule = (rules, path, schema) => {
        push(rules, path, 'string');
        if (typeof schema.minLength === 'number') push(rules, path, `min:${schema.minLength}`);
        if (typeof schema.maxLength === 'number') push(rules, path, `max:${schema.maxLength}`);
        if (typeof schema.pattern === 'string') push(rules, path, `regex:/${escapeRegexForLaravel(schema.pattern)}/`);
        if (schema.format === 'email') push(rules, path, 'email');
        if (schema.format === 'password') {
            const min = Math.max(typeof schema.minLength === 'number' ? schema.minLength : 0, 8);
            push(rules, path, `min:${min}`);
            push(rules, path, 'regex:/[A-Za-z]/');
            push(rules, path, 'regex:/\\d/');
        }
    };

    const specFor = (path) => {
        const key = path.split('.').filter((s) => s !== '*').at(-1) ?? '';
        return fieldSpecs[key] ?? null;
    };

    const build = (raw, path, required, rules) => {
        const s = resolve(raw) ?? {};
        const spec = path ? specFor(path) : null;
        const eff = typeof spec?.required === 'boolean' ? spec.required : required;
        const type = typeof s.type === 'string'
            ? s.type
            : (spec?.type ? normalizeFieldType(spec.type) : undefined);

        if (path) presence(rules, path, eff, Boolean(s.nullable));

        if (Array.isArray(s.enum) && s.enum.length > 0) {
            if (path) push(rules, path, `in:${s.enum.map(String).join(',')}`);
            return;
        }

        if (type === 'object' || s.properties || s.additionalProperties) {
            if (path) push(rules, path, 'array');
            if (s.properties && typeof s.properties === 'object') {
                const req = new Set(Array.isArray(s.required) ? s.required : []);
                for (const [k, v] of Object.entries(s.properties)) {
                    build(v, path ? `${path}.${k}` : k, req.has(k), rules);
                }
                return;
            }
            if (s.additionalProperties && path) {
                const child = s.additionalProperties === true ? {} : s.additionalProperties;
                build(child, `${path}.*`, true, rules);
            }
            return;
        }

        if (type === 'array') {
            if (path) {
                push(rules, path, 'array');
                if (typeof s.minItems === 'number') push(rules, path, `min:${s.minItems}`);
                if (typeof s.maxItems === 'number') push(rules, path, `max:${s.maxItems}`);
            }
            if (s.items && path) build(s.items, `${path}.*`, true, rules);
            return;
        }

        if (type === 'string' && path) {
            stringRule(rules, path, s);
            if (spec?.type === 'date') push(rules, path, 'date_format:Y-m-d');
            if (spec?.type === 'time') push(rules, path, 'date_format:H:i');
            if (spec?.type === 'datetime') push(rules, path, 'date');
            if (spec?.type === 'timezone') push(rules, path, 'timezone:all');
            return;
        }

        if (type === 'integer' && path) {
            push(rules, path, 'integer');
            if (typeof s.minimum === 'number') push(rules, path, `min:${s.minimum}`);
            if (typeof s.maximum === 'number') push(rules, path, `max:${s.maximum}`);
            return;
        }

        if (type === 'number' && path) {
            push(rules, path, 'numeric');
            if (typeof s.minimum === 'number') push(rules, path, `min:${s.minimum}`);
            if (typeof s.maximum === 'number') push(rules, path, `max:${s.maximum}`);
            return;
        }

        if (type === 'boolean' && path) push(rules, path, 'boolean');
    };

    return build;
};

// ────────────────────────────────────────
// 出力レンダリング
// ────────────────────────────────────────

const renderFrontFile = async (names, schemas, toExpr) => {
    const lines = [];

    for (const name of names) {
        const s = schemas[name];
        if (!s?.properties || typeof s.properties !== 'object') {
            lines.push(`  ${name}: generatedComponents.schemas.${name},`);
            continue;
        }
        const req = new Set(Array.isArray(s.required) ? s.required : []);
        lines.push(`  ${name}: generatedComponents.schemas.${name}.extend({`);
        for (const [k, v] of Object.entries(s.properties)) {
            const expr = toExpr(v, req.has(k), [name, k])
                .split('\n')
                .map((l, i) => (i === 0 ? l : `      ${l}`))
                .join('\n');
            lines.push(`    ${k}: ${expr},`);
        }
        lines.push('  }),');
    }

    return render('zod-validation.tpl', { schemas: lines.join('\n') });
};

const renderBackFile = async (names, ruleMap, labels) => {
    const rulesLines = [];
    const attrLines = [];

    for (const name of names) {
        rulesLines.push(`        '${escapeSingleQuote(name)}' => [`);
        for (const [path, pathRules] of Object.entries(ruleMap[name] ?? {})) {
            const ser = pathRules.map((r) => `'${escapeSingleQuote(r)}'`).join(', ');
            rulesLines.push(`            '${escapeSingleQuote(path)}' => [${ser}],`);
        }
        rulesLines.push('        ],');

        attrLines.push(`        '${escapeSingleQuote(name)}' => [`);
        for (const path of Object.keys(ruleMap[name] ?? {})) {
            const seg = path.split('.').filter((s) => s !== '*');
            const lbl = labels[seg.at(-1) ?? path] ?? path;
            attrLines.push(`            '${escapeSingleQuote(path)}' => '${escapeSingleQuote(lbl)}',`);
        }
        attrLines.push('        ],');
    }

    return render('laravel-validation.tpl', {
        rules: rulesLines.join('\n'),
        attributes: attrLines.join('\n'),
    });
};

// ────────────────────────────────────────
// メイン
// ────────────────────────────────────────

run('Validator generation', async () => {
    const bundle = await readJson(bundleJsonPath);
    const fieldsDoc = await readYaml(fieldsYamlPath);
    const schemas = bundle?.components?.schemas ?? {};
    const fieldSpecs = buildFieldSpecMap(fieldsDoc);

    // Zod 生成ファイルの正規化
    const zodFile = await normalizeZodFile();
    const exported = Array.from(zodFile.matchAll(/export const (\w+)\s*=/g)).map((m) => m[1]);

    // リゾルバ・ビルダー初期化
    const resolve = createResolver(schemas);
    const toExpr = createZodBuilder(resolve);
    const buildRules = createLaravelBuilder(resolve, fieldSpecs);

    // 対象スキーマの絞り込み
    const candidates = Object.keys(schemas)
        .filter((name) => exported.includes(name))
        .filter((name) => {
            const s = resolve(schemas[name]);
            return s && (s.type === 'object' || s.properties || s.additionalProperties);
        })
        .sort();

    const resolved = Object.fromEntries(candidates.map((n) => [n, resolve(schemas[n])]));
    const labels = buildLabelMap(candidates, resolved, resolve, fieldSpecs);

    // Laravel ルール構築
    const ruleMap = {};
    for (const name of candidates) {
        const rules = {};
        buildRules(resolved[name], '', true, rules);
        ruleMap[name] = rules;
    }

    // 出力
    const frontFile = await renderFrontFile(candidates, resolved, toExpr);
    const backFile = await renderBackFile(candidates, ruleMap, labels);

    await writeFile(zodValidationPath, frontFile);
    await writeFile(fieldLabelsPath, `${JSON.stringify(labels, null, 2)}\n`);
    await writeFile(phpValidationPath, backFile);

    console.log(`✅ Validators generated for ${candidates.length} schemas`);
    console.log(`   → ${zodValidationPath}`);
    console.log(`   → ${fieldLabelsPath}`);
    console.log(`   → ${phpValidationPath}`);
});
