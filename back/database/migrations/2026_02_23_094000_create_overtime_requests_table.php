<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('overtime_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // ユーザーに紐づけ
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();

            // 申請日・残業時間
            $table->date('work_date'); // 残業する日の勤務日
            $table->time('start_time'); // 残業開始時間
            $table->time('end_time'); // 残業終了時間
            $table->decimal('hours', 4, 2); // 残業時間（例：1.5時間）

            // ステータス
            $table->enum('status', ['pending', 'approved', 'returned', 'canceled'])
                ->default('pending');

            $table->timestampsTz();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('overtime_requests');
    }
};