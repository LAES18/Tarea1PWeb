<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'demo@mail.com'],
            [
                'name' => 'Demo Traveler',
                'password' => Hash::make('password123'),
            ]
        );
    }
}
