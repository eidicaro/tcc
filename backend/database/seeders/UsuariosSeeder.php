<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use InvalidArgumentException;

class UsuariosSeeder extends Seeder
{
    /**
     * Cria ou atualiza o usuario administrador configurado no ambiente.
     */
    public function run(): void
    {
        $name = trim((string) config('development.admin.name'));
        $email = Str::lower(trim((string) config('development.admin.email')));
        $password = (string) config('development.admin.password');

        if ($name === '' || $email === '' || $password === '') {
            throw new InvalidArgumentException(
                'Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD antes de executar a seeder de usuarios.'
            );
        }

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('ADMIN_EMAIL deve conter um endereco de e-mail valido.');
        }

        if (Str::length($password) < 12) {
            throw new InvalidArgumentException('ADMIN_PASSWORD deve ter no minimo 12 caracteres.');
        }

        $admin = User::query()->firstOrNew(['email' => $email]);
        $admin->name = $name;
        $admin->password = Hash::make($password);
        $admin->email_verified_at ??= now();
        $admin->is_admin = true;
        $admin->save();
    }
}
