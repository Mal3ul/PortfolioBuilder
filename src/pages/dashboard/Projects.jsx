// src/pages/editor/Projects.jsx
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([
    { id: 1, title: "", description: "", technologies: "" }, // 1 card par défaut
  ]);

  const handleAddProject = () => {
    setProjects([
      ...projects,
      { id: projects.length + 1, title: "", description: "", technologies: "" },
    ]);
  };

  const handleChange = (id, field, value) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <>
      <button className="btn btn-add" onClick={handleAddProject}>
        <Plus size={16} /> Ajouter un projet
      </button>
      <div className="tab-panel">
        <div className="projects-container">

          {projects.map((project) => (
            <div key={project.id} className="card project-card">
              <div className="card-header">
                <h2 className="card-title">Projet {project.id}</h2>
                {projects.length > 1 && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleDelete(project.id)}>
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
                    onChange={(e) => handleChange(project.id, "title", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="label">Technologies</label>
                  <input
                    className="input"
                    placeholder="React, Node.js"
                    value={project.technologies}
                    onChange={(e) => handleChange(project.id, "technologies", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Description du projet..."
                    value={project.description}
                    onChange={(e) => handleChange(project.id, "description", e.target.value)}
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
