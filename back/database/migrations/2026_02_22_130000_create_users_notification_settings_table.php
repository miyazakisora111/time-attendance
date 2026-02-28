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
        Schema::create('user_notification_settings', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('gen_random_uuid()'))
                  ->comment('ユーザー通知設定ID（UUID）');

            // ユーザーID（1ユーザー1設定）
            $table->foreignUuid('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('ユーザーID');

            $table->boolean('clock_in_reminder')
                  ->default(true)
                  ->comment('打刻忘れ通知フラグ');

            $table->boolean('approval_notification')
                  ->default(true)
                  ->comment('申請承認通知フラグ');

            $table->boolean('leave_reminder')
                  ->default(true)
                  ->comment('休暇リマインド通知フラグ');

            $table->timestampsTz();

            $table->unique('user_id', 'uniq_user_notification_settings_user_id');
        });

        DB::statement("COMMENT ON TABLE user_notification_settings IS 'ユーザー通知設定'");
    }

    public function down(): void
    {
        Schema::dropIfExists('user_notification_settings');
    }
};