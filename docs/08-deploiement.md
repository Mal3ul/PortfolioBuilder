# Procédure de déploiement — Portfolio Builder

Ce document décrit l'architecture de déploiement, la chaîne CI/CD et les procédures de
mise en production et de retour arrière (rollback).

## 1. Vue d'ensemble (DevOps)

Le projet suit une démarche **DevOps** : intégration continue (tests automatisés) et
déploiement continu (mise en production automatique après validation).

```
Développeur
   │ git push
   ▼
GitHub  ──►  GitHub Actions (CI/CD)
                 │ 1. Tests + analyse statique
                 │ 2. (si succès, sur main) Déploiement SSH
                 ▼
              VPS Linux
                 │ deploy.sh
                 ▼
   Docker Compose (prod) : reverse-proxy + app Node + PostgreSQL
```

## 2. Environnements

| Environnement | Branche | Hébergement | Lancement |
|---------------|---------|-------------|-----------|
| Développement | `feature/*` | Poste local | `make dev` (http://127.0.0.1:18080) |
| Intégration / recette | `dev` | Local / CI | `make dev`, CI sur push |
| Production | `main` | VPS Linux | Automatique via CI/CD (`deploy.sh`) |

## 3. Chaîne CI/CD

Définie dans [.github/workflows/deploy.yml](../.github/workflows/deploy.yml).

### Déclencheurs
- `push` et `pull_request` sur `dev` et `main` → exécute le job **`test`**.
- `push` sur `main` uniquement → exécute le job **`deploy`** (si `test` réussit).

### Job `test` (intégration continue)
1. Récupération du code.
2. Installation des dépendances (`npm ci`).
3. **Analyse statique** (ESLint — informatif).
4. **Audit de sécurité** des dépendances (`npm audit`).
5. **Suite de tests** (unit + intégration) sur base éphémère via Docker.

### Job `deploy` (déploiement continu)
- Conditionné par `needs: test` → **ne s'exécute que si les tests passent**.
- Connexion **SSH** au VPS et exécution de [deploy.sh](../deploy.sh).

## 4. Prérequis du VPS

| Élément | Détail |
|---------|--------|
| OS | Linux (distribution avec Docker). |
| Docker + Docker Compose | Pour exécuter la stack de production. |
| Dépôt cloné | `/home/claudeuser/PortfolioBuilder`. |
| Fichier `.env` | Présent à la racine, renseigné (jamais versionné). |
| Accès SSH | Clé publique autorisée ; secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` configurés dans GitHub. |

### Secrets GitHub Actions requis
| Secret | Usage |
|--------|-------|
| `VPS_HOST` | Adresse du serveur. |
| `VPS_USER` | Utilisateur SSH. |
| `VPS_SSH_KEY` | Clé privée SSH de déploiement. |

## 5. Procédure de mise en production

### 5.1 Automatique (nominale)
1. Fusionner la recette validée de `dev` vers `main`.
2. `git push origin main`.
3. La CI exécute les tests puis, si tout est vert, déclenche le déploiement.
4. Sur le VPS, `deploy.sh` : `git pull` → `docker compose -f docker-prod.yaml up -d --build`
   → `docker image prune` → affichage de l'état de la stack.

### 5.2 Manuelle (depuis le VPS)
```bash
cd /home/claudeuser/PortfolioBuilder
./deploy.sh          # ou : make deploy
```

## 6. Procédure de retour arrière (rollback)

En cas de dysfonctionnement après une mise en production :

```bash
cd /home/claudeuser/PortfolioBuilder

# 1. Revenir au commit stable précédent
git log --oneline -5          # identifier le dernier commit sain
git checkout <hash_stable>

# 2. Reconstruire et redémarrer la stack
docker compose -f docker-prod.yaml up -d --build

# 3. Vérifier l'état
docker compose -f docker-prod.yaml ps
docker compose -f docker-prod.yaml logs -f
```

> Une fois la cause corrigée, repasser sur `main` (`git checkout main`) et redéployer.

## 7. Vérifications post-déploiement

| Vérification | Commande / action |
|--------------|-------------------|
| Conteneurs démarrés | `make prod-ps` |
| Absence d'erreurs | `make prod-logs` |
| Application accessible | Ouvrir l'URL publique et tester la connexion. |
| Base accessible | `make prod-psql` (`\dt` pour lister les tables). |

## 8. Diagnostic des incidents

| Symptôme | Piste de diagnostic |
|----------|---------------------|
| Conteneur qui redémarre en boucle | `make prod-logs` → lire la stacktrace ; vérifier `.env`. |
| Erreur de connexion base | Vérifier `DATABASE_URL` et l'état du conteneur `pb-database`. |
| 502 / proxy | Vérifier la configuration Nginx ([docker/nginx.conf](../docker/nginx.conf)). |
| Échec du déploiement CI | Consulter les logs du job dans l'onglet *Actions* de GitHub. |
