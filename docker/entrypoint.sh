#!/bin/sh
set -e

echo "Aplicando migraciones de base de datos..."
npx prisma migrate deploy

echo "Sembrando datos iniciales..."
npx prisma db seed

echo "Iniciando servidor Next.js..."
exec node server.js
