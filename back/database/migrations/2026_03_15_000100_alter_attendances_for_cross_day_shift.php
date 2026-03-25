<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table): void {
            $table->timestampTz('clock_in_at')->nullable()->comment('出勤日時(タイムゾーン付き)');
            $table->timestampTz('clock_out_at')->nullable()->after('clock_in_at')->comment('退勤日時(タイムゾーン付き)');
            $table->string('work_timezone', 64)->default('Asia/Tokyo')->after('clock_out_at')->comment('勤務タイムゾーン(IANA)');
            $table->unsignedInteger('break_minutes')->default(0)->after('work_timezone')->comment('休憩分数');
            $table->unsignedInteger('worked_minutes')->nullable()->after('break_minutes')->comment('実働分数');
            $table->text('note')->nullable()->after('worked_minutes')->comment('備考');
        });

        DB::statement("ALTER TABLE attendances DROP CONSTRAINT IF EXISTS chk_attendances_time_order");
        DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_clock_range CHECK (clock_in_at IS NULL OR clock_out_at IS NULL OR clock_out_at > clock_in_at)");
        DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_break_minutes_non_negative CHECK (break_minutes >= 0)");
        DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_worked_minutes_non_negative CHECK (worked_minutes IS NULL OR worked_minutes >= 0)");
        DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_timezone_not_blank CHECK (length(trim(work_timezone)) > 0)");

        DB::statement("CREATE INDEX idx_attendances_user_clock_in_at ON attendances (user_id, clock_in_at)");
        DB::statement("CREATE INDEX idx_attendances_clock_out_at ON attendances (clock_out_at)");
    }

    public function down(): void
    {
        DB::statement("DROP INDEX IF EXISTS idx_attendances_user_clock_in_at");
        DB::statement("DROP INDEX IF EXISTS idx_attendances_clock_out_at");

        DB::statement("ALTER TABLE attendances DROP CONSTRAINT IF EXISTS chk_attendances_clock_range");
        DB::statement("ALTER TABLE attendances DROP CONSTRAINT IF EXISTS chk_attendances_break_minutes_non_negative");
        DB::statement("ALTER TABLE attendances DROP CONSTRAINT IF EXISTS chk_attendances_worked_minutes_non_negative");
        DB::statement("ALTER TABLE attendances DROP CONSTRAINT IF EXISTS chk_attendances_timezone_not_blank");
        DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_time_order CHECK (clock_out_at IS NULL OR clock_in_at IS NULL OR clock_out_at >= clock_in_at)");

        Schema::table('attendances', function (Blueprint $table): void {
            $table->dropColumn([
                'clock_in_at',
                'clock_out_at',
                'work_timezone',
                'break_minutes',
                'worked_minutes',
                'note',
            ]);
        });
    }
};
