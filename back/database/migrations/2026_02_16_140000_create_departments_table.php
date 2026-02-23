<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 部署テーブルの作成
        Schema::create('departments', function (Blueprint $table) {

            $table->uuid('id')->primary();
            
            $table->string('name', 100); // 部署名
            $table->unsignedInteger('sort_order')->default(0); // 並び順

            $table->timestamps();
            $table->softDeletes();

            $table->index('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
