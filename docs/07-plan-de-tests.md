# Plan de tests — Portfolio Builder

Ce document décrit la stratégie de test du projet, les niveaux de test, les cas couverts
et leur automatisation. Il s'inspire des bonnes pratiques **ISTQB / CFTL**.

## 1. Objectifs et stratégie

| Objectif | Description |
|----------|-------------|
| Détecter les régressions | Tout changement de code est validé par une suite automatisée. |
| Sécuriser les accès | Vérifier l'authentification, les rôles (RBAC) et l'anti-IDOR. |
| Garantir le comportement métier | Vérifier les règles de gestion et la validation des données. |
| Valider les parcours API | Tester les endpoints de bout en bout sur une vraie base. |

**Approche :** pyramide des tests — beaucoup de tests **unitaires** (rapides, isolés),
moins de tests **d'intégration** (parcours API), et des tests **de sécurité** ciblés.

## 2. Niveaux de test

| Niveau | Portée | Outils | Base de données |
|--------|--------|--------|-----------------|
| **Unitaire** | Logique métier (services) en isolant les dépendances (repositories mockés), value objects (POO), utilitaires. | Vitest | Non |
| **Intégration** | Parcours API complets (requête HTTP → réponse) à travers toutes les couches. | Vitest + Supertest | Oui (éphémère) |
| **Sécurité** | Middlewares d'authentification, contrôle des rôles (RBAC), anti-IDOR. | Vitest + Supertest | Selon le cas |
| **Non-régression** | Réexécution de l'ensemble des suites à chaque évolution. | Vitest (CI) | Oui |

## 3. Environnement de test

- Base **PostgreSQL éphémère** (`docker-utils.yaml`, service `test-db`) : montée sur
  `tmpfs` (aucune persistance), initialisée automatiquement avec `backend/schema.sql`,
  repart vierge à chaque exécution.
- Variables d'environnement de test isolées (`NODE_ENV=test`, `JWT_SECRET=test-secret`,
  `NEUTRALIZE_EMAIL=true` pour ne pas envoyer de vrais emails).
- Exécution **conteneurisée** : reproductible à l'identique en local et en CI.

## 4. Commandes d'exécution

| Commande | Portée |
|----------|--------|
| `make test` | Suite complète (unit + intégration) en conteneur. |
| `make test-unit` | Tests unitaires seuls (sans base). |
| `make test-integration` | Tests d'intégration sur base éphémère. |
| `make coverage` | Rapport de couverture HTML (`reports/coverage/`). |
| `npm run test:security` | Tests de sécurité (sur l'hôte). |

## 5. Cas de test couverts

### 5.1 Tests unitaires ([tests/unit/](../tests/unit/))

| Fichier | Cas couverts |
|---------|--------------|
| `auth.service.test.js` | Inscription, connexion, validation, unicité de l'email, hachage. |
| `project.service.test.js` | CRUD projets, contrôle de propriété (anti-IDOR). |
| `domain.test.js` | Value objects `Email` / `Password` (validation, immutabilité). |
| `httpError.test.js` | Helpers d'erreurs HTTP (codes, messages). |

### 5.2 Tests d'intégration ([tests/integration/](../tests/integration/))

| Fichier | Cas couverts |
|---------|--------------|
| `auth.routes.test.js` | `/register`, `/login`, reset mot de passe (parcours complets). |
| `projects.routes.test.js` | CRUD projets via l'API, accès interdit aux ressources d'autrui. |

### 5.3 Tests de sécurité ([tests/security/](../tests/security/))

| Fichier | Cas couverts |
|---------|--------------|
| `auth.middleware.test.js` | Token absent / invalide / expiré → refus d'accès. |
| `rbac.test.js` | Accès admin réservé, vérification des rôles. |

## 6. Cahier de recette (exemples)

| ID | Scénario | Étapes | Résultat attendu |
|----|----------|--------|------------------|
| T-01 | Inscription valide | POST `/register` avec données valides | 201 + token |
| T-02 | Email déjà utilisé | POST `/register` avec email existant | 409 |
| T-03 | Connexion invalide | POST `/login` mauvais mot de passe | 401 (message générique) |
| T-04 | Accès sans token | GET ressource protégée sans `Authorization` | 401 |
| T-05 | Anti-IDOR | PUT projet d'un autre utilisateur | 404 |
| T-06 | Accès admin refusé | Endpoint admin avec rôle `user` | 403 |

## 7. Intégration continue

Les tests sont exécutés automatiquement par la CI ([.github/workflows/deploy.yml](../.github/workflows/deploy.yml))
à chaque `push` et `pull request` sur `dev` et `main`. **Le déploiement n'a lieu que si
les tests passent** (voir [08-deploiement.md](08-deploiement.md)).

## 8. Critères d'acceptation

- 100 % des suites de tests passent (vert) avant toute fusion dans `dev` puis `main`.
- Aucune régression introduite (réexécution complète en CI).
- Les vulnérabilités critiques/élevées remontées par `npm audit` sont traitées.

## 9. Hors périmètre

- **Tests de charge / performance** : non réalisés à ce stade (perspective d'évolution) ;
  la stratégie consisterait à mesurer la tenue de l'API sous montée en charge avec un
  outil dédié (k6, Artillery).
