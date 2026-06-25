import { useState } from "react";
import { ArrowLeft, Mail, Lock, User, Sparkles, ShieldCheck } from "lucide-react";
import "../../styles/AuthPage.css";
import "../../styles/FormValidation.css";
import "../../styles/AuthAlerts.css";
import "../../styles/LegalPage.css";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Le nom complet est obligatoire";
    }
    if (!email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }
    if (!password) {
      newErrors.password = "Le mot de passe est obligatoire";
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un chiffre";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un caractère spécial";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est obligatoire";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    return newErrors;
  };

  const handleRegister = async (e) => {
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
      const res = await authService.register({
        name,
        email,
        password
      });

      // Connecter l'utilisateur après l'inscription
      login({
        id: res.userId,
        userId: res.userId,
        name: res.name,
        email: res.email,
        token: res.token
      });

      // Rediriger vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(err?.message ? `Erreur lors de l'inscription : ${err.message}` : "Erreur lors de l'inscription");
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

        <div className="auth-card">

          <h1 className="auth-title">Créer un compte</h1>
          <p className="card-description">Commence à construire ton portfolio.</p>

          {submitError && (
            <div className="alert alert-error" role="alert" style={{ marginBottom: '1rem' }}>
              <span className="sr-only">Erreur : </span>{submitError}
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-form">

            <div className="form-group">
              <label htmlFor="register-name">Nom complet <span className="required-star" aria-hidden="true">*</span></label>
              <div className="input-wrapper">
                <User className="input-icon" size={16} aria-hidden="true" />
                <input
                  id="register-name"
                  type="text"
                  className="input input-login input-with-icon"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "register-name-error" : undefined}
                />
              </div>
                {errors.name && <span id="register-name-error" className="error-message" role="alert">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email <span className="required-star" aria-hidden="true">*</span></label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={16} aria-hidden="true" />
                <input
                  id="register-email"
                  type="email"
                  className="input input-login input-with-icon"
                  placeholder="ton.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "register-email-error" : undefined}
                />
              </div>
                {errors.email && <span id="register-email-error" className="error-message" role="alert">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Mot de passe <span className="required-star" aria-hidden="true">*</span></label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={16} aria-hidden="true" />
                <input
                  id="register-password"
                  type="password"
                  className="input input-login input-with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "register-password-error" : "register-password-hint"}
                />
              </div>
                <span id="register-password-hint" className="input-hint">
                  Au moins 8 caractères, dont un chiffre et un caractère spécial.
                </span>
                {errors.password && <span id="register-password-error" className="error-message" role="alert">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="register-confirm">Confirmer le mot de passe <span className="required-star" aria-hidden="true">*</span></label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={16} aria-hidden="true" />
                  <input
                    id="register-confirm"
                    type="password"
                    className="input input-login input-with-icon"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
                  />
                </div>
                {errors.confirmPassword && <span id="register-confirm-error" className="error-message" role="alert">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>

          </form>

          <p className="auth-footer-text">
            Déjà membre ? <Link to="/login">Connexion</Link>
          </p>

          <p className="data-notice">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              En créant un compte, tu acceptes que nous collections et traitions tes données
              personnelles pour le fonctionnement du service. Pour en savoir plus, consulte
              notre <Link to="/confidentialite">politique de confidentialité</Link>.
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
