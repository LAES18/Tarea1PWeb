# Presentacion de Passport en Postman

La coleccion lista para importar es `postman/AgendaViajesLaravel.postman_collection.json`. Contiene tres carpetas que corresponden a las tres guias:

1. **Client Credentials:** obtiene un token de aplicacion y consulta `/api/client/status`.
2. **Password Grant y Refresh:** registra o autentica al usuario, consulta `/api/me`, renueva el token y ejecuta logout.
3. **Scopes y CRUD:** demuestra un acceso permitido, un `403 Forbidden` por falta de permisos y el CRUD de viajes con los scopes correctos.

## Preparacion

```powershell
cd "G:\Desarrollo web\Act.1\MiPrimeraApp\laravel-travel-api\backend"
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

En Postman, importar la coleccion y abrir **Variables**. Copiar desde `laravel-travel-api/backend/.env`:

| Variable de Postman | Variable de Laravel |
|---|---|
| `clientId` | `PASSPORT_CLIENT_ID` |
| `clientSecret` | `PASSPORT_CLIENT_SECRET` |
| `passwordClientId` | `PASSPORT_PASSWORD_CLIENT_ID` |
| `passwordClientSecret` | `PASSPORT_PASSWORD_CLIENT_SECRET` |

No compartir ni subir los secretos a Git.

## Orden sugerido para la demostracion

1. Ejecutar **Registrar usuario con permisos completos**. Si el correo ya existe, usar **Login con permisos completos**.
2. Ejecutar **Usuario autenticado**: debe responder `200`.
3. Ejecutar **Renovar access token**: la coleccion reemplaza automáticamente ambos tokens.
4. Ejecutar **Login solo lectura**.
5. Con ese token, **Listar viajes** responde `200`, pero **Crear viaje - 403** responde `403`.
6. Volver a ejecutar el login completo y probar crear, actualizar, eliminar y buscar fotos.
7. Ejecutar **Logout y revocacion**. Cualquier uso posterior del mismo access token responde `401`.

La API Key de Pexels permanece únicamente en el `.env` del backend; nunca se envía desde Postman ni desde Expo.
