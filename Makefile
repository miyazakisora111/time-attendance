BACK_DIR := back
FRONT_DIR := front
INFRA_DIR := infra
OPENAPI_DIR := openapi

ENV ?= dev
ifeq ($(ENV),prod)
  DC := docker compose --env-file .env -f $(INFRA_DIR)/docker-compose.yml -f $(INFRA_DIR)/docker-compose.prod.yml
else
  DC := docker compose --env-file .env -f $(INFRA_DIR)/docker-compose.yml -f $(INFRA_DIR)/docker-compose.override.yml
endif

BUNDLE := $(OPENAPI_DIR)/build/bundle.yaml
BUNDLE_JSON := $(OPENAPI_DIR)/build/bundle.json

.PHONY: setup up build down restart logs ps sh init migrate seed fresh test optimize \
	front-install front-dev front-build front-typecheck front-lint local-back health \
	openapi-lint openapi-bundle openapi-client openapi-zod openapi-validators openapi-examples openapi openapi-clean \
	openapi-enums openapi-enums-check \
	dev in-db

setup:
	@[ -f .env ] || cp .env.example .env
	@[ -f $(BACK_DIR)/.env ] || cp $(BACK_DIR)/.env.example $(BACK_DIR)/.env
	@[ -f $(FRONT_DIR)/.env ] || cp $(FRONT_DIR)/.env.example $(FRONT_DIR)/.env
	$(MAKE) build
	$(MAKE) init

up:
	$(DC) up -d

build:
	$(DC) up -d --build

down:
	$(DC) down

restart:
	$(MAKE) down
	$(MAKE) up

logs:
	$(DC) logs -f --tail=200

ps:
	$(DC) ps

sh:
	$(DC) exec app sh

init:
	$(DC) exec app php artisan key:generate --ansi
	$(DC) exec app php artisan jwt:secret --ansi
	$(DC) exec app php artisan migrate --seed --force

migrate:
	$(DC) exec app php artisan migrate --force

seed:
	$(DC) exec app php artisan db:seed --force

fresh:
	$(DC) exec app php artisan migrate:fresh --seed --force

test:
	$(DC) exec app php artisan test

optimize:
	$(DC) exec app composer optimize-prod

front-install:
	cd $(FRONT_DIR) && pnpm install

front-dev:
	cd $(FRONT_DIR) && pnpm dev --host --port 5173 --strictPort

front-build:
	cd $(FRONT_DIR) && pnpm build

front-typecheck:
	cd $(FRONT_DIR) && pnpm typecheck

front-lint:
	cd $(FRONT_DIR) && pnpm lint

local-back:
	cd $(BACK_DIR) && php artisan serve --host=0.0.0.0 --port=8000

health:
	@curl -fsS http://localhost:$${APP_PORT:-8000}/api/health && echo

# ────────────────────────────────────────
# OpenAPI
# ────────────────────────────────────────

openapi-lint:
	npx @redocly/cli lint $(OPENAPI_DIR)/openapi.yaml

openapi-bundle: openapi-lint
	@mkdir -p $(OPENAPI_DIR)/build
	npx @redocly/cli bundle $(OPENAPI_DIR)/openapi.yaml -o $(BUNDLE)
	npx @redocly/cli bundle $(OPENAPI_DIR)/openapi.yaml --dereferenced --ext json -o $(BUNDLE_JSON)

openapi-client: openapi-bundle
	npx --prefix $(FRONT_DIR) orval

openapi-zod: openapi-bundle
	npx --prefix $(FRONT_DIR) openapi-zod $(BUNDLE) -o $(FRONT_DIR)/src/__generated__/zod.ts

openapi-validators: openapi-bundle openapi-zod
	node openapi/scripts/generate-openapi-validators.mjs
	npx prettier --write ./front/src/__generated__/zod.validation.ts

openapi-clean:
	rm -rf $(OPENAPI_DIR)/build/*
	rm -rf $(OPENAPI_DIR)/examples/*
	rm -rf $(FRONT_DIR)/src/__generated__/*
	rm -rf $(BACK_DIR)/app/__Generated__/*

openapi-enums:
	node openapi/scripts/generate-php-enums.mjs
	node openapi/scripts/generate-ts-enums.mjs
	
openapi-php-dto: openapi-bundle \
    openapi-generator-cli generate \
        -i $(BUNDLE) \
        -g php \
        -o $(BACK_DIR)/app/__Generated__/Responses \
        --global-property=models \
        --additional-properties=phpVersion=8.2,readonlyProperties=true,modelPropertyNaming=camelCase,enumClassPrefix=true

openapi: openapi-enums openapi-php-dto openapi-zod openapi-client openapi-validators

dev: openapi
	$(MAKE) front-dev
	cd $(BACK_DIR) && php artisan serve --host=0.0.0.0 --port=8000

in-db:
	sudo -u postgres psql