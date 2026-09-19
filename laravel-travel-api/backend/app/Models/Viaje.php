<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Viaje extends \Illuminate\Database\Eloquent\Model
{
    use HasFactory;

    protected $table = 'viajes';

    protected $fillable = [
        'destino',
        'pais',
        'fecha_inicio',
        'fecha_fin',
        'descripcion',
        'imagen',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date:Y-m-d',
            'fecha_fin' => 'date:Y-m-d',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
