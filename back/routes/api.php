<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Attendance\CalendarController;
use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\MeController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Settings\SettingsController;
use App\Http\Controllers\Team\TeamController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'api' => true,
    ]);
});

// --- 認証不要 ---
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// --- 認証必須 ---
Route::middleware(['auth:api', 'throttle:60,1'])->group(function () {
    // 認証
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::get('/auth/me', MeController::class);

    // ダッシュボード
    Route::get('/dashboard', [DashboardController::class, 'show']);
    Route::post('/dashboard/clock', [DashboardController::class, 'clock']);

    // 勤怠
    Route::prefix('attendances')->group(function () {
        Route::get('/latest', [AttendanceController::class, 'latest']);
        Route::post('/clock-in', [AttendanceController::class, 'clockIn']);
        Route::post('/clock-out', [AttendanceController::class, 'clockOut']);
        Route::post('/break-start', [AttendanceController::class, 'breakStart']);
        Route::post('/break-end', [AttendanceController::class, 'breakEnd']);
        Route::get('/', [AttendanceController::class, 'index']);
        Route::post('/', [AttendanceController::class, 'store']);
        Route::patch('/{attendanceId}', [AttendanceController::class, 'update']);
    });

    // スケジュール
    Route::get('/schedule/calendar', [CalendarController::class, 'index']);

    // チーム
    Route::get('/team/members', [TeamController::class, 'index']);

    // 設定
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'show']);
        Route::put('/', [SettingsController::class, 'update']);
        Route::put('/password', [SettingsController::class, 'changePassword']);
        Route::get('/login-histories', [SettingsController::class, 'loginHistories']);
    });
});
