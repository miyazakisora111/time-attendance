<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Attendance\CalendarController;
use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Auth\AuthController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'api' => true,
    ]);
});

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
})->middleware('throttle:5,1');

Route::post('/clock-in', [AttendanceController::class, 'clockIn']);
Route::post('/clock-out', [AttendanceController::class, 'clockOut']);
Route::get('/today', [AttendanceController::class, 'today']);

Route::middleware(['auth:api'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/calendar', [CalendarController::class, 'index']);
    })->middleware('throttle:60,1');
});
