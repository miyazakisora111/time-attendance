#!/bin/sh
set -eu

# Install dependencies if node_modules is empty (volume mount wipes them)
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "==> node_modules missing: running pnpm install"
    pnpm install --no-frozen-lockfile
fi

exec "$@"
