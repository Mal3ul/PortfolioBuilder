# Spécifications fonctionnelles — Portfolio Builder

Ce document formalise les besoins utilisateurs sous forme de **user stories** et de
**cas d'utilisation (use cases)**, selon une approche Agile.

## 1. User stories

Format : *En tant que [acteur], je veux [action] afin de [objectif].*

### 1.1 Authentification et compte

| ID | User story | Priorité |
|----|------------|----------|
| US-01 | En tant que **visiteur**, je veux créer un compte afin d'accéder à mon espace. | Haute |
| US-02 | En tant qu'**utilisateur**, je veux me connecter afin de gérer mon portfolio. | Haute |
| US-03 | En tant qu'**utilisateur**, je veux réinitialiser mon mot de passe oublié afin de récupérer l'accès à mon compte. | Haute |
| US-04 | En tant qu'**utilisateur**, je veux modifier mon email/mot de passe afin de garder mon compte à jour. | Moyenne |
| US-05 | En tant qu'**utilisateur**, je veux supprimer mon compte afin d'exercer mon droit à l'effacement. | Moyenne |

### 1.2 Gestion du portfolio

| ID | User story | Priorité |
|----|------------|----------|
| US-06 | En tant qu'**utilisateur**, je veux renseigner mon profil (nom, titre, bio, contact) afin de me présenter. | Haute |
| US-07 | En tant qu'**utilisateur**, je veux ajouter/modifier/supprimer mes compétences afin de valoriser mon savoir-faire. | Haute |
| US-08 | En tant qu'**utilisateur**, je veux gérer mes projets (titre, description, technologies, liens) afin de montrer mes réalisations. | Haute |
| US-09 | En tant qu'**utilisateur**, je veux gérer mes expériences professionnelles afin de présenter mon parcours. | Haute |
| US-10 | En tant qu'**utilisateur**, je veux gérer mes formations et certifications afin de présenter mon cursus. | Moyenne |
| US-11 | En tant qu'**utilisateur**, je veux ajouter mes liens et réseaux sociaux afin que l'on puisse me contacter. | Moyenne |

### 1.3 Consultation publique

| ID | User story | Priorité |
|----|------------|----------|
| US-12 | En tant que **visiteur**, je veux consulter le portfolio public d'un utilisateur afin de découvrir son profil. | Haute |

### 1.4 Administration

| ID | User story | Priorité |
|----|------------|----------|
| US-13 | En tant qu'**administrateur**, je veux lister tous les utilisateurs afin de gérer la plateforme. | Haute |
| US-14 | En tant qu'**administrateur**, je veux modifier le rôle d'un utilisateur afin d'attribuer des droits. | Moyenne |
| US-15 | En tant qu'**administrateur**, je veux supprimer un utilisateur ou un portfolio afin de modérer la plateforme. | Moyenne |

### 1.5 Système

| ID | User story | Priorité |
|----|------------|----------|
| US-16 | En tant que **système**, je veux avertir puis supprimer les comptes inactifs afin de respecter le RGPD. | Moyenne |

## 2. Cas d'utilisation (Use Cases)

### 2.1 Diagramme de cas d'utilisation

> **Image à insérer :** `images/use-case-diagram.png`
>
> ![Diagramme de cas d'utilisation](images/use-case-diagram.png)

**Spécification du diagramme à dessiner (draw.io / Figma) :**

- **Acteurs (à gauche) :** `Visiteur`, `Utilisateur` (hérite de Visiteur), `Administrateur`
  (hérite de Utilisateur). **Acteur secondaire (à droite) :** `Système (cron)`.
- **Cas d'utilisation (dans le système « Portfolio Builder ») :**
  - Visiteur : `Consulter un portfolio public`, `Créer un compte`, `Se connecter`,
    `Réinitialiser le mot de passe`.
  - Utilisateur : `Gérer son profil`, `Gérer ses compétences`, `Gérer ses projets`,
    `Gérer ses expériences`, `Gérer ses formations/certifications`, `Gérer ses liens`,
    `Modifier ses identifiants`, `Supprimer son compte`.
  - Administrateur : `Gérer les utilisateurs`, `Gérer les portfolios`, `Modifier un rôle`.
  - Système : `Avertir/supprimer les comptes inactifs`.
- **Relations :** `«include»` de toutes les actions de gestion vers `Se connecter`
  (authentification requise). Héritage entre acteurs (flèche triangle creux).

### 2.2 Descriptions détaillées des cas principaux

#### UC-01 — Créer un compte

| Champ | Valeur |
|-------|--------|
| Acteur principal | Visiteur |
| Précondition | Le visiteur n'est pas connecté. |
| Déclencheur | Le visiteur soumet le formulaire d'inscription. |
| **Scénario nominal** | 1. Le visiteur saisit nom, email, mot de passe.<br>2. Le système valide le format (email valide, mot de passe ≥ 6 caractères).<br>3. Le système vérifie l'unicité de l'email.<br>4. Le système hache le mot de passe et crée le compte.<br>5. Le système crée le portfolio associé.<br>6. Le système renvoie un token (connexion automatique). |
| **Scénarios alternatifs** | 2a. Format invalide → message d'erreur 400.<br>3a. Email déjà utilisé → message d'erreur 409. |
| Postcondition | Le compte et le portfolio sont créés ; l'utilisateur est connecté. |

#### UC-02 — Se connecter

| Champ | Valeur |
|-------|--------|
| Acteur principal | Utilisateur |
| Précondition | L'utilisateur possède un compte. |
| **Scénario nominal** | 1. L'utilisateur saisit email + mot de passe.<br>2. Le système vérifie l'email.<br>3. Le système compare le mot de passe au hash (bcrypt).<br>4. Le système met à jour `last_login_at`.<br>5. Le système renvoie un token JWT. |
| **Scénarios alternatifs** | 2a/3a. Identifiants invalides → erreur 401 (message générique anti-énumération). |
| Postcondition | L'utilisateur est authentifié et reçoit un token. |

#### UC-08 — Gérer ses projets

| Champ | Valeur |
|-------|--------|
| Acteur principal | Utilisateur |
| Précondition | L'utilisateur est connecté et possède un portfolio. |
| **Scénario nominal** | 1. L'utilisateur ajoute/modifie/supprime un projet.<br>2. Le système vérifie que le projet appartient à l'utilisateur (anti-IDOR).<br>3. Le système enregistre la modification.<br>4. Le système renvoie le projet à jour. |
| **Scénarios alternatifs** | 2a. Le projet n'appartient pas à l'utilisateur → erreur 404. |
| Postcondition | Le projet est créé, modifié ou supprimé. |

#### UC-12 — Consulter un portfolio public

| Champ | Valeur |
|-------|--------|
| Acteur principal | Visiteur |
| Précondition | Aucune (accès libre). |
| **Scénario nominal** | 1. Le visiteur accède à l'URL publique d'un portfolio.<br>2. Le système récupère le profil et ses relations.<br>3. Le système affiche la page portfolio. |
| **Scénarios alternatifs** | 1a. Utilisateur inexistant → page « introuvable » (404). |
| Postcondition | Le portfolio est affiché en lecture seule. |

#### UC-16 — Avertir/supprimer les comptes inactifs

| Champ | Valeur |
|-------|--------|
| Acteur principal | Système (cron) |
| Précondition | Tâche planifiée active. |
| **Scénario nominal** | 1. Le cron identifie les comptes inactifs depuis `INACTIVITY_DAYS`.<br>2. Le système envoie un email d'avertissement et marque `inactivity_warning_sent_at`.<br>3. Après `INACTIVITY_GRACE_DAYS` sans reconnexion, le système supprime le compte et ses données (cascade). |
| Postcondition | Comptes inactifs avertis puis supprimés (conformité RGPD). |

## 3. Règles de gestion

| ID | Règle |
|----|-------|
| RG-01 | Un email est unique sur la plateforme. |
| RG-02 | Un mot de passe contient au minimum 6 caractères et est stocké haché. |
| RG-03 | Un utilisateur possède exactement un portfolio (relation 1–1). |
| RG-04 | Un utilisateur ne peut modifier que ses propres données. |
| RG-05 | La suppression d'un utilisateur supprime en cascade son portfolio et toutes ses données. |
| RG-06 | Seul un administrateur accède aux fonctions d'administration. |
