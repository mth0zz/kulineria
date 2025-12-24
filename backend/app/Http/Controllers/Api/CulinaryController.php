<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Culinary;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class CulinaryController extends Controller
{
    /**
     * Tampilan Publik (Homepage) - Hanya yang Published
     */
    public function index()
    {
        $data = Culinary::where('status', 'published')->latest()->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Tampilan Khusus UMKM - Hanya milik dia sendiri
     */
    public function myCulinaries(Request $request)
    {
        $data = Culinary::where('user_id', $request->user()->id)->latest()->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Tampilan Khusus Admin - Semua kuliner dari semua UMKM
     */
    public function adminIndex()
    {
        $data = Culinary::with('user')->latest()->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Simpan Kuliner Baru
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'kategori' => 'required|string',
            'deskripsi_ringkas' => 'required|string|max:255',
            'deskripsi_lengkap' => 'required|string',
            'provinsi' => 'required|string',
            'kota' => 'required|string',
            'harga_min' => 'required|numeric',
            'harga_max' => 'required|numeric',
            'bahan' => 'required|array',
            'langkah' => 'required|array',
            'images' => 'required|array', // Menerima array URL foto
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $culinary = Culinary::create([
            'user_id' => $request->user()->id,
            'nama' => $request->nama,
            'slug' => Str::slug($request->nama) . '-' . Str::random(5),
            'kategori' => $request->kategori,
            'deskripsi_ringkas' => $request->deskripsi_ringkas,
            'deskripsi_lengkap' => $request->deskripsi_lengkap,
            'provinsi' => $request->provinsi,
            'kota' => $request->kota,
            'harga_min' => $request->harga_min,
            'harga_max' => $request->harga_max,
            'bahan' => $request->bahan,
            'langkah' => $request->langkah,
            'images' => $request->images,
            'status' => 'published',
        ]);

        return response()->json(['success' => true, 'message' => 'Kuliner berhasil diterbitkan!', 'data' => $culinary]);
    }

    /**
     * Detail Kuliner (Include Reviews)
     */
    public function show($id)
    {
        $culinary = Culinary::where('id', $id)->orWhere('slug', $id)->first();
        
        if (!$culinary) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $culinary]);
    }

    public function destroy($id)
    {
        $culinary = Culinary::findOrFail($id);
        $culinary->delete();
        return response()->json(['success' => true, 'message' => 'Berhasil dihapus']);
    }
}