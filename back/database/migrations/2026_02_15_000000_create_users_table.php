<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            // UUID 主キー
            $table->uuid('id')->primary();

            // 基本情報
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('department')->nullable();
            $table->string('position')->nullable();

            // 勤怠アプリ用ステータス
            $table->enum('status', ['active', 'inactive', 'suspended', 'deleted'])->default('active');

            // ログイン関連
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();

            // Laravel timestamps / soft deletes
            $table->softDeletes();
            $table->timestamps();

            // 検索用インデックス
            $table->index('email');
            $table->index('status');
            $table->index('department');
            $table->index('position');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
