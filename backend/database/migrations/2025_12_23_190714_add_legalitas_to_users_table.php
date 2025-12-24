<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Field khusus untuk Role UMKM
            $table->string('nama_usaha')->nullable()->after('role');
            $table->string('nik_ktp')->nullable()->after('nama_usaha');
            $table->string('npwp')->nullable()->after('nik_ktp');
            $table->string('kategori_usaha')->nullable()->after('npwp');
            // Status verifikasi oleh Admin
            $table->boolean('is_verified')->default(false)->after('kategori_usaha');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nama_usaha', 'nik_ktp', 'npwp', 'kategori_usaha', 'is_verified']);
        });
    }
};