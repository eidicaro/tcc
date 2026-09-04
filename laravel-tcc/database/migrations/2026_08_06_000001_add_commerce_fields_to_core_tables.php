<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produto', function (Blueprint $table) {
            $table->boolean('ativo')->default(true);
            $table->boolean('destaque')->default(false);
            $table->unsignedInteger('ordem')->default(0);
            $table->softDeletes();

            $table->index(['ativo', 'destaque', 'ordem']);
        });

        Schema::table('adicional', function (Blueprint $table) {
            $table->unsignedInteger('ordem')->default(0);
            $table->softDeletes();

            $table->index(['ativo', 'ordem']);
        });

        Schema::table('categoria', function (Blueprint $table) {
            $table->boolean('ativo')->default(true);
            $table->unsignedInteger('ordem')->default(0);
            $table->softDeletes();

            $table->index(['ativo', 'ordem']);
        });

        Schema::table('pedidos', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('taxa_entrega', 10, 2)->default(0);
            $table->string('status_pedido', 30)->default('novo');
            $table->string('token', 64)->nullable()->unique();

            $table->index(['status_pedido', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropIndex(['status_pedido', 'created_at']);
            $table->dropUnique(['token']);
            $table->dropColumn(['subtotal', 'taxa_entrega', 'status_pedido', 'token']);
        });

        Schema::table('categoria', function (Blueprint $table) {
            $table->dropIndex(['ativo', 'ordem']);
            $table->dropColumn(['ativo', 'ordem', 'deleted_at']);
        });

        Schema::table('adicional', function (Blueprint $table) {
            $table->dropIndex(['ativo', 'ordem']);
            $table->dropColumn(['ordem', 'deleted_at']);
        });

        Schema::table('produto', function (Blueprint $table) {
            $table->dropIndex(['ativo', 'destaque', 'ordem']);
            $table->dropColumn(['ativo', 'destaque', 'ordem', 'deleted_at']);
        });
    }
};
