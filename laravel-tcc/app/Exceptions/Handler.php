<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function (AuthenticationException $exception, Request $request) {
            if ($request->is('api/*', 'login', 'logout') || $request->expectsJson()) {
                return response()->json([
                    'message' => 'Não autenticado.',
                ], 401);
            }

            return null;
        });

        $this->reportable(function (Throwable $e) {
            //
        });
    }
}
