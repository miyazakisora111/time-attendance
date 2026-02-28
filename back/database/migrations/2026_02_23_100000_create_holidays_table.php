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
        Schema::create('holidays', function (Blueprint $table) {

            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('gen_random_uuid()'));

            $table->date('holiday_date')
                  ->comment('祝日の日付');

            $table->string('name', 50)
                  ->comment('祝日名');

            $table->timestampsTz();

            $table->unique('holiday_date', 'uq_holidays_date');
        });

        DB::statement("COMMENT ON TABLE holidays IS '祝日マスタ'");
    }

    public function down(): void
    {
        Schema::dropIfExists('holidays');
    }
};