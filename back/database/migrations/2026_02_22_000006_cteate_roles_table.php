<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 役職テーブルの作成
        Schema::create('roles', function (Blueprint $table) {

            $table->uuid('id')->primary();  
             
            $table->string('name', 50); // 役職名（例：部長・課長・一般社員）
            $table->unsignedInteger('sort_order')->default(0); // 並び順
            $table->string('status', 20)->default('active'); // 状態（例: active, inactive）

            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};