# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable
COPY package.json ./
RUN pnpm install --no-frozen-lockfile

FROM base AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "--port", "5173", "--strictPort"]

FROM base AS build
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY . .
RUN pnpm build

FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /var/www/frontend
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
