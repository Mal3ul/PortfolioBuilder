import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Error.css";
import { AlertCircle } from "lucide-react";

export default function Error() {
  return (
    <div className="error-page">
      <div className="error-container">
        <AlertCircle size={64} color="#4f46e5" />
        <h1 className="error-title">404</h1>
        <p className="error-message">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btn btn-primary">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
