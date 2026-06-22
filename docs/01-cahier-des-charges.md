# Cahier des charges — Portfolio Builder

## 1. Contexte et présentation du projet

**Portfolio Builder** est une application web permettant à toute personne (développeur,
designer, étudiant, freelance…) de créer, gérer et publier un portfolio professionnel en
ligne, sans compétences techniques.

L'utilisateur saisit ses informations (profil, compétences, projets, expériences,
formations, certifications, liens) via une interface d'administration ; l'application
génère une page portfolio publique consultable par n'importe qui via une URL.

## 2. Objectifs

| Objectif | Description |
|----------|-------------|
| Simplicité | Permettre la création d'un portfolio complet sans connaissances techniques. |
| Autonomie | L'utilisateur gère seul l'intégralité de son contenu. |
| Visibilité | Offrir une page publique partageable et présentable à un recruteur/client. |
| Sécurité | Protéger les comptes et les données personnelles (RGPD). |

## 3. Périmètre fonctionnel

### 3.1 Dans le périmètre (MVP)

- Création de compte, connexion, réinitialisation de mot de passe.
- Gestion du profil (nom, titre, biographie, coordonnées).
- Gestion des compétences, projets, expériences, formations, certifications.
- Gestion des liens et réseaux sociaux (LinkedIn, GitHub, sites web).
- Génération d'une page portfolio publique.
- Espace d'administration réservé aux administrateurs (gestion des utilisateurs).
- Suppression automatique des comptes inactifs (conformité RGPD).

### 3.2 Hors périmètre (évolutions futures)

- Thèmes graphiques personnalisables par l'utilisateur.
- Nom de domaine personnalisé.
- Statistiques de consultation du portfolio.
- Export PDF du portfolio.

## 4. Acteurs

| Acteur | Rôle |
|--------|------|
| **Visiteur** | Consulte un portfolio public, sans compte. |
| **Utilisateur** | Personne inscrite qui gère son propre portfolio. |
| **Administrateur** | Gère les utilisateurs et les portfolios de la plateforme. |
| **Système (cron)** | Tâche planifiée qui avertit puis supprime les comptes inactifs. |

## 5. Contraintes

### 5.1 Contraintes techniques

| Domaine | Choix | Justification |
|---------|-------|---------------|
| Front-end | React + Vite | Écosystème mature, rendu rapide, composants réutilisables. |
| Back-end | Node.js + Express | Même langage front/back (JavaScript), large écosystème. |
| Base de données | PostgreSQL | Base relationnelle robuste, intégrité référentielle, transactions. |
| Authentification | JWT + bcryptjs | Standard d'authentification stateless, hachage des mots de passe. |
| Hébergement | Render (back + base), VPS (prod) | Déploiement simple, intégration continue. |

### 5.2 Contraintes de sécurité

- Mots de passe **hachés** (jamais stockés en clair).
- Requêtes SQL **paramétrées** (anti-injection).
- Contrôle d'accès basé sur les rôles (**RBAC**) et vérification de propriété (**anti-IDOR**).
- Secrets (clés, identifiants base) **hors du dépôt Git**.

### 5.3 Contraintes légales (RGPD)

- Mentions légales et politique de confidentialité accessibles.
- Droit à l'effacement : suppression du compte et des données associées (cascade).
- Minimisation : suppression automatique des comptes inactifs après une période définie.

## 6. Exigences non fonctionnelles

| Exigence | Cible |
|----------|-------|
| Performance | Temps de réponse API < 500 ms sur les opérations courantes. |
| Accessibilité | Conformité RGAA (contrastes, navigation clavier, attributs ARIA). |
| Responsivité | Interface utilisable sur mobile, tablette et desktop. |
| Maintenabilité | Architecture en couches, code documenté, tests automatisés. |
| Disponibilité | Application accessible 24/7. |

## 7. Livrables

- Application web fonctionnelle (front + back + base).
- Dossier de conception (ce dossier `docs/`).
- Code source documenté et testé.
- Documentation d'architecture.
