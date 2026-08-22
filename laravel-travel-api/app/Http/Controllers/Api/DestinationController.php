<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index(Request $request)
    {
        $destinations = Destination::query()
            ->when($request->filled('country'), fn ($query) => $query->where('country', $request->string('country')))
            ->latest()
            ->get();

        return response()->json($destinations);
    }

    public function store(Request $request)
    {
        $destination = Destination::create($this->validatedData($request));

        return response()->json($destination, 201);
    }

    public function show(Destination $destination)
    {
        return response()->json($destination);
    }

    public function update(Request $request, Destination $destination)
    {
        $destination->update($this->validatedData($request, $destination));

        return response()->json($destination->fresh());
    }

    public function destroy(Destination $destination)
    {
        $destination->delete();

        return response()->json(['success' => true]);
    }

    private function validatedData(Request $request, ?Destination $destination = null): array
    {
        $uniqueSlug = 'unique:destinations,slug' . ($destination ? ',' . $destination->id : '');
        $required = $destination ? 'sometimes' : 'required';

        return $request->validate([
            'slug' => [$required, 'string', 'max:100', $uniqueSlug],
            'country' => [$required, 'string', 'max:50'],
            'title' => [$required, 'string', 'max:150'],
            'location' => [$required, 'string', 'max:150'],
            'description' => [$required, 'string'],
            'vibe' => [$required, 'string', 'max:80'],
            'highlights' => [$required, 'array'],
            'highlights.*' => ['string'],
            'best_time' => [$required, 'string', 'max:100'],
            'route' => [$required, 'string'],
            'image_url' => ['nullable', 'url', 'max:500'],
        ]);
    }
}
