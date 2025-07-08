<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('adicional', function (Blueprint $table) {
            $table->id('id_adicional');
            $table->string('nome', 100);
            $table->decimal('preco', 10, 2);
            $table->string('imagem', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adicional');
    }
};
