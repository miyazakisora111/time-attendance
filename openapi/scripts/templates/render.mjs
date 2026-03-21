import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const templatesDir = path.dirname(__filename);

/**
 * テンプレートファイルを読み込み、{{key}} プレースホルダーを置換して返す。
 *
 * @param {string} templateName  templates/ 配下のファイル名 (例: "ts-enum.tpl")
 * @param {Record<string, string>} vars  置換する変数マップ
 * @returns {Promise<string>}
 */
export const render = async (templateName, vars) => {
    const tplPath = path.join(templatesDir, templateName);
    let content = await fs.readFile(tplPath, 'utf-8');

    for (const [key, value] of Object.entries(vars)) {
        content = content.replaceAll(`{{${key}}}`, value);
    }

    return content;
};
