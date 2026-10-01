<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produto', function (Blueprint $table) {
            // Sem evidência de configuração, produtos existentes permanecem
            // no modo legado. Pivôs preexistentes são corrigidas logo abaixo.
            $table->boolean('adicionais_configurados')->default(false)->after('destaque');
        });

        // Uma pivô preexistente já representa uma configuração intencional.
        // O query builder gera EXISTS compatível com SQLite, MySQL e PostgreSQL.
        DB::table('produto')
            ->whereExists(function ($query) {
                $query
                    ->selectRaw('1')
                    ->from('produto_adicional')
                    ->whereColumn(
                        'produto_adicional.id_produto',
                        'produto.id_produto'
                    );
            })
            ->update(['adicionais_configurados' => true]);
    }

    public function down(): void
    {
        Schema::table('produto', function (Blueprint $table) {
            $table->dropColumn('adicionais_configurados');
        });
    }
};
