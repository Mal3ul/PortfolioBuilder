import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Certifications() {
  const [certifications, setCertifications] = useState([
    { id: 1, title: "", description: "", technologies: "" }, // 1 card par défaut
  ]);

  const handleAddCertification = () => {
    setCertifications([
      ...certifications,
      { id: certifications.length + 1, title: "", description: "", technologies: "" },
    ]);
  };

  const handleChange = (id, field, value) => {
    setCertifications(certifications.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDelete = (id) => {
    setCertifications(certifications.filter(p => p.id !== id));
  };

  return (
    <>
      <button className="btn btn-add" onClick={handleAddCertification}>
        <Plus size={16} /> Ajouter une certification
      </button>
      <div className="tab-panel">
        <div className="projects-container">

          {certifications.map((certification) =>
          (
            <div key={certification.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">Certification {certification.id}</h2>
                {certifications.length > 1 && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleDelete(certification.id)}>
                    <Trash2 size={16} /> Supprimer
                  </button>
                )}
              </div>

              <div className="card-content">

                <div className="form-group">
                  <label className="label">Titre</label>
                  <input className="input" placeholder="AWS" />
                </div>

                <div className="form-group">
                  <label className="label">Organisme</label>
                  <input className="input" placeholder="Amazon" />
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
                    placeholder="Description..."
                    value={certification.description}
                    onChange={(e) => handleChange(certification.id, "description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )
          )
          }
        </div>
      </div>
    </>
  );
}