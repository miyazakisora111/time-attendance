<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Attendance\CalendarController;
use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Approval\ApprovalController;
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
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'show']);
    Route::post('/dashboard/clock', [DashboardController::class, 'clock']);

    // Attendance
    Route::prefix('attendances')->group(function () {
        Route::get('/today', [AttendanceController::class, 'today']);
        Route::post('/clock-in', [AttendanceController::class, 'clockIn']);
        Route::post('/clock-out', [AttendanceController::class, 'clockOut']);
        Route::post('/break-start', [AttendanceController::class, 'breakStart']);
        Route::post('/break-end', [AttendanceController::class, 'breakEnd']);
        Route::get('/', [AttendanceController::class, 'index']);
        Route::post('/', [AttendanceController::class, 'store']);
        Route::patch('/{attendanceId}', [AttendanceController::class, 'update']);
    });

    // Schedule
    Route::get('/schedule/calendar', [CalendarController::class, 'index']);

    // Team
    Route::get('/team/members', [TeamController::class, 'index']);

    // Settings
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'show']);
        Route::put('/', [SettingsController::class, 'update']);
        Route::put('/password', [SettingsController::class, 'changePassword']);
        Route::get('/login-histories', [SettingsController::class, 'loginHistories']);
    });

    // Approval
    Route::prefix('approvals')->group(function () {
        Route::get('/', [ApprovalController::class, 'index']);
        Route::post('/paid-leaves', [ApprovalController::class, 'createPaidLeave']);
        Route::patch('/paid-leaves/{paidLeaveRequestId}/approve', [ApprovalController::class, 'approvePaidLeave']);
        Route::patch('/paid-leaves/{paidLeaveRequestId}/reject', [ApprovalController::class, 'rejectPaidLeave']);
        Route::patch('/paid-leaves/{paidLeaveRequestId}/cancel', [ApprovalController::class, 'cancelPaidLeave']);
        Route::post('/overtime-requests', [ApprovalController::class, 'createOvertime']);
        Route::patch('/overtime-requests/{overtimeRequestId}/approve', [ApprovalController::class, 'approveOvertime']);
        Route::patch('/overtime-requests/{overtimeRequestId}/return', [ApprovalController::class, 'returnOvertime']);
        Route::patch('/overtime-requests/{overtimeRequestId}/cancel', [ApprovalController::class, 'cancelOvertime']);
    });
});
