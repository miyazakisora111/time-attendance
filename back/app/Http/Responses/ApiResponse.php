<?php

declare(strict_types=1);

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

/**
 * APIレスポンスの統一フォーマットを生成する専用クラス。
 */
final class ApiResponse
{
    /**
     * 成功レスポンスを生成する
     *
     * @param mixed  $data    レスポンスデータ本体
     * @param string $message 成功メッセージ
     * @param int    $status  HTTPステータスコード
     * @param array<string, mixed> $meta  付加情報（ページネーションなど）
     *
     * @return JsonResponse
     */
    public static function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200,
        array $meta = []
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
            'meta'    => $meta !== [] ? $meta : null,
        ], $status);
    }

    /**
     * エラーレスポンスを生成する
     *
     * @param string $message エラーメッセージ
     * @param int    $status  HTTPステータスコード
     * @param array<string, mixed> $errors バリデーションエラーや詳細情報
     *
     * @return JsonResponse
     */
    public static function error(
        string $message,
        int $status,
        array $errors = []
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors !== [] ? $errors : null,
        ], $status);
    }
}
