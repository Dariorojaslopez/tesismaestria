#!/bin/sh
set -e

cd "$(dirname "$0")/.."

echo "→ Actualizando código..."
git pull origin main

echo "→ Reconstruyendo contenedores..."
docker compose down
docker compose up -d --build

echo "→ Despliegue completado."
