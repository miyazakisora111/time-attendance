<?php

namespace App\Policies;

use App\Models\Attendance;

final class AttendanceActionPolicy
{
    public function assertCanClockOut(Attendance $attendance): void
    {
        match ($this->resolver->resolve($attendance)) {
            ClockStatus::IN    => null,
            ClockStatus::BREAK => throw new DomainException(...),
            ClockStatus::OUT   => throw new DomainException(...),
        };
    }

    public function assertCanBreakStart(Attendance $attendance): void
    {
        match ($this->resolver->resolve($attendance)) {
            ClockStatus::IN    => null,
            ClockStatus::BREAK => throw new DomainException(...),
            ClockStatus::OUT   => throw new DomainException(...),
        };
    }
}
