<?php

declare(strict_types=1);

namespace App\Application\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * 全サービスの基底クラス。
 *
 * ログ出力・トランザクション管理・共通ユーティリティを提供する。
 * 個別サービスは本クラスを継承し、ビジネスロジックのみに集中する。
 */
abstract class BaseService
{
    /**
     * 情報ログを記録する。
     *
     * @param string $message ログメッセージ
     * @param array<string, mixed> $context 追加コンテキスト情報
     */
    protected function log(string $message, array $context = []): void
    {
        Log::info($message, $context);
    }

    /**
     * 警告ログを記録する。
     *
     * @param string $message ログメッセージ
     * @param array<string, mixed> $context 追加コンテキスト情報
     */
    protected function logWarning(string $message, array $context = []): void
    {
        Log::warning($message, $context);
    }

    /**
     * エラーログを記録する。
     *
     * @param string $message ログメッセージ
     * @param array<string, mixed> $context 追加コンテキスト情報
     */
    protected function logError(string $message, array $context = []): void
    {
        Log::error($message, $context);
    }

    /**
     * トランザクション内でコールバックを実行する。
     *
     * @template T
     * @param callable(): T $callback
     * @return T
     *
     * @throws \Throwable コールバック内で発生した例外はそのまま再送出する
     */
    protected function transaction(callable $callback): mixed
    {
        try {
            $result = DB::transaction($callback);

            $this->log('Transaction committed', [
                'service' => static::class,
            ]);

            return $result;
        } catch (\Throwable $e) {
            $this->logError('Transaction failed', [
                'service' => static::class,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * タイムゾーン文字列を解決する。
     *
     * null や空文字が渡された場合は DEFAULT_TIMEZONE を返す。
     *
     * @param string|null $timezone タイムゾーン候補
     * @return string 有効なタイムゾーン文字列
     */
    protected function resolveTimezone(?string $timezone): string
    {
        return (is_string($timezone) && $timezone !== '') ? $timezone : static::DEFAULT_TIMEZONE;
    }

    /**
     * Carbon 日付から日本語曜日（1文字）を返す。
     *
     * @param Carbon $date 対象日付
     * @return string 「日」〜「土」
     */
    protected function weekdayJa(Carbon $date): string
    {
        return ['日', '月', '火', '水', '木', '金', '土'][$date->dayOfWeek];
    }

    /**
     * 勤務時間（時間単位）を算出する。
     *
     * worked_minutes が記録済みならそれを優先し、
     * 未記録なら出勤・退勤時刻の差分から計算する。
     *
     * @param mixed $startAt 出勤日時（Carbon / string / null）
     * @param mixed $endAt 退勤日時（Carbon / string / null）
     * @param int|null $workedMinutes 記録済み実働分数
     * @param Carbon|null $fallbackEndTime 退勤未打刻時の代替終了時刻
     * @return float|null 勤務時間（時間）。算出不能の場合は null
     */
    protected function calculateWorkHours(
        mixed $startAt,
        mixed $endAt,
        ?int $workedMinutes = null,
        ?Carbon $fallbackEndTime = null,
    ): ?float {
        if ($workedMinutes !== null) {
            return round($workedMinutes / 60, 1);
        }

        if ($startAt === null) {
            return null;
        }

        $start = Carbon::parse((string) $startAt);
        $end = $endAt !== null
            ? Carbon::parse((string) $endAt)
            : $fallbackEndTime;

        if ($end === null || $end->lt($start)) {
            return null;
        }

        return round($end->diffInMinutes($start) / 60, 1);
    }
}
