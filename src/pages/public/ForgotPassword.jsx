import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Sparkles, ArrowLeft } from "lucide-react";
import "../../styles/AuthPage.css";
import "../../styles/FormValidation.css";
import "../../styles/AuthAlerts.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }
    setValidationErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail("");
        
        // Afficher le token en dev
        if (data.devToken) {
          console.log("Lien de réinitialisation :", data.devUrl);
        }
      } else {
        setError(data.message || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
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

          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
        <div className="auth-card">
          <h1 className="auth-title">Mot de passe oublié</h1>
          <p className="card-description">Entre ton email pour recevoir un lien de réinitialisation.</p>


          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email <span className="required-star">*</span></label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={16} />
                <input
                  type="email"
                  className={`input input-login input-with-icon ${validationErrors.email ? "input-error" : ""}`}
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
                {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
          </form>

          <p className="auth-footer-text" style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#6366f1', fontSize: '0.9rem' }}>
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
