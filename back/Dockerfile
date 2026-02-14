FROM php:8.4-fpm

# 必要な PHP 拡張
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    libzip-dev \
    php-redis \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

# Composer インストール
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable
