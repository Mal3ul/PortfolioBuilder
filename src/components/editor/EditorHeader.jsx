import React from "react";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext"; // ton context
import "../../styles/Editor.css";

export default function EditorHeader() {
  const navigate = useNavigate();

  const { portfolioData } = usePortfolio(); // récupère toutes les données du portfolio

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleSave = async () => {
    // Ici on "publie" les données
    try {
      console.log("Portfolio à publier :", portfolioData);

      // Exemple avec fetch POST vers ton API
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioData),
      });

      if (!response.ok) throw new Error("Erreur lors de la publication");

      const result = await response.json();
      console.log("Portfolio publié avec succès :", result);
      alert("Portfolio publié !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la publication du portfolio");
    }
  };

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
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} />
          &nbsp; Publier
        </button>
      </div>
    </header>
  );
}
