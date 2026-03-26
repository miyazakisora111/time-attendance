/**
 * CLI エントリーポイントラッパー。
 * 全 generator スクリプトの main() を統一フォーマットで実行する。
 */

/**
 * @param {string} label   表示名（例: "PHP Enum generation"）
 * @param {() => Promise<void>} fn  生成処理
 */
export const run = (label, fn) => {
    fn().catch((err) => {
        console.error(`❌ ${label} failed:`, err);
        process.exit(1);
    });
};
