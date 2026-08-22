# Presentacion de la API en Postman

## 1. Preparar los servidores

Terminal del backend:

```powershell
cd "D:\Desarrollo web\Act.1\MiPrimeraApp\laravel-travel-api\backend"
php artisan serve --host=0.0.0.0 --port=8000
```

La API queda en `http://127.0.0.1:8000/api`.

## 2. Registrar usuario

**POST** `http://127.0.0.1:8000/api/registro`

Headers:

```text
Accept: application/json
Content-Type: application/json
```

Body, opcion raw JSON:

```json
{
  "name": "Alumno Demo",
  "email": "alumno@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

Respuesta esperada: `201 Created`, con usuario y `token`.
Copia el token o guardalo en una variable de coleccion llamada `token`.

## 3. Iniciar sesion

**POST** `http://127.0.0.1:8000/api/login`

Headers:

```text
Accept: application/json
Content-Type: application/json
```

Body:

```json
{
  "email": "alumno@example.com",
  "password": "password123",
  "device_name": "postman"
}
```

Respuesta esperada: `200 OK` con un token Sanctum.

## 4. Autorizacion

En todas las peticiones siguientes agrega en Headers:

```text
Accept: application/json
Authorization: Bearer TU_TOKEN
```

El token se genera en login. No se escribe en el codigo de React Native.

## 5. Listar viajes

**GET** `http://127.0.0.1:8000/api/viajes`

Respuesta: `200 OK` con un arreglo JSON de viajes del usuario autenticado.

## 6. Crear viaje

**POST** `http://127.0.0.1:8000/api/viajes`

Headers adicionales:

```text
Content-Type: application/json
```

Body:

```json
{
  "destino": "Tokyo",
  "pais": "Japon",
  "fecha_inicio": "2026-10-01",
  "fecha_fin": "2026-10-05",
  "descripcion": "Viaje cultural por Tokyo",
  "imagen": null,
  "estado": "planeado"
}
```

Respuesta esperada: `201 Created` y el viaje creado. Guarda su `id`.

## 7. Consultar detalle

**GET** `http://127.0.0.1:8000/api/viajes/1`

Cambia `1` por el ID creado.
Respuesta esperada: `200 OK` con un solo viaje.

## 8. Actualizar viaje

**PUT** `http://127.0.0.1:8000/api/viajes/1`

Headers adicionales:

```text
Content-Type: application/json
```

Body:

```json
{
  "estado": "completado",
  "descripcion": "Viaje actualizado desde Postman"
}
```

Respuesta esperada: `200 OK` con los datos modificados.

## 9. Eliminar viaje

**DELETE** `http://127.0.0.1:8000/api/viajes/1`

Respuesta esperada: `200 OK`:

```json
{
  "message": "Viaje eliminado correctamente."
}
```

## 10. Consultar fotos de Pexels

**GET** `http://127.0.0.1:8000/api/fotos?query=Tokyo&per_page=3`

Headers:

```text
Accept: application/json
Authorization: Bearer TU_TOKEN
```

Respuesta esperada: `200 OK`, con `total_results` y un arreglo `photos` que contiene las URLs de Pexels.
La API Key no se envia desde Postman ni React Native: Laravel la lee desde `backend/.env`.

## 11. Explicacion para la clase

- Laravel es el backend que recibe las peticiones HTTP.
- `viajes` es el recurso principal de la API.
- Cada URL es un endpoint.
- Sanctum genera el token y protege los endpoints.
- El token se envia como `Authorization: Bearer TOKEN`.
- POST crea, GET consulta, PUT actualiza y DELETE elimina.
- Laravel consulta Pexels usando la API Key privada de `.env`.
- React Native consume los endpoints de Laravel, no Pexels directamente.
- `routes/api.php` contiene las rutas; no se usa `routes/web.php`.
- En la app, `Descubrir` lista los viajes y `Ver detalle` consulta un viaje y su foto.
