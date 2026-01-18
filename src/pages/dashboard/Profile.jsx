import { usePortfolio } from "../../context/PortfolioContext";
import { useState } from "react";
import AlertBanner from "../../components/AlertBanner";

export default function Profile() {
  const { profile, setProfile, saveProfile } = usePortfolio();
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!profile.firstName || !profile.firstName.trim()) {
      errors.firstName = "Le prénom est obligatoire";
    }
    if (!profile.lastName || !profile.lastName.trim()) {
      errors.lastName = "Le nom est obligatoire";
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSaveMessage("");
      setSaveError("Veuillez corriger les erreurs ci-dessus");
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    
    try {
      await saveProfile(profile);
      setSaveError("");
      setValidationErrors({});
      setSaveMessage("Profil sauvegardé !");
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveMessage("");
      setSaveError("Erreur lors de la sauvegarde");
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <form className="tab-panel" onSubmit={handleSubmit}>
      <AlertBanner message={saveMessage} error={saveError} />
      <div className="projects-container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Informations personnelles</h2>
          </div>

          <div className="card-content">
            <div className="form-grid">
              <div className="form-group">
                <label className="label">Prénom <span style={{ color: 'red' }}>*</span></label>
                <input
                  name="firstName"
                  className={`input ${validationErrors.firstName ? 'input-error' : ''}`}
                  placeholder="Jean"
                  value={profile.firstName}
                  onChange={handleChange}
                  required
                />
                {validationErrors.firstName && <span className="error-text">{validationErrors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="label">Nom <span style={{ color: 'red' }}>*</span></label>
                <input
                  name="lastName"
                  className={`input ${validationErrors.lastName ? 'input-error' : ''}`}
                  placeholder="Dupont"
                  value={profile.lastName}
                  onChange={handleChange}
                  required
                />
                {validationErrors.lastName && <span className="error-text">{validationErrors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Titre professionnel</label>
              <input
                name="title"
                className="input"
                placeholder="Développeur Full-Stack"
                value={profile.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label">Bio</label>
              <textarea
                name="bio"
                className="textarea"
                rows={6}
                placeholder="Passionné par le développement web et les nouvelles technologies..."
                value={profile.bio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label">Téléphone</label>
              <input
                name="phone"
                type="tel"
                className="input"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label">Localisation</label>
              <input
                name="location"
                className="input"
                value={profile.location}
                onChange={handleChange}
              />
            </div>
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
