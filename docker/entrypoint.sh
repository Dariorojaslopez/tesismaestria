#!/bin/sh
set -e

echo "Aplicando migraciones (estructura de tablas)..."
npx prisma migrate deploy

echo "Sembrando datos iniciales (solo si la BD está vacía)..."
npx prisma db seed

echo "Iniciando servidor Next.js..."
exec node server.js
