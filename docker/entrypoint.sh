#!/bin/sh
set -e

if [ -z "$AUTH_SECRET" ] || [ "${#AUTH_SECRET}" -lt 16 ]; then
  echo "ERROR: AUTH_SECRET no está definido o es demasiado corto (mín. 16 caracteres)."
  echo "Configúralo en el archivo .env del servidor antes de iniciar la app."
  exit 1
fi

echo "Aplicando migraciones (estructura de tablas)..."
npx prisma migrate deploy

echo "Sembrando datos iniciales (solo si la BD está vacía)..."
npx prisma db seed

echo "Iniciando servidor Next.js..."
exec node server.js
