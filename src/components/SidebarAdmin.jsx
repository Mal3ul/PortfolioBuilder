import { FolderOpen, Users, LogOut, LayoutDashboard } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.name || "Admin";
  const avatarLetter = displayName.substring(0, 1).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar" style={{ width: 260 }}>
      <div className="sidebar-logo">
        <div className="logo-icon">AD</div>
        <span className="logo-text">Portfolio Builder</span>
      </div>

      <div className="sidebar-user">
        <div className="avatar">{avatarLetter}</div>
        <div className="user-info">
          <p className="user-name">{displayName}</p>
          <p className="user-email">Admin</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          to="/admin"
          end
        >
          <FolderOpen size={20} />
          <span className="menu-label">Portfolios</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          to="/admin/users"
        >
          <Users size={20} />
          <span className="menu-label">Users</span>
        </NavLink>
        
          <NavLink className="menu-item" to="/dashboard">
            <LayoutDashboard size={20} />
            <span className="menu-label">Dashboard</span>
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
