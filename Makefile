# --------------------------------
# パス設定
# --------------------------------
BACK_DIR=back
FRONT_DIR=front
BACK_CONTAINER=app
OPENAPI_DIR=openapi
BUNDLE=$(OPENAPI_DIR)/build/bundle.yaml
ENV ?= dev
DOCKER_COMPOSE_BASE=docker-compose.base.yml
DOCKER_COMPOSE_ENV=docker-compose.$(ENV).yml
DC_CMD=docker-compose -f $(DOCKER_COMPOSE_BASE) -f $(DOCKER_COMPOSE_ENV)

# --------------------------------
# バックエンド
# --------------------------------
back-up:
	$(DC_CMD) up -d

back-down:
	$(DC_CMD) down

back-ps:
	$(DC_CMD) ps

back-ssh:
	$(DC_CMD) exec $(BACK_CONTAINER) sh

back-optimize:
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan config:clear
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan route:clear
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan cache:clear
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan view:clear
	$(DC_CMD) exec $(BACK_CONTAINER) composer dump-autoload
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan config:cache

back-test:
	$(DC_CMD) exec $(BACK_CONTAINER) php artisan test --coverage --min=75.3

back-phpcs:
	$(DC_CMD) exec $(BACK_CONTAINER) ./vendor/bin/phpcs --standard=phpcs.xml --colors -ps $(opt)

back-phpcbf:
	$(DC_CMD) exec $(BACK_CONTAINER) ./vendor/bin/phpcbf --standard=phpcs.xml --extensions=php

# --------------------------------
# フロントエンド
# --------------------------------
front-install:
	[ -d $(FRONT_DIR)/node_modules ] || npm install --prefix $(FRONT_DIR)

front-up: front-install
	npm start --prefix $(FRONT_DIR)

front-build:
	npm run build --prefix $(FRONT_DIR)

front-test:
	npm test --prefix $(FRONT_DIR)

front-lint:
	npm run lint --prefix $(FRONT_DIR)

# --------------------------------
# OpenAPI
# --------------------------------
openapi-bundle:
	npx @redocly/cli bundle \
	$(OPENAPI_DIR)/openapi.yaml \
	-o $(BUNDLE)

openapi-client: openapi-bundle
	npx --prefix $(FRONT_DIR) orval

openapi-zod: openapi-bundle
	npx --prefix $(FRONT_DIR) openapi-zod \
	$(BUNDLE) \
	-o $(FRONT_DIR)/src/api/__generated__/zod.ts

openapi: openapi-client openapi-zod

# --------------------------------
# DB
# --------------------------------
db-init:
	@echo "==> DB作成チェック中..."
	@$(DC_CMD) exec postgres bash -c 'psql -U $$POSTGRES_USER -lqt | cut -d \| -f 1 | grep -w $$DB_DATABASE || createdb -U $$POSTGRES_USER $$DB_DATABASE'
	@echo "==> DB作成完了"

db-refresh:
	@$(DC_CMD) exec $(BACK_CONTAINER) php artisan migrate:fresh --seed