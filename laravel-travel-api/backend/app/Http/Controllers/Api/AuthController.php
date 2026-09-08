<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OAuthTokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Passport\Passport;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(private readonly OAuthTokenService $tokens) {}

    public function register(Request $request): Response
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'scopes' => ['sometimes', 'array'],
            'scopes.*' => ['string', Rule::in(Passport::scopeIds())],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        return $this->tokenResponse(
            $this->tokens->issuePasswordToken(
                $data['email'],
                $data['password'],
                $data['scopes'] ?? Passport::defaultScopes(),
            ),
            $user,
            201,
            'Usuario registrado correctamente.',
        );
    }

    public function login(Request $request): Response
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:100'],
            'scopes' => ['sometimes', 'array'],
            'scopes.*' => ['string', Rule::in(Passport::scopeIds())],
        ]);

        $user = User::where('email', $credentials['email'])->first();
        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son válidas.'],
            ]);
        }

        return $this->tokenResponse(
            $this->tokens->issuePasswordToken(
                $credentials['email'],
                $credentials['password'],
                $credentials['scopes'] ?? Passport::defaultScopes(),
            ),
            $user,
            200,
            'Inicio de sesión correcto.',
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()->currentAccessToken();
        $tokenId = $token?->oauth_access_token_id;

        if (is_string($tokenId)) {
            Passport::refreshToken()->newQuery()
                ->where('access_token_id', $tokenId)
                ->update(['revoked' => true]);
        }

        $token?->revoke();

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    public function tokenInfo(Request $request): JsonResponse
    {
        $token = $request->user()->currentAccessToken();

        return response()->json([
            'token_id' => $token?->oauth_access_token_id,
            'scopes' => $token?->oauth_scopes ?? [],
            'user' => $request->user()->only(['id', 'name', 'email']),
            'expires_at' => $token?->expires_at,
        ]);
    }

    private function tokenResponse(
        Response $oauthResponse,
        User $user,
        int $status,
        string $message,
    ): Response {
        $payload = json_decode((string) $oauthResponse->getContent(), true);

        if (! $oauthResponse->isSuccessful() || ! is_array($payload)) {
            return $oauthResponse;
        }

        return response()->json([
            ...$payload,
            'token' => $payload['access_token'],
            'message' => $message,
            'user' => $user,
        ], $status);
    }
}
