import { Sparkles, User, Briefcase, FolderOpen, Award, Settings, LogOut, Settings2, LayoutDashboard, Menu, X, GraduationCap, Album, Link } from "lucide-react";
import "../styles/Dashboard.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayName = user?.name || "Utilisateur Inconnu";
  const displayEmail = user?.email || "user@inconnu.com";
  const avatarLetter = displayName.substring(0, 1).toUpperCase();
  
  const isOnSettings = location.pathname === "/dashboard/settings";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Sparkles size={24} />
        </div>
        <span className="logo-text">Portfolio Builder</span>
      </div>

      <div className="sidebar-user">
        <div className="avatar">{avatarLetter || "?"}</div>
        <div className="user-info">
          <p className="user-name">{displayName}</p>
          {displayEmail && <p className="user-email">{displayEmail}</p>}
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink className="menu-item" to="/editor/profile" onClick={closeMobileMenu}>
          <User size={20} />
          <span className="menu-label">Profil</span>
        </NavLink>

        <NavLink className="menu-item" to="/editor/experience" onClick={closeMobileMenu}>
          <Briefcase size={20} />
          <span className="menu-label">Expériences</span>
        </NavLink>

        <NavLink className="menu-item" to="/editor/education" onClick={closeMobileMenu}>
          <GraduationCap size={20} />
          <span className="menu-label">Formations</span>
        </NavLink>

        <NavLink className="menu-item" to="/editor/certifications" onClick={closeMobileMenu}>
          <Album size={20} />
          <span className="menu-label">Certifications</span>
        </NavLink>

        <NavLink className="menu-item" to="/editor/projects" onClick={closeMobileMenu}>
          <FolderOpen size={20} />
          <span className="menu-label">Projets</span>
        </NavLink>

        <NavLink className="menu-item" to="/editor/skills" onClick={closeMobileMenu}>
          <Award size={20} />
          <span className="menu-label">Compétences</span>
        </NavLink>

        <NavLink className="menu-item" to="/editor/media" onClick={closeMobileMenu}>
          <Link size={20} />
          <span className="menu-label">Liens & Médias</span>
        </NavLink>

        {/* {isOnSettings ? (
          <NavLink className="menu-item" to="/dashboard" onClick={closeMobileMenu}>
            <LayoutDashboard size={20} />
            <span className="menu-label">Dashboard</span>
          </NavLink>
        ) : (
          <NavLink className="menu-item" to="/dashboard/settings" onClick={closeMobileMenu}>
            <Settings size={20} />
            <span className="menu-label">Paramètres</span>
          </NavLink>
        )} */}
      </nav>

      <div className="sidebar-logout">
        {user?.role === "admin" && (
          <NavLink className="menu-item" to="/admin" onClick={closeMobileMenu}>
            <Settings2 size={20} />
            <span className="menu-label">Admin</span>
          </NavLink>
        )}
        {isOnSettings ? (
          <NavLink className="menu-item" to="/dashboard" onClick={closeMobileMenu}>
            <LayoutDashboard size={20} />
            <span className="menu-label">Dashboard</span>
          </NavLink>
        ) : (
          <NavLink className="menu-item" to="/dashboard/settings" onClick={closeMobileMenu}>
            <Settings size={20} />
            <span className="menu-label">Paramètres</span>
          </NavLink>
        )}
      </div>
      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
    </>
  );
}
