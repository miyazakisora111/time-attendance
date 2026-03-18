#!/bin/sh
set -eu

if [ "${APP_ENV:-local}" != "production" ] && [ ! -f "vendor/autoload.php" ] && command -v composer >/dev/null 2>&1; then
    echo "==> vendor missing: running composer install"
    composer install --no-interaction --prefer-dist
fi

mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chmod -R ug+rwX storage bootstrap/cache || true

if [ "$(id -u)" = "0" ]; then
    chown -R www-data:www-data storage bootstrap/cache || true
fi

exec "$@"
