import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Admin */}
      <SidebarAdmin />

      {/* Contenu principal */}
      <main style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
