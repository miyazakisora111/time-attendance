<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       // 休憩時間テーブルの作成
        Schema::create('attendance_breaks', function (Blueprint $table) {
            $table->uuid('id')->primary();

             // 勤怠ID(外部キー)
            $table->foreignUuid('attendance_id')->constrained('attendances')->cascadeOnDelete();
            
            $table->time('break_start'); // 休憩開始時間
            $table->time('break_end')->nullable(); // 休憩終了時間

            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_breaks');
    }
};