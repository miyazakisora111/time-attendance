#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const bundleJsonPath = path.join(rootDir, 'openapi/build/bundle.json');
const zodGeneratedPath = path.join(rootDir, 'front/src/__generated__/zod.ts');
const frontOutputPath = path.join(rootDir, 'front/src/__generated__/zod.validation.ts');
const labelOutputPath = path.join(rootDir, 'front/src/__generated__/field-labels.json');
const backOutputPath = path.join(rootDir, 'back/app/Http/Requests/Generated/OpenApiGeneratedRules.php');
const fieldsPath = path.join(rootDir, 'schema/fields.yaml');

const LABEL_OVERRIDES = {
  email: 'メールアドレス',
  password: 'パスワード',
};

const escapeSingleQuote = (value) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const escapeRegexForLaravel = (value) => value.replace(/\//g, '\\/');

const readJson = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
};

const readYaml = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf-8');
  return YAML.parse(content) ?? {};
};

const normalizeFieldType = (type) => {
  switch (type) {
    case 'uuid':
    case 'email':
    case 'password':
    case 'time':
    case 'date':
    case 'datetime':
    case 'timezone':
    case 'text':
    case 'enum':
      return 'string';
    case 'integer':
      return 'integer';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      return 'array';
    case 'object':
      return 'object';
    default:
      return 'string';
  }
};

const buildFieldSpecMap = (fieldsDoc) => {
  const byKey = {};

  Object.values(fieldsDoc ?? {}).forEach((group) => {
    if (!group || typeof group !== 'object') {
      return;
    }

    Object.entries(group).forEach(([fieldKey, spec]) => {
      if (!spec || typeof spec !== 'object') {
        return;
      }

      byKey[fieldKey] = {
        type: typeof spec.type === 'string' ? spec.type : undefined,
        label: typeof spec.label === 'string' ? spec.label : undefined,
        required: typeof spec.required === 'boolean' ? spec.required : undefined,
        description: typeof spec.description === 'string' ? spec.description : undefined,
      };
    });
  });

  return byKey;
};

const getRefName = (ref) => ref.split('/').at(-1) ?? '';

const createResolver = (schemas) => {
  const resolveSchema = (schema, seen = new Set()) => {
    if (!schema || typeof schema !== 'object') {
      return schema;
    }

    if ('$ref' in schema && typeof schema.$ref === 'string') {
      const refName = getRefName(schema.$ref);

      if (!refName || seen.has(refName)) {
        return schema;
      }

      const resolved = schemas[refName];
      if (!resolved) {
        return schema;
      }

      const merged = { ...resolveSchema(resolved, new Set([...seen, refName])) };
      const local = { ...schema };
      delete local.$ref;

      return { ...merged, ...local };
    }

    if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
      const [first, ...rest] = schema.allOf;
      let merged = resolveSchema(first, seen);
      rest.forEach((item) => {
        merged = { ...(merged ?? {}), ...(resolveSchema(item, seen) ?? {}) };
      });
      const local = { ...schema };
      delete local.allOf;
      return { ...(merged ?? {}), ...local };
    }

    return schema;
  };

  return { resolveSchema };
};

const fieldKeyFromPath = (pathParts) => pathParts[pathParts.length - 1] ?? 'field';

const buildLabelMap = (schemaNames, schemaMap, resolveSchema, fieldSpecsByKey) => {
  const labels = {};

  const setLabel = (fieldKey, fieldSchema) => {
    if (!fieldKey || labels[fieldKey]) {
      return;
    }

    if (fieldSpecsByKey[fieldKey]?.label) {
      labels[fieldKey] = fieldSpecsByKey[fieldKey].label;
      return;
    }

    if (fieldSchema && typeof fieldSchema['x-label'] === 'string' && fieldSchema['x-label']) {
      labels[fieldKey] = fieldSchema['x-label'];
      return;
    }

    labels[fieldKey] = LABEL_OVERRIDES[fieldKey] ?? fieldKey;
  };

  const walk = (rawSchema, pathParts = []) => {
    const schema = resolveSchema(rawSchema) ?? {};

    if (schema && typeof schema === 'object' && schema.properties && typeof schema.properties === 'object') {
      Object.entries(schema.properties).forEach(([propertyName, propertySchema]) => {
        setLabel(propertyName, propertySchema);
        walk(propertySchema, [...pathParts, propertyName]);
      });
      return;
    }

    if (schema && typeof schema === 'object' && schema.items) {
      walk(schema.items, [...pathParts, 'item']);
      return;
    }

    if (schema && typeof schema === 'object' && schema.additionalProperties && schema.additionalProperties !== true) {
      walk(schema.additionalProperties, [...pathParts, 'value']);
    }
  };

  schemaNames.forEach((schemaName) => {
    walk(schemaMap[schemaName], [schemaName]);
  });

  return labels;
};

const createZodBuilder = (resolveSchema) => {
  const applyOptionalNullable = (expr, required, nullable) => {
    let next = expr;

    if (nullable) {
      next += '.nullable()';
    }

    if (!required) {
      next += '.optional()';
    }

    return next;
  };

  const applyStringRules = (schema, required, pathParts) => {
    const labelKey = fieldKeyFromPath(pathParts);
    const labelRef = `labelOf(${JSON.stringify(labelKey)})`;
    const labelTemplate = `\${${labelRef}}`;
    let expr = 'z.string().trim()';

    const minLength = typeof schema.minLength === 'number' ? schema.minLength : undefined;
    const maxLength = typeof schema.maxLength === 'number' ? schema.maxLength : undefined;
    const format = typeof schema.format === 'string' ? schema.format : undefined;
    const pattern = typeof schema.pattern === 'string' ? schema.pattern : undefined;

    if (required) {
      if (format === 'password') {
        expr += `.min(1, \`${labelTemplate}は必須です。\`)`;
      } else {
        const min = Math.max(minLength ?? 0, 1);
        expr += `.min(${min}, \`${labelTemplate}は必須です。\`)`;
      }
    } else if (typeof minLength === 'number' && minLength > 0) {
      expr += `.min(${minLength}, \`${labelTemplate}は${minLength}文字以上で入力してください。\`)`;
    }

    if (format === 'email') {
      expr += `.email(\`${labelTemplate}の形式が正しくありません。\`)`;
    }

    if (format === 'password') {
      const passwordMin = Math.max(minLength ?? 0, 8);
      expr += `.min(${passwordMin}, \`${labelTemplate}は${passwordMin}文字以上で入力してください。\`)`;
      expr += ".regex(/[A-Za-z]/, 'パスワードに英字を1文字以上含めてください。')";
      expr += ".regex(/\\d/, 'パスワードに数字を1文字以上含めてください。')";
    }

    if (typeof maxLength === 'number') {
      expr += `.max(${maxLength}, \`${labelTemplate}は${maxLength}文字以内で入力してください。\`)`;
    }

    if (pattern) {
      expr += `.regex(new RegExp(${JSON.stringify(pattern)}), \`${labelTemplate}の形式が正しくありません。\`)`;
    }

    return expr;
  };

  const toZodExpr = (rawSchema, required, pathParts) => {
    const schema = resolveSchema(rawSchema) ?? {};

    if (schema && typeof schema === 'object' && typeof schema.$ref === 'string') {
      const refName = getRefName(schema.$ref);
      if (refName) {
        return applyOptionalNullable(`generatedComponents.schemas.${refName}`, required, Boolean(schema.nullable));
      }
    }

    if (Array.isArray(schema.enum) && schema.enum.length > 0) {
      const enumValues = schema.enum;
      if (enumValues.every((value) => typeof value === 'string')) {
        const literals = enumValues.map((value) => `'${escapeSingleQuote(value)}'`).join(', ');
        return applyOptionalNullable(`z.enum([${literals}])`, required, Boolean(schema.nullable));
      }

      const literals = enumValues.map((value) => `z.literal(${JSON.stringify(value)})`).join(', ');
      return applyOptionalNullable(`z.union([${literals}])`, required, Boolean(schema.nullable));
    }

    const type = schema.type;

    if (type === 'string') {
      const expr = applyStringRules(schema, required, pathParts);
      return applyOptionalNullable(expr, required, Boolean(schema.nullable));
    }

    if (type === 'integer') {
      let expr = 'z.number().int()';
      if (typeof schema.minimum === 'number') expr += `.min(${schema.minimum})`;
      if (typeof schema.maximum === 'number') expr += `.max(${schema.maximum})`;
      return applyOptionalNullable(expr, required, Boolean(schema.nullable));
    }

    if (type === 'number') {
      let expr = 'z.number()';
      if (typeof schema.minimum === 'number') expr += `.min(${schema.minimum})`;
      if (typeof schema.maximum === 'number') expr += `.max(${schema.maximum})`;
      return applyOptionalNullable(expr, required, Boolean(schema.nullable));
    }

    if (type === 'boolean') {
      return applyOptionalNullable('z.boolean()', required, Boolean(schema.nullable));
    }

    if (type === 'array') {
      const itemExpr = toZodExpr(schema.items ?? {}, true, [...pathParts, 'item']);
      let expr = `z.array(${itemExpr})`;

      if (typeof schema.minItems === 'number') {
        expr += `.min(${schema.minItems})`;
      }

      if (typeof schema.maxItems === 'number') {
        expr += `.max(${schema.maxItems})`;
      }

      return applyOptionalNullable(expr, required, Boolean(schema.nullable));
    }

    if (type === 'object' || schema.properties || schema.additionalProperties) {
      if (schema.properties && typeof schema.properties === 'object') {
        const requiredSet = new Set(Array.isArray(schema.required) ? schema.required : []);
        const entries = Object.entries(schema.properties).map(([key, value]) => {
          const childExpr = toZodExpr(value, requiredSet.has(key), [...pathParts, key]);
          return `  ${key}: ${childExpr},`;
        });

        const objectExpr = ['z.object({', ...entries, '})'].join('\n');
        return applyOptionalNullable(objectExpr, required, Boolean(schema.nullable));
      }

      if (schema.additionalProperties) {
        const valueExpr =
          schema.additionalProperties === true
            ? 'z.unknown()'
            : toZodExpr(schema.additionalProperties, true, [...pathParts, 'value']);
        return applyOptionalNullable(`z.record(z.string(), ${valueExpr})`, required, Boolean(schema.nullable));
      }

      return applyOptionalNullable('z.record(z.string(), z.unknown())', required, Boolean(schema.nullable));
    }

    return applyOptionalNullable('z.unknown()', required, Boolean(schema.nullable));
  };

  return { toZodExpr };
};

const createLaravelBuilder = (resolveSchema, fieldSpecsByKey) => {
  const uniquePush = (list, value) => {
    if (!list.includes(value)) {
      list.push(value);
    }
  };

  const addRule = (rules, pathKey, value) => {
    if (!rules[pathKey]) {
      rules[pathKey] = [];
    }

    uniquePush(rules[pathKey], value);
  };

  const addPresenceRules = (rules, pathKey, required, nullable) => {
    addRule(rules, pathKey, required ? 'required' : 'sometimes');
    if (nullable) {
      addRule(rules, pathKey, 'nullable');
    }
  };

  const addStringRule = (rules, pathKey, schema) => {
    addRule(rules, pathKey, 'string');

    if (typeof schema.minLength === 'number') {
      addRule(rules, pathKey, `min:${schema.minLength}`);
    }

    if (typeof schema.maxLength === 'number') {
      addRule(rules, pathKey, `max:${schema.maxLength}`);
    }

    if (typeof schema.pattern === 'string') {
      addRule(rules, pathKey, `regex:/${escapeRegexForLaravel(schema.pattern)}/`);
    }

    if (schema.format === 'email') {
      addRule(rules, pathKey, 'email');
    }

    if (schema.format === 'password') {
      const minLength = typeof schema.minLength === 'number' ? schema.minLength : 0;
      addRule(rules, pathKey, `min:${Math.max(8, minLength)}`);
      addRule(rules, pathKey, 'regex:/[A-Za-z]/');
      addRule(rules, pathKey, 'regex:/\\d/');
    }
  };

  const fieldSpecForPath = (pathKey) => {
    const segments = pathKey.split('.').filter((segment) => segment !== '*');
    const key = segments[segments.length - 1] ?? '';
    return fieldSpecsByKey[key] ?? null;
  };

  const buildRules = (rawSchema, pathKey, required, rules) => {
    const schema = resolveSchema(rawSchema) ?? {};
    const fieldSpec = pathKey ? fieldSpecForPath(pathKey) : null;
    const effectiveRequired = typeof fieldSpec?.required === 'boolean' ? fieldSpec.required : required;
    const effectiveType = typeof schema.type === 'string'
      ? schema.type
      : (fieldSpec?.type ? normalizeFieldType(fieldSpec.type) : undefined);

    if (pathKey) {
      addPresenceRules(rules, pathKey, effectiveRequired, Boolean(schema.nullable));
    }

    if (Array.isArray(schema.enum) && schema.enum.length > 0) {
      const enumString = schema.enum.map((value) => String(value)).join(',');
      if (pathKey) {
        addRule(rules, pathKey, `in:${enumString}`);
      }
      return;
    }

    const type = effectiveType;

    if (type === 'object' || schema.properties || schema.additionalProperties) {
      if (pathKey) {
        addRule(rules, pathKey, 'array');
      }

      if (schema.properties && typeof schema.properties === 'object') {
        const requiredSet = new Set(Array.isArray(schema.required) ? schema.required : []);

        Object.entries(schema.properties).forEach(([key, childSchema]) => {
          const childPath = pathKey ? `${pathKey}.${key}` : key;
          buildRules(childSchema, childPath, requiredSet.has(key), rules);
        });

        return;
      }

      if (schema.additionalProperties && pathKey) {
        const childSchema = schema.additionalProperties === true ? {} : schema.additionalProperties;
        buildRules(childSchema, `${pathKey}.*`, true, rules);
      }

      return;
    }

    if (type === 'array') {
      if (pathKey) {
        addRule(rules, pathKey, 'array');

        if (typeof schema.minItems === 'number') {
          addRule(rules, pathKey, `min:${schema.minItems}`);
        }

        if (typeof schema.maxItems === 'number') {
          addRule(rules, pathKey, `max:${schema.maxItems}`);
        }
      }

      if (schema.items && pathKey) {
        buildRules(schema.items, `${pathKey}.*`, true, rules);
      }

      return;
    }

    if (type === 'string' && pathKey) {
      addStringRule(rules, pathKey, schema);

      if (fieldSpec?.type === 'date') {
        addRule(rules, pathKey, 'date_format:Y-m-d');
      }

      if (fieldSpec?.type === 'time') {
        addRule(rules, pathKey, 'date_format:H:i');
      }

      if (fieldSpec?.type === 'datetime') {
        addRule(rules, pathKey, 'date');
      }

      if (fieldSpec?.type === 'timezone') {
        addRule(rules, pathKey, 'timezone:all');
      }

      return;
    }

    if (type === 'integer' && pathKey) {
      addRule(rules, pathKey, 'integer');
      if (typeof schema.minimum === 'number') addRule(rules, pathKey, `min:${schema.minimum}`);
      if (typeof schema.maximum === 'number') addRule(rules, pathKey, `max:${schema.maximum}`);
      return;
    }

    if (type === 'number' && pathKey) {
      addRule(rules, pathKey, 'numeric');
      if (typeof schema.minimum === 'number') addRule(rules, pathKey, `min:${schema.minimum}`);
      if (typeof schema.maximum === 'number') addRule(rules, pathKey, `max:${schema.maximum}`);
      return;
    }

    if (type === 'boolean' && pathKey) {
      addRule(rules, pathKey, 'boolean');
    }
  };

  return { buildRules };
};

const renderFrontFile = (schemaNames, schemas, toZodExpr) => {
  const lines = [];

  lines.push('// This file is auto-generated. Do not edit manually.');
  lines.push('// Source: openapi/build/bundle.json + front/src/__generated__/zod.ts + field-labels.json');
  lines.push('');
  lines.push("import { z } from 'zod';");
  lines.push("import { components as generatedComponents } from './zod';");
  lines.push("import labelsJson from './field-labels.json';");
  lines.push('');
  lines.push('const labels = labelsJson as Record<string, string>;');
  lines.push('const labelOf = (field: string): string => labels[field] ?? field;');
  lines.push('');
  lines.push('export const validationSchemas = {');

  schemaNames.forEach((schemaName) => {
    const schema = schemas[schemaName];
    const resolved = schema && typeof schema === 'object' ? schema : {};

    if (!resolved.properties || typeof resolved.properties !== 'object') {
      lines.push(`  ${schemaName}: generatedComponents.schemas.${schemaName},`);
      return;
    }

    const requiredSet = new Set(Array.isArray(resolved.required) ? resolved.required : []);
    lines.push(`  ${schemaName}: generatedComponents.schemas.${schemaName}.extend({`);

    Object.entries(resolved.properties).forEach(([propertyName, propertySchema]) => {
      const expr = toZodExpr(propertySchema, requiredSet.has(propertyName), [schemaName, propertyName]);
      const indentedExpr = expr
        .split('\n')
        .map((line, index) => (index === 0 ? line : `      ${line}`))
        .join('\n');

      lines.push(`    ${propertyName}: ${indentedExpr},`);
    });

    lines.push('  }),');
  });

  lines.push('} as const;');
  lines.push('');
  lines.push('export type ValidationSchemaName = keyof typeof validationSchemas;');
  lines.push('');

  return `${lines.join('\n')}`;
};

const fieldLabelFromRulePath = (pathKey, labels) => {
  const segments = pathKey.split('.').filter((segment) => segment !== '*');
  const field = segments[segments.length - 1] ?? pathKey;
  return labels[field] ?? field;
};

const renderBackFile = (schemaNames, schemaRuleMap, labels) => {
  const lines = [];

  lines.push('<?php');
  lines.push('');
  lines.push('declare(strict_types=1);');
  lines.push('');
  lines.push('namespace App\\Http\\Requests\\Generated;');
  lines.push('');
  lines.push('/**');
  lines.push(' * OpenAPI から自動生成されたバリデーションルール。');
  lines.push(' * 直接編集しないこと。');
  lines.push(' */');
  lines.push('final class OpenApiGeneratedRules');
  lines.push('{');
  lines.push('    /**');
  lines.push('     * @return array<string, array<int, string>>');
  lines.push('     */');
  lines.push('    public static function schema(string $schema): array');
  lines.push('    {');
  lines.push('        return self::SCHEMA_RULES[$schema] ?? [];');
  lines.push('    }');
  lines.push('');
  lines.push('    /**');
  lines.push('     * @return array<string, string>');
  lines.push('     */');
  lines.push('    public static function schemaAttributes(string $schema): array');
  lines.push('    {');
  lines.push('        return self::SCHEMA_ATTRIBUTES[$schema] ?? [];');
  lines.push('    }');
  lines.push('');
  lines.push('    /**');
  lines.push('     * @var array<string, array<string, array<int, string>>>');
  lines.push('     */');
  lines.push('    private const SCHEMA_RULES = [');

  schemaNames.forEach((schemaName) => {
    lines.push(`        '${escapeSingleQuote(schemaName)}' => [`);
    const rules = schemaRuleMap[schemaName] ?? {};
    Object.entries(rules).forEach(([pathKey, pathRules]) => {
      const serializedRules = pathRules.map((rule) => `'${escapeSingleQuote(rule)}'`).join(', ');
      lines.push(`            '${escapeSingleQuote(pathKey)}' => [${serializedRules}],`);
    });
    lines.push('        ],');
  });

  lines.push('    ];');
    lines.push('');
    lines.push('    /**');
    lines.push('     * @var array<string, array<string, string>>');
    lines.push('     */');
    lines.push('    private const SCHEMA_ATTRIBUTES = [');

    schemaNames.forEach((schemaName) => {
      lines.push(`        '${escapeSingleQuote(schemaName)}' => [`);
      const rules = schemaRuleMap[schemaName] ?? {};
      Object.keys(rules).forEach((pathKey) => {
        const label = fieldLabelFromRulePath(pathKey, labels);
        lines.push(`            '${escapeSingleQuote(pathKey)}' => '${escapeSingleQuote(label)}',`);
      });
      lines.push('        ],');
    });

    lines.push('    ];');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
};

const ensureDir = async (targetPath) => {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
};

const buildMismatchReport = (schemaNames, schemas, fieldSpecsByKey) => {
  const mismatches = [];

  schemaNames.forEach((schemaName) => {
    const schema = schemas[schemaName];
    if (!schema || typeof schema !== 'object' || !schema.properties || typeof schema.properties !== 'object') {
      return;
    }

    const requiredSet = new Set(Array.isArray(schema.required) ? schema.required : []);

    Object.entries(schema.properties).forEach(([fieldName, fieldSchema]) => {
      const spec = fieldSpecsByKey[fieldName];
      if (!spec) {
        mismatches.push({
          schema: schemaName,
          field: fieldName,
          issue: 'missing_in_fields_yaml',
        });
        return;
      }

      const openapiType = typeof fieldSchema?.type === 'string' ? fieldSchema.type : 'object';
      const fieldsType = spec.type ? normalizeFieldType(spec.type) : 'string';

      if (openapiType !== fieldsType && !(fieldsType === 'string' && Array.isArray(fieldSchema?.enum))) {
        mismatches.push({
          schema: schemaName,
          field: fieldName,
          issue: 'type_mismatch',
          openapiType,
          fieldsType,
        });
      }

      if (typeof spec.required === 'boolean' && requiredSet.has(fieldName) !== spec.required) {
        mismatches.push({
          schema: schemaName,
          field: fieldName,
          issue: 'required_mismatch',
          openapiRequired: requiredSet.has(fieldName),
          fieldsRequired: spec.required,
        });
      }
    });
  });

  return mismatches;
};

const main = async () => {
  const bundle = await readJson(bundleJsonPath);
  const fieldsDoc = await readYaml(fieldsPath);
  const schemas = bundle?.components?.schemas ?? {};
  const fieldSpecsByKey = buildFieldSpecMap(fieldsDoc);

  const zodFile = await fs.readFile(zodGeneratedPath, 'utf-8');
  const exportedZodSchemaNames = Array.from(zodFile.matchAll(/export const (\w+)\s*=/g)).map((match) => match[1]);

  const { resolveSchema } = createResolver(schemas);
  const { toZodExpr } = createZodBuilder(resolveSchema);
  const { buildRules } = createLaravelBuilder(resolveSchema, fieldSpecsByKey);

  const candidates = Object.keys(schemas)
    .filter((name) => exportedZodSchemaNames.includes(name))
    .filter((name) => {
      const schema = resolveSchema(schemas[name]);
      return schema && (schema.type === 'object' || schema.properties || schema.additionalProperties);
    })
    .sort((a, b) => a.localeCompare(b));

  const schemaRuleMap = {};
  const resolvedSchemas = Object.fromEntries(candidates.map((name) => [name, resolveSchema(schemas[name])]));
  const labels = buildLabelMap(candidates, resolvedSchemas, resolveSchema, fieldSpecsByKey);

  candidates.forEach((schemaName) => {
    const rules = {};
    const schema = resolvedSchemas[schemaName];
    buildRules(schema, '', true, rules);
    schemaRuleMap[schemaName] = rules;
  });

  const frontFile = renderFrontFile(candidates, resolvedSchemas, toZodExpr);
  const backFile = renderBackFile(candidates, schemaRuleMap, labels);
  const mismatches = buildMismatchReport(candidates, resolvedSchemas, fieldSpecsByKey);

  await ensureDir(frontOutputPath);
  await ensureDir(labelOutputPath);
  await ensureDir(backOutputPath);
  await fs.writeFile(frontOutputPath, frontFile, 'utf-8');
  await fs.writeFile(labelOutputPath, `${JSON.stringify(labels, null, 2)}\n`, 'utf-8');
  await fs.writeFile(backOutputPath, backFile, 'utf-8');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
