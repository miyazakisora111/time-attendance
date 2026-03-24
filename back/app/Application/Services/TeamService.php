<?php

declare(strict_types=1);

namespace App\Application\Services;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\User;
use Carbon\CarbonImmutable;

/**
 * チーム機能のサービス。
 */
final class TeamService extends BaseService
{
    /**
     * メンバー一覧を返す。
     *
     * @return array{members: array<int, array<string, mixed>>}
     */
    public function listMembers(): array
    {
        $users = User::query()
            ->with(['department:id,name', 'role:id,name'])
            ->ordered()
            ->get();

        $members = $users
            ->map(fn(User $user): array => $this->mapUserToMember($user))
            ->values()
            ->all();

        return [
            'members' => $members,
        ];
    }

    /**
     * ユーザーをフロント表示用メンバー構造へ変換する。
     *
     * @return array<string, mixed>
     */
    private function mapUserToMember(User $user): array
    {
        $timezone = $this->resolveTimezone($user->timezone ?? null);
        $today = CarbonImmutable::today($timezone)->toDateString();

        $attendance = Attendance::query()
            ->where('user_id', $user->id)
            ->where('work_date', $today)
            ->latest('clock_in_at')
            ->first();

        $status = $this->resolveMemberStatus($user, $attendance);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role?->name ?? 'メンバー',
            'department' => $user->department?->name ?? '未所属',
            'status' => $status,
            'clockInTime' => $attendance?->clock_in_at?->setTimezone($timezone)->format('H:i'),
            'email' => $user->email,
        ];
    }

    /**
     * ユーザーと当日勤怠からステータスを算出する。
     */
    private function resolveMemberStatus(User $user, ?Attendance $attendance): string
    {
        if ((int) $user->status !== 1) {
            return 'leave';
        }

        if ($attendance === null || !$attendance->isClockedIn() || $attendance->isClockedOut()) {
            return 'off';
        }

        $activeBreak = AttendanceBreak::query()
            ->where('attendance_id', $attendance->id)
            ->whereNotNull('break_start')
            ->whereNull('break_end')
            ->latest('break_start')
            ->first();

        if ($activeBreak !== null) {
            return 'break';
        }

        return 'working';
    }
}
