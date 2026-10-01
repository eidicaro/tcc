<?php

namespace Tests\Feature;

use App\Http\Middleware\VerifyCsrfToken;
use App\Models\ClienteModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_official_sanctum_csrf_endpoint_sets_the_xsrf_cookie(): void
    {
        $this->get('/sanctum/csrf-cookie')
            ->assertNoContent()
            ->assertCookie('XSRF-TOKEN');

        $loginRoute = app('router')->getRoutes()->getByName('login');

        $this->assertNotNull($loginRoute);
        $this->assertContains('web', $loginRoute->middleware());
        $this->assertContains(
            VerifyCsrfToken::class,
            app('router')->getMiddlewareGroups()['web']
        );
    }

    public function test_admin_can_log_in_and_read_the_current_user(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => 'correct-horse-battery-staple',
            'is_admin' => true,
        ]);

        $this->postJson('/login', [
            'email' => 'ADMIN@example.com',
            'password' => 'correct-horse-battery-staple',
        ])->assertOk()->assertJson([
            'user' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => 'admin@example.com',
            ],
        ]);

        $this->assertAuthenticatedAs($admin, 'web');

        $this->getJson('/api/auth/me')
            ->assertOk()
            ->assertExactJson([
                'user' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => 'admin@example.com',
                ],
            ]);
    }

    public function test_web_login_rejects_requests_without_a_valid_csrf_token(): void
    {
        User::factory()->create([
            'email' => 'csrf-admin@example.com',
            'password' => 'correct-horse-battery-staple',
            'is_admin' => true,
        ]);

        // Laravel bypasses CSRF while the app reports the "testing" environment.
        // Switching only this request path to production exercises the real middleware.
        $this->app['env'] = 'production';

        $credentials = [
            'email' => 'csrf-admin@example.com',
            'password' => 'correct-horse-battery-staple',
        ];

        $this->postJson('/login', $credentials)->assertStatus(419);

        $this->withSession(['_token' => 'known-csrf-token'])
            ->postJson('/login', $credentials + ['_token' => 'known-csrf-token'])
            ->assertOk();
    }

    public function test_invalid_credentials_return_unauthorized_without_creating_a_session(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => 'correct-horse-battery-staple',
            'is_admin' => true,
        ]);

        $this->postJson('/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong-password',
        ])->assertUnauthorized()->assertExactJson([
            'message' => 'E-mail ou senha inválidos.',
        ]);

        $this->assertGuest('web');
    }

    public function test_non_admin_credentials_cannot_create_an_admin_session(): void
    {
        User::factory()->create([
            'email' => 'user@example.com',
            'password' => 'correct-horse-battery-staple',
            'is_admin' => false,
        ]);

        $this->postJson('/login', [
            'email' => 'user@example.com',
            'password' => 'correct-horse-battery-staple',
        ])->assertUnauthorized()->assertExactJson([
            'message' => 'E-mail ou senha inválidos.',
        ]);

        $this->assertGuest('web');
    }

    public function test_login_has_a_dedicated_rate_limit(): void
    {
        User::factory()->create([
            'email' => 'limited@example.com',
            'password' => 'correct-horse-battery-staple',
            'is_admin' => true,
        ]);

        $credentials = [
            'email' => 'limited@example.com',
            'password' => 'wrong-password',
        ];

        foreach (range(1, 5) as $attempt) {
            $this->postJson('/login', $credentials)->assertUnauthorized();
        }

        $this->postJson('/login', $credentials)
            ->assertTooManyRequests()
            ->assertHeader('Retry-After');
    }

    public function test_guest_cannot_read_the_current_user_or_admin_data(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
        $this->getJson('/api/admin/clientes')->assertUnauthorized();
    }

    public function test_authenticated_non_admin_user_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user, 'web')
            ->getJson('/api/admin/clientes')
            ->assertForbidden()
            ->assertExactJson(['message' => 'Acesso não autorizado.']);
    }

    public function test_admin_user_can_access_admin_routes(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/clientes')
            ->assertOk()
            ->assertJsonPath('clientes', [])
            ->assertJsonPath('pagination.total', 0);
    }

    public function test_admin_customer_list_is_paginated_and_searchable(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        ClienteModel::create(['nome' => 'Ana Lima', 'telefone' => '15999990001']);
        ClienteModel::create(['nome' => 'Bruno Souza', 'telefone' => '15999990002']);
        ClienteModel::create(['nome' => 'Carla Dias', 'telefone' => '15999990003']);

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/clientes?per_page=2&page=1')
            ->assertOk()
            ->assertJsonCount(2, 'clientes')
            ->assertJsonPath('pagination.total', 3)
            ->assertJsonPath('pagination.has_more', true);

        $this->actingAs($admin, 'web')
            ->getJson('/api/admin/clientes?q=90003')
            ->assertOk()
            ->assertJsonCount(1, 'clientes')
            ->assertJsonPath('clientes.0.nome', 'Carla Dias');
    }

    public function test_logout_invalidates_the_authenticated_session(): void
    {
        User::factory()->create([
            'email' => 'logout@example.com',
            'password' => 'correct-horse-battery-staple',
            'is_admin' => true,
        ]);

        $this->postJson('/login', [
            'email' => 'logout@example.com',
            'password' => 'correct-horse-battery-staple',
        ])->assertOk();

        $this->postJson('/logout')
            ->assertOk()
            ->assertExactJson(['message' => 'Sessão encerrada com sucesso.']);

        $this->assertGuest('web');
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_public_order_listing_customer_mutation_and_debug_route_do_not_exist(): void
    {
        $this->getJson('/api/pedidos')->assertNotFound();
        $this->postJson('/api/cliente', [
            'nome' => 'Tentativa pública',
            'telefone' => '15999999999',
        ])->assertNotFound();
        $this->getJson('/debug-carrinho')->assertNotFound();
    }

    public function test_every_admin_route_requires_authentication_and_admin_authorization(): void
    {
        $adminRoutes = collect(app('router')->getRoutes()->getRoutes())
            ->filter(static fn ($route): bool => str_starts_with($route->uri(), 'api/admin/'));

        $this->assertNotEmpty($adminRoutes);

        foreach ($adminRoutes as $route) {
            $this->assertContains('auth:sanctum', $route->middleware(), $route->uri());
            $this->assertContains('admin', $route->middleware(), $route->uri());
        }
    }

    public function test_every_cart_route_uses_the_cart_rate_limiter(): void
    {
        $cartRoutes = collect(app('router')->getRoutes()->getRoutes())
            ->filter(static fn ($route): bool => str_starts_with($route->uri(), 'api/carrinho/'));

        $this->assertNotEmpty($cartRoutes);

        foreach ($cartRoutes as $route) {
            $this->assertContains('throttle:carrinho', $route->middleware(), $route->uri());
        }
    }

    public function test_security_headers_are_added_to_backend_responses(): void
    {
        $this->getJson('/api/categoria')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
}
