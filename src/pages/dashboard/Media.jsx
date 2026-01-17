import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function Media() {
  const [websites, setWebsites] = useState([""]);
  const [social, setSocial] = useState({ linkedin: "", github: "", twitter: "" });

  const updateSocial = (field, value) => {
    setSocial((prev) => ({ ...prev, [field]: value }));
  };

  const addWebsite = () => {
    
    setWebsites([...websites, ""]);
  };

  const updateWebsite = (index, value) => {
    const updated = [...websites];
    updated[index] = value;
    setWebsites(updated);
  };

  const removeWebsite = (index) => {
    setWebsites(websites.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises :", { social, websites });
    // Ici tu peux appeler ton API ou mettre à jour un state global
  };

  return (
    <form className="tab-panel" onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Liens & Réseaux sociaux</h2>
        </div>

        <div className="card-content">

          <div className="form-group">
            <label className="label">LinkedIn</label>
            <input
              className="input"
              placeholder="https://linkedin.com/in/..."
              value={social.linkedin}
              onChange={(e) => updateSocial("linkedin", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label">GitHub</label>
            <input
              className="input"
              placeholder="https://github.com/..."
              value={social.github}
              onChange={(e) => updateSocial("github", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label">Twitter / X</label>
            <input
              className="input"
              placeholder="https://twitter.com/..."
              value={social.twitter}
              onChange={(e) => updateSocial("twitter", e.target.value)}
            />
          </div>

          {/* Sites web */}
          <div className="form-group">
            <label className="label">Sites web personnels</label>

            {websites.map((site, index) => (
              <div key={index} className="input-inline">
                <input
                  className="input"
                  placeholder="https://..."
                  value={site}
                  onChange={(e) => updateWebsite(index, e.target.value)}
                />

                {websites.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => removeWebsite(index)}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline btn-sm mt-2"
              onClick={addWebsite}
            >
              <Plus size={14} /> Ajouter un lien
            </button>
          </div>
          <div className="btn-container mt-4">
            <button type="submit" className="btn btn-add btn-primary">
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
