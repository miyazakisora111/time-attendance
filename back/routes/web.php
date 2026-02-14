<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['message' => 'Welcome to Time Attendance API'];
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
