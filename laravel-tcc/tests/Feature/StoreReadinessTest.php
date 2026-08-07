<?php

namespace Tests\Feature;

use Tests\TestCase;

class StoreReadinessTest extends TestCase
{
    public function test_store_is_configured_when_every_essential_field_is_filled(): void
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

    public function test_store_reports_only_safe_field_names_when_configuration_is_incomplete(): void
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
            ->assertJsonPath('configured', false)
            ->assertExactJson([
                'store' => config('store'),
                'configured' => false,
                'missing_fields' => [
                    'name',
                    'description',
                    'logo_url',
                    'hero_image_url',
                    'city',
                ],
            ]);
    }
}
