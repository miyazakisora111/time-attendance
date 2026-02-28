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
        Schema::create('paid_leave_grants', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('gen_random_uuid()'))
                  ->comment('有給付与ID（UUID）');

            // ユーザーID
            $table->foreignUuid('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('ユーザーID');

            $table->numeric('days', 4, 2)
                  ->comment('付与日数（例: 10.5日）');

            $table->date('granted_at')
                  ->comment('付与日');

            $table->date('expires_at')
                  ->nullable()
                  ->comment('有効期限');

            $table->timestampsTz();

            // 検索用
            $table->index('user_id', 'idx_paid_leave_grants_user_id');
            $table->index('granted_at', 'idx_paid_leave_grants_granted_at');
        });

        // 日数は正の値のみ
        DB::statement("
            ALTER TABLE paid_leave_grants
            ADD CONSTRAINT chk_paid_leave_days_positive
            CHECK (days > 0)
        ");

        DB::statement("COMMENT ON TABLE paid_leave_grants IS '有給付与履歴'");
    }

    public function down(): void
    {
        Schema::dropIfExists('paid_leave_grants');
    }
};