import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * このスクリプトのディレクトリ配下にある templates/ をルートにして、
 * 指定テンプレートを読み込み、{{key}} を置換して返す。
 */
const templatesDir = path.resolve(__dirname, 'templates');

/**
 * テンプレートファイルを読み込み、{{key}} プレースホルダーを置換して返す。
 *
 * @param {string} templateName - templates/ 配下のファイル名 (例: "ts-enum.tpl" / "php-enum.tpl")
 * @param {Record<string, string|number>} vars - 置換する変数マップ
 * @returns {Promise<string>}
 */
export const render = async (templateName, vars) => {
    const tplPath = path.join(templatesDir, templateName);

    let content;
    try {
        content = await fs.readFile(tplPath, 'utf8');
    } catch (err) {
        const relToCwd = path.relative(process.cwd(), tplPath);
        throw new Error(
            `Template not found: ${tplPath}\n` +
            `- cwd: ${process.cwd()}\n` +
            `- relative: ${relToCwd}\n` +
            `Ensure the file exists under: ${templatesDir}/`
        );
    }

    // {{ key }} と {{key}} の両方をサポート。未定義キーは空文字にする。
    content = content.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
        const v = vars[key];
        return v == null ? '' : String(v);
    });

    return content;
};