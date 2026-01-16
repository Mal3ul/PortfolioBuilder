import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <div className="logo-icon">
                <Sparkles size={16} />
              </div>
              <span className="logo-text">Portfolio Builder</span>
            </div>
            <p className="footer-text">La plateforme la plus simple pour créer ton portfolio professionnel.</p>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Produit</h3>
            <ul className="footer-links">
              <li><a href="#features">Fonctionnalités</a></li>
              <li><a href="#templates">Templates</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Entreprise</h3>
            <ul className="footer-links">
              <li><a href="#">À propos</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Confidentialité</a></li>
            </ul>
          </div>
        </div>
      </footer>
   );
}