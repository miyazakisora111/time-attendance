/**
 * ファイル I/O ユーティリティ。
 * YAML/JSON 読み込み、ディレクトリ走査、ファイル書き出しを共通化する。
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

/** ディレクトリが存在しなければ再帰的に作成 */
export const ensureDirExists = async (dirPath) => {
    await fs.mkdir(dirPath, { recursive: true });
};

/** YAML ファイルを読み込みパース */
export const readYaml = async (filePath) => {
    const content = await fs.readFile(filePath, 'utf-8');
    return YAML.parse(content) ?? {};
};

/** JSON ファイルを読み込みパース */
export const readJson = async (filePath) => {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
};

/** テキストファイルを読み込み */
export const readText = async (filePath) => {
    return fs.readFile(filePath, 'utf-8');
};

/** ファイルを書き込み（親ディレクトリが無ければ自動作成） */
export const writeFile = async (filePath, content) => {
    await ensureDirExists(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
};

/**
 * 指定ディレクトリ内の全 YAML を読み取り、
 * 各ファイルの先頭キーを名前として返す。
 *
 * @param {string} dirPath
 * @returns {Promise<Array<{ name: string, schema: object, file: string }>>}
 */
export const collectYamlEntries = async (dirPath) => {
    const files = (await fs.readdir(dirPath))
        .filter((f) => f.endsWith('.yaml'))
        .sort();

    const entries = [];
    for (const file of files) {
        const parsed = await readYaml(path.join(dirPath, file));
        const name = Object.keys(parsed)[0];
        if (name) {
            entries.push({ name, schema: parsed[name], file });
        }
    }
    return entries;
};

/**
 * サブディレクトリを再帰的に走査し全 YAML を収集する。
 *
 * @param {string} dirPath     走査ルート
 * @param {string} [baseDir]   sourceFile の相対パス基準（省略時は dirPath）
 * @returns {Promise<Array<{ name: string, schema: object, file: string, sourceFile: string }>>}
 */
export const collectYamlEntriesRecursive = async (dirPath, baseDir) => {
    const base = baseDir ?? dirPath;
    const entries = [];
    const subdirs = (await fs.readdir(dirPath, { withFileTypes: true }))
        .filter((e) => e.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name));

    for (const dir of subdirs) {
        const subPath = path.join(dirPath, dir.name);
        const files = (await fs.readdir(subPath))
            .filter((f) => f.endsWith('.yaml'))
            .sort();

        for (const file of files) {
            const parsed = await readYaml(path.join(subPath, file));
            const name = Object.keys(parsed)[0];
            if (name) {
                entries.push({
                    name,
                    schema: parsed[name],
                    file,
                    sourceFile: path.relative(base, path.join(subPath, file)),
                });
            }
        }
    }
    return entries;
};
