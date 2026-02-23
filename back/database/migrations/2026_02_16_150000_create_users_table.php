<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ユーザーマスタの作成
        Schema::create('users', function (Blueprint $table) {

            $table->uuid('id')->primary();

            // 部署ID
            $table->foreignUuid('department_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            // 役職ID
            $table->foreignUuid('role_id')
                ->nullable()
                ->constrained('roles')
                ->nullOnDelete();
            
            // 基本情報
            $table->string('name', 100); // 氏名
            $table->unsignedInteger('sort_order')->default(0); // 並び順
            $table->string('email', 255)
                ->unique('email')
                ->whereNull('deleted_at'); // メールアドレス（ユニーク制約、論理削除は除外）
            $table->string('password'); // パスワード
            $table->string('status', 20)->default('active'); // 状態

            // ログイン情報
            $table->timestampTz('email_verified_at')->nullable(); // メールアドレス確認日時
            $table->timestampTz('last_login_at')->nullable(); // 最終ログイン日時
            $table->rememberToken();

             // 作成・更新・削除管理
            $table->timestampsTz();
            $table->softDeletesTz();

            // インデックス
            $table->index('department_id');
            $table->index('role_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
