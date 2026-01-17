// src/context/PortfolioContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { portfolioService } from "../services/api";

const PortfolioContext = createContext();
export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ userId, children }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  // Récupère les données du portfolio au montage
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioService.getPortfolio();
        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error("Erreur fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

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

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        setProfile,
        saveProfile,
        loading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
