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
# Laravel Passport: guias 1, 2 y 3

El backend terminado esta en `laravel-travel-api/backend` y utiliza Laravel 13 con Passport 13.

## Iniciar el backend

```powershell
cd "G:\Desarrollo web\Act.1\MiPrimeraApp\laravel-travel-api\backend"
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

Las llaves RSA, las migraciones OAuth y los dos clientes requeridos ya estan creados en el entorno local. Sus identificadores y secretos estan en `backend/.env`, archivo excluido de Git.

Si se instala el proyecto en otro equipo, crear clientes nuevos:

```powershell
php artisan passport:keys
php artisan passport:client --client --name="Travel API Service Client"
php artisan passport:client --password --name="Travel API Password Client" --provider=users
```

Guardar el primer par en `PASSPORT_CLIENT_ID` y `PASSPORT_CLIENT_SECRET`; guardar el segundo en `PASSPORT_PASSWORD_CLIENT_ID` y `PASSPORT_PASSWORD_CLIENT_SECRET`.

## Guia 1: Client Credentials

Solicitar un token de aplicacion con `POST /oauth/token`, usando body `x-www-form-urlencoded`:

```text
grant_type=client_credentials
client_id=PASSPORT_CLIENT_ID
client_secret=PASSPORT_CLIENT_SECRET
scope=viajes.read
```

Probar el token en `GET /api/client/status` con `Authorization: Bearer TOKEN`.

## Guia 2: usuario, refresh y logout

El login es `POST /api/login`:

```json
{
  "email": "alumno@example.com",
  "password": "password123",
  "scopes": ["viajes.read", "viajes.write", "viajes.delete", "fotos.read"]
}
```

La respuesta contiene `access_token`, `refresh_token`, `expires_in` y el alias `token` usado por la app Expo. El access token dura una hora y el refresh token 30 dias.

Para renovar, enviar a `POST /oauth/token` como `x-www-form-urlencoded`:

```text
grant_type=refresh_token
refresh_token=REFRESH_TOKEN
client_id=PASSPORT_PASSWORD_CLIENT_ID
client_secret=PASSPORT_PASSWORD_CLIENT_SECRET
scope=viajes.read viajes.write viajes.delete fotos.read
```

Rutas de usuario:

- `GET /api/me`: usuario autenticado.
- `POST /api/logout`: revoca el access token y su refresh token.

## Guia 3: scopes

Scopes disponibles:

- `viajes.read`: listar y consultar viajes.
- `viajes.write`: crear y actualizar viajes.
- `viajes.delete`: eliminar viajes.
- `fotos.read`: buscar fotos.
- `admin`: alternativa administrativa para eliminar viajes o consultar fotos.

El endpoint `GET /api/token-info` permite inspeccionar los scopes mientras `APP_ENV=local`. No se registra en produccion.

## Postman

Importar `postman/AgendaViajesLaravel.postman_collection.json`. Después copiar desde `backend/.env` los cuatro valores de cliente a las variables de la coleccion:

- `clientId`
- `clientSecret`
- `passwordClientId`
- `passwordClientSecret`

La coleccion guarda automaticamente access tokens, refresh tokens y el ID del viaje creado.
