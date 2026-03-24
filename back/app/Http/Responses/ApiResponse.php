<?php

declare(strict_types=1);

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

/**
 * APIレスポンスの統一フォーマットを生成する
 */
final class ApiResponse
{
    /**
     * 成功HTTPレスポンスを生成する
     *
     * @param mixed $data HTTPレスポンスデータ本体
     * @param string $message 成功メッセージ
     * @param int $status  HTTPステータスコード
     * @param array<string, mixed> $meta 付加情報
     * @return JsonResponse JSONレスポンス
     */
    public static function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200,
        array $meta = [],
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'meta' => $meta !== [] ? $meta : null,
        ], $status);
    }

    /**
     * エラーHTTPレスポンスを生成する
     *
     * @param string $message エラーメッセージ
     * @param int $status HTTPステータスコード
     * @param array<string, mixed> $errors バリデーションエラーや詳細情報
     * @param string $code エラーコード
     * @return JsonResponse JSONレスポンス
     */
    public static function error(
        string $message,
        int $status,
        array $errors = [],
        string $code = 'INTERNAL_ERROR',
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'code' => $code,
            'errors' => $errors !== [] ? $errors : null,
        ], $status);
    }
}
