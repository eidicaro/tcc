<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('carrinho_produto', function (Blueprint $table) {
            $table->unsignedBigInteger('id_carrinho');
            $table->unsignedBigInteger('id_produto');
            $table->integer('quantidade')->default(1);
            $table->primary(['id_carrinho', 'id_produto']);

            $table->foreign('id_carrinho')->references('id_carrinho')->on('carrinho')->onDelete('cascade');
            $table->foreign('id_produto')->references('id_produto')->on('produto')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carrinho_produto');
    }
};
