<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Attendance\CalendarController;
use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Dashboard\DashboardController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'api' => true,
    ]);
});

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth:api', 'throttle:60,1']);
Route::get('/authme', [AuthController::class, 'me'])->middleware(['auth:api', 'throttle:60,1']);

Route::prefix('auth')->middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

Route::post('/clock-in', [AttendanceController::class, 'clockIn']);
Route::post('/clock-out', [AttendanceController::class, 'clockOut']);
Route::get('/today', [AttendanceController::class, 'today']);
Route::get('/dashboard', [DashboardController::class, 'show']);
Route::post('/dashboard/clock', [DashboardController::class, 'clock']);

Route::middleware(['auth:api'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/calendar', [CalendarController::class, 'index']);
    })->middleware('throttle:60,1');
});
