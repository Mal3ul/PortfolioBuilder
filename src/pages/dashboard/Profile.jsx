import { useState } from "react";

export default function Profile() {
  // On crée un state pour stocker toutes les informations
  const [formProfile, setFormProfile] = useState({
    firstName: "",
    lastName: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
  });

  // Fonction pour mettre à jour le state quand l'utilisateur écrit
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fonction pour gérer la soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises :", formProfile);
    // Ici tu peux appeler ton API ou mettre à jour un state global
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
                <label className="label">Prénom</label>
                <input
                  name="firstName"
                  className="input"
                  placeholder="Jean"
                  value={formProfile.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="label">Nom</label>
                <input
                  name="lastName"
                  className="input"
                  placeholder="Dupont"
                  value={formProfile.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Titre professionnel</label>
              <input
                name="title"
                className="input"
                placeholder="Développeur Full-Stack"
                value={formProfile.title}
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
                value={formProfile.bio}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                className="input"
                placeholder="jean@exemple.com"
                value={formProfile.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label">Téléphone</label>
              <input
                name="phone"
                type="tel"
                className="input"
                placeholder="+33 6 12 34 56 78"
                value={formProfile.phone}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label className="label">Localisation</label>
              <input
                name="location"
                className="input"
                placeholder="Paris, France"
                value={formProfile.location}
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