<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       // 勤怠テーブルの作成
        Schema::create('attendances', function (Blueprint $table) {
            
            $table->uuid('id')->primary();

             // ユーザーID（外部キー）
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();

            $table->date('work_date'); // 勤務日
            $table->time('start_time'); // 出勤時間
            $table->time('end_time')->nullable(); // 退勤時間

            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};