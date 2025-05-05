<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Rules\Password;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Handle user login via session-based auth (Laravel Sanctum).
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Attempt login using email & password
        if (!Auth::attempt($request->only('email', 'password'))) {
            return ResponseFormatter::error('Email atau password salah', 401);
        }

        // Regenerate session to prevent session fixation
        $request->session()->regenerate();

        $user = Auth::user();

        return ResponseFormatter::success([
            'user' => $user,
        ], 'Login berhasil');
    }

    /**
     * Handle user registration and automatic login.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', new Password],
        ]);

        // Create new user
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Auto-login after register
        Auth::login($user);
        $request->session()->regenerate();

        return ResponseFormatter::success([
            'user' => $user,
        ], 'Registrasi berhasil dan login otomatis');
    }

    /**
     * Logout user and invalidate session.
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return ResponseFormatter::success(null, 'Logout berhasil');
    }

    /**
     * Get current authenticated user data.
     */
    public function fetch(Request $request)
    {
        return ResponseFormatter::success($request->user(), 'Data user berhasil diambil');
    }

    /**
     * Get all users (for admin use).
     */
    public function all()
    {
        $users = User::all();
        return ResponseFormatter::success($users, 'Semua user berhasil diambil');
    }
}
