import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div>
      {/* Header */}
      <header>
        <h1>Portfolio Builder</h1>
      </header>

      {/* Page content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <p>© 2024 Portfolio Builder</p>
      </footer>
    </div>
  );
}
