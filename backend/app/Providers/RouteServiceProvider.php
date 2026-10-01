<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('login', function (Request $request) {
            $email = Str::lower(trim((string) $request->input('email')));

            return [
                Limit::perMinute(5)->by('login:'.$email.'|'.$request->ip()),
                Limit::perMinute(20)->by('login-ip:'.$request->ip()),
            ];
        });

        RateLimiter::for('checkout', function (Request $request) {
            $key = $this->requestFingerprint($request);

            return [
                Limit::perMinute(6)->by('checkout-minute:'.$key),
                Limit::perHour(30)->by('checkout-hour:'.$key),
            ];
        });

        RateLimiter::for('carrinho', function (Request $request) {
            $key = $this->requestFingerprint($request);

            return [
                Limit::perMinute(60)->by('carrinho-minute:'.$key),
                Limit::perHour(600)->by('carrinho-hour:'.$key),
            ];
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    private function requestFingerprint(Request $request): string
    {
        if ($request->user()) {
            return 'user:'.$request->user()->getAuthIdentifier();
        }

        $sessionId = $request->hasSession() ? $request->session()->getId() : '';

        return hash('sha256', $sessionId.'|'.$request->ip());
    }
}
