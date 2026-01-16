import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Education() {
const [educations, setEducations] = useState([
    { id: 1, title: "", description: "", technologies: "" }, // 1 card par défaut
  ]);

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      { id: educations.length + 1, title: "", description: "", technologies: "" },
    ]);
  };

  const handleChange = (id, field, value) => {
    setEducations(educations.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDelete = (id) => {
    setEducations(educations.filter(p => p.id !== id));
  };

  return (
  <>
      <button className="btn btn-add" onClick={handleAddEducation}>
        <Plus size={16} /> Ajouter une formation
      </button>
      <div className="tab-panel">
        <div className="projects-container">

          {educations.map((education) => (
            <div key={education.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">Formation {education.id}</h2>
                {educations.length > 1 && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleDelete(education.id)}>
                    <Trash2 size={16} /> Supprimer
                  </button>
                )}
              </div>

              <div className="card-content">
                  <div className="form-group">
                    <label className="label">Diplôme</label>
                    <input className="input" placeholder="Licence" />
                  </div>

                  <div className="form-group">
                    <label className="label">Établissement</label>
                    <input className="input" placeholder="Université de Paris" />
                  </div>
                
                  <div className="form-group">
                    <label className="label">Période</label>
                    <input
                      type="date"
                      className="input"
                      placeholder="jj/mm/aaaa"
                    />
                  </div>

                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Spécialisation, mention..."
                    value={education.description}
                    onChange={(e) => handleChange(education.id, "description", e.target.value)}
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