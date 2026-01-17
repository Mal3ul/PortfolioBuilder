import { usePortfolio } from "../../context/PortfolioContext";

export default function Profile() {
  const { profile, setProfile, saveProfile } = usePortfolio();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier que prénom et nom sont remplis
    if (!profile.firstName || !profile.firstName.trim()) {
      alert("Le prénom est obligatoire");
      return;
    }
    if (!profile.lastName || !profile.lastName.trim()) {
      alert("Le nom est obligatoire");
      return;
    }
    
    try {
      await saveProfile(profile); // sauvegarde sur l'API et met à jour le context
      alert("Profil sauvegardé !");
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    }
  };

  return (
    <form className="tab-panel" onSubmit={handleSubmit}>
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
                  className="input"
                  placeholder="Jean"
                  value={profile.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Nom <span style={{ color: 'red' }}>*</span></label>
                <input
                  name="lastName"
                  className="input"
                  placeholder="Dupont"
                  value={profile.lastName}
                  onChange={handleChange}
                  required
                />
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
