# Maquettes — Portfolio Builder

Ce document regroupe les maquettes fonctionnelles des écrans principaux. L'application
étant réalisée, les maquettes peuvent être complétées par des **captures d'écran** de
l'interface existante (Figma pour les wireframes, captures pour le rendu final).

## 1. Arborescence des écrans

```
Accueil (public)
├── Connexion
├── Inscription
├── Mot de passe oublié → Réinitialisation
├── Portfolio public (/portfolio/:id)
└── Espace connecté
    ├── Tableau de bord / Éditeur de portfolio
    │   ├── Profil
    │   ├── Compétences
    │   ├── Projets
    │   ├── Expériences
    │   ├── Formations / Certifications
    │   └── Liens & réseaux
    ├── Paramètres du compte (email, mot de passe, suppression)
    └── Administration (admin uniquement)
        ├── Liste des utilisateurs
        └── Liste des portfolios
```

## 2. Maquettes des écrans clés

Pour chaque écran : insérer le wireframe (Figma) et/ou la capture de l'écran réalisé.

### 2.1 Connexion / Inscription
> ![Maquette connexion](images/maquette-connexion.png)

**À représenter :** formulaire centré (email, mot de passe), lien « mot de passe oublié »,
lien vers l'inscription, bouton de validation.

### 2.2 Éditeur de portfolio (espace connecté)
> ![Maquette éditeur](images/maquette-editeur.png)

**À représenter :** navigation par sections (profil, compétences, projets…), formulaires
d'édition, ajout/suppression d'éléments, bouton d'enregistrement.

### 2.3 Portfolio public
> ![Maquette portfolio public](images/maquette-portfolio-public.png)

**À représenter :** en-tête (nom, titre, bio, contact), sections compétences, projets
(cartes), expériences, formations, liens/réseaux.

### 2.4 Administration
> ![Maquette administration](images/maquette-admin.png)

**À représenter :** tableau des utilisateurs (nom, email, rôle, actions), actions de
gestion des rôles et de suppression.

## 3. Principes ergonomiques (UX/UI)

| Principe | Application |
|----------|-------------|
| **Cohérence** | Composants et styles uniformes sur toutes les pages. |
| **Responsivité** | Mise en page adaptée mobile / tablette / desktop. |
| **Accessibilité (RGAA)** | Contrastes suffisants, navigation clavier, attributs ARIA, libellés de formulaires. |
| **Feedback** | Messages de confirmation et d'erreur explicites. |
| **Éco-conception** | Pages légères, pas de ressources superflues, requêtes optimisées. |
