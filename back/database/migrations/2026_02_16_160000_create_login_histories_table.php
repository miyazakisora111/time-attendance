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
        Schema::create('login_histories', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('gen_random_uuid()'))
                  ->comment('ログイン履歴ID（UUID）');

            // ユーザーID（外部キー）
            $table->foreignUuid('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('ユーザーID');

            $table->ipAddress('ip_address')
                  ->nullable()
                  ->comment('IPアドレス');

            $table->text('user_agent')
                  ->nullable()
                  ->comment('ユーザーエージェント');

            $table->timestampTz('logged_in_at')
                  ->comment('ログイン日時');

            $table->timestampTz('logged_out_at')
                  ->nullable()
                  ->comment('ログアウト日時');

            $table->timestampsTz();

            // インデックス
            $table->index('user_id', 'idx_login_histories_user_id');
            $table->index('logged_in_at', 'idx_login_histories_logged_in_at');
        });

        // テーブルコメント
        DB::statement("COMMENT ON TABLE login_histories IS 'ログイン履歴'");
    }

    public function down(): void
    {
        Schema::dropIfExists('login_histories');
    }
};