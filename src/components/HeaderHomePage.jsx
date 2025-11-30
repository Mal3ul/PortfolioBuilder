export default function Header() {
    return ( <header className="landing-header">
        <div className="landing-header-content">
          <div className="landing-logo">
            <div className="logo-icon">
              {/* <Sparkles size={18} /> */}
            </div>
            <span className="logo-text">Portfolio Builder</span>
          </div>

          <nav className="landing-nav">
            <a href="#features">Fonctionnalités</a>
            <a href="#templates">Templates</a>
            <a href="#pricing">Tarifs</a>
            <button className="btn btn-ghost" onClick={() => navigate("/login")}>Connexion</button>
            <button className="btn btn-primary" onClick={onGetStarted}>Commencer gratuitement</button>
          </nav>
        </div>
      </header> );
}