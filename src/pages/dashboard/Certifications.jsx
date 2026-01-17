import { usePortfolio } from "../../context/PortfolioContext";
import { Plus, Trash2 } from "lucide-react";

export default function Certifications() {
  const { certifications, setCertifications, saveCertifications } = usePortfolio();

  // Ajouter une nouvelle certification
  const handleAddCertification = () => {
    setCertifications([
      ...certifications,
      {
        id: certifications.length + 1,
        title: "",
        organization: "",
        date: "",
        description: "",
        createdAt: Date.now()
      },
    ]);
  };

  // Mettre à jour une certification
  const handleChange = (id, field, value) => {
    setCertifications(
      certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  // Supprimer une certification
  const handleDelete = (id) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  // Soumettre (pour debug ou API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveCertifications(certifications);
      alert("Certifications sauvegardées !");
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    }
  };

  return (
    <>
      <button className="btn btn-add mb-4" onClick={handleAddCertification}>
        <Plus size={16} /> Ajouter une certification
      </button>

      <form className="tab-panel" onSubmit={handleSubmit}>
        <div className="projects-container">
          {certifications.map((certification, index) => (
            <div key={certification.id} className="card project-card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h2 className="card-title">Certification {index + 1}</h2>
                {certifications.length > 1 && (
                  <button
                    type="button"
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
                    name="title"
                    className="input"
                    placeholder="AWS Cloud Practitioner"
                    value={certification.title}
                    onChange={(e) =>
                      handleChange(certification.id, "title", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Organisme</label>
                  <input
                    name="organization"
                    className="input"
                    placeholder="Amazon"
                    value={certification.organization}
                    onChange={(e) =>
                      handleChange(certification.id, "organization", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Date d’obtention</label>
                  <input
                    type="date"
                    name="date"
                    className="input"
                    value={certification.date}
                    onChange={(e) =>
                      handleChange(certification.id, "date", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    className="textarea"
                    rows={4}
                    placeholder="Description de la certification..."
                    value={certification.description}
                    onChange={(e) =>
                      handleChange(certification.id, "description", e.target.value)
                    }
                  />
                </div>
        <div className="btn-container mt-4">
          <button type="submit" className="btn btn-primary">
            Sauvegarder
          </button>
        </div>
              </div>
            </div>
          ))}
        </div>

      </form>
    </>
  );
}
