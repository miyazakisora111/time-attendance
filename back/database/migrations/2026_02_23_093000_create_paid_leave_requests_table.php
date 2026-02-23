<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 有給休暇申請テーブルの作成
        Schema::create('paid_leave_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();

             // ユーザーID(外部キー)
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            
            $table->date('leave_date'); // 休暇日
            $table->string('status', 20)->default('pending'); // 申請のステータス（例: pending, approved, rejected）

            $table->timestampsTz();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('paid_leave_requests');
    }
};