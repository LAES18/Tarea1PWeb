<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Viaje;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ViajeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->viajes()->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $viaje = $request->user()->viajes()->create($this->validatedData($request));

        return response()->json($viaje, 201);
    }

    public function show(Request $request, Viaje $viaje): JsonResponse
    {
        $this->ensureOwner($request, $viaje);

        return response()->json($viaje);
    }

    public function update(Request $request, Viaje $viaje): JsonResponse
    {
        $this->ensureOwner($request, $viaje);
        $viaje->update($this->validatedData($request, true));

        return response()->json($viaje->fresh());
    }

    public function destroy(Request $request, Viaje $viaje): JsonResponse
    {
        $this->ensureOwner($request, $viaje);
        $viaje->delete();

        return response()->json(['message' => 'Viaje eliminado correctamente.']);
    }

    private function validatedData(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'destino' => [$required, 'string', 'max:150'],
            'pais' => [$required, 'string', 'max:100'],
            'fecha_inicio' => [$required, 'date'],
            'fecha_fin' => [$required, 'date', 'after_or_equal:fecha_inicio'],
            'descripcion' => [$required, 'string'],
            'imagen' => ['nullable', 'url', 'max:500'],
            'estado' => [$required, 'in:planeado,en curso,completado'],
        ]);
    }

    private function ensureOwner(Request $request, Viaje $viaje): void
    {
        abort_unless($viaje->user_id === $request->user()->id, 403, 'No tienes permiso para acceder a este viaje.');
    }
}
