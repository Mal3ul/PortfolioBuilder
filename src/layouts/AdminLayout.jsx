import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Admin */}
      <aside style={{ width: "250px", backgroundColor: "#f0f0f0", padding: "1rem" }}>
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><a href="/admin">Dashboard</a></li>
            <li><a href="/admin/users">Users</a></li>
            <li><a href="/admin/templates">Templates</a></li>
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
