<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'culinary_id',
        'rating',
        'comment',
        'status',
    ];

    /**
     * Relasi ke User (Siapa yang mengulas)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Culinary (Makanan apa yang diulas)
     */
    public function culinary()
    {
        return $this->belongsTo(Culinary::class);
    }
}