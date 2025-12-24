<?php

namespace Database\Seeders;

use App\Models\Culinary;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CulinarySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Pastikan ada akun UMKM buat nampung datanya
        $umkm = User::updateOrCreate(
            ['email' => 'umkm@example.com'],
            [
                'name' => 'Mitra Berkah Nusantara',
                'password' => bcrypt('password'),
                'role' => 'umkm'
            ]
        );

        // 2. Data makanan (Gua tambahin slug manual biar aman 100%)
        $items = [
            [
                'user_id' => $umkm->id,
                'nama' => 'Rendang Padang',
                'slug' => 'rendang-padang-' . Str::random(5),
                'kategori' => 'Makanan',
                'deskripsi_ringkas' => 'Rendang daging sapi asli Minang dengan rempah pilihan.',
                'deskripsi_lengkap' => 'Masakan tradisional Minangkabau yang dimasak perlahan dengan santan murni hingga menghasilkan dedak rendang yang gurih dan daging yang empuk.',
                'provinsi' => 'Sumatera Barat',
                'kota' => 'Padang',
                'harga_min' => 25000,
                'harga_max' => 45000,
                'rating' => 4.9,
                'lat' => '-0.9471',
                'lng' => '100.4172',
                'images' => ['https://i.pinimg.com/736x/9e/60/53/9e6053d7e57e315eb1b90e03dfb6bbf2.jpg'],
                'bahan' => ['Daging Sapi', 'Santan Kental', 'Bawang Merah', 'Cabai Merah'],
                'langkah' => ['Tumis bumbu halus', 'Masukkan daging', 'Tuangkan santan', 'Aduk hingga kering'],
                'status' => 'published'
            ],
            [
                'user_id' => $umkm->id,
                'nama' => 'Pempek Palembang',
                'slug' => 'pempek-palembang-' . Str::random(5),
                'kategori' => 'Makanan',
                'deskripsi_ringkas' => 'Olahan ikan tenggiri autentik dengan kuah cuko pedas asam.',
                'deskripsi_lengkap' => 'Pempek asli Palembang dibuat dari daging ikan tenggiri segar dan sagu berkualitas, disajikan dengan cuko yang kental.',
                'provinsi' => 'Sumatera Selatan',
                'kota' => 'Palembang',
                'harga_min' => 15000,
                'harga_max' => 35000,
                'rating' => 4.8,
                'lat' => '-2.9761',
                'lng' => '104.7754',
                'images' => ['https://i.pinimg.com/736x/cb/ab/36/cbab3668111326924649e6214dae92e1.jpg'],
                'bahan' => ['Ikan Tenggiri', 'Tepung Sagu', 'Bawang Putih', 'Garam'],
                'langkah' => ['Haluskan ikan', 'Campur tepung sagu', 'Rebus adonan', 'Goreng dan sajikan'],
                'status' => 'published'
            ]
        ];

        foreach ($items as $item) {
            Culinary::create($item);
        }
    }
}