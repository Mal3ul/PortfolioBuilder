import { useState } from "react";
import { ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react";
import "../../styles/AuthPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 900);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <Link to="/" className="btn-back">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <div className="auth-logo">
          <div className="logo-icon-lg">
            <Sparkles size={22} color="white" />
          </div>
          <span className="auth-logo-text">Portfolio Builder</span>
        </div>

        <div className="auth-card">

          <h1 className="auth-title">Créer un compte</h1>
          <p className="card-description">Commence à construire ton portfolio.</p>

          <form onSubmit={handleRegister} className="auth-form">

            <div className="form-group">
              <label>Nom complet</label>
              <div className="input-wrapper">
                <User className="input-icon" size={16} />
                <input
                  type="text"
                  className="input input-with-icon"
                  placeholder="Jean Dupont"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={16} />
                <input
                  type="email"
                  className="input input-with-icon"
                  placeholder="ton.email@exemple.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={16} />
                <input
                  type="password"
                  className="input input-with-icon"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>

          </form>

          <p className="auth-footer-text">
            Déjà membre ? <Link to="/login">Connexion</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
