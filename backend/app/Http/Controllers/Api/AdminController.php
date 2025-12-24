<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Culinary;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Ambil statistik ringkas untuk Dashboard Admin
     */
    public function getStats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_kuliner' => Culinary::count(),
                'total_umkm' => User::where('role', 'umkm')->count(),
                'total_visitor' => User::where('role', 'visitor')->count(),
                'pending_verifikasi' => User::where('role', 'umkm')->where('is_verified', false)->count(),
            ]
        ]);
    }
}