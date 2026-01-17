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
  try {
    const base = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${base}/api/portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(portfolioData),
    });

    if (!res.ok) throw new Error("Erreur API");

    alert("Portfolio publié !");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la publication");
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
