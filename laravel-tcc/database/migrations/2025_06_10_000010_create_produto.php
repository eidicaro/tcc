<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('produto', function (Blueprint $table) {
            $table->id('id_produto');
            $table->string('nome', 100);
            $table->text('descricao')->nullable();
            $table->decimal('preco', 10, 2);
            $table->string('imagem', 255)->nullable();
            $table->unsignedBigInteger('id_categoria')->nullable();
            $table->timestamps();

            $table->foreign('id_categoria')->references('id_categoria')->on('categoria');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produto');
    }
};
