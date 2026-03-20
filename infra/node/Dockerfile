# ============================================================
# Node / React multi-stage build
# context: project root (../)  — set in docker-compose.yml
# ============================================================

# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable
COPY front/package.json front/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
COPY infra/node/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 5173
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["pnpm", "dev", "--host", "--port", "5173", "--strictPort"]

# ---------- build ----------
FROM base AS build
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY front/ .
RUN pnpm build

# ---------- prod (nginx serving static assets) ----------
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /var/www/frontend
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
