<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 祝日テーブルの作成
        Schema::create('holidays', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->date('holiday_date'); // 祝日の日付
            $table->string('name', 50); // 祝日名（例：元日、建国記念の日、天皇誕生日など）

            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('holidays');
    }
};