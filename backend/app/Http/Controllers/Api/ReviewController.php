<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Culinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Ambil ulasan yang sudah di-approve untuk hidangan spesifik
     */
    public function index($culinary_id)
    {
        try {
            $reviews = Review::with('user')
                ->where('culinary_id', $culinary_id)
                ->where('status', 'approved')
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $reviews
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil ulasan'
            ], 500);
        }
    }

    /**
     * Simpan ulasan baru (Wajib Login & Status Pending)
     */
    public function store(Request $request)
    {
        // PERBAIKAN: Validasi manual agar pesan error lebih akurat
        $validator = Validator::make($request->all(), [
            'culinary_id' => 'required',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak lengkap atau format salah.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cek apakah kuliner beneran ada di DB
        $exists = Culinary::find($request->culinary_id);
        if (!$exists) {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, menu kuliner ini tidak ditemukan di database kami.'
            ], 404);
        }

        try {
            $review = Review::create([
                'user_id' => $request->user()->id, 
                'culinary_id' => $request->culinary_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
                'status' => 'pending', 
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Ulasan Terkirim, dalam tinjauan admin. Terima kasih!'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function adminIndex()
    {
        $reviews = Review::with(['user', 'culinary'])->latest()->get();
        return response()->json(['success' => true, 'data' => $reviews]);
    }

    public function updateStatus(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => $request->status]);
        return response()->json(['success' => true]);
    }
}