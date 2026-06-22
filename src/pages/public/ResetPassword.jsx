import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../styles/AuthPage.css";
import "../../styles/FormValidation.css";
import "../../styles/AuthAlerts.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
        <div className="auth-card">
          <h1>Nouveau mot de passe</h1>
          <p className="auth-subtitle">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>

          {message && (
            <div className="alert alert-success" role="status">
              <span className="sr-only">Succès : </span>{message}
              <br />
              <small>Redirection vers la page de connexion...</small>
            </div>
          )}

          {error && (
            <div className="alert alert-error" role="alert">
              <span className="sr-only">Erreur : </span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe <span className="required-star" aria-hidden="true">*</span></label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                disabled={loading}
                minLength={6}
                aria-invalid={error ? "true" : "false"}
                className={error ? "input-error" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe <span className="required-star" aria-hidden="true">*</span></label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retapez le mot de passe"
                required
                disabled={loading}
                minLength={6}
                aria-invalid={error ? "true" : "false"}
                className={error ? "input-error" : ""}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login">Retour à la connexion</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
