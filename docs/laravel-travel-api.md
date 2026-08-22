# Laravel Travel API + Expo (Token + CRUD)

## 1) Crear backend Laravel

```bash
composer create-project laravel/laravel travel-api
cd travel-api
php artisan serve
```

Base URL local esperada:
- `http://127.0.0.1:8000`

## 2) Instalar autenticacion con token (Sanctum)

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

En `app/Models/User.php` agrega:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

## 3) Crear modelo y CRUD de destinos

```bash
php artisan make:model Destination -mcr
```

### Migracion ejemplo (`database/migrations/*_create_destinations_table.php`)

```php
Schema::create('destinations', function (Blueprint $table) {
    $table->id();
    $table->string('slug')->unique();
    $table->string('country');
    $table->string('title');
    $table->string('location');
    $table->text('description');
    $table->string('vibe');
    $table->json('highlights');
    $table->string('best_time');
    $table->text('route');
    $table->string('image_url')->nullable();
    $table->timestamps();
});
```

```bash
php artisan migrate
```

### Modelo (`app/Models/Destination.php`)

```php
class Destination extends Model
{
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
```

### Controlador API (`app/Http/Controllers/Api/DestinationController.php`)

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index(Request $request)
    {
        $query = Destination::query();

        if ($request->filled('country')) {
            $query->where('country', $request->string('country'));
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug' => 'required|string|unique:destinations,slug',
            'country' => 'required|string',
            'title' => 'required|string',
            'location' => 'required|string',
            'description' => 'required|string',
            'vibe' => 'required|string',
            'highlights' => 'required|array',
            'best_time' => 'required|string',
            'route' => 'required|string',
            'image_url' => 'nullable|url',
        ]);

        return response()->json(Destination::create($data), 201);
    }

    public function show(Destination $destination)
    {
        return response()->json($destination);
    }

    public function update(Request $request, Destination $destination)
    {
        $data = $request->validate([
            'slug' => 'sometimes|string|unique:destinations,slug,' . $destination->id,
            'country' => 'sometimes|string',
            'title' => 'sometimes|string',
            'location' => 'sometimes|string',
            'description' => 'sometimes|string',
            'vibe' => 'sometimes|string',
            'highlights' => 'sometimes|array',
            'best_time' => 'sometimes|string',
            'route' => 'sometimes|string',
            'image_url' => 'nullable|url',
        ]);

        $destination->update($data);

        return response()->json($destination);
    }

    public function destroy(Destination $destination)
    {
        $destination->delete();

        return response()->json(['success' => true]);
    }
}
```

### Login con token (`app/Http/Controllers/Api/AuthController.php`)

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'device_name' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales invalidas'], 401);
        }

        $token = $user->createToken($data['device_name'])->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }
}
```

### Rutas (`routes/api.php`)

```php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DestinationController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('destinations', DestinationController::class);
});
```

## 4) Probar en Postman (local)

1. `POST http://127.0.0.1:8000/api/login`
2. Copia token
3. En requests de CRUD usa header:
- `Authorization: Bearer TU_TOKEN`
- `Accept: application/json`

## 5) Conectar Expo

En el proyecto Expo crea `.env` con:

```bash
EXPO_PUBLIC_TRAVEL_API_URL=http://127.0.0.1:8000/api
```

La app ya tiene cliente API en:
- `src/services/travel-api.ts`

Uso rapido desde cualquier pantalla:

```ts
import { loginAndStoreToken, listDestinations } from '@/services/travel-api';

await loginAndStoreToken('demo@mail.com', 'password123');
const destinations = await listDestinations('japan');
```
