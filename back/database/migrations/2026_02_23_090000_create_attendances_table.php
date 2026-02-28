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
        Schema::create('attendances', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('gen_random_uuid()'))
                  ->comment('勤怠ID（UUID）');

            // ユーザーID（外部キー）
            $table->foreignUuid('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('ユーザーID');

            $table->date('work_date')
                  ->comment('勤務日');

            $table->time('start_time')
                  ->nullable()
                  ->comment('出勤時間');

            $table->time('end_time')
                  ->nullable()
                  ->comment('退勤時間');

            $table->timestampsTz();
            $table->softDeletesTz();

            // 1日1レコード
            $table->index('user_id', 'idx_attendances_user_id');
            $table->index('work_date', 'idx_attendances_work_date');
        });

        // 部分ユニークインデックス
        DB::statement("
            CREATE UNIQUE INDEX uniq_attendances_user_work_date_active
            ON attendances (user_id, work_date)
            WHERE deleted_at IS NULL
        ");

        // 勤務時間整合性チェック
        DB::statement("
            ALTER TABLE attendances
            ADD CONSTRAINT chk_attendance_time_order
            CHECK (
                end_time IS NULL OR start_time IS NULL OR end_time >= start_time
            )
        ");

        DB::statement("COMMENT ON TABLE attendances IS '勤怠'");
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};