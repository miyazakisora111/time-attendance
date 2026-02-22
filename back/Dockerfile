# ===============================
# ベース PHP イメージ
# ===============================
FROM php:8.4-fpm

# 作業ディレクトリ
WORKDIR /var/www/html

# 必要パッケージ・PHP拡張
RUN apt-get update && apt-get install -y \
        libpq-dev \
        unzip \
        git \
        libzip-dev \
        zip \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip \
    && pecl install redis xdebug \
    && docker-php-ext-enable redis xdebug \
    && rm -rf /var/lib/apt/lists/*

# Composer インストール（キャッシュ効率化）
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ===============================
# Laravel 開発用 Xdebug 設定
# ===============================
ARG ENABLE_XDEBUG=false
RUN if [ "$ENABLE_XDEBUG" = "true" ]; then \
        echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.log=/tmp/xdebug.log" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini ; \
    fi

# ===============================
# Laravel 権限調整
# ===============================
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# ===============================
# Laravel storage/framework 初期化 & php-fpm 起動
# ===============================
CMD mkdir -p storage/framework/{views,cache,sessions} \
    && chown -R www-data:www-data storage \
    && chmod -R 775 storage \
    && php-fpm
