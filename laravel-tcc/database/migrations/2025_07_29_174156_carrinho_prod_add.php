<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('carrinho_prod_add', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_carrinho');
            $table->unsignedBigInteger('id_produto');
            $table->unsignedBigInteger('id_adicional');
            $table->integer('quantidade')->default(1);

            // Chaves estrangeiras
            $table->foreign('id_carrinho')->references('id_carrinho')->on('carrinho')->onDelete('cascade');
            $table->foreign('id_produto')->references('id_produto')->on('produto')->onDelete('cascade');
            $table->foreign('id_adicional')->references('id_adicional')->on('adicional')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('carrinho_prod_add');
    }
};
