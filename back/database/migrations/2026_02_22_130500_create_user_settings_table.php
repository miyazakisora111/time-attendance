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
        Schema::create('user_settings', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('gen_random_uuid()'))
                  ->comment('ユーザー設定ID（UUID）');

            // ユーザーID（1ユーザー1設定）
            $table->foreignUuid('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('ユーザーID');

            $table->string('theme', 20)
                  ->default('light')
                  ->comment('テーマ設定（light / dark など）');

            $table->string('language', 10)
                  ->default('ja')
                  ->comment('言語設定（ISOコード）');

            $table->timestampsTz();

            $table->unique('user_id', 'uniq_user_settings_user_id');
        });

        DB::statement("COMMENT ON TABLE user_settings IS 'ユーザー個別設定'");
    }

    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};