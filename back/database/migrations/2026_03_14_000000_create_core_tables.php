<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('役職ID');
            $table->string('name', 50)->comment('役職名');
            $table->unsignedInteger('sort_order')->default(0)->comment('表示順');
            $table->string('status', 20)->default('active')->comment('状態（active / inactive）');
            $table->timestampsTz();
            $table->softDeletesTz();
            $table->index('name', 'idx_roles_name');
            $table->index('sort_order', 'idx_roles_sort_order');
        });

        Schema::create('departments', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('部署ID');
            $table->string('name', 100)->comment('部署名');
            $table->unsignedInteger('sort_order')->default(0)->comment('表示順');
            $table->timestampsTz();
            $table->softDeletesTz();
            $table->index('name', 'idx_departments_name');
            $table->index('sort_order', 'idx_departments_sort_order');
        });

        Schema::create('users', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('ユーザーID');
            $table->foreignUuid('department_id')->nullable()->constrained('departments')->nullOnDelete()->comment('部署ID');
            $table->foreignUuid('role_id')->nullable()->constrained('roles')->nullOnDelete()->comment('役職ID');
            $table->string('name', 100)->comment('氏名');
            $table->unsignedInteger('sort_order')->default(0)->comment('表示順');
            $table->string('email', 255)->comment('メールアドレス');
            $table->string('password')->comment('パスワードハッシュ');
            $table->smallInteger('status')->default(1)->comment('状態（1:有効 / 0:無効）');
            $table->timestampTz('email_verified_at')->nullable()->comment('メール認証日時');
            $table->timestampTz('last_login_at')->nullable()->comment('最終ログイン日時');
            $table->rememberToken();
            $table->timestampsTz();
            $table->softDeletesTz();
            $table->index('department_id', 'idx_users_department_id');
            $table->index('role_id', 'idx_users_role_id');
            $table->index('sort_order', 'idx_users_sort_order');
        });

        Schema::create('login_histories', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('ログイン履歴ID');
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete()->comment('ユーザーID');
            $table->ipAddress('ip_address')->nullable()->comment('IPアドレス');
            $table->text('user_agent')->nullable()->comment('ユーザーエージェント');
            $table->timestampTz('logged_in_at')->comment('ログイン日時');
            $table->timestampTz('logged_out_at')->nullable()->comment('ログアウト日時');
            $table->timestampsTz();
            $table->index('user_id', 'idx_login_histories_user_id');
            $table->index('logged_in_at', 'idx_login_histories_logged_in_at');
        });

        Schema::create('user_notification_settings', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('ユーザー通知設定ID');
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete()->comment('ユーザーID');
            $table->boolean('clock_in_reminder')->default(true)->comment('打刻忘れ通知');
            $table->boolean('leave_reminder')->default(true)->comment('休暇リマインド通知');
            $table->timestampsTz();
            $table->unique('user_id', 'uq_user_notification_settings_user_id');
        });

        Schema::create('user_settings', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('ユーザー設定ID');
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete()->comment('ユーザーID');
            $table->string('theme', 20)->default('light')->comment('テーマ設定');
            $table->string('language', 10)->default('ja')->comment('言語設定');
            $table->timestampsTz();
            $table->unique('user_id', 'uq_user_settings_user_id');
        });

        Schema::create('attendances', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('勤怠ID');
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete()->comment('ユーザーID');
            $table->date('work_date')->comment('勤務日');
            $table->time('start_time')->nullable()->comment('出勤時刻');
            $table->time('end_time')->nullable()->comment('退勤時刻');
            $table->timestampsTz();
            $table->softDeletesTz();
            $table->index('user_id', 'idx_attendances_user_id');
            $table->index('work_date', 'idx_attendances_work_date');
        });

        Schema::create('attendance_breaks', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('休憩ID');
            $table->foreignUuid('attendance_id')->constrained('attendances')->cascadeOnDelete()->comment('勤怠ID');
            $table->time('break_start')->comment('休憩開始時刻');
            $table->time('break_end')->nullable()->comment('休憩終了時刻');
            $table->timestampsTz();
            $table->softDeletesTz();
            $table->index('attendance_id', 'idx_attendance_breaks_attendance_id');
        });

        Schema::create('paid_leave_grants', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('有給付与ID');
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete()->comment('ユーザーID');
            $table->decimal('days', 4, 2)->comment('付与日数');
            $table->date('granted_at')->comment('付与日');
            $table->date('expires_at')->nullable()->comment('有効期限');
            $table->timestampsTz();
            $table->index('user_id', 'idx_paid_leave_grants_user_id');
            $table->index('granted_at', 'idx_paid_leave_grants_granted_at');
        });

        Schema::create('holidays', function (Blueprint $table): void {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'))->comment('祝日ID');
            $table->date('holiday_date')->comment('祝日の日付');
            $table->string('name', 50)->comment('祝日名');
            $table->timestampsTz();
            $table->unique('holiday_date', 'uq_holidays_holiday_date');
        });

        DB::statement("COMMENT ON TABLE roles IS '役職マスタ'");
        DB::statement("COMMENT ON TABLE departments IS '部署マスタ'");
        DB::statement("COMMENT ON TABLE users IS 'ユーザーマスタ'");
        DB::statement("COMMENT ON TABLE login_histories IS 'ログイン履歴'");
        DB::statement("COMMENT ON TABLE user_notification_settings IS 'ユーザー通知設定'");
        DB::statement("COMMENT ON TABLE user_settings IS 'ユーザー個別設定'");
        DB::statement("COMMENT ON TABLE attendances IS '勤怠'");
        DB::statement("COMMENT ON TABLE attendance_breaks IS '勤怠休憩'");
        DB::statement("COMMENT ON TABLE paid_leave_grants IS '有給付与履歴'");

        DB::statement("COMMENT ON TABLE holidays IS '祝日マスタ'");

        DB::statement("ALTER TABLE roles ADD CONSTRAINT chk_roles_status CHECK (status IN ('active', 'inactive'))");
        DB::statement("ALTER TABLE users ADD CONSTRAINT chk_users_status CHECK (status IN (0, 1))");
        DB::statement("ALTER TABLE user_settings ADD CONSTRAINT chk_user_settings_theme CHECK (theme IN ('light', 'dark'))");
        DB::statement("ALTER TABLE user_settings ADD CONSTRAINT chk_user_settings_language CHECK (language IN ('ja', 'en'))");
        DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_time_order CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)");
        DB::statement("ALTER TABLE attendance_breaks ADD CONSTRAINT chk_attendance_breaks_time_order CHECK (break_end IS NULL OR break_end >= break_start)");
        DB::statement("ALTER TABLE paid_leave_grants ADD CONSTRAINT chk_paid_leave_grants_days_positive CHECK (days > 0)");

        DB::statement("CREATE UNIQUE INDEX uq_users_email_active ON users (email) WHERE deleted_at IS NULL");
        DB::statement("CREATE UNIQUE INDEX uq_attendances_user_work_date_active ON attendances (user_id, work_date) WHERE deleted_at IS NULL");
    }

    public function down(): void
    {
        Schema::dropIfExists('holidays');
        Schema::dropIfExists('paid_leave_grants');
        Schema::dropIfExists('attendance_breaks');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('user_settings');
        Schema::dropIfExists('user_notification_settings');
        Schema::dropIfExists('login_histories');
        Schema::dropIfExists('users');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('roles');
    }
};
