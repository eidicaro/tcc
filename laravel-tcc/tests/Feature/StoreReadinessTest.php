<?php

namespace Tests\Feature;

use Tests\TestCase;

class StoreReadinessTest extends TestCase
{
    public function test_store_returns_the_profile_without_blocking_local_orders(): void
    {
        config(['store' => [
            'name' => 'Loja Exemplo',
            'tagline' => 'Uma experiência especial',
            'description' => 'Descrição completa da operação.',
            'logo_url' => '/storage/branding/logo.svg',
            'hero_image_url' => '/storage/branding/hero.webp',
            'address' => [
                'line' => 'Rua Exemplo, 100',
                'city' => 'Sorocaba',
            ],
            'public_marker' => 'preservado',
        ]]);

        $this->getJson('/api/store')
            ->assertOk()
            ->assertJsonPath('configured', true)
            ->assertJsonPath('missing_fields', [])
            ->assertJsonPath('store.public_marker', 'preservado');
    }

    public function test_store_uses_frontend_fallbacks_instead_of_pausing_orders(): void
    {
        config(['store' => [
            'name' => " \t ",
            'tagline' => 'Tagline válida',
            'description' => null,
            'logo_url' => '',
            'hero_image_url' => 123,
            'address' => [
                'line' => 'Rua Exemplo, 100',
                'city' => '   ',
            ],
            'internal_value' => 'não deve aparecer no diagnóstico',
        ]]);

        $this->getJson('/api/store')
            ->assertOk()
            ->assertJsonPath('configured', true)
            ->assertExactJson([
                'store' => config('store'),
                'configured' => true,
                'missing_fields' => [],
            ]);
    }
}
