# Portfolio Builder

**Portfolio Builder** est une plateforme web complète permettant aux utilisateurs de créer, personnaliser et partager leur portfolio.

---

## Technologies utilisées

### Frontend
- **React** + **Vite**
- **React Router**
- **Lucide Icons**

### Backend
- **Node.js** + **Express**
- **PostgreSQL** 
- **JWT** 
- **Nodemailer**

---

## Installation et lancement

```bash
# Cloner le dépôt
git clone https://github.com/Mal3ul/PortfolioBuilder.git
cd PortfolioBuilder

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application est accessible sur `http://localhost:5173`

### Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configuration PostgreSQL, JWT_SECRET, SMTP_HOST, etc.

```
---

## Structure du projet

```

PortfolioBuilder/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── SidebarAdmin.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── AlertBanner.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx
│   │   ├── dashboard/
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Experience.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Education.jsx
│   │   │   ├── Certifications.jsx
│   │   │   ├── Media.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── PortfolioTemplate.jsx
│   │   │   ├── PortfolioEditor.jsx
│   │   │   └── EditorLayout.jsx
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── PublicPortfolio.jsx
│   │   │   └── Error.jsx
│   ├── layouts/
│   │   ├── DashboardLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── EditorLayout.jsx
│   │   └── PublicLayout.jsx
│   ├── routes/
│   │   └── Router.jsx
│   ├── context/
│   │   ├── PortfolioContext.jsx
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   └── styles/
│       ├── App.css
│       ├── Dashboard.css
│       ├── Editor.css
│       ├── AuthPage.css
│       ├── LandingPage.css
│       └── PortfolioTemplate.css
├── backend/
│   ├── server.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── portfolio.controller.js
│   │   ├── projects.controller.js
│   │   ├── skills.controller.js
│   │   ├── activities.controller.js
│   │   └── media.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── portfolio.routes.js
│   │   ├── projects.routes.js
│   │   ├── skills.routes.js
│   │   ├── activities.routes.js
│   │   └── admin.routes.js
│   ├── config/
│   │   └── database.js
│   └── data/
│       ├── user.json
│       └── portfolio.json
└── package.json
```



## API REST

### Authentification (`/api/auth`)
| Route | Méthode | Description | Auth |
|-------|---------|-------------|------|
| `/api/auth/register` | POST | Créer un compte utilisateur | ❌ |
| `/api/auth/login` | POST | Connecter un utilisateur | ❌ |
| `/api/auth/forgot-password` | POST | Demander réinitialisation mot de passe | ❌ |
| `/api/auth/reset-password` | POST | Réinitialiser le mot de passe | ❌ |

### Portfolio (`/api/portfolio`)
| Route | Méthode | Description | Auth | Rôle |
|-------|---------|-------------|------|------|
| `/api/portfolio` | GET | Récupérer le portfolio de l'utilisateur connecté | ✅ | user/admin |
| `/api/portfolio/user/:userId` | GET | Récupérer le portfolio d'un utilisateur (public) | ❌ | - |
| `/api/portfolio` | POST | Créer/Initialiser le portfolio | ✅ | user/admin |
| `/api/portfolio` | PUT | Mettre à jour le portfolio | ✅ | user/admin |

### Médias (`/api/media`)
| Route | Méthode | Description | Auth | Rôle |
|-------|---------|-------------|------|------|
| `/api/media` | PUT | Mettre à jour image profil et CV | ✅ | user/admin |

### Projets (`/api/projects`)
| Route | Méthode | Description | Auth | Rôle |
|-------|---------|-------------|------|------|
| `/api/projects/:userId` | GET | Lister les projets d'un utilisateur (public) | ❌ | - |
| `/api/projects` | POST | Créer un projet | ✅ | user/admin |
| `/api/projects/:projectId` | PUT | Modifier un projet | ✅ | user/admin |
| `/api/projects/:projectId` | DELETE | Supprimer un projet | ✅ | user/admin |

### Compétences (`/api/skills`)
| Route | Méthode | Description | Auth | Rôle |
|-------|---------|-------------|------|------|
| `/api/skills/:userId` | GET | Lister les compétences d'un utilisateur (public) | ❌ | - |
| `/api/skills` | POST | Ajouter une compétence | ✅ | user/admin |
| `/api/skills` | PUT | Mettre à jour TOUTES les compétences | ✅ | user/admin |
| `/api/skills/:skillId` | PUT | Modifier une compétence | ✅ | user/admin |
| `/api/skills/:skillId` | DELETE | Supprimer une compétence | ✅ | user/admin |

### Activités (`/api/activities`)
| Route | Méthode | Description | Auth | Rôle |
|-------|---------|-------------|------|------|
| `/api/activities` | GET | Récupérer les activités de l'utilisateur | ✅ | user/admin |
| `/api/activities` | POST | Ajouter une activité | ✅ | user/admin |

### Administration (`/api/admin`)
| Route | Méthode | Description | Auth | Rôle |
|-------|---------|-------------|------|------|
| `/api/admin/users` | GET | Lister tous les utilisateurs | ✅ | admin |
| `/api/admin/portfolios` | GET | Lister tous les portfolios | ✅ | admin |
| `/api/admin/users/:userId/role` | PATCH | Modifier le rôle d'un utilisateur | ✅ | admin |
| `/api/admin/users/:userId` | DELETE | Supprimer un utilisateur | ✅ | admin |
| `/api/admin/portfolios/:portfolioId` | DELETE | Supprimer un portfolio | ✅ | admin |
