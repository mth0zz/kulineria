<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Culinary extends Model
{
    use HasFactory;

    protected $table = 'culinaries';

    protected $fillable = [
        'user_id', 'nama', 'slug', 'kategori', 
        'deskripsi_ringkas', 'deskripsi_lengkap', 
        'provinsi', 'kota', 'harga_min', 'harga_max', 
        'rating', 'lat', 'lng', 'images', 'bahan', 
        'langkah', 'status'
    ];

    protected $casts = [
        'images' => 'array',
        'bahan' => 'array',
        'langkah' => 'array',
        'rating' => 'float',
        'harga_min' => 'integer',
        'harga_max' => 'integer',
    ];

    /**
     * Relasi ke Pemilik (UMKM)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Daftar Ulasan (Hanya yang sudah di-approve)
     */
    public function approvedReviews()
    {
        return $this->hasMany(Review::class)->where('status', 'approved');
    }

    /**
     * Relasi ke Semua Ulasan (Untuk Admin/UMKM monitoring)
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    protected static function booted()
    {
        static::creating(function ($culinary) {
            if (empty($culinary->slug)) {
                $culinary->slug = Str::slug($culinary->nama) . '-' . Str::lower(Str::random(5));
            }
        });
    }
}