import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function PortfolioTemplate({ userData }) {
  const { profile, projects = [], skills = [], experiences = [], education = [], certifications = [], media = [] } = userData || {};
  const [skillsSortOrder, setSkillsSortOrder] = useState("none"); // "asc" | "desc" | "none"
  const [experiencesSortOrder, setExperiencesSortOrder] = useState("none");
  const [educationSortOrder, setEducationSortOrder] = useState("none");
  const [certificationsSortOrder, setCertificationsSortOrder] = useState("none");

  // Fonction pour ouvrir le CV dans un nouvel onglet
  const handleDownloadCV = () => {
    // Chercher le cvFile dans userData.media si c'est un objet
    const cvFile = userData?.media?.cvFile || null;
    const cvFileName = userData?.media?.cvFileName || "CV.pdf";
    

    
    if (cvFile) {
      // Ouvrir le PDF dans un nouvel onglet
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>${cvFileName}</title></head>
            <body style="margin:0;">
              <iframe src="${cvFile}" style="width:100%;height:100vh;border:none;"></iframe>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        alert("Veuillez autoriser les popups pour voir le CV");
      }
      
      // Version téléchargement (commentée)
      // const link = document.createElement('a');
      // link.href = cvFile;
      // link.download = cvFileName;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    } else {
      alert("Aucun CV disponible");
    }
  };

  // Fonction pour trier les compétences
  const getSortedSkills = () => {
    const skillsCopy = [...skills];
    if (skillsSortOrder === "asc") {
      return skillsCopy.sort((a, b) => a.localeCompare(b));
    } else if (skillsSortOrder === "desc") {
      return skillsCopy.sort((a, b) => b.localeCompare(a));
    }
    return skillsCopy;
  };

  // Fonction pour trier les expériences par date
  const getSortedExperiences = () => {
    const expCopy = [...experiences];
    if (experiencesSortOrder === "asc") {
      return expCopy.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (experiencesSortOrder === "desc") {
      return expCopy.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }
    return expCopy;
  };

  // Fonction pour trier les formations par date
  const getSortedEducation = () => {
    const eduCopy = [...education];
    if (educationSortOrder === "asc") {
      return eduCopy.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (educationSortOrder === "desc") {
      return eduCopy.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }
    return eduCopy;
  };

  // Fonction pour trier les certifications par date
  const getSortedCertifications = () => {
    const certCopy = [...certifications];
    if (certificationsSortOrder === "asc") {
      return certCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (certificationsSortOrder === "desc") {
      return certCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return certCopy;
  };

  return (
    <div className="portfolio-template">
      {/* Header / Navbar */}
      <header className="portfolio-header">
        <nav className="portfolio-navbar">
          <div className="container-portfolio">
            <a href="#accueil" className="portfolio-logo">{profile?.name || "Portfolio"}</a>
            <button className="menu-toggle" aria-label="Menu">
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
            </button>
            {/* <ul className="nav-links">
              <li><a href="#accueil">Accueil</a></li>
              <li><a href="#parcours">Parcours</a></li>
              <li><a href="#projets">Projets</a></li>
              <li><a href="#competences">Compétences</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul> */}
          </div>
        </nav>
      </header>

      {/* Section Accueil / Hero */}
      <section id="accueil" className="hero-section">
        <div className="container-portfolio">
          <div className="hero-flex">
            <div className="hero-content">
              <h1>{profile?.name || "Votre Nom"}</h1>
              <h2 className="hero-title">{profile?.title || "Votre Titre"}</h2>
              <p className="hero-bio">{profile?.bio || "Votre biographie professionnelle."}</p>
              <button onClick={handleDownloadCV} className="btn-primary" style={{ cursor: 'pointer', border: 'none' }}>
                {userData?.media?.cvFile ? "Voir mon CV" : "Me Contacter"}
              </button>
            </div>
            <div className="hero-image">
              <div className="avatar-large">
                {profile?.avatar && profile.avatar.startsWith('data:image') ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name || "Photo de profil"} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  profile?.avatar || "👤"
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Compétences */}
      {skills.length > 0 && (
        <section id="competences" className="skills-section">
          <div className="container-portfolio">
            <div className="skills-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Mes Compétences</h2>
              <div className="sort-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSkillsSortOrder(skillsSortOrder === "asc" ? "none" : "asc")}
                  className={`btn btn-sm ${skillsSortOrder === "asc" ? "btn-primary" : "btn-outline"}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  title="Trier A-Z"
                >
                  <ArrowUp size={14} /> A-Z
                </button>
                <button
                  type="button"
                  onClick={() => setSkillsSortOrder(skillsSortOrder === "desc" ? "none" : "desc")}
                  className={`btn btn-sm ${skillsSortOrder === "desc" ? "btn-primary" : "btn-outline"}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  title="Trier Z-A"
                >
                  <ArrowDown size={14} /> Z-A
                </button>
              </div>
            </div>
            <div className="tech-tags">
              {getSortedSkills().map((skill, index) => (
                <span key={index} className="tech-tag">{skill}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Parcours / Expériences */}
      {experiences.length > 0 && (
        <section id="parcours" className="parcours-section">
          <div className="container-portfolio">
            <div className="skills-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Mes Expériences</h2>
              <div className="sort-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setExperiencesSortOrder(experiencesSortOrder === "desc" ? "none" : "desc")}
                  className={`btn btn-sm ${experiencesSortOrder === "desc" ? "btn-primary" : "btn-outline"}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  title="Plus récent d'abord"
                >
                  <ArrowDown size={14} /> Récent
                </button>
                <button
                  type="button"
                  onClick={() => setExperiencesSortOrder(experiencesSortOrder === "asc" ? "none" : "asc")}
                  className={`btn btn-sm ${experiencesSortOrder === "asc" ? "btn-primary" : "btn-outline"}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  title="Plus ancien d'abord"
                >
                  <ArrowUp size={14} /> Ancien
                </button>
              </div>
            </div>
            <div className="parcours-container">
              {getSortedExperiences().map((exp, index) => (
                <div key={index} className="parcours-item">
                  <h3>{exp.title}</h3>
                  <p className="parcours-company">{exp.company}</p>
                  <p className="parcours-date">{exp.startDate} - {exp.endDate || "Présent"}</p>
                  <p className="parcours-description">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Projets */}
      {projects.length > 0 && (
        <section id="projets" className="projects-section">
          <div className="container-portfolio">
            <h2 className="section-title">Mes Réalisations</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="tech-tags">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Formations */}
      {education.length > 0 && (
        <section id="formations" className="parcours-section">
          <div className="container-portfolio">
            <div className="skills-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Mes Formations</h2>
              <div className="sort-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEducationSortOrder(educationSortOrder === "desc" ? "none" : "desc")}
                  className={`btn btn-sm ${educationSortOrder === "desc" ? "btn-primary" : "btn-outline"}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  title="Plus récent d'abord"
                >
                  <ArrowDown size={14} /> Récent
                </button>
                <button
                  type="button"
                  onClick={() => setEducationSortOrder(educationSortOrder === "asc" ? "none" : "asc")}
                  className={`btn btn-sm ${educationSortOrder === "asc" ? "btn-primary" : "btn-outline"}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  title="Plus ancien d'abord"
                >
                  <ArrowUp size={14} /> Ancien
                </button>
              </div>
            </div>
            <div className="parcours-container">
              {getSortedEducation().map((edu, index) => (
                <div key={edu.id || index} className="parcours-item">
                  <h3>{edu.diploma}</h3>
                  <p className="parcours-company">{edu.school}</p>
                  <p className="parcours-date">{edu.startDate} - {edu.endDate || "Présent"}</p>
                  <p className="parcours-description">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Certifications */}
      {certifications.length > 0 && (
        <section id="certifications" className="projects-section">
          <div className="container-portfolio">
            <div className="skills-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Mes Certifications</h2>
              <div className="sort-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCertificationsSortOrder(certificationsSortOrder === "desc" ? "none" : "desc")}
                  className={`btn btn-sm ${certificationsSortOrder === "desc" ? "btn-primary" : "btn-outline"}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  title="Plus récent d'abord"
                >
                  <ArrowDown size={14} /> Récent
                </button>
                <button
                  type="button"
                  onClick={() => setCertificationsSortOrder(certificationsSortOrder === "asc" ? "none" : "asc")}
                  className={`btn btn-sm ${certificationsSortOrder === "asc" ? "btn-primary" : "btn-outline"}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  title="Plus ancien d'abord"
                >
                  <ArrowUp size={14} /> Ancien
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {getSortedCertifications().map((cert) => (
                <div key={cert.id || cert.title} className="project-card">
                  <h3>{cert.title}</h3>
                  <p className="parcours-company">{cert.organization || cert.issuer || "Organisme non renseigné"}</p>
                  <p className="parcours-date">{cert.date || "Date non renseignée"}</p>
                  {cert.description && <p>{cert.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer / Contact */}
      <footer id="contact" className="portfolio-footer">
        <div className="container-portfolio">
          <h3>Restons en contact</h3>
          {media?.links && media.links.length > 0 && (
            <ul className="social-links">
              {media.links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p>&copy; {new Date().getFullYear()} {profile?.name || "Portfolio"}. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
