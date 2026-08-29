<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FotoController;
use App\Http\Controllers\Api\ViajeController;
use Illuminate\Support\Facades\Route;

Route::post('/registro', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('viajes', ViajeController::class);
    Route::get('/fotos', [FotoController::class, 'search']);
});
