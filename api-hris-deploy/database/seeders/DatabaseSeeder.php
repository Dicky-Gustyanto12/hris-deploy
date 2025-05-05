<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use App\Models\Team;
use App\Models\Role;
use App\Models\Responsibility;
use App\Models\Employee;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);


        // Company::factory(10)->create();

        // Team::factory(30)->create();

        // Role::factory(10)->create();

        // Responsibility::factory(40)->create();

        Employee::factory(1000)->create();
    }
}
