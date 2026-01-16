export default function Profile() {
  return (
    <div className="tab-panel">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Informations personnelles</h2>
        </div>

        <div className="card-content">
          <div className="form-grid">
            <div className="form-group">
              <label className="label">Prénom</label>
              <input className="input" placeholder="Jean" />
            </div>

            <div className="form-group">
              <label className="label">Nom</label>
              <input className="input" placeholder="Dupont" />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Titre professionnel</label>
            <input
              className="input"
              placeholder="Développeur Full-Stack"
            />
          </div>

          <div className="form-group">
            <label className="label">Biographie</label>
            <textarea
              className="textarea"
              rows={6}
              placeholder="Passionné par le développement web et les nouvelles technologies..."
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="jean@exemple.com" />
            </div>

            <div className="form-group">
              <label className="label">Téléphone</label>
              <input className="input" type="tel" placeholder="+33 6 12 34 56 78" />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Localisation</label>
            <input className="input" placeholder="Paris, France" />
          </div>
        </div>
      </div>
    </div>
  );
}
