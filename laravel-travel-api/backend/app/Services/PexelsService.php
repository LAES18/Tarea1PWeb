<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class PexelsService
{
    public function search(string $query, int $perPage = 15): array
    {
        $key = config('services.pexels.key');
        if (!$key) {
            throw new RuntimeException('PEXELS_API_KEY no está configurada en el archivo .env.');
        }

        return Http::withHeaders(['Authorization' => $key])
            ->acceptJson()
            ->get(config('services.pexels.base_url') . '/search', [
                'query' => $query,
                'per_page' => min($perPage, 80),
            ])
            ->throw()
            ->json();
    }
}
