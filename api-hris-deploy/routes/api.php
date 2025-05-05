<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CompanyController;
use App\Http\Controllers\API\TeamController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\ResponsibilityController;
use App\Http\Controllers\API\UserController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

// Proteksi semua route dengan Sanctum + Stateful middleware
Route::middleware([
    EnsureFrontendRequestsAreStateful::class,
    'auth:sanctum'
])->group(function () {

    // User
    Route::get('/user', [UserController::class, 'fetch']);
    Route::get('/users', [UserController::class, 'all']);

    // Company
    Route::post('/company', [CompanyController::class, 'create']);
    Route::post('/company/update/{id}', [CompanyController::class, 'update']);
    Route::get('/company', [CompanyController::class, 'fetch']);

    // Team
    Route::post('/team', [TeamController::class, 'create']);
    Route::post('/team/update/{id}', [TeamController::class, 'update']);
    Route::get('/team', [TeamController::class, 'fetch']);
    Route::delete('/team/{id}', [TeamController::class, 'destroy']);

    // Role
    Route::post('/role', [RoleController::class, 'create']);
    Route::post('/role/update/{id}', [RoleController::class, 'update']);
    Route::get('/role', [RoleController::class, 'fetch']);
    Route::delete('/role/{id}', [RoleController::class, 'delete']);

    // Responsibility
    Route::post('/responsibility', [ResponsibilityController::class, 'create']);
    Route::post('/responsibility/update/{id}', [ResponsibilityController::class, 'update']);
    Route::get('/responsibility', [ResponsibilityController::class, 'fetch']);
    Route::delete('/responsibility/{id}', [ResponsibilityController::class, 'delete']);

    // Employee
    Route::post('/employee', [EmployeeController::class, 'create']);
    Route::post('/employee/update/{id}', [EmployeeController::class, 'update']);
    Route::get('/employee', [EmployeeController::class, 'fetch']);
    Route::delete('/employee/{id}', [EmployeeController::class, 'delete']);
});
