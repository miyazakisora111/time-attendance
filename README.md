# Time Attendance Monorepo

Backend: Laravel (PHP + PostgreSQL + Redis)

Frontend: React + TypeScript + Vite (SPA)

Infrastructure: Docker Compose in `infra/`

## Runtime model

- Production uses Docker Compose (`infra/docker-compose.yml` + `infra/docker-compose.prod.yml`)
- Development supports both:
	- Docker mode
	- Non-Docker mode (host PostgreSQL/Redis)
- Vite production strategy is **same-domain serving**:
	- `web` serves SPA static files
	- `/api/*` is forwarded to Laravel (`app`)

## Environment files

- Root `.env`: compose-only variables (ports, DB credentials, build settings)
- `back/.env`: Laravel runtime values (host mode defaults)
- `front/.env`: Vite runtime values (`VITE_*` only)

`back/.env` is the source of truth for non-Docker mode.
In Docker mode, compose `environment` overrides DB/Redis host values to service names.

## Docker development

```bash
cp .env.example .env
cp back/.env.example back/.env
cp front/.env.example front/.env

docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml up -d --build
docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml exec app php artisan key:generate --ansi
docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml exec app php artisan jwt:secret --ansi
docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml exec app php artisan migrate --seed --force
```

Check:

- API health: `http://localhost:8000/api/health`
- API version: `http://localhost:8000/api/version`
- Frontend dev server: `http://localhost:5173`

Vite in Docker is configured with:

- `--host --port 5173 --strictPort`
- `CHOKIDAR_USEPOLLING=true`
- HMR host/clientPort options from env
- `/api` proxy to `web` container

## Non-Docker development

Prerequisites:

- PHP 8.4+
- Composer
- Node.js 20+
- pnpm
- PostgreSQL 15+
- Redis 7+

```bash
cp back/.env.example back/.env
cp front/.env.example front/.env
```

Ensure `back/.env` has host values:

```dotenv
DB_HOST=localhost
REDIS_HOST=localhost
```

Install and initialize:

```bash
cd back && composer install
php artisan key:generate --ansi
php artisan jwt:secret --ansi
php artisan migrate --seed

cd ../front && pnpm install
```

Run servers in separate terminals:

```bash
cd back && php artisan serve --host=0.0.0.0 --port=8000
```

```bash
cd front && pnpm dev --host --port 5173 --strictPort
```

## Production deployment

```bash
docker compose -f infra/docker-compose.yml -f infra/docker-compose.prod.yml up -d --build
docker compose -f infra/docker-compose.yml -f infra/docker-compose.prod.yml exec app php artisan migrate --force
docker compose -f infra/docker-compose.yml -f infra/docker-compose.prod.yml exec app composer optimize-prod
```

Production optimization commands included in backend:

- `php artisan config:cache`
- `php artisan route:cache`
- `php artisan view:cache`

## Useful Make targets

```bash
make setup         # Docker setup (copy env, build, migrate)
make setup-local   # Non-Docker setup
make build         # docker compose up --build
make down          # stop stack
make logs          # tail logs
make sh            # shell into app container
make init          # key + jwt + migrate --seed
make fresh         # migrate:fresh --seed
make front-dev     # run Vite dev on host
make health        # curl /api/health
```

## Troubleshooting

- If Vite HMR does not work in Docker, verify:
	- `FRONT_PORT=5173`
	- `VITE_HMR_HOST=localhost`
	- `VITE_HMR_CLIENT_PORT=5173`
- If frontend cannot call API in Docker dev:
	- check `VITE_API_BASE_URL=/api`
	- check Vite proxy target (`VITE_DEV_PROXY_TARGET=http://web`)
- If permissions fail in Laravel storage:
	- `docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml exec app sh`
	- `chown -R www-data:www-data storage bootstrap/cache`

## Security notes

- Never commit real `.env` files.
- Never commit private keys (`*.pem`, `*.key`).
- Production runtime images do not include Node or Composer in final stage.
- See [infra/README.md](infra/README.md) for backup and restore procedures.
