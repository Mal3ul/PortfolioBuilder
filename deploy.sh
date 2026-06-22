#!/usr/bin/env bash
# Déploiement / mise à jour de la stack Docker PortfolioBuilder.
# Usage : ./deploy.sh
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "Erreur : fichier .env absent. Copiez .env.example -> .env et renseignez les valeurs." >&2
  exit 1
fi

echo "==> Récupération du code (git pull)"
git pull

echo "==> Suppression de l'ancienne image (évite le bug dist/app/index.html)"
docker rmi portfoliobuilder-app 2>/dev/null || true

echo "==> Build des images"
docker compose -f docker-prod.yaml build

echo "==> (re)démarrage des conteneurs (prod)"
docker compose -f docker-prod.yaml up -d

echo "==> Nettoyage des images orphelines"
docker image prune -f

echo "==> État de la stack"
docker compose -f docker-prod.yaml ps
