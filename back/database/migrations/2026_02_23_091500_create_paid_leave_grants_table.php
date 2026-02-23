<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 有給付与テーブルの作成
        Schema::create('paid_leave_grants', function (Blueprint $table) {
            
            $table->uuid('id')->primary();

             // ユーザーID(外部キー)
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();

            $table->integer('days'); // 付与された有給の日数
            $table->date('granted_at'); // 付与日

            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paid_leave_grants');
    }
};