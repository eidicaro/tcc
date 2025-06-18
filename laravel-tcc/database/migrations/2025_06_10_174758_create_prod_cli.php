<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('prod_cli', function (Blueprint $table) {
            $table->unsignedBigInteger('id_cliente');
            $table->unsignedBigInteger('id_produto');
            $table->primary(['id_cliente', 'id_produto']);

            $table->foreign('id_cliente')->references('id_cliente')->on('cliente')->onDelete('cascade');
            $table->foreign('id_produto')->references('id_produto')->on('produto')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prod_cli');
    }
};
