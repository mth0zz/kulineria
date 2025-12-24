<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CulinaryController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API ROUTES - KULINER NUSANTARA
|--------------------------------------------------------------------------
*/

/* --- 1. PUBLIC ROUTES (Tanpa Token) --- */
Route::post('/register/visitor', [AuthController::class, 'registerVisitor']);
Route::post('/register/umkm', [AuthController::class, 'registerUmkm']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/culinaries', [CulinaryController::class, 'index']);
Route::get('/culinaries/{id}', [CulinaryController::class, 'show']);
Route::get('/reviews/{culinary_id}', [ReviewController::class, 'index']);


/* --- 2. PROTECTED ROUTES (Wajib Token) --- */
Route::middleware('auth:sanctum')->group(function () {
    
    // Management Profil & Session
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
    Route::post('/user/update', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Fitur Dashboard UMKM
    Route::get('/my-culinaries', [CulinaryController::class, 'myCulinaries']);
    Route::post('/culinaries', [CulinaryController::class, 'store']);
    Route::delete('/culinaries/{id}', [CulinaryController::class, 'destroy']);

    // Fitur Review (Visitor)
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Fitur Admin Panel
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
    Route::get('/admin/pending-umkm', [AuthController::class, 'getPendingUmkm']);
    Route::post('/admin/verify-umkm/{id}', [AuthController::class, 'verifyUmkm']);
    Route::get('/admin/culinaries', [CulinaryController::class, 'adminIndex']);
    Route::get('/admin/reviews', [ReviewController::class, 'adminIndex']);
    Route::post('/admin/reviews/{id}/status', [ReviewController::class, 'updateStatus']);

});