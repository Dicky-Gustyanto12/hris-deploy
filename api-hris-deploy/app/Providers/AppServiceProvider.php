<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // try {
        //     DB::connection()->getPDO();
        //     dump('Database is connected. Database Name is : ' . DB::connection()->getDatabaseName());
        //  } catch (Exception $e) {
        //     dump('Database connection failed');
        //  }
    }
}
