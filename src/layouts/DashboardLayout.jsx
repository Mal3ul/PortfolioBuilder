import { Outlet, Link } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: "250px", backgroundColor: "#f5f5f5", padding: "1rem" }}>
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/dashboard">Accueil</Link></li>
            <li><Link to="/dashboard/profile">Profil</Link></li>
            <li><Link to="/dashboard/projects">Projets</Link></li>
            <li><Link to="/dashboard/experience">Expériences</Link></li>
            <li><Link to="/dashboard/education">Formations</Link></li>
            <li><Link to="/dashboard/skills">Compétences</Link></li>
            <li><Link to="/dashboard/certifications">Certifications</Link></li>
            <li><Link to="/dashboard/media">Médias</Link></li>
            <li><Link to="/dashboard/templates">Templates</Link></li>
            <li><Link to="/dashboard/settings">Paramètres</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
