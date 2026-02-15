<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashBoard\CalendarController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
Route::get('/health', function () {
    return ['status' => 'ok', 'api' => true];
});

/**
 * カレンダー取得API
 *
 * GET /api/calendar?year=2026&month=2
 */
Route::get('/calendar', [CalendarController::class, 'index']);
