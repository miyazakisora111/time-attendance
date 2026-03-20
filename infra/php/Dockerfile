# ============================================================
# PHP-FPM multi-stage build
# context: project root (../)  — set in docker-compose.yml
# ============================================================

# ---------- base ----------
FROM php:8.4-fpm-bookworm AS base

WORKDIR /var/www/html

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      libpq-dev \
      libzip-dev \
      unzip \
      git \
      $PHPIZE_DEPS; \
    docker-php-ext-install -j"$(nproc)" pdo_pgsql zip bcmath opcache; \
    pecl install redis; \
    docker-php-ext-enable redis opcache; \
    apt-get purge -y --auto-remove \
      -o APT::AutoRemove::RecommendsImportant=false $PHPIZE_DEPS; \
    rm -rf /var/lib/apt/lists/* /tmp/pear

COPY back/docker/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY infra/php/php.ini /usr/local/etc/php/conf.d/99-custom.ini
RUN chmod +x /usr/local/bin/entrypoint.sh

# ---------- vendor (dependency cache) ----------
FROM composer:2 AS vendor

WORKDIR /app

COPY back/composer.json back/composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-ansi \
    --prefer-dist \
    --no-scripts

COPY back/ .
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-ansi \
    --prefer-dist \
    --optimize-autoloader

# ---------- dev ----------
FROM base AS dev

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends $PHPIZE_DEPS; \
    pecl install xdebug; \
    docker-php-ext-enable xdebug; \
    apt-get purge -y --auto-remove \
      -o APT::AutoRemove::RecommendsImportant=false $PHPIZE_DEPS; \
    rm -rf /var/lib/apt/lists/* /tmp/pear

ENV APP_ENV=local
ENV COMPOSER_ALLOW_SUPERUSER=1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm", "-F"]

# ---------- prod ----------
FROM base AS prod

# Override the dev php.ini with production settings
COPY infra/php/php.prod.ini /usr/local/etc/php/conf.d/99-custom.ini

ENV APP_ENV=production

COPY back/ .
COPY --from=vendor /app/vendor /var/www/html/vendor

RUN set -eux; \
    mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache; \
    chown -R www-data:www-data storage bootstrap/cache; \
    chmod -R ug+rwX storage bootstrap/cache

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm", "-F"]
