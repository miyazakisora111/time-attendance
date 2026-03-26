/**
 * テンプレートエンジン。
 * templates/ 配下の .tpl ファイルを {{key}} 置換で展開する。
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { templatesDir } from './paths.mjs';

/**
 * テンプレートファイルを読み込み、{{key}} プレースホルダーを置換して返す。
 *
 * @param {string} templateName  templates/ 配下のファイル名
 * @param {Record<string, string|number>} vars  置換する変数マップ
 * @returns {Promise<string>}
 */
export const render = async (templateName, vars) => {
    const tplPath = path.join(templatesDir, templateName);

    let content;
    try {
        content = await fs.readFile(tplPath, 'utf-8');
    } catch {
        throw new Error(
            `Template not found: ${tplPath}\n` +
            `Ensure the file exists under: ${templatesDir}/`,
        );
    }

    return content.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
        const v = vars[key];
        return v == null ? '' : String(v);
    });
};
