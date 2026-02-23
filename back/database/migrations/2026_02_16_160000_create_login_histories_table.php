<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('login_histories', function (Blueprint $table) {

            $table->uuid('id')->primary();

             // ユーザーID(外部キー)
            $table->foreignUuid('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
                
            $table->string('ip_address', 45)->nullable(); // IPアドレス（IPv6対応）
            $table->text('user_agent')->nullable(); // ユーザーエージェント
            $table->timestampTz('logged_in_at'); // ログイン日時
            $table->timestampTz('logged_out_at')->nullable(); // ログアウト日時
            $table->timestamps();

            // インデックス
            $table->index('user_id');
            $table->index('logged_in_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login_histories');
    }
};
