import React from "react";
import { Sparkles, Layout, Palette, Share2, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/LandingPage.css";

export default function Home() {
  const navigate = useNavigate();

  const onGetStarted = () => {
    navigate("/register");
  };

  const onViewDemo = () => {

    navigate("/portfolio/demo");
  };

  const features = [
    {
      icon: Layout,
      title: "Design intuitif",
      description: "Créez votre portfolio avec une interface simple et élégante",
    },
    {
      icon: Palette,
      title: "Personnalisation",
      description: "Choisissez parmi plusieurs templates",
    },
    {
      icon: Sparkles,
      title: "Templates modernes",
      description: "Accédez à une bibliothèque de designs",
    },
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-content">
          <div className="landing-logo">
            <div className="logo-icon">
              <Sparkles size={18} />
            </div>
            <span className="logo-text">Portfolio Builder</span>
          </div>

          <nav className="landing-nav">
            <a href="#features">Fonctionnalités</a>
            <a href="#templates">Templates</a>
            <button className="btn btn-ghost" onClick={() => navigate("/login")}>Connexion</button>
            <button className="btn btn-primary" onClick={onGetStarted}>Commencer</button>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Créez votre portfolio professionnel</span>
          </div>

          <h1 className="hero-title">Crée ton portfolio professionnel en quelques clics</h1>

          <p className="hero-description">
            Une plateforme simple et intuitive pour créer, personnaliser et partager ton portfolio en ligne.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
              Commencer maintenant
            </button>
            <button className="btn btn-outline btn-lg" onClick={onViewDemo}>
              Voir un exemple
            </button>
          </div>
        </div>

        <div className="hero-preview" aria-hidden>
          <div className="preview-card">
            <div className="preview-placeholder">
              <Layout size={64} />
              <p>Aperçu de l'interface</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Tout ce dont tu as besoin</h2>
          <p className="section-description">Des fonctionnalités pensées pour te simplifier la vie</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card card">
                <div className="card-content">
                  <div className="feature-icon">
                    <Icon size={22} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Prêt à te lancer ?</h2>
          <p className="cta-description">Rejoins-nous et utilise Portfolio Builder</p>
          <button className="btn btn-secondary btn-lg" onClick={onGetStarted}>
            Créer mon portfolio gratuitement
          </button>
        </div>
      </section>

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
    </div>
  );
}
