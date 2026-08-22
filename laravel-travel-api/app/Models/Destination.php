<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'country',
        'title',
        'location',
        'description',
        'vibe',
        'highlights',
        'best_time',
        'route',
        'image_url',
    ];

    protected $casts = [
        'highlights' => 'array',
    ];
}
