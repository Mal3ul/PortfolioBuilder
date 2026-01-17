import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Education() {
  const [educations, setEducations] = useState([
    {
      id: 1,
      diploma: "",
      school: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      {
        id: Date.now(),
        diploma: "",
        school: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const handleChange = (id, field, value) => {
    setEducations((prev) =>
      prev.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const handleDelete = (id) => {
    setEducations((prev) => prev.filter((edu) => edu.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises :", educations);
    // Ici tu peux appeler ton API ou mettre à jour un state global
  };

  return (
    <>
      <button className="btn btn-add" onClick={handleAddEducation}>
        <Plus size={16} /> Ajouter une formation
      </button>

      <form className="tab-panel" onSubmit={handleSubmit}>
        <div className="projects-container">
          {educations.map((education, index) => (
            <div key={education.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">
                  Formation {index + 1}
                </h2>

                {educations.length > 1 && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(education.id)}
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                )}
              </div>

              <div className="card-content">
                <div className="form-group">
                  <label className="label">Diplôme</label>
                  <input
                    className="input"
                    placeholder="BTS SIO / Licence / Bachelor..."
                    value={education.diploma}
                    onChange={(e) =>
                      handleChange(
                        education.id,
                        "diploma",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Établissement</label>
                  <input
                    className="input"
                    placeholder="IRIS Strasbourg"
                    value={education.school}
                    onChange={(e) =>
                      handleChange(
                        education.id,
                        "school",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Date de début</label>
                    <input
                      type="date"
                      className="input"
                      value={education.startDate}
                      onChange={(e) =>
                        handleChange(
                          education.id,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Date de fin</label>
                    <input
                      type="date"
                      className="input"
                      value={education.endDate}
                      onChange={(e) =>
                        handleChange(
                          education.id,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Spécialisation, options, mention, projets réalisés..."
                    value={education.description}
                    onChange={(e) =>
                      handleChange(
                        education.id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="btn-container mt-4">
                <button type="submit" className="btn btn-add btn-primary">
                  Sauvegarder
                </button>
              </div>
            </div>
          ))}
        </div>
      </form>
    </>
  );
}
