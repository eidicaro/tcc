<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produto_adicional', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_produto');
            $table->unsignedBigInteger('id_adicional');
            $table->timestamps();

            $table->foreign('id_produto')->references('id_produto')->on('produto')->onDelete('cascade');
            $table->foreign('id_adicional')->references('id_adicional')->on('adicional')->onDelete('cascade');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('produto_adicional');
    }
};
