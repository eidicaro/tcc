<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('adm', function (Blueprint $table) {
            $table->id('id_adm');
            $table->string('nome', 100);
            $table->string('email', 100)->unique();
            $table->string('senha', 100);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adm');
    }
};
