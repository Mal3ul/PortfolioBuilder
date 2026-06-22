#!/usr/bin/env bash
# Script de déploiement — NE PAS faire git pull ici (déjà fait par le wrapper).
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "Erreur : fichier .env absent. Copiez .env.example -> .env et renseignez les valeurs." >&2
  exit 1
fi

echo "==> Suppression de l'ancienne image (évite réutilisation de layers corrompus)"
docker rmi portfoliobuilder-app 2>/dev/null || true

echo "==> Build de l'image"
docker compose -f docker-prod.yaml build

echo "==> (re)démarrage des conteneurs"
docker compose -f docker-prod.yaml up -d

echo "==> Nettoyage des images orphelines"
docker image prune -f

echo "==> État de la stack"
docker compose -f docker-prod.yaml ps
