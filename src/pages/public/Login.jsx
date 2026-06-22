import { useState } from "react";
import { ArrowLeft, Mail, Lock, Sparkles, ShieldCheck } from "lucide-react";
import "../../styles/AuthPage.css";
import "../../styles/FormValidation.css";
import "../../styles/LegalPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/api";
import AlertBanner from "../../components/AlertBanner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }
    if (!password) {
      newErrors.password = "Le mot de passe est obligatoire";
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitError("");
    setLoading(true);

    try {
      const res = await authService.login({
        email,
        password
      });

      // Normaliser la réponse: id, role
      const userData = {
        ...res,
        id: res.userId || res.id,
        role: res.role || "user"
      };

      login(userData);
      navigate(userData.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setSubmitError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <Link to="/" className="btn-back">
          <ArrowLeft size={16} aria-hidden="true" /> Retour à l'accueil
        </Link>

        <div className="auth-logo">
          <div className="logo-icon-lg">
            <Sparkles size={22} color="white" aria-hidden="true" />
          </div>
          <span className="auth-logo-text">Portfolio Builder</span>
        </div>

          <AlertBanner message="" error={submitError} />
        
        <div className="auth-card">

          <h1 className="auth-title">Connexion</h1>
          <p className="card-description">Connecte-toi pour accéder à ton tableau de bord.</p>

          <form onSubmit={handleLogin} className="auth-form">

            <div className="form-group">
              <label htmlFor="login-email">Email <span className="required-star" aria-hidden="true">*</span></label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={16} aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  className={`input input-login input-with-icon ${errors.email ? "input-error" : ""}`}
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "login-email-error" : undefined}
                />
              </div>
              {errors.email && <span id="login-email-error" className="error-message" role="alert">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Mot de passe <span className="required-star" aria-hidden="true">*</span></label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={16} aria-hidden="true" />
                <input
                  id="login-password"
                  type="password"
                  className={`input input-login input-with-icon ${errors.password ? "input-error" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "login-password-error" : undefined}
                />
              </div>
              {errors.password && <span id="login-password-error" className="error-message" role="alert">{errors.password}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="auth-footer-text" style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: '#6366f1', fontSize: '0.9rem' }}>
              Mot de passe oublié ?
            </Link>
          </p>

          <p className="auth-footer-text">
            Tu n'as pas de compte ? <Link to="/register" style={{ color: '#6366f1', fontWeight: 'bold' }}>S'inscrire</Link>
          </p>

          <p className="data-notice">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              En te connectant, tu acceptes que nous collections et traitions tes données
              personnelles pour le fonctionnement du service. Pour en savoir plus, consulte
              notre <Link to="/confidentialite">politique de confidentialité</Link>.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
