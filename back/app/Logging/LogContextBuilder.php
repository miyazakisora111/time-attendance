<?php

declare(strict_types=1);

namespace App\Infrastructure\Logging;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

/**
 * ログ用のコンテキスト情報を構築するクラス
 */
final class LogContextBuilder
{
    /**
     * HTTPリクエストとHTTPレスポンスからログ用コンテキストを生成する。
     *
     * @param Request $request HTTPリクエスト
     * @param Response $response HTTPレスポンス
     * @return array<string, mixed> ログに渡すコンテキスト情報
     */
    public function fromRequestAndResponse(Request $request, Response $response): array
    {
        return [
            // HTTPメソッド
            'method' => $request->method(),

            // HTTPリクエストされたエンドポイント
            'endpoint' => $request->path(),

            // HTTPレスポンスのHTTPステータスコード
            'status_code' => $response->getStatusCode(),

            // HTTPリクエスト情報
            'request' => [
                'query' => $request->query(),
                'body' => $request->except(['password', 'password_confirmation']),
            ],

            // HTTPレスポンスボディ
            'response' => $this->extractResponseBody($response),
        ];
    }

    /**
     * 例外発生時のログ用コンテキストを生成する。
     *
     * @param Request $request HTTPリクエスト
     * @param Throwable $e 例外オブジェクト
     * @param int $status HTTPステータスコード
     * @return array<string, mixed> ログに渡すコンテキスト情報
     */
    public function fromException(
        Request $request,
        Throwable $e,
        int $status
    ): array {
        return [
            // HTTPメソッド
            'method' => $request->method(),

            // HTTPリクエストされたエンドポイント
            'endpoint' => $request->path(),

            // クライアントに返すHTTPステータスコード
            'status_code' => $status,

            // 例外クラス名
            'exception' => $e::class,

            // 例外メッセージ
            'error_message' => $e->getMessage(),

            // スタックトレース
            'trace' => $e->getTraceAsString(),
        ];
    }

    /**
     * HTTPレスポンスボディを抽出する。
     * 
     * @param Response $response HTTPレスポンス
     * @return array|string|null 抽出したHTTPレスポンス内容
     */
    private function extractResponseBody(Response $response): array|string|null
    {
        // JSONレスポンスの場合
        if ($response instanceof JsonResponse) {
            return $response->getData(true);
        }

        // バイナリ / ストリームの場合
        if (
            $response instanceof BinaryFileResponse ||
            $response instanceof StreamedResponse
        ) {
            return '[non-loggable response body]';
        }

        // サイズ制限
        $content = $response->getContent();
        if (is_string($content) && mb_strlen($content) > 2000) {
            return mb_substr($content, 0, 2000) . '... (truncated)';
        }

        return $content;
    }
}
