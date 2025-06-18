<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('carrinho', function (Blueprint $table) {
            $table->id('id_carrinho');
            $table->unsignedBigInteger('id_cliente');
            $table->dateTime('data_criacao')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamps();

            $table->foreign('id_cliente')->references('id_cliente')->on('cliente')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carrinho');
    }
};
