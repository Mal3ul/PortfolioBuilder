import { useState } from "react";
import { ArrowLeft, Mail, Lock, Sparkles } from "lucide-react";
import "../../styles/AuthPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
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

          <h1 className="auth-title">Connexion</h1>
          <p className="card-description">Accède à ton espace.</p>

          <form onSubmit={handleLogin} className="auth-form">

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
              <div className="form-label-row">
                <label>Mot de passe</label>
              </div>
              <div className="input-wrapper">
                <Lock className="input-icon" size={16} />
                <input
                  type="password"
                  className="input input-with-icon"
                  placeholder="••••••••"
                  required
                />
              </div>
              <a href="#" className="forgot-password">Mot de passe oublié</a>
            </div>

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="auth-footer-text"> Nouveau ? <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
