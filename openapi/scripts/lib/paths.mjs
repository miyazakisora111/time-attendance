/**
 * プロジェクト内の全パス定義。
 * 入力ソース・出力先を一元管理する。
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** プロジェクトルート */
export const rootDir = path.resolve(__dirname, '../../..');

/** openapi/scripts/ ディレクトリ */
export const scriptsDir = path.resolve(__dirname, '..');

/** テンプレートディレクトリ */
export const templatesDir = path.join(scriptsDir, 'templates');

// ── 入力パス ──

export const enumsDir = path.join(rootDir, 'openapi/components/enums');
export const schemasDir = path.join(rootDir, 'openapi/components/schemas');
export const bundleJsonPath = path.join(rootDir, 'openapi/build/bundle.json');
export const fieldsYamlPath = path.join(rootDir, 'openapi/schema/fields.yaml');
export const zodGeneratedPath = path.join(rootDir, 'front/src/__generated__/zod.ts');

// ── 出力パス ──

export const phpEnumsDir = path.join(rootDir, 'back/app/__Generated__/Enums');
export const phpResponseDtosDir = path.join(rootDir, 'back/app/__Generated__/Responses');
export const phpValidationPath = path.join(rootDir, 'back/app/__Generated__/OpenApiGeneratedRules.php');
export const tsEnumsPath = path.join(rootDir, 'front/src/__generated__/enums.ts');
export const zodValidationPath = path.join(rootDir, 'front/src/__generated__/zod.validation.ts');
export const fieldLabelsPath = path.join(rootDir, 'front/src/__generated__/field-labels.json');
