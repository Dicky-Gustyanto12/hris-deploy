<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Rute yang mendukung session, CSRF, dan frontend Blade/SPA (React/Vite)
|--------------------------------------------------------------------------
*/

// Halaman awal (Blade atau bisa diarahkan ke SPA)
Route::get('/', function () {
    return view('welcome');
});

// Rute dashboard setelah login
Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});

// Auth routes - wajib di web.php untuk CSRF dan Sanctum
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/register', [UserController::class, 'register']);
