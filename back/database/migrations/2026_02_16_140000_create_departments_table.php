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
        Schema::create('departments', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->comment('部署ID（UUID）');

            $table->string('name', 100)
                  ->comment('部署名');

            $table->unsignedInteger('sort_order')
                  ->default(0)
                  ->comment('表示順');

            $table->timestampsTz();   // 作成日時・更新日時（タイムゾーン付き）
            $table->softDeletesTz();  // 論理削除日時（タイムゾーン付き）

            $table->index('name', 'idx_departments_name');
        });

        // テーブルコメント
        DB::statement("COMMENT ON TABLE departments IS '部署マスタ'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};