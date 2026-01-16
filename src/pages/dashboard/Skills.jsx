import { useState } from "react";
import "../../styles/Editor.css";

export default function Skills() {
  const [skills, setSkills] = useState([
    "React.js",
    "JavaScript",
    "HTML",
    "CSS",
  ]);

  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill)) return;

    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="tab-panel">
      {/* Header */}
      {/* <div>
        <h2 className="panel-title">Compétences</h2>
        <p className="panel-subtitle">
          Liste tes compétences techniques et soft skills
        </p>
      </div> */}

      {/* Card */}
      <div className="card">
        <div className="card-content">
          {/* Add skill */}
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
              <button className="btn btn-primary" onClick={handleAddSkill}>
                Ajouter
              </button>
            </div>
          </div>

          {/* Skills list */}
          <div className="form-group">
            <label className="label">Compétences actuelles</label>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <span key={index} className="badge badge-secondary skill-badge">
                  {skill}
                  <button
                    className="skill-remove"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
