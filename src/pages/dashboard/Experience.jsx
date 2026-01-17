import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Experience() {
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now(),
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const handleChange = (id, field, value) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleDelete = (id) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises :", experiences);
    // Ici tu peux appeler ton API ou mettre à jour un state global
  };

  return (
    <>
      <button className="btn btn-add" onClick={handleAddExperience}>
        <Plus size={16} /> Ajouter une expérience
      </button>

      <form className="tab-panel" onSubmit={handleSubmit}>
        <div className="projects-container">
          {experiences.map((experience, index) => (
            <div key={experience.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">
                  Expérience {index + 1}
                </h2>

                {experiences.length > 1 && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(experience.id)}
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                )}
              </div>

              <div className="card-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Poste</label>
                    <input
                      className="input"
                      placeholder="Développeur Full-Stack"
                      value={experience.position}
                      onChange={(e) =>
                        handleChange(
                          experience.id,
                          "position",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Entreprise</label>
                    <input
                      className="input"
                      placeholder="Google"
                      value={experience.company}
                      onChange={(e) =>
                        handleChange(
                          experience.id,
                          "company",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Date de début</label>
                    <input
                      type="date"
                      className="input"
                      value={experience.startDate}
                      onChange={(e) =>
                        handleChange(
                          experience.id,
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
                      value={experience.endDate}
                      onChange={(e) =>
                        handleChange(
                          experience.id,
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
                    placeholder="Description de l'expérience..."
                    value={experience.description}
                    onChange={(e) =>
                      handleChange(
                        experience.id,
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
