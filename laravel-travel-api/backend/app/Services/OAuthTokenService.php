<?php

namespace App\Services;

use GuzzleHttp\Psr7\Response as PsrResponse;
use GuzzleHttp\Psr7\ServerRequest;
use Laravel\Passport\Http\Controllers\AccessTokenController;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

class OAuthTokenService
{
    public function __construct(private readonly AccessTokenController $accessTokenController) {}

    /**
     * Issue a Password Grant token without making an HTTP request back to the
     * same local development server.
     *
     * @param  list<string>  $scopes
     */
    public function issuePasswordToken(string $email, string $password, array $scopes): Response
    {
        $clientId = config('passport.password_client.id');
        $clientSecret = config('passport.password_client.secret');

        if (! is_string($clientId) || $clientId === '' || ! is_string($clientSecret) || $clientSecret === '') {
            throw new RuntimeException(
                'Configura PASSPORT_PASSWORD_CLIENT_ID y PASSPORT_PASSWORD_CLIENT_SECRET en el archivo .env.'
            );
        }

        $request = (new ServerRequest('POST', '/oauth/token'))
            ->withHeader('Accept', 'application/json')
            ->withParsedBody([
                'grant_type' => 'password',
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'username' => $email,
                'password' => $password,
                'scope' => implode(' ', $scopes),
            ]);

        return $this->accessTokenController->issueToken($request, new PsrResponse);
    }
}
