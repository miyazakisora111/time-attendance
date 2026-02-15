# ベースイメージ
FROM php:8.4-fpm

# 作業ディレクトリ
WORKDIR /var/www/html

# 必要な PHP 拡張と OS パッケージ
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip \
    && pecl install redis xdebug \
    && docker-php-ext-enable redis xdebug \
    && rm -rf /var/lib/apt/lists/*

# Composer インストール
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Xdebug 設定（デバッグ用）
RUN echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.log=/tmp/xdebug.log" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# 権限調整（Laravel 用）
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Laravel 用の entrypoint（任意）
CMD ["php-fpm"]
