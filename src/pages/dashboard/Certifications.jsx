import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Certifications() {
  const [formCertifications, setFormCertifications] = useState([
    {
      id: 1,
      title: "",
      organization: "",
      date: "",
      description: "",
    },
  ]);

  const handleAddCertification = () => {
    setFormCertifications([
      ...formCertifications,
      {
        id: formCertifications.length + 1,
        title: "",
        organization: "",
        date: "",
        description: "",
      },
    ]);
  };

  const handleChange = (id, field, value) => {
    setFormCertifications((prev) =>
      prev.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const handleDelete = (id) => {
    setFormCertifications((prev) => prev.filter((cert) => cert.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises :", formCertifications);
    // Ici tu peux appeler ton API ou mettre à jour un state global
  };

  return (
    <>
      <button className="btn btn-add" onClick={handleAddCertification}>
        <Plus size={16} /> Ajouter une certification
      </button>

      <form className="tab-panel" onSubmit={handleSubmit}>
        <div className="projects-container">
          {formCertifications.map((certification, index) => (
            <div key={certification.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">
                  Certification {index + 1}
                </h2>

                {formCertifications.length > 1 && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(certification.id)}
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                )}
              </div>

              <div className="card-content">
                <div className="form-group">
                  <label className="label">Titre</label>
                  <input
                    className="input"
                    placeholder="AWS Cloud Practitioner"
                    value={formCertifications.title}
                    onChange={(e) =>
                      handleChange(
                        certification.id,
                        "title",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Organisme</label>
                  <input
                    className="input"
                    placeholder="Amazon"
                    value={formCertifications.organization}
                    onChange={(e) =>
                      handleChange(
                        certification.id,
                        "organization",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Date d’obtention</label>
                  <input
                    type="date"
                    className="input"
                    value={formCertifications.date}
                    onChange={(e) =>
                      handleChange(
                        certification.id,
                        "date",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Description de la certification..."
                    value={formCertifications.description}
                    onChange={(e) =>
                      handleChange(
                        certification.id,
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
