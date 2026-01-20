// src/context/PortfolioContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { portfolioService, activityService } from "../services/api";
import { useAuth } from "./AuthContext";

const PortfolioContext = createContext();
export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ userId, children }) => {
  const { user, updateUserName } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
  });
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [media, setMedia] = useState({ 
    linkedin: "",
    github: "",
    twitter: "",
    websites: [], 
    links: [] 
  });
  const [loading, setLoading] = useState(true);

  // Récupère les données du portfolio lorsqu'un utilisateur est présent
  useEffect(() => {
    if (!user) {
      setLoading(false);
      // Réinitialiser les données quand utilisateur se déconnecte
      setProfile({
        firstName: "",
        lastName: "",
        title: "",
        bio: "",
        email: "",
        phone: "",
        location: "",
      });
      setSkills([]);
      setProjects([]);
      setExperiences([]);
      setEducation([]);
      setCertifications([]);
      setMedia({ 
        linkedin: "",
        github: "",
        twitter: "",
        websites: [], 
        links: [] 
      });
      return;
    }

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioService.getPortfolio();
        if (data.profile) {
          setProfile(data.profile);
        }
        if (data.skills) {
          setSkills(data.skills);
        }
        if (data.projects) {
          setProjects(data.projects);
        }
        if (data.experiences) {
          setExperiences(data.experiences);
        }
        if (data.education) {
          setEducation(data.education);
        }
        if (data.certifications) {
          setCertifications(data.certifications);
        }
        if (data.media) {
          setMedia(data.media);
        }
      } catch (err) {
        console.error("Erreur fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  // Met à jour le profil via l'API
  const saveProfile = async (updatedProfile) => {
    try {
      // Utiliser id ou userId pour compatibilité
      const currentUserId = user?.id || user?.userId;

      
      const data = await portfolioService.updatePortfolio({ 
        profile: updatedProfile,
        userId: currentUserId 
      });
      setProfile(data.profile); // met à jour le context avec les données sauvegardées
      
      // Mettre à jour le nom dans AuthContext si firstName/lastName ont changé
      if (updatedProfile.firstName || updatedProfile.lastName) {
        const fullName = `${updatedProfile.firstName || ''} ${updatedProfile.lastName || ''}`.trim();
        updateUserName(fullName);
      }
      
      // Enregistrer l'activité (non-bloquant)
      activityService.addActivity('Profil mis à jour', 'Informations personnelles').catch(err => 
        console.error("Erreur enregistrement activité:", err)
      );
      return data;
    } catch (err) {
      console.error("Erreur update profile:", err);
      throw err;
    }
  };

  const saveSkills = async (updatedSkills) => {
    try {
      const data = await portfolioService.updateSkills(updatedSkills);
      setSkills(data.skills || updatedSkills);
      // Enregistrer l'activité (non-bloquant)
      activityService.addActivity('Compétences mises à jour', `${updatedSkills.length} compétence(s)`).catch(err => 
        console.error("Erreur enregistrement activité:", err)
      );
      return data;
    } catch (err) {
      console.error("Erreur update skills:", err);
      throw err;
    }
  };

  const saveProjects = async (updatedProjects) => {
    try {
      const data = await portfolioService.updateProjects(updatedProjects);
      setProjects(data.projects || updatedProjects);
      // Enregistrer l'activité pour le dernier projet ajouté (non-bloquant)
      if (updatedProjects.length > projects.length) {
        const lastProject = updatedProjects[updatedProjects.length - 1];
        activityService.addActivity('Projet ajouté', lastProject.title || 'Nouveau projet').catch(err => 
          console.error("Erreur enregistrement activité:", err)
        );
      } else {
        activityService.addActivity('Projets mis à jour', `${updatedProjects.length} projet(s)`).catch(err => 
          console.error("Erreur enregistrement activité:", err)
        );
      }
      return data;
    } catch (err) {
      console.error("Erreur update projects:", err);
      throw err;
    }
  };

  const saveExperiences = async (updatedExperiences) => {
    try {
      const data = await portfolioService.updateExperiences(updatedExperiences);
      setExperiences(data.experiences || updatedExperiences);
      // Enregistrer l'activité pour la dernière expérience ajoutée (non-bloquant)
      if (updatedExperiences.length > experiences.length) {
        const lastExp = updatedExperiences[updatedExperiences.length - 1];
        activityService.addActivity('Expérience ajoutée', lastExp.position || 'Nouveau poste').catch(err => 
          console.error("Erreur enregistrement activité:", err)
        );
      } else {
        activityService.addActivity('Expériences mises à jour', `${updatedExperiences.length} expérience(s)`).catch(err => 
          console.error("Erreur enregistrement activité:", err)
        );
      }
      return data;
    } catch (err) {
      console.error("Erreur update experiences:", err);
      throw err;
    }
  };

  const saveEducation = async (updatedEducation) => {
    try {
      const data = await portfolioService.updateEducation(updatedEducation);
      setEducation(data.education || updatedEducation);
      // Enregistrer l'activité pour la dernière formation ajoutée (non-bloquant)
      if (updatedEducation.length > education.length) {
        const lastEdu = updatedEducation[updatedEducation.length - 1];
        activityService.addActivity('Formation ajoutée', lastEdu.diploma || 'Nouveau diplôme').catch(err => 
          console.error("Erreur enregistrement activité:", err)
        );
      } else {
        activityService.addActivity('Formations mises à jour', `${updatedEducation.length} formation(s)`).catch(err => 
          console.error("Erreur enregistrement activité:", err)
        );
      }
      return data;
    } catch (err) {
      console.error("Erreur update education:", err);
      throw err;
    }
  };

  const saveCertifications = async (updatedCertifications) => {
    try {
      const data = await portfolioService.updateCertifications(updatedCertifications);
      setCertifications(data.certifications || updatedCertifications);
      // Enregistrer l'activité pour la dernière certification ajoutée (non-bloquant)
      if (updatedCertifications.length > certifications.length) {
        const lastCert = updatedCertifications[updatedCertifications.length - 1];
        activityService.addActivity('Certification ajoutée', lastCert.name || 'Nouvelle certification').catch(err => 
          console.error("Erreur enregistrement activité:", err)
        );
      } else {
        activityService.addActivity('Certifications mises à jour', `${updatedCertifications.length} certification(s)`).catch(err => 
          console.error("Erreur enregistrement activité:", err)
        );
      }
      return data;
    } catch (err) {
      console.error("Erreur update certifications:", err);
      throw err;
    }
  };

  const saveMedia = async (updatedMedia) => {
    try {
      const data = await portfolioService.updateMedia(updatedMedia);
      setMedia(data.media || updatedMedia);
      // Enregistrer l'activité (non-bloquant)
      activityService.addActivity('Médias mis à jour', 'Réseaux sociaux et liens').catch(err => 
        console.error("Erreur enregistrement activité:", err)
      );
      return data;
    } catch (err) {
      console.error("Erreur update media:", err);
      throw err;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        setProfile,
        saveProfile,
        loading,
        skills,
        setSkills,
        saveSkills,
        projects,
        setProjects,
        saveProjects,
        experiences,
        setExperiences,
        saveExperiences,
        education,
        setEducation,
        saveEducation,
        certifications,
        setCertifications,
        saveCertifications,
        media,
        setMedia,
        saveMedia,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
