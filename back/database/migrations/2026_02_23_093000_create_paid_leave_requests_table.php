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
        Schema::create('paid_leave_requests', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('gen_random_uuid()'))
                  ->comment('有給申請ID');

            // ユーザー
            $table->foreignUuid('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('ユーザーID');

            $table->date('leave_date')
                  ->comment('休暇日');

            // 半休・時間単位対応
            $table->decimal('days', 4, 2)
                  ->default(1.00)
                  ->comment('取得日数（1, 0.5 など）');

            // PostgreSQLなら enum より check 制約がおすすめ
            $table->string('status', 20)
                  ->default('pending')
                  ->comment('申請ステータス');

            $table->text('reason')
                  ->nullable()
                  ->comment('申請理由');

            $table->timestampsTz();
            $table->softDeletesTz();

            // 1日1申請保証（論理削除考慮）
            $table->unique(
                ['user_id', 'leave_date'],
                'uq_paid_leave_requests_user_date'
            );
        });

        // ステータス制約
        DB::statement("
            ALTER TABLE paid_leave_requests
            ADD CONSTRAINT chk_paid_leave_status
            CHECK (status IN ('pending', 'approved', 'rejected'))
        ");

        DB::statement("
            ALTER TABLE paid_leave_requests
            ADD CONSTRAINT chk_paid_leave_days_positive
            CHECK (days > 0)
        ");

        DB::statement("COMMENT ON TABLE paid_leave_requests IS '有給休暇申請'");
    }

    public function down(): void
    {
        Schema::dropIfExists('paid_leave_requests');
    }
};