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
        Schema::create('users', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->comment('ユーザーID（UUID）');

            // 部署ID
            $table->foreignUuid('department_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete()
                  ->comment('部署ID');

            // 役職ID
            $table->foreignUuid('role_id')
                  ->nullable()
                  ->constrained('roles')
                  ->nullOnDelete()
                  ->comment('役職ID');

            // 基本情報
            $table->string('name', 100)
                  ->comment('氏名');

            $table->unsignedInteger('sort_order')
                  ->default(0)
                  ->comment('表示順');

            $table->string('email', 255)
                  ->comment('メールアドレス');

            $table->string('password')
                  ->comment('パスワード');

            $table->smallInteger('status')
                  ->default(1)
                  ->comment('状態（1:有効 / 0:無効）');

            // ログイン情報
            $table->timestampTz('email_verified_at')
                  ->nullable()
                  ->comment('メール認証日時');

            $table->timestampTz('last_login_at')
                  ->nullable()
                  ->comment('最終ログイン日時');

            $table->rememberToken();

            // 管理カラム
            $table->timestampsTz();
            $table->softDeletesTz();

            // 通常インデックス
            $table->index('department_id', 'idx_users_department_id');
            $table->index('role_id', 'idx_users_role_id');
        });

        // 複合ユニークインデックス（メールアドレスは論理削除されていないレコードで一意）
        DB::statement("
            CREATE UNIQUE INDEX uniq_users_email_active
            ON users (email)
            WHERE deleted_at IS NULL
        ");

        // テーブルコメント
        DB::statement("COMMENT ON TABLE users IS 'ユーザーマスタ'");
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};