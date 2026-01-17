import { useState } from "react";
import { ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react";
import "../../styles/AuthPage.css";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.register({
        name,
        email,
        password
      });

      // Connecter l'utilisateur après l'inscription
      login({
        userId: res.userId,
        name,
        email
      });

      // Rediriger vers l'éditeur
      navigate("/editor");
    } catch (err) {
      alert("Erreur lors de l'inscription : " + err.message);
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

          <h1 className="auth-title">Créer un compte</h1>
          <p className="card-description">Commence à construire ton portfolio.</p>

          <form onSubmit={handleRegister} className="auth-form">

            <div className="form-group">
              <label>Nom complet</label>
              <div className="input-wrapper">
                <User className="input-icon" size={16} />
                <input
                  type="text"
                  className="input input-login input-with-icon"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  className="input input-login input-with-icon"
                  placeholder="ton.email@exemple.com"
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

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
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
