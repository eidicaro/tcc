<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produto', function (Blueprint $table): void {
            $table->boolean('disponivel')->default(true)->after('ativo');
            $table->index(['ativo', 'disponivel']);
        });
    }

    public function down(): void
    {
        Schema::table('produto', function (Blueprint $table): void {
            $table->dropIndex(['ativo', 'disponivel']);
            $table->dropColumn('disponivel');
        });
    }
};
