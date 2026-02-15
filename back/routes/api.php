<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashBoard\CalendarController;
use App\Http\Controllers\Authorize\AuthorizeController;

// ヘルスチェック
Route::get('/health', function () {
    return ['status' => 'ok', 'api' => true];
});

// 認証不要
Route::prefix('auth')->group(function () {

    /**
     * ログインAPI
     *
     * POST /api/auth/login
     */
    Route::post('/login', [AuthorizeController::class, 'login'])
        ->middleware('throttle:5,1'); // 1分間に5回まで
});

// 認証必須
Route::middleware('auth:sanctum')->group(function () {

    /**
     * ログアウトAPI
     *
     * POST /api/auth/logout
     */
    Route::post('/auth/logout', [AuthorizeController::class, 'logout']);

    /**
     * カレンダー取得API
     *
     * GET /api/calendar?year=2026&month=2
     */
    Route::get('/calendar', [CalendarController::class, 'index']);
});
