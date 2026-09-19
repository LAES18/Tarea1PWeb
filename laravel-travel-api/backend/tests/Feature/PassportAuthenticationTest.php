<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\ClientRepository;
use Tests\TestCase;

class PassportAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_grant_issues_scoped_tokens_and_logout_revokes_them(): void
    {
        $client = app(ClientRepository::class)
            ->createPasswordGrantClient('Test Password Client', 'users', true);

        config([
            'passport.password_client.id' => $client->getKey(),
            'passport.password_client.secret' => $client->plainSecret,
        ]);

        $user = User::factory()->create([
            'email' => 'passport@example.com',
            'password' => 'password123',
        ]);

        $login = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
            'scopes' => ['viajes.read'],
        ])->assertOk()
            ->assertJsonStructure([
                'token_type',
                'expires_in',
                'access_token',
                'refresh_token',
                'token',
                'user' => ['id', 'name', 'email'],
            ]);

        $token = $login->json('access_token');

        $this->withToken($token)->getJson('/api/viajes')->assertOk();
        $this->withToken($token)->postJson('/api/viajes', [
            'destino' => 'Antigua Guatemala',
            'pais' => 'Guatemala',
            'fecha_inicio' => '2026-10-01',
            'fecha_fin' => '2026-10-03',
            'descripcion' => 'Viaje de prueba',
            'estado' => 'planeado',
        ])->assertForbidden();

        $this->withToken($token)->postJson('/api/logout')->assertOk();
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }

    public function test_client_credentials_can_access_the_client_route(): void
    {
        $client = app(ClientRepository::class)
            ->createClientCredentialsGrantClient('Test Service Client');

        $tokenResponse = $this->post('/oauth/token', [
            'grant_type' => 'client_credentials',
            'client_id' => $client->getKey(),
            'client_secret' => $client->plainSecret,
            'scope' => 'viajes.read',
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonStructure(['token_type', 'expires_in', 'access_token']);

        $this->withToken($tokenResponse->json('access_token'))
            ->getJson('/api/client/status')
            ->assertOk();
    }
}
