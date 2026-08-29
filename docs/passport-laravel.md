# Laravel Passport

La API usa Laravel Passport para emitir y validar tokens Bearer.

## Instalacion

Desde `laravel-travel-api/backend`:

```powershell
composer require laravel/passport
php artisan install:api --passport
php artisan migrate --force
```

`install:api --passport` crea las migraciones OAuth, publica la configuracion y genera las claves de cifrado. Las claves de `storage/` no se suben al repositorio.

## Credenciales del cliente

Para generar el cliente de acceso personal usado por Postman:

```powershell
php artisan passport:client --personal --name="MiPrimeraApp Personal Access Client"
```

Passport guarda el cliente en la tabla `oauth_clients`. El identificador y el secreto se muestran una sola vez en la consola; no deben guardarse en Git ni enviarse al frontend.

## Generar un token

La API expone dos endpoints publicos:

- `POST /api/registro`: crea el usuario y devuelve `token`.
- `POST /api/login`: valida las credenciales y devuelve `token`.

Ejemplo de login:

```json
{
  "email": "alumno@example.com",
  "password": "password123",
  "device_name": "postman"
}
```

El valor `token` se envia en cada ruta protegida:

```text
Authorization: Bearer <token>
Accept: application/json
```

## CRUD protegido

Las rutas de viajes requieren `auth:api`, cuyo driver es Passport:

- `GET /api/viajes`
- `POST /api/viajes`
- `GET /api/viajes/{id}`
- `PUT /api/viajes/{id}`
- `DELETE /api/viajes/{id}`

En Postman, ejecutar `Registro` o `Login` primero. El test de esas peticiones guarda automaticamente la respuesta `token` en la variable `token`; las peticiones del CRUD la reutilizan como Bearer token.
