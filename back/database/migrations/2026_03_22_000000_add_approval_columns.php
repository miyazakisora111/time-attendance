<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * 承認ワークフロー修正:
 * - roles に level カラム追加（承認権限の階層判定用）
 * - paid_leave_requests / overtime_requests に approved_by, approved_at カラム追加
 */
return new class extends Migration
{
    public function up(): void
    {
        // roles に level カラム追加
        Schema::table('roles', function (Blueprint $table): void {
            $table->smallInteger('level')->default(1)->after('sort_order')->comment('役職レベル（数値が大きいほど上位）');
        });

        // paid_leave_requests に承認者・承認日時カラム追加
        Schema::table('paid_leave_requests', function (Blueprint $table): void {
            $table->foreignUuid('approved_by')->nullable()->after('status')->constrained('users')->nullOnDelete()->comment('承認者ID');
            $table->timestampTz('approved_at')->nullable()->after('approved_by')->comment('承認日時');
        });

        // paid_leave_requests の status CHECK 制約を更新（canceled を追加）
        DB::statement("ALTER TABLE paid_leave_requests DROP CONSTRAINT chk_paid_leave_requests_status");
        DB::statement("ALTER TABLE paid_leave_requests ADD CONSTRAINT chk_paid_leave_requests_status CHECK (status IN ('pending', 'approved', 'rejected', 'canceled'))");

        // overtime_requests に承認者・承認日時カラム追加
        Schema::table('overtime_requests', function (Blueprint $table): void {
            $table->foreignUuid('approved_by')->nullable()->after('status')->constrained('users')->nullOnDelete()->comment('承認者ID');
            $table->timestampTz('approved_at')->nullable()->after('approved_by')->comment('承認日時');
        });
    }

    public function down(): void
    {
        // paid_leave_requests の CHECK 制約を元に戻す
        DB::statement("ALTER TABLE paid_leave_requests DROP CONSTRAINT chk_paid_leave_requests_status");
        DB::statement("ALTER TABLE paid_leave_requests ADD CONSTRAINT chk_paid_leave_requests_status CHECK (status IN ('pending', 'approved', 'rejected'))");

        Schema::table('paid_leave_requests', function (Blueprint $table): void {
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['approved_by', 'approved_at']);
        });

        Schema::table('overtime_requests', function (Blueprint $table): void {
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['approved_by', 'approved_at']);
        });

        Schema::table('roles', function (Blueprint $table): void {
            $table->dropColumn('level');
        });
    }
};
