import { createContext, useContext, useState } from "react";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
  });

  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [media, setMedia] = useState({
    linkedin: "",
    github: "",
    twitter: "",
    websites: [],
  });
  const [links, setLinks] = useState({
    linkedin: "",
    github: "",
    website: [],
  });

  const value = {
    profile,
    setProfile,

    experiences,
    setExperiences,

    education,
    setEducation,

    certifications,
    setCertifications,

    skills,
    setSkills,

    projects,
    setProjects,

    media,
    setMedia,

    links,
    setLinks,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }
  return context;
}
