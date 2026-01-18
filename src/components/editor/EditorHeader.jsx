import React from "react";
import { Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Editor.css";

export default function EditorHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Bouton de visualisation: lien vers le portfolio public de l'utilisateur


  return (
    <header className="editor-topbar">
      <div className="editor-topbar-left">
        <button className="btn btn-ghost" onClick={handleBackToDashboard}>
          <ArrowLeft size={16} />&nbsp;
          <span>Tableau de bord</span>
        </button>

        <div className="header-divider"></div>

        <h3 className="editor-title">Éditer le portfolio</h3>
      </div>

      <div className="editor-topbar-right">
        <a
          className="btn btn-primary"
          href={user?.id ? `/portfolio/${user.id}` : `#`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Eye size={16} />
          &nbsp; Visualiser
        </a>
      </div>
    </header>
  );
}
