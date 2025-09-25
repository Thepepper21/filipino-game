<?php

use App\Http\Controllers\ScoreController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Game Score API Routes
Route::prefix('score')->group(function () {
    Route::post('/', [ScoreController::class, 'store'])->name('score.store');
    Route::get('/high', [ScoreController::class, 'getHighScore'])->name('score.high');
    Route::get('/leaderboard', [ScoreController::class, 'getLeaderboard'])->name('score.leaderboard');
});
