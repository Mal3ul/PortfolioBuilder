import { User, Briefcase, FolderOpen, Award, Settings, LogOut } from "lucide-react";
import "../styles/Dashboard.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.name || "Utilisateur";
  const displayEmail = user?.email || "";
  const avatarLetter = displayName.substring(0, 1).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">PB</div>
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
        <NavLink className="menu-item" to="/editor/profile">
          <User size={20} />
          <span className="menu-label">Profil</span>
        </NavLink>

        <NavLink className="menu-item" to="/editor/experience">
          <Briefcase size={20} />
          <span className="menu-label">Expérience</span>
        </NavLink>

        <NavLink className="menu-item" to="/editor/projects">
          <FolderOpen size={20} />
          <span className="menu-label">Projets</span>
        </NavLink>

        <NavLink className="menu-item" to="/editor/skills">
          <Award size={20} />
          <span className="menu-label">Compétences</span>
        </NavLink>

        <NavLink className="menu-item" to="/dashboard/settings">
          <Settings size={20} />
          <span className="menu-label">Paramètres</span>
        </NavLink>
      </nav>

      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
