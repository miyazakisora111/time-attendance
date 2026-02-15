<?php

declare(strict_types=1);

namespace App\Services;

use Carbon\Carbon;
use App\Services\BaseService;

/**
 * カレンダーのサービスクラス
 */
class CalendarService extends BaseService
{
    /**
     * 指定された年月に含まれる日付一覧を取得する。
     * 
     * @param int $year 対象年
     * @param int $month 対象月
     *
     * @return array<int, string> YYYY-MM-DD形式の日付配列
     */
    public function getDates(int $year, int $month): array
    {
        // 開始と終了を生成する。
        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();

        // 日付配列を作成する。
        $dates = [];
        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $dates[] = $date->toDateString();
        }

        return $dates;
    }
}
