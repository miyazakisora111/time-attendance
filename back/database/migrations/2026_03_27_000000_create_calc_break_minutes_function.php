<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

return new class extends Migration
{
    public function up(): void
    {
        $sql = File::get(database_path('functions/calc_break_minutes.sql'));
        DB::unprepared($sql);
    }

    public function down(): void
    {
        DB::unprepared('DROP FUNCTION IF EXISTS calc_break_minutes');
    }
};
