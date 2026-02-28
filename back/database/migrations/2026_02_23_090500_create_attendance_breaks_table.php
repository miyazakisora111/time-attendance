<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendance_breaks', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('gen_random_uuid()'))
                  ->comment('休憩ID（UUID）');

            // 勤怠ID（外部キー）
            $table->foreignUuid('attendance_id')
                  ->constrained('attendances')
                  ->cascadeOnDelete()
                  ->comment('勤怠ID');

            $table->time('break_start')
                  ->comment('休憩開始時間');

            $table->time('break_end')
                  ->nullable()
                  ->comment('休憩終了時間');

            $table->timestampsTz();
            $table->softDeletesTz();

            // 検索用
            $table->index('attendance_id', 'idx_breaks_attendance_id');
        });

        // 🔥 休憩終了は開始以降であることを保証
        DB::statement("
            ALTER TABLE attendance_breaks
            ADD CONSTRAINT chk_break_time_order
            CHECK (
                break_end IS NULL OR break_end >= break_start
            )
        ");

        DB::statement("COMMENT ON TABLE attendance_breaks IS '勤怠休憩時間'");
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_breaks');
    }
};