# Veille technologique et de sécurité — Portfolio Builder

Ce document décrit la démarche de veille technologique et de sécurité mise en place pour
maintenir le projet à jour, fiable et sécurisé.

## 1. Objectifs

| Objectif | Description |
|----------|-------------|
| Sécurité | Identifier et corriger les vulnérabilités des dépendances et du code. |
| Pérennité | Suivre l'évolution des technologies utilisées (versions, dépréciations). |
| Montée en compétences | Se former en continu sur les bonnes pratiques. |

## 2. Domaines de veille

| Domaine | Sujets suivis |
|---------|---------------|
| Langages / runtime | Node.js (LTS), JavaScript (ECMAScript). |
| Front-end | React, Vite, React Router. |
| Back-end | Express, PostgreSQL, `pg`. |
| Sécurité | OWASP Top 10, CVE des dépendances, bonnes pratiques JWT/bcrypt. |
| DevOps | Docker, GitHub Actions, CI/CD. |

## 3. Sources de veille

| Type | Sources |
|------|---------|
| Sécurité | [OWASP](https://owasp.org/), bulletins CVE, [GitHub Security Advisories](https://github.com/advisories), Snyk. |
| Officielles | Blogs et notes de version (Node.js, React, PostgreSQL, Express). |
| Communautaires | MDN, Stack Overflow, dépôts GitHub, newsletters techniques. |
| Normes | RGPD (CNIL), RGAA (accessibilité). |

## 4. Outils de veille automatisée (dans le projet)

| Outil | Rôle | Intégration |
|-------|------|-------------|
| **`npm audit`** | Détecte les vulnérabilités connues des dépendances. | Exécuté dans la CI à chaque push/PR. |
| **GitHub Dependabot** | Alerte et propose des montées de version sécurité. | Activable sur le dépôt. |
| **ESLint** | Analyse statique du code (qualité, erreurs potentielles). | Exécuté dans la CI. |
| **Tests automatisés** | Détectent les régressions lors des mises à jour. | CI (bloquant). |

## 5. Processus de traitement d'une alerte de sécurité

1. **Détection** : alerte `npm audit` / Dependabot / CVE.
2. **Évaluation** : criticité (faible / moyenne / élevée / critique) et impact réel sur le projet.
3. **Correction** : mise à jour de la dépendance (`npm update` / montée de version majeure testée), ou contournement.
4. **Validation** : exécution complète des tests (non-régression).
5. **Déploiement** : via la chaîne CI/CD une fois les tests verts.

## 6. Rythme de veille

| Activité | Fréquence |
|----------|-----------|
| Lecture des sources / newsletters | Hebdomadaire. |
| Revue des alertes `npm audit` / Dependabot | À chaque CI + revue mensuelle. |
| Mise à jour des dépendances | Mensuelle (ou immédiate si vulnérabilité critique). |
| Veille approfondie (nouvelles versions majeures) | Trimestrielle. |

## 7. Bonnes pratiques de sécurité appliquées au projet

- Mots de passe hachés (bcrypt), jamais en clair.
- Requêtes SQL paramétrées (anti-injection).
- Authentification JWT + contrôle des rôles (RBAC) + anti-IDOR.
- Secrets hors du dépôt (`.env`, secrets GitHub).
- Dépendances auditées en continu (CI).
- Conformité RGPD (suppression des comptes inactifs, droit à l'effacement).
