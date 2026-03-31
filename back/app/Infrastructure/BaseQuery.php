<?php

declare(strict_types=1);

namespace App\Infrastructure;

use Illuminate\Support\Facades\DB;

/**
 * クエリ基底クラス
 *
 * SQLファイルの読み込み・バインド・実行を共通化する。
 */
abstract class BaseQuery
{
    /**
     * SQLファイルを読み込む。
     *
     * 子クラスの配置から ../Sql/{filename} を解決する。
     *
     * @param string $filename SQLファイル名（例: attendance_summary.sql）
     * @return string SQL文
     */
    protected function loadSql(string $filename): string
    {
        $classDir = dirname((new \ReflectionClass(static::class))->getFileName());
        $path = dirname($classDir) . '/Sql/' . $filename;

        if (!file_exists($path)) {
            throw new \RuntimeException("SQL file not found: {$path}");
        }

        return file_get_contents($path);
    }

    /**
     * SELECT を実行し、結果を配列で返す。
     *
     * @param string $sql SQL文
     * @param array<string, mixed> $bindings バインドパラメータ
     * @return array<int, object> 結果行
     */
    protected function select(string $sql, array $bindings = []): array
    {
        return DB::select($sql, $bindings);
    }

    /**
     * SELECT を実行し、最初の1行を返す。
     *
     * @param string $sql SQL文
     * @param array<string, mixed> $bindings バインドパラメータ
     * @return ?object 結果行
     */
    protected function selectOne(string $sql, array $bindings = []): ?object
    {
        return DB::selectOne($sql, $bindings);
    }
}
