<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->comment('役職ID（UUID）');

            $table->string('name', 50)
                  ->comment('役職名（例：部長・課長・一般社員）');

            $table->unsignedInteger('sort_order')
                  ->default(0)
                  ->comment('表示順');

            $table->string('status', 20)
                  ->default('active')
                  ->comment('状態（active:有効 / inactive:無効）');

            $table->timestampsTz();   // 作成日時・更新日時（タイムゾーン付き）
            $table->softDeletesTz();  // 論理削除日時（タイムゾーン付き）
        });

        // テーブルコメント
        DB::statement("ALTER TABLE roles COMMENT = '役職マスタ'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};