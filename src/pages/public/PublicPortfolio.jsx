import PortfolioTemplate from "../dashboard/PortfolioTemplate";
import "../../styles/PortfolioTemplate.css";

// Données simulées
const demoUser = {
  profile: {
    name: "Jean Dupont",
    title: "Développeur Full-Stack",
    bio: "Passionné par le développement web et les nouvelles technologies.",
    avatar: "👨‍💻",
  },
  projects: [
    { id: 1, title: "Portfolio Personnel", description: "Mon portfolio dynamique.", technologies: ["React", "CSS"] },
    { id: 2, title: "Application E-commerce", description: "Site de vente en ligne.", technologies: ["React", "Node.js"] },
  ],
  skills: ["React.js", "Node.js", "MongoDB", "UI/UX Design"],
  experiences: [
    { title: "Développeur Web", company: "Agence Web", startDate: "2021", endDate: "2023", description: "Développement front-end et back-end" },
  ],
  certifications: [
    { title: "React Advanced", issuer: "Udemy" }
  ],
  media: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/jeandupont" },
    { platform: "GitHub", url: "https://github.com/jeandupont" }
  ]
};

export default function PublicPortfolio() {
  return <PortfolioTemplate userData={demoUser} />;
}
