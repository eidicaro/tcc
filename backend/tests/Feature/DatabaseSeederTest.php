<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_local_seeders_can_run_twice_without_duplicating_example_data(): void
    {
        $this->seed(DatabaseSeeder::class);

        $firstRun = [
            'users' => DB::table('users')->count(),
            'categories' => DB::table('categoria')->count(),
            'additionals' => DB::table('adicional')->count(),
            'products' => DB::table('produto')->count(),
        ];

        $this->seed(DatabaseSeeder::class);

        $this->assertSame($firstRun['users'], DB::table('users')->count());
        $this->assertSame($firstRun['categories'], DB::table('categoria')->count());
        $this->assertSame($firstRun['additionals'], DB::table('adicional')->count());
        $this->assertSame($firstRun['products'], DB::table('produto')->count());
        $this->assertGreaterThan(0, $firstRun['products']);
    }
}
