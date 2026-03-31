<?php

declare(strict_types=1);

namespace App\Application\Team;

use App\Application\BaseService;
use App\Infrastructure\Team\Query\TeamQuery;
use App\Models\User;
use App\__Generated__\Responses\Team\TeamMembersResponse;
use Carbon\CarbonImmutable;

/**
 * チームのサービス
 */
final class TeamService extends BaseService
{
    /**
     * コンストラクタ
     *
     * @param TeamQuery $query チームのクエリ
     * @param TeamResolver $resolver チームのリゾルバ
     * @param TeamResponseFactory $factory チームのレスポンスファクトリ
     */
    public function __construct(
        private readonly TeamQuery $query,
        private readonly TeamResolver $resolver,
        private readonly TeamResponseFactory $factory,
    ) {}

    /**
     * チームメンバー一覧を取得する。
     *
     * @param User $user 認証済みユーザー
     * @return TeamMembersResponse チームメンバーレスポンス
     */
    public function getMembers(User $user): TeamMembersResponse
    {
        $today = CarbonImmutable::today($this->resolveTimezone(null))->toDateString();

        $members = $this->query->getMembers($user);

        $teamMembers = $members->map(function (User $member) use ($today) {
            $attendance = $this->query->getTodayAttendance($member->id, $today);

            // 休憩判定のために breaks をロードする
            $attendance?->load('breaks');

            $status = $this->resolver->resolveStatus($attendance);

            return $this->factory->createMember($member, $status, $attendance);
        })->all();

        return $this->factory->createResponse($teamMembers);
    }
}
