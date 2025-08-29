<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('carrinho_produto', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('carrinho_id');
            $table->unsignedBigInteger('produto_id');
            $table->string('nome');
            $table->decimal('preco', 8, 2);
            $table->integer('quantidade');
            $table->json('adicionais')->nullable();
            $table->string('uid')->nullable();
            $table->timestamps();
        
            $table->foreign('carrinho_id')->references('id_carrinho')->on('carrinho')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carrinho_produto');
    }
};
