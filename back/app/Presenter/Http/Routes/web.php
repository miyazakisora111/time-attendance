<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

/**
 * トップページ（動作確認用）
 */
Route::get('/', function () {
    return response()->json([
        'status' => 'ok',
        'mode' => 'web'
    ]);
});