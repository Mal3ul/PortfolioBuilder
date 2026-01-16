import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function Media() {
  const [websites, setWebsites] = useState([""]);

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

  return (
    <div className="tab-panel">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Liens & Réseaux sociaux</h2>
        </div>

        <div className="card-content">

          <div className="form-group">
            <label className="label">LinkedIn</label>
            <input className="input" placeholder="https://linkedin.com/in/..." />
          </div>

          <div className="form-group">
            <label className="label">GitHub</label>
            <input className="input" placeholder="https://github.com/..." />
          </div>

          <div className="form-group">
            <label className="label">Twitter / X</label>
            <input className="input" placeholder="https://twitter.com/..." />
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
                    className="btn btn-outline btn-sm"
                    onClick={() => removeWebsite(index)}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

            <button
              className="btn btn-outline btn-sm mt-2"
              onClick={addWebsite}
            >
              <Plus size={14} /> Ajouter un lien
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
