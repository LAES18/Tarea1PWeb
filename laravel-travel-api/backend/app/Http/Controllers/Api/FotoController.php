<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PexelsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class FotoController extends Controller
{
    public function __construct(private readonly PexelsService $pexels)
    {
    }

    public function search(Request $request): JsonResponse
    {
        $data = $request->validate([
            'query' => ['required', 'string', 'min:2', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:80'],
        ]);

        try {
            return response()->json($this->pexels->search($data['query'], $data['per_page'] ?? 15));
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'No se pudieron consultar las fotografías externas.',
            ], 502);
        }
    }
}
