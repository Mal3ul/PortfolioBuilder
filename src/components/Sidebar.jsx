import {
  User, Briefcase, FolderOpen, Award, Settings, LogOut
} from "lucide-react";
import "../styles/Dashboard.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">PB</div>
        <span className="logo-text">Portfolio Builder</span>
      </div>

      <div className="sidebar-user">
        <div className="avatar">?</div>
        <div className="user-info">
          <p className="user-name">jean dupont</p>
          <p className="user-email">jean@example.com</p>
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
        <button className="logout-btn">
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
