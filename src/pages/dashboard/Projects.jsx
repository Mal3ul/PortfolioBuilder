import { Plus, Trash2 } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export default function Projects() {
  const { projects, setProjects, saveProjects } = usePortfolio();

  // Ajouter un projet
  const handleAddProject = () => {
    setProjects([
      ...projects,
      { 
        id: projects.length + 1, 
        title: "", 
        description: "", 
        technologies: "",
        createdAt: Date.now()
      },
    ]);
  };

  // Mettre à jour un projet
  const handleChange = (id, field, value) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Supprimer un projet
  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Soumettre (ex: API ou sauvegarde locale)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveProjects(projects);
      alert("Projets sauvegardés !");
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    }
  };

  return (
    <>
      <button className="btn btn-add" onClick={handleAddProject}>
        <Plus size={16} /> Ajouter un projet
      </button>

      <form className="tab-panel" onSubmit={handleSubmit}>
        <div className="projects-container">
          {projects.map((project, index) => (
            <div key={project.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">Projet {index + 1}</h2>

                {projects.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(project.id)}
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
                    value={project.title}
                    onChange={(e) =>
                      handleChange(project.id, "title", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Technologies</label>
                  <input
                    className="input"
                    placeholder="React, Node.js"
                    value={project.technologies}
                    onChange={(e) =>
                      handleChange(project.id, "technologies", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Description du projet..."
                    value={project.description}
                    onChange={(e) =>
                      handleChange(project.id, "description", e.target.value)
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
