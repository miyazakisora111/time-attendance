<?php

declare(strict_types=1);

namespace App\Application\Dashboard;

use App\Application\Attendance\AttendanceResolver;
use App\Application\Attendance\AttendanceService;
use App\Application\BaseService;
use App\__Generated__\Enums\ClockAction;
use App\__Generated__\Responses\Attendance\AttendanceResponse;
use App\__Generated__\Responses\Dashboard\DashboardResponse;
use App\Http\Responses\Factories\AttendanceResponseFactory;
use App\Models\User;

/**
 * ダッシュボードのサービス
 */
final class DashboardService extends BaseService
{
    /**
     * コンストラクタ
     *
     * @param DashboardQuery $query ダッシュボードのクエリ
     * @param DashboardResolver $resolver ダッシュボードのリゾルバ
     * @param DashboardResponseFactory $factory ダッシュボードレスポンスファクトリ
     * @param AttendanceResolver $attendanceResolver 勤怠リゾルバ
     * @param AttendanceService $attendanceService 勤怠サービス
     * @param AttendanceResponseFactory $attendanceResponseFactory 勤怠レスポンスファクトリ
     */
    public function __construct(
        private readonly DashboardQuery $query,
        private readonly DashboardResolver $resolver,
        private readonly DashboardResponseFactory $factory,
        private readonly AttendanceResolver $attendanceResolver,
        private readonly AttendanceService $attendanceService,
        private readonly AttendanceResponseFactory $attendanceResponseFactory,
    ) {}

    /**
     * ダッシュボード情報を取得する
     *
     * @param User $user ユーザー
     * @return DashboardResponse ダッシュボードレスポンス
     */
    public function getDashboard(User $user): DashboardResponse
    {
        // 最新の勤怠から打刻状態を判定する。
        $latestAttendance = $this->query->getLatestAttendance($user);
        $clockStatus = $this->attendanceResolver->resolveClockStatus($latestAttendance);

        // 当日の勤怠を取得する。
        $todayAttendance = $this->query->getTodayAttendance($user);

        // 月次統計を算出する。
        $monthlyAttendances = $this->query->getMonthlyAttendances($user);
        $stats = $this->resolver->resolveMonthlyStats($monthlyAttendances);

        // 直近の勤怠一覧を取得する。
        $recentAttendances = $this->query->getRecentAttendances($user);

        return $this->factory->create(
            user: $user,
            clockStatus: $clockStatus,
            todayAttendance: $todayAttendance,
            stats: $stats,
            recentAttendances: $recentAttendances,
        );
    }

    /**
     * ダッシュボードから打刻を実行する
     *
     * 打刻アクション種別に応じて AttendanceService に委譲する。
     *
     * @param User $user ユーザー
     * @param ClockAction $action 打刻アクション
     * @return AttendanceResponse 勤怠レスポンス
     */
    public function clock(User $user, ClockAction $action): AttendanceResponse
    {
        $attendance = match ($action) {
            ClockAction::IN => $this->attendanceService->clockIn($user),
            ClockAction::OUT => $this->attendanceService->clockOut($user),
            ClockAction::BREAK_START => $this->attendanceService->breakStart($user),
            ClockAction::BREAK_END => $this->attendanceService->breakEnd($user),
        };

        return $this->attendanceResponseFactory->create($attendance);
    }
}
