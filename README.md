# Portfolio Builder

**Portfolio Builder** est une application web qui permet aux utilisateurs de créer, personnaliser et partager leur portfolio. 

---

## Technologies utilisées

- **Frontend :** React, React Router, Lucide Icons    
- **Base de données :** PostgreSQL 

---

## Installation et lancement

1. Cloner le dépôt public :

```bash
git clone https://github.com/Mal3ul/PortfolioBuilder.git
```

2. Installer les dépendances :

```bash
npm create vite@latest . —- -—template react
npm install react-router-dom lucide-react
```
3. Lancer l’application :

```bash
npm run dev
```

4. L’application sera accessible sur : 

```bash
http://localhost:3000
```

## Structure du projet :
```
/src
|  App.css
|  App.jsx
|  index.css
|  main.jsx
├─  /layout
|    AdminLayout.jsx
|    DashboardLayout.jsx
|    PublicLayout.jsx
├─  /components
|    Footer.jsx
|    Sidebar.jsx
|    Header.jsx
|    HeaderHome.page.jsx
├─  /pages
├─  ├─/admin
|   |    AdminHome.jsx
|   |    AdminTemplates.jsx
|   |    AdminUsers.jsx
├─  ├─/dashboard
|   |    Certifications.jsx
|   |    DashboardHome.jsx
|   |    Education.jsx
|   |    Experience.jsx
|   |    Media.jsx
|   |    Profile.jsx
|   |    Projects.jsx
|   |    Settings.jsx
|   |    Skills.jsx
|   |    Templates.jsx
├─  ├─/publics
|   |    Home.jsx
|   |    Login.jsx
|   |    PublicPortfolio.jsx
|   |    Register.jsx
├─  /routes
|     Router.jsx
├─  /styles
|     AuthPage.css
|     Dashboard.css
|     LandingPage.css
|     Public.css
```
## API REST :

| Route                     | Méthode | Description                                      | Exemple                                                                           | Codes HTTP    |
| ------------------------- | ------- | ------------------------------------------------ | --------------------------------------------------------------------------------- | ------------- |
| `/api/auth/register`      | POST    | Créer un compte utilisateur                      | `{ "name": "Jean Dupont", "email": "email@example.com", "password": "12345" }`    | 201, 400      | 
| `/api/auth/login`         | POST    | Connecter un utilisateur                         | `{ "email": "email@example.com", "password": "12345" }`                           | 200, 401      |
| `/api/portfolio/:userId`  | GET     | Récupérer les données du portfolio               | -                                                                                 | 200, 404      |
| `/api/portfolio/:userId`  | PUT     | Mettre à jour les informations du portfolio      | `{ "bio": "...", "title": "...", "avatar": "url" }`                               | 200, 400, 404 |
| `/api/projects/:userId`   | GET     | Récupérer la liste des projets                   | -                                                                                 | 200, 404      |
| `/api/projects`           | POST    | Ajouter un projet                                | `{ "title": "Projet 1", "description": "...", "technologies": ["React", "API"] }` | 201, 400      |
| `/api/projects/:projectId`| PUT     | Mettre à jour un projet existant                 | `{ "title": "Projet modifié", "description": "...", "technologies": [...] }`      | 200, 400, 404 |
| `/api/projects/:projectId`| DELETE  | Supprimer un projet                              | -                                                                                 | 204, 404      |
| `/api/skills/:userId`     | GET     | Récupérer les compétences de l’utilisateur       | -                                                                                 | 200, 404      |
| `/api/skills`             | POST    | Ajouter une compétence                           | `{ "skill": "React", "description": "..."} `                                      | 201, 400      |
| `/api/skills/:skillId`    | PUT     | Mettre à jour une compétence                     | `{ "skill": "React avancé", "description": "..."} `                               | 200, 400, 404 |
| `/api/skills/:skillId`    | DELETE  | Supprimer une compétence                         | -                                                                                 | 204, 404      |
| `/api/activities/:userId` | GET     | Récupérer l’historique d’activité                | -                                                                                 | 200, 404      |
