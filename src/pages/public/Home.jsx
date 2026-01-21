import React, { useState, useEffect } from "react";
import { Sparkles, Layout, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import "../../styles/LandingPage.css";

export default function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {

        // l'id du token JWT
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.id) {
          setIsAuthenticated(true);
          setUserId(decoded.id);
        }
      } catch (err) {
        console.error("Erreur décodage token:", err);
      }
    }
  }, []);

  const onGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const onViewProfile = () => {
    navigate("/dashboard");
  };

  const onViewDemo = () => {

    navigate("/portfolio/demo");
  };

  const features = [
    {
      icon: Layout,
      title: "Design intuitif",
      description: "Créez votre portfolio avec une interface simple",
    },
    {
      icon: Palette,
      title: "Personnalisation",
      description: "Choisissez parmi plusieurs templates",
    },
    {
      icon: Sparkles,
      title: "Templates",
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
            {isAuthenticated ? (
              <button className="btn btn-primary" onClick={onViewProfile}>Mon profil</button>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={() => navigate("/login")}>Connexion</button>
                <button className="btn btn-primary" onClick={onGetStarted}>Commencer</button>
              </>
            )}
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
              {isAuthenticated ? "Aller à mon profil" : "Commencer maintenant"}
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
            Créer mon portfolio
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
