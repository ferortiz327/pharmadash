#!/bin/sh
set -e

echo "🚀 Iniciando PharmaDash..."

# Generar Prisma
echo "📦 Generando cliente Prisma..."
npx prisma generate

# Push de esquema
echo "📦 Actualizando esquema..."
npx prisma db push

# Iniciar
echo "🚀 Iniciando aplicación..."
node dist/index.js
