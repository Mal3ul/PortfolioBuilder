# Architecture du projet

Ce document décrit l'organisation technique de **Portfolio Builder** : les couches
du back-end, le flux d'une requête, la gestion des erreurs, la sécurité, la base de
données et les tests. Il sert de point d'entrée pour comprendre et faire évoluer le code.

## Vue d'ensemble

| Partie | Technologies |
|--------|--------------|
| Front-end | React + Vite, React Router |
| Back-end | Node.js + Express |
| Base de données | PostgreSQL (`pg`) |
| Authentification | JWT (`jsonwebtoken`) + `bcryptjs` |
| Emails | Nodemailer / API Brevo |
| Tâches planifiées | `node-cron` |
| Tests | Vitest + Supertest |

## Architecture en couches (back-end)

Le back-end est organisé en **couches** : chaque couche a une seule responsabilité
et ne communique qu'avec la couche immédiatement en dessous.

```
Requête HTTP
   │
   ▼
routes/         Définit les URLs + middlewares (auth, rôles). Aucune logique métier.
   │
   ▼
controllers/    Couche HTTP : lit la requête, appelle le service, renvoie la réponse.
   │
   ▼
services/       Logique métier : règles, validations, orchestration, transactions.
   │
   ▼
repositories/   Accès aux données : uniquement des requêtes SQL.
   │
   ▼
PostgreSQL
```

Couches transverses :

- **`domain/`** — *value objects* (POO) qui encapsulent et valident des données
  (ex. `Email`, `Password`).
- **`middleware/`** — `verifyToken` (JWT), `roles` (RBAC), `asyncHandler`,
  `errorHandler`.
- **`utils/`** — utilitaires (`httpError`, `email`).
- **`config/`** — connexion à la base (`database.js`) et helper `withTransaction`.

### Pourquoi des couches ?

- **Lisibilité** : on sait où chercher (une requête SQL est forcément dans `repositories/`).
- **Testabilité** : on teste la logique métier en *mockant* les repositories (sans base).
- **Évolutivité** : changer la base de données n'impacte que la couche `repositories/`.

## Flux d'une requête (exemple : modifier un projet)

```
PUT /api/projects/:id
  → projects.routes.js        vérifie le token + le rôle + le propriétaire
  → projects.controller.js    extrait les données de la requête
  → project.service.js        vérifie que le projet appartient à l'utilisateur (anti-IDOR)
  → project.repository.js     exécute l'UPDATE SQL
  → réponse JSON
```

## Gestion des erreurs

- Les services lèvent une **`HttpError`** typée (`badRequest`, `unauthorized`,
  `forbidden`, `notFound`) — ils ne dépendent pas d'Express.
- Les controllers sont enveloppés par **`asyncHandler`** : toute erreur est transmise
  au gestionnaire central.
- **`errorHandler`** traduit la `HttpError` en code HTTP, sinon renvoie un `500`.

Résultat : pas de `try/catch` répété dans les controllers.

## Sécurité

- **Authentification** : JWT vérifié par `verifyToken` (en-tête `Authorization: Bearer`).
- **Autorisations (RBAC)** : `requireRole`, `requireAnyRole`, `requireSelfOrAdmin`.
- **Anti-IDOR** : les services vérifient que la ressource appartient bien à
  l'utilisateur avant toute modification/suppression.
- **Mots de passe** : hachés avec `bcryptjs`. **Secrets** : hors du dépôt (`.env` en
  local, dashboard Render en production).

## Base de données

- Schéma : `backend/schema.sql`. Évolutions : `backend/migrations/`.
- Accès via la couche `repositories/`. Toutes les requêtes sont **paramétrées**
  (`$1, $2…`) pour éviter les injections SQL.
- Les opérations multi-requêtes (ex. mise à jour complète d'un portfolio) utilisent
  `withTransaction()` (`config/database.js`).

## Tâches planifiées (RGPD)

`scheduler.service.js` (via `node-cron`, démarré depuis `server.js`) lance
`accountCleanup.service.js` : avertissement puis suppression des comptes inactifs
selon `INACTIVITY_DAYS` / `INACTIVITY_GRACE_DAYS`.

## Tests

| Commande | Portée |
|----------|--------|
| `npm run test:unit` | logique métier (repositories mockés, sans base) |
| `npm run test:security` | middlewares d'auth et de rôles, anti-IDOR |
| `npm run test:integration` | parcours API complets (nécessite une base PostgreSQL) |
| `npm test` | tout |
| `npm run coverage` | rapport de couverture |

## Ajouter une nouvelle fonctionnalité

En partant du bas vers le haut :

1. **`repositories/`** — ajouter les requêtes SQL nécessaires.
2. **`services/`** — écrire la logique métier (validations, règles).
3. **`controllers/`** — brancher la requête HTTP au service.
4. **`routes/`** — déclarer l'URL + les middlewares (auth/rôles).
5. **`tests/`** — ajouter au minimum un test unitaire du service.

## Arborescence (back-end)

```
backend/
├── config/         database.js (+ withTransaction)
├── controllers/    couche HTTP
├── domain/         value objects (POO)
├── middleware/     auth, roles, asyncHandler, errorHandler
├── migrations/     évolutions du schéma SQL
├── repositories/   accès aux données (SQL)
├── routes/         déclaration des endpoints
├── services/       logique métier
├── utils/          httpError, email
├── app.js          configuration Express (importable par les tests)
└── server.js       démarrage du serveur + tâches planifiées
```
