import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/api";
import { Lock, Mail } from "lucide-react";
import "../../styles/Editor.css";

export default function Settings() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [emailChanged, setEmailChanged] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Changer l'email
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Veuillez entrer une adresse email");
      return;
    }
    
    setLoading(true);
    try {
      await authService.changeEmail(email, user?.userId);
      setSuccessMessage("Email modifié avec succès !");
      setEmailChanged(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Changer le mot de passe
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    
    if (!currentPassword.trim()) {
      setPasswordError("Veuillez entrer votre mot de passe actuel");
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError("Veuillez entrer un nouveau mot de passe");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    
    setLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword, user?.userId);
      setSuccessMessage("Mot de passe modifié avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-panel">
      <div className="projects-container">
        {successMessage && (
          <div className="card" style={{ borderLeft: "4px solid #22c55e", backgroundColor: "#f0fdf4" }}>
            <div className="card-content">
              <p style={{ color: "#22c55e", margin: 0 }}>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Changement d'email */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={20} />
              <h2 className="card-title">Changer l'adresse email</h2>
            </div>
          </div>

          <div className="card-content">
            <form onSubmit={handleChangeEmail}>
              <div className="form-group">
                <label className="label">Email actuel</label>
                <input
                  type="email"
                  className="input"
                  value={user?.email || ""}
                  disabled
                  style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                />
              </div>

              <div className="form-group">
                <label className="label">Nouvel email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="nouveau@email.com"
                  // value={email}
                  // onChange={(e) => {
                  //   setEmail(e.target.value);
                  //   setEmailChanged(e.target.value !== user?.email);
                  // }}
                />
              </div>

              <div className="btn-container mt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!emailChanged || loading}
                >
                  {loading ? "Modification en cours..." : "Modifier l'email"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Changement de mot de passe */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={20} />
              <h2 className="card-title">Changer le mot de passe</h2>
            </div>
          </div>

          <div className="card-content">
            <form onSubmit={handleChangePassword}>
              {passwordError && (
                <div className="form-group" style={{ 
                  padding: "10px", 
                  backgroundColor: "#fee", 
                  border: "1px solid #f88", 
                  borderRadius: "4px",
                  marginBottom: "15px"
                }}>
                  <p style={{ color: "#c33", margin: 0 }}>{passwordError}</p>
                </div>
              )}

              <div className="form-group">
                {/* <label className="label">Mot de passe actuel</label> */}
                <input
                  type="password"
                  className="input"
                  placeholder="Mot de passe actuel"                  
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                {/* <label className="label">Nouveau mot de passe</label> */}
                <br />
                <input
                  type="password"
                  className="input"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                {/* <label className="label">Confirmer le nouveau mot de passe</label> */}
                <br />
                <input
                  type="password"
                  className="input"
                  placeholder="Confirmer le nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="btn-container mt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Modification en cours..." : "Modifier le mot de passe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}