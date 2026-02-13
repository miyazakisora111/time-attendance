<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller;

/**
 * BaseController
 * 
 * すべてのコントローラーの基底クラス。
 * 共通の機能と初期化を提供します。
 */
abstract class BaseController extends Controller
{
    use AuthorizesRequests;
    use ValidatesRequests;

    /**
     * 成功レスポンスを返す
     */
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $code = 200,
    ): \Illuminate\Http\JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * エラーレスポンスを返す
     */
    protected function error(
        string $message = 'Error',
        int $code = 400,
        mixed $errors = null,
    ): \Illuminate\Http\JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    /**
     * ページネーション付きレスポンスを返す
     */
    protected function paginated(
        \Illuminate\Contracts\Pagination\LengthAwarePaginator $paginator,
        string $message = 'Success',
    ): \Illuminate\Http\JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ], 200);
    }
}
