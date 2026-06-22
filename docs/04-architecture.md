# Architecture de l'application — Portfolio Builder

Ce document présente l'architecture logicielle et technique de l'application. Il complète
la documentation technique détaillée de [ARCHITECTURE.md](ARCHITECTURE.md) par les
diagrammes de conception (multicouches, séquence, déploiement).

## 1. Style d'architecture retenu

L'application suit une **architecture multicouche** (n-tier), séparant clairement la
présentation, la logique métier et l'accès aux données.

| Style envisagé | Décision | Justification |
|----------------|----------|---------------|
| **Multicouche (retenu)** | ✅ | Adapté à une application de taille moyenne, simple à déployer, faible couplage entre couches, testable. |
| Microservices | ❌ | Surdimensionné pour le périmètre actuel ; complexité opérationnelle injustifiée. |
| SaaS / multi-tenant | ⚠️ Partiel | L'application est mutualisée (multi-utilisateurs) mais sans isolation par tenant. |

## 2. Architecture applicative en couches

Le back-end est découpé en couches à responsabilité unique : `routes` → `controllers`
→ `services` → `repositories` → base de données. Le détail est documenté dans
[ARCHITECTURE.md](ARCHITECTURE.md).

> **Image à insérer :** `images/architecture-couches.png`
>
> ![Architecture en couches](images/architecture-couches.png)

**Spécification du diagramme à dessiner :**

- Empiler de haut en bas, avec une flèche descendante « appelle » entre chaque bloc :
  1. **Front-end** — React + Vite (navigateur)
  2. ↓ *HTTP / JSON (API REST)*
  3. **routes/** — endpoints + middlewares (auth, rôles)
  4. **controllers/** — couche HTTP (lecture requête, réponse)
  5. **services/** — logique métier (règles, validations, transactions)
  6. **repositories/** — accès aux données (SQL paramétré)
  7. **PostgreSQL** — base de données
- Sur le côté, une bande « couches transverses » : `domain/` (POO), `middleware/`,
  `utils/`, `config/`.

## 3. Diagramme de séquence — Modifier un projet

Illustre le flux complet d'une requête authentifiée à travers les couches, avec le
contrôle anti-IDOR.

> **Image à insérer :** `images/sequence-modifier-projet.png`
>
> ![Diagramme de séquence — Modifier un projet](images/sequence-modifier-projet.png)

**Spécification du diagramme de séquence à dessiner :**

Participants (de gauche à droite) : `Utilisateur`, `Front (React)`, `Route`,
`Middleware (verifyToken/roles)`, `Controller`, `Service`, `Repository`, `PostgreSQL`.

Échanges :
1. Utilisateur → Front : modifie un projet et valide.
2. Front → Route : `PUT /api/projects/:id` (en-tête `Authorization: Bearer <token>`).
3. Route → Middleware : vérifie le token JWT et le rôle.
4. Middleware → Controller : requête validée (`req.user` renseigné).
5. Controller → Service : `updateProject(userId, id, data)`.
6. Service → Repository : `findById(id)` (vérification de propriété — anti-IDOR).
7. Repository → PostgreSQL : `SELECT`.
8. **Alt [le projet n'appartient pas à l'utilisateur]** : Service → Controller : `HttpError 404`.
9. **Sinon** : Service → Repository : `update(id, data)` → `UPDATE` SQL.
10. Repository → Service → Controller → Front : projet mis à jour (JSON 200).

## 4. Architecture technique / déploiement

> **Image à insérer :** `images/deploiement.png`
>
> ![Diagramme de déploiement](images/deploiement.png)

**Spécification du diagramme de déploiement à dessiner :**

- **Poste client** : navigateur web (application React servie en statique).
- **Serveur d'application** : conteneur Node.js + Express (API REST), derrière un
  reverse-proxy Nginx.
- **Serveur de base de données** : PostgreSQL.
- **Services externes** : API Brevo (envoi d'emails).
- **Tâche planifiée** : `node-cron` interne au serveur d'application (nettoyage RGPD).
- Liens : Navigateur ⇄ Nginx (HTTPS) ⇄ Node/Express ⇄ PostgreSQL ; Node → Brevo (SMTP/API).

## 5. Choix techniques et composants

| Couche | Technologie / composant | Justification |
|--------|-------------------------|---------------|
| Présentation | React + Vite, React Router | Composants réutilisables, routage SPA, build rapide. |
| API | Express 5 (Node.js, ESM) | Léger, middleware-centric, même langage que le front. |
| Accès données | `pg` (driver PostgreSQL) + pattern Repository | Contrôle du SQL, requêtes paramétrées, abstraction de la base. |
| Authentification | `jsonwebtoken`, `bcryptjs` | Auth stateless (JWT), hachage des mots de passe. |
| Emails | Nodemailer / API Brevo | Réinitialisation de mot de passe, avertissements RGPD. |
| Tâches planifiées | `node-cron` | Nettoyage automatique des comptes inactifs. |
| Conteneurisation | Docker / Docker Compose | Environnements reproductibles (dev, test, prod). |
| Tests | Vitest + Supertest | Unitaires, intégration, sécurité, non-régression. |

## 6. Patrons de conception (design patterns)

| Patron | Usage dans le projet |
|--------|----------------------|
| **Layered architecture** | Séparation routes/controllers/services/repositories. |
| **Repository** | Isolation de l'accès aux données. |
| **Value Object** (POO) | `Email`, `Password` (encapsulation + validation + immutabilité). |
| **Middleware (chaîne de responsabilité)** | `verifyToken`, `roles`, `errorHandler`. |
| **Gestion centralisée des erreurs** | `HttpError` + `asyncHandler` + `errorHandler`. |
