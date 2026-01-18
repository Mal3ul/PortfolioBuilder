import { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import "../../styles/Editor.css";
import AlertBanner from "../../components/AlertBanner";

export default function Skills() {
  const { skills, setSkills, saveSkills } = usePortfolio(); // On récupère le state global
  const [newSkill, setNewSkill] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) return;

    setSkills([...skills, trimmed]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveSkills(skills);
      setSaveError("");
      setSaveMessage("Compétences sauvegardées !");
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveMessage("");
      setSaveError("Erreur lors de la sauvegarde");
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <form className="tab-panel" onSubmit={handleSubmit}>
      <AlertBanner message={saveMessage} error={saveError} />
      <div className="card">
        <div className="card-content">
          {/* Ajouter une compétence */}
          <div className="form-group">
            <label className="label">Ajouter une compétence</label>
            <div className="skill-input-group">
              <input
                className="input"
                placeholder="Ex: React.js"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddSkill}
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Liste des compétences */}
          <div className="form-group">
            <label className="label">Compétences actuelles</label>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <span key={index} className="badge badge-secondary skill-badge">
                  {skill}
                  <button
                    type="button"
                    className="skill-remove"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bouton sauvegarder */}
          <div className="btn-container mt-4">
            <button type="submit" className="btn btn-add btn-primary">
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
