import { usePortfolio } from "../../context/PortfolioContext";
import { Plus, X } from "lucide-react";

export default function Media() {
  const { media, setMedia } = usePortfolio();
  // media = { linkedin, github, twitter, websites: [] }

  // Mise à jour des réseaux sociaux
  const updateSocial = (field, value) => {
    setMedia((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Ajouter un site web
  const addWebsite = () => {
    setMedia((prev) => ({
      ...prev,
      websites: [...prev.websites, ""],
    }));
  };

  // Mettre à jour un site web existant
  const updateWebsite = (index, value) => {
    const updatedWebsites = [...media.websites];
    updatedWebsites[index] = value;
    setMedia((prev) => ({ ...prev, websites: updatedWebsites }));
  };

  // Supprimer un site web
  const removeWebsite = (index) => {
    const updatedWebsites = media.websites.filter((_, i) => i !== index);
    setMedia((prev) => ({ ...prev, websites: updatedWebsites }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Media sauvegardé :", media);
    // Ici tu peux appeler ton API ou sauvegarder globalement
  };

  return (
    <form className="tab-panel" onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Liens & Réseaux sociaux</h2>
        </div>

        <div className="card-content">
          {/* Réseaux sociaux */}
          <div className="form-group">
            <label className="label">LinkedIn</label>
            <input
              className="input"
              placeholder="https://linkedin.com/in/..."
              value={media.linkedin}
              onChange={(e) => updateSocial("linkedin", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label">GitHub</label>
            <input
              className="input"
              placeholder="https://github.com/..."
              value={media.github}
              onChange={(e) => updateSocial("github", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label">Twitter / X</label>
            <input
              className="input"
              placeholder="https://twitter.com/..."
              value={media.twitter}
              onChange={(e) => updateSocial("twitter", e.target.value)}
            />
          </div>

          {/* Sites web personnels */}
          <div className="form-group">
            <label className="label">Sites web personnels</label>
            {media.websites.map((site, index) => (
              <div key={index} className="input-inline">
                <input
                  className="input"
                  placeholder="https://..."
                  value={site}
                  onChange={(e) => updateWebsite(index, e.target.value)}
                />
                {media.websites.length > 1 && (
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
