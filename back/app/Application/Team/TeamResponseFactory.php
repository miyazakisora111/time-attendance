<?php

declare(strict_types=1);

namespace App\Application\Team;

use App\Models\User;
use App\Models\Attendance;
use App\__Generated__\Enums\TeamMemberStatus;
use App\__Generated__\Responses\Team\TeamMember;
use App\__Generated__\Responses\Team\TeamMembersResponse;

/**
 * チームレスポンスのファクトリ
 */
final class TeamResponseFactory
{
    /**
     * TeamMember DTO を作成する。
     *
     * @param User $user ユーザーモデル
     * @param TeamMemberStatus $status 勤務状態
     * @param ?Attendance $attendance 本日の勤怠
     * @return TeamMember チームメンバーDTO
     */
    public function createMember(
        User $user,
        TeamMemberStatus $status,
        ?Attendance $attendance,
    ): TeamMember {
        return new TeamMember(
            id: $user->id,
            name: $user->name,
            role: $user->role?->name ?? '',
            department: $user->department?->name ?? '',
            status: $status,
            email: $user->email,
            clockInTime: $attendance?->clock_in_at?->toDateTimeString(),
        );
    }

    /**
     * TeamMembersResponse DTO を作成する。
     *
     * @param TeamMember[] $members チームメンバーDTO一覧
     * @return TeamMembersResponse チームメンバーレスポンスDTO
     */
    public function createResponse(array $members): TeamMembersResponse
    {
        return new TeamMembersResponse(
            members: $members,
        );
    }
}
