<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ユーザー設定テーブルの作成
        Schema::create('user_settings', function (Blueprint $table) {

            $table->uuid('id')->primary();

            $table->foreignUuid('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->string('theme', 10)->default('light'); // テーマ設定
            $table->string('language', 10)->default('ja'); // 言語設定

            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};