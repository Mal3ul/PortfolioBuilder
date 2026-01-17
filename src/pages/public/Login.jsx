import { useState } from "react";
import { ArrowLeft, Mail, Lock, Sparkles } from "lucide-react";
import "../../styles/AuthPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login({
        email,
        password
      });

      login(res);
      navigate("/dashboard");
    } catch (err) {
      alert("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
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
          <p className="card-description">Connecte-toi pour accéder à ton tableau de bord.</p>

          <form onSubmit={handleLogin} className="auth-form">

            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={16} />
                <input
                  type="email"
                  className="input input-login input-with-icon"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="input input-login input-with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="auth-footer-text">
            Tu n'as pas de compte ? <Link to="/register" style={{ color: '#6366f1', fontWeight: 'bold' }}>S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
