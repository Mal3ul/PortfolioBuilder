import { usePortfolio } from "../../context/PortfolioContext";
import { Plus, Trash2 } from "lucide-react";

export default function Education() {
  const { education, setEducation, saveEducation } = usePortfolio(); // context global

  // Ajouter une nouvelle formation
  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        id: education.length + 1,
        diploma: "",
        school: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  // Mettre à jour un champ d'une formation
  const handleChange = (id, field, value) => {
    setEducation((prev) =>
      prev.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  // Supprimer une formation
  const handleDelete = (id) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== id));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveEducation(education);
      alert("Formations sauvegardées !");
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    }
  };

  return (
    <>
      <button className="btn btn-add" onClick={handleAddEducation}>
        <Plus size={16} /> Ajouter une formation
      </button>

      <form className="tab-panel" onSubmit={handleSubmit}>
        <div className="projects-container">
          {education.map((edu, index) => (
            <div key={edu.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">Formation {index + 1}</h2>
                {education.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(edu.id)}
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
                    placeholder="Licence / Bachelor..."
                    value={edu.diploma}
                    onChange={(e) =>
                      handleChange(edu.id, "diploma", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Établissement</label>
                  <input
                    className="input"
                    placeholder="Université de Strasbourg"
                    value={edu.school}
                    onChange={(e) =>
                      handleChange(edu.id, "school", e.target.value)
                    }
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Date de début</label>
                    <input
                      type="date"
                      className="input"
                      value={edu.startDate}
                      onChange={(e) =>
                        handleChange(edu.id, "startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Date de fin</label>
                    <input
                      type="date"
                      className="input"
                      value={edu.endDate}
                      onChange={(e) =>
                        handleChange(edu.id, "endDate", e.target.value)
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
                    value={edu.description}
                    onChange={(e) =>
                      handleChange(edu.id, "description", e.target.value)
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
