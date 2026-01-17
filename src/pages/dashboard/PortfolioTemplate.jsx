import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import "../../styles/PortfolioTemplate.css";

export default function PortfolioTemplate() {
  // Récupère toutes les données depuis le contexte
  const {
    profile,
    skills,
    setSkills,
    projects,
    experiences,
    media
  } = usePortfolio();

  const [newSkill, setNewSkill] = useState("");

  // Construire une liste uniforme de liens à partir de l'objet media
  const mediaList = React.useMemo(() => {
    if (Array.isArray(media)) return media;
    if (!media) return [];
    const list = [];
    if (media.linkedin) list.push({ platform: "LinkedIn", url: media.linkedin });
    if (media.github) list.push({ platform: "GitHub", url: media.github });
    if (media.twitter) list.push({ platform: "Twitter", url: media.twitter });
    if (Array.isArray(media.websites)) {
      media.websites.filter(Boolean).forEach((url, idx) => {
        list.push({ platform: `Site ${idx + 1}`, url });
      });
    }
    return list;
  }, [media]);

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  return (
    <div className="portfolio-template">

      {/* === Accueil === */}
      <section className="accueil">
        <div className="accueil-container">
          <div className="accueil-left">
            <h1>{profile.firstName} {profile.lastName}</h1>
            <p className="role">{profile.title}</p>
            <p className="bio">{profile.bio}</p>
            <a href="#" className="btn-cv" target="_blank">Voir mon CV</a>
          </div>
          <div className="accueil-right">
            <div className="avatar">{profile.avatar || "👨‍💻"}</div>
          </div>
        </div>
      </section>

      {/* === Compétences === */}
      <section className="skills">
        <h2>Compétences</h2>
        <p>Liste tes compétences techniques et soft skills</p>

        <div className="skills-add">
          <input
            className="input"
            placeholder="Ex: React.js"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
          />
          <button className="btn-primary" onClick={addSkill}>Ajouter</button>
        </div>

        <div className="skills-list">
          {skills.map((skill, index) => (
            <span key={index} className="badge">{skill}</span>
          ))}
        </div>
      </section>

      {/* === Projets === */}
      <section className="projects">
        <h2>Projets</h2>
        <div className="projects-container">
          {projects?.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-list">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="badge">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Parcours / Expériences === */}
      <section className="parcours">
        <h2>Parcours Professionnel et Scolaire</h2>
        <div className="parcours-container">
          {experiences?.map((exp, i) => (
            <div key={i} className="parcours-item">
              <h3>{exp.title}</h3>
              <p>{exp.company}</p>
              <p>{exp.startDate} - {exp.endDate}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Contacts / Réseaux === */}
      <section className="media">
        <h2>Réseaux & Liens</h2>
        <ul className="media-list">
          {mediaList.map((item, i) => (
            <li key={i}><a href={item.url} target="_blank">{item.platform}</a></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
