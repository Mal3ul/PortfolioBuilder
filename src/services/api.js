const baseURL = "/api";

// ✅ Fonction utilitaire pour ajouter JWT aux requêtes
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// ✅ Gestion d'erreur JWT (401)
const handleUnauthorized = (error) => {
  if (error.status === 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

const updatePortfolio = async (data) => {
  // Récupérer le userId depuis localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id || user.userId;
  
  const response = await fetch(`${baseURL}/portfolio`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...data, userId }), // Toujours inclure userId pour RBAC
  });
  if (!response.ok) {
    handleUnauthorized(response);
    throw new Error("Erreur lors de la mise à jour du portfolio");
  }
  return response.json();
};

export const portfolioService = {
  getPortfolio: async () => {
    const response = await fetch(`${baseURL}/portfolio`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      handleUnauthorized(response);
      throw new Error("Erreur lors de la récupération du portfolio");
    }
    return response.json();
  },

  updatePortfolio,

  updateSkills: async (skills) => {
    return updatePortfolio({ skills });
  },

  updateProjects: async (projects) => {
    return updatePortfolio({ projects });
  },

  updateExperiences: async (experiences) => {
    return updatePortfolio({ experiences });
  },

  updateEducation: async (education) => {
    return updatePortfolio({ education });
  },

  updateCertifications: async (certifications) => {
    return updatePortfolio({ certifications });
  },

  updateMedia: async (media) => {
    return updatePortfolio({ media });
  },
};

export const activityService = {
  getActivities: async () => {
    const response = await fetch(`${baseURL}/activities`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des activités");
    }
    return response.json();
  },

  addActivity: async (action, name) => {
    const response = await fetch(`${baseURL}/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, name }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de l'activité");
    }
    return response.json();
  },
};

export const authService = {
  login: async (credentials) => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error("Identifiants invalides");
    }
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'inscription");
    }
    return response.json();
  },

  changeEmail: async (newEmail, userId) => {
    const response = await fetch(`${baseURL}/auth/change-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newEmail, userId }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Erreur lors du changement d'email");
    }
    return response.json();
  },

  changePassword: async (currentPassword, newPassword, userId) => {
    const response = await fetch(`${baseURL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword, userId }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Erreur lors du changement de mot de passe");
    }
    return response.json();
  },};