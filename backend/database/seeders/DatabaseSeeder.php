<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Membuat Admin Utama
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@nusantara.id',
            'password' => bcrypt('nusantara2025'),
            'role' => 'admin',
        ]);

        // Menjalankan seeder kuliner
        $this->call([
            CulinarySeeder::class,
        ]);
    }
}