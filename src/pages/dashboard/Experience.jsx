import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Experience() {
  const [experiences, setExperiences] = useState([
    { id: 1, title: "", description: "", technologies: "" }, // 1 card par défaut
  ]);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { id: experiences.length + 1, title: "", description: "", technologies: "" },
    ]);
  };

  const handleChange = (id, field, value) => {
    setExperiences(experiences.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDelete = (id) => {
    setExperiences(experiences.filter(p => p.id !== id));
  };

  return (
    <>
      <button className="btn btn-add" onClick={handleAddExperience}>
        <Plus size={16} /> Ajouter une expérience
      </button>
      <div className="tab-panel">
        <div className="projects-container">

          {experiences.map((experience) => (
            <div key={experience.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">Experience {experience.id}</h2>
                {experiences.length > 1 && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleDelete(experience.id)}>
                    <Trash2 size={16} /> Supprimer
                  </button>
                )}
              </div>

              <div className="card-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Poste</label>
                    <input className="input" placeholder="Développeur Full-Stack" />
                  </div>

                  <div className="form-group">
                    <label className="label">Entreprise</label>
                    <input className="input" placeholder="Google" />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Période</label>
                    <input
                      type="date"
                      className="input"
                      placeholder="jj/mm/aaaa"
                    />
                  </div>
                  <div className="form-group">
                    <br />
                    <input
                      type="date"
                      className="input"
                      placeholder="jj/mm/aaaa"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Description de l'expérience..."
                    value={experience.description}
                    onChange={(e) => handleChange(experience.id, "description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}