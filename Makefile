# --------------------------------
# パス設定
# --------------------------------
BACK_DIR=back
FRONT_DIR=front
BACK_CONTAINER=laravel.test

# Docker Compose 環境指定
ENV ?= dev
DOCKER_COMPOSE_BASE=docker-compose.base.yml
DOCKER_COMPOSE_ENV=docker-compose.$(ENV).yml

DC_CMD=docker-compose -f $(DOCKER_COMPOSE_BASE) -f $(DOCKER_COMPOSE_ENV)

# --------------------------------
# バックエンド
# --------------------------------
up-back:
	$(DC_CMD) up -d

down-back:
	$(DC_CMD) down

ssh-back:
	$(DC_CMD) exec $(BACK_CONTAINER) sh

optimize-back:
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan config:clear
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan route:clear
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan view:clear
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan config:cache

refresh-back:
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan migrate --seed

test-back:
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan test --coverage --min=75.3

phpcs-back:
	$(DC_CMD) exec $(BACK_CONTAINER) ./vendor/bin/phpcs --standard=phpcs.xml --colors -ps $(opt)

phpcbf-back:
	$(DC_CMD) exec $(BACK_CONTAINER) ./vendor/bin/phpcbf --standard=phpcs.xml --extensions=php

# --------------------------------
# フロントエンド
# --------------------------------
install-front:
	[ -d $(FRONT_DIR)/node_modules ] || npm install --prefix $(FRONT_DIR)

up-front: install-front
	npm start --prefix $(FRONT_DIR)

build-front:
	npm run build --prefix $(FRONT_DIR)

test-front:
	npm test --prefix $(FRONT_DIR)

lint-front:
	npm run lint --prefix $(FRONT_DIR)

# --------------------------------
# 共通
# --------------------------------
.PHONY: up-back down-back ssh-back optimize-back refresh-back test-back phpcs-back phpcbf-back \
        install-front up-front build-front test-front lint-front
