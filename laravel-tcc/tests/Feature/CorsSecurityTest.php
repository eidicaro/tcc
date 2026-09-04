<?php

namespace Tests\Feature;

use Tests\TestCase;

class CorsSecurityTest extends TestCase
{
    public function test_configured_frontend_origin_can_make_credentialed_preflight_requests(): void
    {
        $response = $this->options('/login', [], [
            'Origin' => 'http://localhost:3000',
            'Access-Control-Request-Method' => 'POST',
            'Access-Control-Request-Headers' => 'content-type,x-xsrf-token',
        ]);

        $response
            ->assertNoContent()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->assertHeader('Access-Control-Allow-Credentials', 'true');
    }

    public function test_unconfigured_origin_is_not_granted_cors_access(): void
    {
        $response = $this->options('/login', [], [
            'Origin' => 'https://attacker.example',
            'Access-Control-Request-Method' => 'POST',
        ]);

        $this->assertNotSame(
            'https://attacker.example',
            $response->headers->get('Access-Control-Allow-Origin')
        );
        $this->assertNotContains('*', config('cors.allowed_origins'));
    }
}
