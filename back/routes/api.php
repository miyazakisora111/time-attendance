<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashBoard\CalendarController;
use App\Http\Controllers\Auth\AuthController;

// ヘルスチェック
Route::get('/health', function () {
    return ['status' => 'ok', 'api' => true];
});

// 認証不要ルート
Route::prefix('auth')->group(function () {

    /**
     * ログインユーザー情報取得
     * GET /api/auth/me
     */
    Route::get('/me', [AuthController::class, 'me'])
        ->middleware('throttle:10,1'); // 1分間に10回まで

    /**
     * ログイン
     * POST /api/auth/login
     */
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1'); // 1分間に5回まで
});

// 認証必須ルート
Route::middleware('auth:sanctum')->group(function () {

    /**
     * ログアウト
     * POST /api/auth/logout
     */
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    /**
     * カレンダー取得
     * GET /api/calendar?year=2026&month=2
     */
    Route::get('/calendar', [CalendarController::class, 'index']);
});
