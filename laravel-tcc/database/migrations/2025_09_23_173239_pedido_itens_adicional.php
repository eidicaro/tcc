<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pedido_item_adicionais', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pedido_item');
            $table->unsignedBigInteger('id_adicional');
            $table->integer('quantidade');
            $table->decimal('preco_unitario', 10, 2);
        
            $table->foreign('id_pedido_item')->references('id')->on('pedido_itens')->onDelete('cascade');
            $table->foreign('id_adicional')->references('id_adicional')->on('adicional')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_item_adicionais');
    }
};
