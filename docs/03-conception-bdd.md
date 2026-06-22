# Conception de la base de données — Portfolio Builder

Ce document décrit la conception de la base de données relationnelle selon la démarche
**Merise** : modèle conceptuel (MCD), modèle logique (MLD) et modèle physique (MPD),
complétés par le dictionnaire de données.

Le SGBD cible est **PostgreSQL**. Le modèle physique est implémenté dans
[backend/schema.sql](../backend/schema.sql).

## 1. Modèle Conceptuel de Données (MCD)

Le MCD décrit les entités du domaine et leurs associations, indépendamment de toute
technologie.

> **Image à insérer :** `images/mcd.png`
>
> ![Modèle Conceptuel de Données](images/mcd.png)

**Spécification du MCD à dessiner (formalisme entité-association) :**

- **Entités :** `UTILISATEUR`, `PORTFOLIO`, `COMPETENCE`, `PROJET`, `EXPERIENCE`,
  `FORMATION`, `CERTIFICATION`, `MEDIA`, `SITE_WEB`, `LIEN`, `ACTIVITE`.
- **Associations et cardinalités :**

| Association | Entités | Cardinalités | Sens |
|-------------|---------|--------------|------|
| Possède | UTILISATEUR — PORTFOLIO | (1,1) — (1,1) | Un utilisateur possède un et un seul portfolio. |
| Contient | PORTFOLIO — COMPETENCE | (0,n) — (1,1) | Un portfolio contient 0..n compétences. |
| Contient | PORTFOLIO — PROJET | (0,n) — (1,1) | Un portfolio contient 0..n projets. |
| Contient | PORTFOLIO — EXPERIENCE | (0,n) — (1,1) | Un portfolio contient 0..n expériences. |
| Contient | PORTFOLIO — FORMATION | (0,n) — (1,1) | Un portfolio contient 0..n formations. |
| Contient | PORTFOLIO — CERTIFICATION | (0,n) — (1,1) | Un portfolio contient 0..n certifications. |
| Contient | PORTFOLIO — ACTIVITE | (0,n) — (1,1) | Un portfolio contient 0..n activités (journal). |
| Possède | PORTFOLIO — MEDIA | (0,n) — (1,1) | Un portfolio possède 0..n blocs média. |
| Regroupe | MEDIA — SITE_WEB | (0,n) — (1,1) | Un média regroupe 0..n sites web. |
| Regroupe | MEDIA — LIEN | (0,n) — (1,1) | Un média regroupe 0..n liens. |

> Remarque : `UTILISATEUR` — `PORTFOLIO` est une relation **1–1** (un portfolio par
> utilisateur). Le reste forme une arborescence à partir de `PORTFOLIO`.

## 2. Modèle Logique de Données (MLD)

Le MLD traduit le MCD en tables relationnelles. Les clés primaires sont soulignées,
les clés étrangères préfixées de `#`.

```
UTILISATEUR (id, name, email, password, role, reset_password_token,
             reset_password_expiry, last_login_at, inactivity_warning_sent_at,
             created_at, updated_at)

PORTFOLIO (id, #user_id, first_name, last_name, title, bio, email, phone,
           location, updated_at)

COMPETENCE (id, #portfolio_id, skill_name, created_at)

PROJET (id, #portfolio_id, title, description, technologies, github_url,
        live_url, image_url, created_at)

EXPERIENCE (id, #portfolio_id, position, company, start_date, end_date,
            description, created_at)

FORMATION (id, #portfolio_id, diploma, school, start_date, end_date,
           description, created_at)

CERTIFICATION (id, #portfolio_id, title, organization, date, description,
               created_at)

MEDIA (id, #portfolio_id, linkedin, github, twitter, created_at)

SITE_WEB (id, #media_id, url, created_at)

LIEN (id, #media_id, url, label, created_at)

ACTIVITE (id, #portfolio_id, action, details, name, timestamp, created_at)
```

Règle de passage MCD → MLD appliquée : chaque association **(1,1)–(0,n)** se traduit par
l'ajout de la clé étrangère du côté **« plusieurs »** (ex. `portfolio_id` dans `PROJET`).
La relation **1–1** UTILISATEUR–PORTFOLIO est portée par `user_id` (UNIQUE) dans `PORTFOLIO`.

## 3. Modèle Physique de Données (MPD)

Le MPD est l'implémentation SQL réelle ([backend/schema.sql](../backend/schema.sql)) :
types PostgreSQL, contraintes, clés étrangères `ON DELETE CASCADE` et index.

> **Image à insérer :** `images/mpd.png`
>
> ![Modèle Physique de Données](images/mpd.png)
>
> *Astuce : ce diagramme peut être généré automatiquement depuis la base avec un outil
> comme DBeaver (ER Diagram) ou pgAdmin, puis exporté en image.*

Points clés du MPD :

- Clés primaires `BIGINT` / `BIGSERIAL`.
- **Intégrité référentielle** : toutes les FK pointent vers la table parente avec
  `ON DELETE CASCADE` (supprimer un utilisateur supprime tout son portfolio).
- **Unicité** : `users.email` (UNIQUE), `portfolios.user_id` (UNIQUE → relation 1–1).
- **Contrainte de domaine** : `users.role CHECK (role IN ('user','admin'))`.
- **Index** : sur chaque clé étrangère et sur `users.email` / `users.last_login_at`
  (performance des recherches et de la tâche RGPD).

## 4. Dictionnaire de données

### Table `users`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK | Identifiant unique. |
| name | VARCHAR(255) | NOT NULL | Nom complet. |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email de connexion. |
| password | VARCHAR(255) | NOT NULL | Mot de passe haché (bcrypt). |
| role | VARCHAR(50) | DEFAULT 'user', CHECK | Rôle : `user` ou `admin`. |
| reset_password_token | VARCHAR(255) | NULL | Jeton de réinitialisation. |
| reset_password_expiry | BIGINT | NULL | Expiration du jeton (timestamp). |
| last_login_at | TIMESTAMP | NULL | Dernière connexion (RGPD). |
| inactivity_warning_sent_at | TIMESTAMP | NULL | Date d'avertissement d'inactivité. |
| created_at | TIMESTAMP | DEFAULT now | Date de création. |
| updated_at | TIMESTAMP | DEFAULT now | Dernière modification. |

### Table `portfolios`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK | Identifiant unique. |
| user_id | BIGINT | FK → users, NOT NULL, UNIQUE | Propriétaire (1–1). |
| first_name | VARCHAR(255) | NULL | Prénom affiché. |
| last_name | VARCHAR(255) | NULL | Nom affiché. |
| title | VARCHAR(255) | NULL | Titre professionnel. |
| bio | TEXT | NULL | Biographie. |
| email | VARCHAR(255) | NULL | Email de contact public. |
| phone | VARCHAR(20) | NULL | Téléphone. |
| location | VARCHAR(255) | NULL | Localisation. |
| updated_at | TIMESTAMP | DEFAULT now | Dernière modification. |

### Table `skills`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGSERIAL | PK | Identifiant unique. |
| portfolio_id | BIGINT | FK → portfolios, NOT NULL | Portfolio rattaché. |
| skill_name | VARCHAR(255) | NOT NULL | Nom de la compétence. |
| created_at | TIMESTAMP | DEFAULT now | Date de création. |

### Table `projects`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK | Identifiant unique. |
| portfolio_id | BIGINT | FK → portfolios, NOT NULL | Portfolio rattaché. |
| title | VARCHAR(255) | NOT NULL | Titre du projet. |
| description | TEXT | NULL | Description. |
| technologies | VARCHAR(500) | NULL | Technologies (JSON sérialisé). |
| github_url | VARCHAR(500) | NULL | Lien dépôt. |
| live_url | VARCHAR(500) | NULL | Lien démo. |
| image_url | VARCHAR(500) | NULL | Illustration. |
| created_at | TIMESTAMP | NULL | Date de création. |

### Table `experiences`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK | Identifiant unique. |
| portfolio_id | BIGINT | FK → portfolios, NOT NULL | Portfolio rattaché. |
| position | VARCHAR(255) | NOT NULL | Intitulé du poste. |
| company | VARCHAR(255) | NOT NULL | Entreprise. |
| start_date | DATE | NULL | Date de début. |
| end_date | DATE | NULL | Date de fin. |
| description | TEXT | NULL | Description. |
| created_at | TIMESTAMP | NULL | Date de création. |

### Table `education`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK | Identifiant unique. |
| portfolio_id | BIGINT | FK → portfolios, NOT NULL | Portfolio rattaché. |
| diploma | VARCHAR(255) | NOT NULL | Diplôme. |
| school | VARCHAR(255) | NOT NULL | Établissement. |
| start_date | DATE | NULL | Date de début. |
| end_date | DATE | NULL | Date de fin. |
| description | TEXT | NULL | Description. |
| created_at | TIMESTAMP | NULL | Date de création. |

### Table `certifications`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK | Identifiant unique. |
| portfolio_id | BIGINT | FK → portfolios, NOT NULL | Portfolio rattaché. |
| title | VARCHAR(255) | NOT NULL | Intitulé. |
| organization | VARCHAR(255) | NULL | Organisme. |
| date | DATE | NULL | Date d'obtention. |
| description | TEXT | NULL | Description. |
| created_at | TIMESTAMP | NULL | Date de création. |

### Table `media`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGSERIAL | PK | Identifiant unique. |
| portfolio_id | BIGINT | FK → portfolios, NOT NULL | Portfolio rattaché. |
| linkedin | VARCHAR(500) | NULL | Profil LinkedIn. |
| github | VARCHAR(500) | NULL | Profil GitHub. |
| twitter | VARCHAR(500) | NULL | Profil Twitter/X. |
| created_at | TIMESTAMP | DEFAULT now | Date de création. |

### Table `websites`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGSERIAL | PK | Identifiant unique. |
| media_id | BIGINT | FK → media, NOT NULL | Bloc média rattaché. |
| url | VARCHAR(500) | NOT NULL | URL du site. |
| created_at | TIMESTAMP | DEFAULT now | Date de création. |

### Table `links`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGSERIAL | PK | Identifiant unique. |
| media_id | BIGINT | FK → media, NOT NULL | Bloc média rattaché. |
| url | VARCHAR(500) | NOT NULL | URL du lien. |
| label | VARCHAR(255) | NULL | Libellé affiché. |
| created_at | TIMESTAMP | DEFAULT now | Date de création. |

### Table `activities`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK | Identifiant unique. |
| portfolio_id | BIGINT | FK → portfolios, NOT NULL | Portfolio rattaché. |
| action | VARCHAR(255) | NOT NULL | Type d'action journalisée. |
| details | TEXT | NULL | Détails de l'action. |
| name | VARCHAR(255) | NULL | Libellé. |
| timestamp | BIGINT | NULL | Horodatage (epoch). |
| created_at | TIMESTAMP | DEFAULT now | Date de création. |

## 5. Choix techniques de persistance

| Choix | Justification |
|-------|---------------|
| **PostgreSQL** (relationnel) | Données fortement structurées et reliées (intégrité référentielle, transactions ACID). |
| Accès via **couche `repositories/`** | Toutes les requêtes SQL centralisées, paramétrées (anti-injection). |
| **Transactions** (`withTransaction`) | Les mises à jour multi-tables (ex. portfolio complet) sont atomiques. |
| **Pas d'ORM** | Contrôle fin du SQL, dépendances réduites ; le pattern repository joue le rôle d'abstraction. |
