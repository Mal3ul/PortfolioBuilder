# Dossier de conception — Portfolio Builder

Ce dossier regroupe la documentation de conception et d'architecture du projet
(référentiel RNCP — Bloc 2 : *Concevoir et organiser une application*).

## Sommaire

| Document | Contenu |
|----------|---------|
| [01 — Cahier des charges](01-cahier-des-charges.md) | Contexte, objectifs, périmètre, acteurs, contraintes, exigences. |
| [02 — Spécifications fonctionnelles](02-specifications-fonctionnelles.md) | User stories, cas d'utilisation, règles de gestion. |
| [03 — Conception de la base de données](03-conception-bdd.md) | MCD, MLD, MPD, dictionnaire de données. |
| [04 — Architecture](04-architecture.md) | Architecture multicouche, diagrammes de séquence et de déploiement. |
| [05 — Gestion de projet](05-gestion-de-projet.md) | Méthode Agile, backlog, planning, outils. |
| [06 — Maquettes](06-maquettes.md) | Arborescence des écrans et maquettes fonctionnelles. |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Documentation technique détaillée (couches, flux, tests). |

## Diagrammes

Les diagrammes sont à réaliser dans un outil externe (draw.io / Figma) puis à déposer
dans `docs/images/`. Chaque emplacement est indiqué dans les documents avec sa
spécification (contenu attendu) :

| Image attendue | Document | Type |
|----------------|----------|------|
| `use-case-diagram.png` | 02 | Diagramme de cas d'utilisation (UML) |
| `mcd.png` | 03 | Modèle conceptuel de données |
| `mpd.png` | 03 | Modèle physique (générable via DBeaver/pgAdmin) |
| `architecture-couches.png` | 04 | Architecture en couches |
| `sequence-modifier-projet.png` | 04 | Diagramme de séquence |
| `deploiement.png` | 04 | Diagramme de déploiement |
| `planning-gantt.png` | 05 | Planning (Gantt) |
| `maquette-*.png` | 06 | Maquettes / captures d'écran |
