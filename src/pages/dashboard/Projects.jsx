import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Projects() {
  const [formProjects, setFormProjects] = useState([
    { id: 1, title: "", description: "", technologies: "" },
  ]);

  const handleAddProject = () => {
    setFormProjects([
      ...formProjects,
      {
        id: formProjects.length + 1 ,
        title: "",
        description: "",
        technologies: "",
      },
    ]);
  };

  const handleChange = (id, field, value) => {
    setFormProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const handleDelete = (id) => {
    setFormProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Projets sauvegardés :", formProjects);

    // 🔜 plus tard :
    // - envoyer vers une API
    // - stocker dans un context
    // - mettre à jour l’aperçu live
  };

  return (
    <>
      <button className="btn btn-add" onClick={handleAddProject}>
        <Plus size={16} /> Ajouter un projet
      </button>

      <form className="tab-panel" onSubmit={handleSubmit}>
        <div className="projects-container">
          {formProjects.map((formProject, index) => (
            <div key={formProject.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">Projet {index + 1}</h2>

                {formProjects.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(formProject.id)}
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                )}
              </div>

              <div className="card-content">
                <div className="form-group">
                  <label className="label">Titre du projet</label>
                  <input
                    className="input"
                    placeholder="Mon projet"
                    value={formProject.title}
                    onChange={(e) =>
                      handleChange(formProject.id, "title", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Technologies</label>
                  <input
                    className="input"
                    placeholder="React, Node.js"
                    value={formProject.technologies}
                    onChange={(e) =>
                      handleChange(formProject.id, "technologies", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Description du projet..."
                    value={formProject.description}
                    onChange={(e) =>
                      handleChange(formProject.id, "description", e.target.value)
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
