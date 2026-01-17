// src/context/PortfolioContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { portfolioService } from "../services/api";
import { useAuth } from "./AuthContext";

const PortfolioContext = createContext();
export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ userId, children }) => {
  const { user } = useAuth();
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
      const data = await portfolioService.updatePortfolio({ profile: updatedProfile });
      setProfile(data.profile); // met à jour le context avec les données sauvegardées
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
