<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ユーザー通知設定テーブルの作成
        Schema::create('user_notification_settings', function (Blueprint $table) {

            $table->uuid('id')->primary();

            $table->foreignUuid('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->boolean('clock_in_reminder')->default(true); // 打刻忘れ通知
            $table->boolean('approval_notification')->default(true); // 申請承認通知
            $table->boolean('leave_reminder')->default(true); // 休暇リマインド

            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_notification_settings');
    }
};
