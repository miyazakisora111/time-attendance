<?php

namespace App\Services;

use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Attendance;
use App\Services\BaseService;

class AttendanceService extends BaseService
{
    public function clockIn(User $user): array
    {
        return $this->transaction(function () use ($user) {

            $today = Carbon::today();

            $attendance = Attendance::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'work_date' => $today,
                ],
                [
                    'id' => (string) Str::uuid(),
                    'start_time' => now(),
                ]
            );

            if ($attendance->start_time) {
                throw new \DomainException('既に出勤済みです');
            }

            $attendance->update([
                'start_time' => now(),
            ]);

            return $attendance->fresh()->toArray();
        });
    }

    public function clockOut(User $user): array
    {
        return $this->transaction(function () use ($user) {

            $attendance = Attendance::where('user_id', $user->id)
                ->where('work_date', today())
                ->first();

            if (!$attendance || !$attendance->start_time) {
                throw new \DomainException('出勤していません');
            }

            if ($attendance->end_time) {
                throw new \DomainException('既に退勤済みです');
            }

            $attendance->update([
                'end_time' => now(),
            ]);

            return $attendance->fresh()->toArray();
        });
    }

    public function getToday(User $user): array
    {
        return Attendance::where('user_id', $user->id)
            ->where('work_date', today())
            ->first()
            ?->toArray() ?? [];
    }
}
