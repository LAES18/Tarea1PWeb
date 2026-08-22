# Laravel Travel API (CRUD + Token)

Este folder contiene la estructura base para tu backend Laravel local.

## Requisitos
- PHP 8.2+
- Composer
- MySQL o MariaDB

## Crear proyecto real en este folder
Si tu entorno ya tiene PHP y Composer:

```bash
cd laravel-travel-api
composer create-project laravel/laravel .
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

Luego copia estos archivos de referencia dentro del proyecto Laravel generado:
- routes/api.php
- app/Models/Destination.php
- app/Http/Controllers/Api/AuthController.php
- app/Http/Controllers/Api/DestinationController.php
- database/migrations/2026_08_21_000000_create_destinations_table.php

## Endpoints
- POST /api/login
- GET /api/destinations
- POST /api/destinations
- PUT /api/destinations/{id}
- DELETE /api/destinations/{id}

## Postman
Importa:
- postman/TravelAPI.local.postman_collection.json
