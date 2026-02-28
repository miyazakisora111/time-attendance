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
        Schema::create('overtime_requests', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('gen_random_uuid()'))
                  ->comment('残業申請ID');

            // ユーザー
            $table->foreignUuid('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('ユーザーID');

            $table->date('work_date')
                  ->comment('対象勤務日');

            $table->time('start_time')
                  ->comment('残業開始時間');

            $table->time('end_time')
                  ->comment('残業終了時間');

            $table->string('status', 20)
                  ->default('pending')
                  ->comment('申請ステータス');

            $table->text('reason')
                  ->nullable()
                  ->comment('申請理由');

            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index(['user_id', 'work_date'], 'idx_overtime_user_date');
        });

        // 終了は開始より後
        DB::statement("
            ALTER TABLE overtime_requests
            ADD CONSTRAINT chk_overtime_time_order
            CHECK (end_time > start_time)
        ");

        DB::statement("
            ALTER TABLE overtime_requests
            ADD CONSTRAINT chk_overtime_status
            CHECK (status IN ('pending', 'approved', 'returned', 'canceled'))
        ");

        DB::statement("COMMENT ON TABLE overtime_requests IS '残業申請'");
    }

    public function down(): void
    {
        Schema::dropIfExists('overtime_requests');
    }
};