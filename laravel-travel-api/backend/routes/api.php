<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FotoController;
use App\Http\Controllers\Api\ViajeController;
use Illuminate\Support\Facades\Route;

Route::post('/registro', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('client')->get('/client/status', function () {
    return response()->json([
        'message' => 'Cliente OAuth autenticado correctamente.',
    ]);
});

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/viajes', [ViajeController::class, 'index'])
        ->middleware('scope:viajes.read');
    Route::get('/viajes/{viaje}', [ViajeController::class, 'show'])
        ->middleware('scope:viajes.read');
    Route::post('/viajes', [ViajeController::class, 'store'])
        ->middleware('scope:viajes.write');
    Route::match(['put', 'patch'], '/viajes/{viaje}', [ViajeController::class, 'update'])
        ->middleware('scope:viajes.write');
    Route::delete('/viajes/{viaje}', [ViajeController::class, 'destroy'])
        ->middleware('scopes:viajes.delete,admin');

    Route::get('/fotos', [FotoController::class, 'search'])
        ->middleware('scopes:fotos.read,admin');

    if (app()->isLocal()) {
        Route::get('/token-info', [AuthController::class, 'tokenInfo']);
    }
});
