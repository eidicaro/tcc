<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminCreateCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_creates_an_admin_with_a_hidden_non_default_password(): void
    {
        $password = 'a-secure-passphrase-123';

        $this->artisan('admin:create', [
            '--name' => 'Restaurant Owner',
            '--email' => 'OWNER@EXAMPLE.COM',
        ])
            ->expectsQuestion('Senha (mínimo de 12 caracteres)', $password)
            ->expectsQuestion('Confirme a senha', $password)
            ->assertSuccessful();

        $admin = User::query()->where('email', 'owner@example.com')->firstOrFail();

        $this->assertTrue($admin->is_admin);
        $this->assertTrue(Hash::check($password, $admin->password));
    }

    public function test_command_rejects_passwords_shorter_than_twelve_characters(): void
    {
        $this->artisan('admin:create', [
            '--name' => 'Restaurant Owner',
            '--email' => 'owner@example.com',
        ])
            ->expectsQuestion('Senha (mínimo de 12 caracteres)', 'short-pass')
            ->expectsQuestion('Confirme a senha', 'short-pass')
            ->assertExitCode(1);

        $this->assertDatabaseMissing('users', ['email' => 'owner@example.com']);
    }

    public function test_admin_flag_cannot_be_granted_by_generic_mass_assignment(): void
    {
        $user = User::query()->create([
            'name' => 'Regular User',
            'email' => 'regular@example.com',
            'password' => 'a-secure-passphrase-123',
            'is_admin' => true,
        ]);

        $this->assertFalse($user->fresh()->is_admin);
    }
}
