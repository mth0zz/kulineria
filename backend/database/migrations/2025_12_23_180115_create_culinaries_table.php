<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('culinaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Pemilik (Role UMKM)
            $table->string('nama');
            $table->string('slug')->unique();
            $table->string('kategori');
            $table->text('deskripsi_ringkas');
            $table->text('deskripsi_lengkap');
            $table->string('provinsi');
            $table->string('kota');
            $table->integer('harga_min')->nullable();
            $table->integer('harga_max')->nullable();
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->string('lat')->nullable();
            $table->string('lng')->nullable();
            $table->json('images'); // Menyimpan array URL foto
            $table->json('bahan');  // Menyimpan array bahan-bahan
            $table->json('langkah'); // Menyimpan array langkah memasak
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('culinaries');
    }
};