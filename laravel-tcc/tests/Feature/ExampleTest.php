<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_store_profile_endpoint_returns_a_successful_response(): void
    {
        $this->getJson('/api/store')
            ->assertOk()
            ->assertJsonStructure([
                'store' => ['name', 'theme', 'order'],
            ]);
    }
}
