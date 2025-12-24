<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'nama_usaha',
        'nik_ktp',
        'npwp',
        'kategori_usaha',
        'is_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
        ];
    }

    /**
     * Relasi ke Kuliner (Hanya jika user adalah UMKM)
     */
    public function culinaries()
    {
        return $this->hasMany(Culinary::class);
    }

    /**
     * Relasi ke Ulasan (Hanya jika user adalah Visitor)
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}