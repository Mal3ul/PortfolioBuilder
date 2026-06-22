# Gestion et pilotage de projet — Portfolio Builder

Ce document décrit la méthode de gestion de projet, l'organisation du travail et les
outils de suivi utilisés pour le développement de Portfolio Builder.

## 1. Méthode retenue

Le projet est mené en mode **Agile**, avec une approche inspirée de **Scrum/Kanban**
adaptée à une équipe réduite.

| Méthode | Décision | Justification |
|---------|----------|---------------|
| **Agile (Scrum/Kanban) — retenu** | ✅ | Itératif, livraisons fréquentes, adaptation au changement, priorisation continue. |
| Cycle en V | ❌ | Trop rigide ; spécifications figées en amont peu adaptées à un projet évolutif. |

**Principes appliqués :**

- Découpage en **itérations courtes** (sprints) avec un incrément livrable.
- **Backlog priorisé** : on traite d'abord la valeur la plus haute (MVP d'abord).
- **Tableau Kanban** : visualisation du flux (À faire / En cours / Terminé).
- **Intégration continue** : tests automatisés à chaque évolution.

## 2. Organisation Git (workflow)

| Branche | Rôle |
|---------|------|
| `main` | Production (déployée sur le VPS). |
| `dev` | Branche d'intégration (recette). |
| `feature/*`, `fix/*`, `docs/*` | Branches de travail dédiées à une tâche unique. |

**Règle :** une tâche = une branche, traitée séquentiellement, puis fusionnée dans `dev`
après validation, et enfin remontée vers `main` pour la mise en production.

## 3. Backlog produit (priorisé)

Priorisation MoSCoW : **M** = Must have, **S** = Should have, **C** = Could have.

| ID | Élément du backlog | Priorité | Sprint |
|----|--------------------|----------|--------|
| US-01/02/03 | Authentification (inscription, connexion, reset mot de passe) | M | 1 |
| US-06 | Gestion du profil | M | 1 |
| US-07/08 | Gestion des compétences et projets | M | 2 |
| US-09/10 | Gestion des expériences, formations, certifications | M | 2 |
| US-11 | Gestion des liens et réseaux | S | 2 |
| US-12 | Page portfolio publique | M | 3 |
| US-13/14/15 | Espace d'administration | S | 3 |
| US-04/05 | Modification identifiants / suppression de compte | S | 4 |
| US-16 | Nettoyage RGPD des comptes inactifs | C | 4 |

## 4. Planning prévisionnel (sprints)

> **Image à insérer :** `images/planning-gantt.png`
>
> ![Diagramme de Gantt](images/planning-gantt.png)

**Spécification du planning à dessiner (diagramme de Gantt) :**

| Sprint | Thème | Durée indicative |
|--------|-------|------------------|
| Sprint 1 | Authentification + profil | 2 semaines |
| Sprint 2 | Contenus du portfolio (compétences, projets, parcours) | 2 semaines |
| Sprint 3 | Page publique + administration | 2 semaines |
| Sprint 4 | RGPD, sécurité, tests, finitions | 2 semaines |

Sur le Gantt : une ligne par sprint, axe horizontal = semaines, barres pour la durée de
chaque thème, avec les jalons (fin de MVP, mise en production).

## 5. Suivi et qualité

| Activité | Mise en œuvre |
|----------|---------------|
| **Suivi des tâches** | Tableau Kanban (To do / In progress / Done). |
| **Revue de code** | Relecture avant fusion dans `dev`. |
| **Tests** | Suites unitaires, intégration, sécurité, non-régression (Vitest + Supertest). |
| **Intégration continue** | Exécution des tests via Docker (`make test`). |
| **Documentation** | Dossier `docs/` tenu à jour à chaque évolution majeure. |

## 6. Outils collaboratifs

| Besoin | Outil |
|--------|-------|
| Gestion de version | Git / GitHub |
| Suivi des tâches | Tableau Kanban (GitHub Projects / Trello) |
| Maquettage | Figma / draw.io |
| Communication | Réunions de travail (points d'avancement réguliers) |
| Conteneurisation / CI | Docker, GitHub Actions |

## 7. Cérémonies (rituels Agile)

| Rituel | Objet |
|--------|-------|
| Planification de sprint | Sélection et estimation des éléments du backlog. |
| Point d'avancement | Suivi quotidien/hebdomadaire des tâches en cours. |
| Revue de sprint | Démonstration de l'incrément livré. |
| Rétrospective | Amélioration continue du fonctionnement de l'équipe. |
