<?php

namespace App\Providers;

use Carbon\CarbonInterval;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::enablePasswordGrant();

        Passport::tokensExpireIn(CarbonInterval::hours(1));
        Passport::clientCredentialsTokensExpireIn(CarbonInterval::hours(1));
        Passport::refreshTokensExpireIn(CarbonInterval::days(30));
        Passport::personalAccessTokensExpireIn(CarbonInterval::months(6));

        Passport::tokensCan([
            'viajes.read' => 'Ver el listado y el detalle de los viajes',
            'viajes.write' => 'Crear y editar viajes',
            'viajes.delete' => 'Eliminar viajes',
            'fotos.read' => 'Buscar fotografías para los viajes',
            'admin' => 'Acceso administrativo',
        ]);

        Passport::setDefaultScope('viajes.read');
    }
}
