<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create
                            {--name= : Nome do administrador}
                            {--email= : E-mail do administrador}';

    protected $description = 'Cria um administrador sem usar credenciais padrão';

    public function handle(): int
    {
        $name = trim((string) ($this->option('name') ?: $this->ask('Nome')));
        $email = Str::lower(trim((string) ($this->option('email') ?: $this->ask('E-mail'))));
        $password = (string) $this->secret('Senha (mínimo de 12 caracteres)');
        $passwordConfirmation = (string) $this->secret('Confirme a senha');

        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'password_confirmation' => $passwordConfirmation,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::min(12)],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $admin = new User([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);
        $admin->is_admin = true;
        $admin->save();

        $this->info('Administrador criado com sucesso.');

        return self::SUCCESS;
    }
}
