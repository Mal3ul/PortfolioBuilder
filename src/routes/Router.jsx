import { createBrowserRouter } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import PublicPortfolio from "../pages/public/PublicPortfolio";

// Dashboard pages
import DashboardHome from "../pages/dashboard/DashboardHome";
import Profile from "../pages/dashboard/Profile";
import Projects from "../pages/dashboard/Projects";
import Experience from "../pages/dashboard/Experience";
import Education from "../pages/dashboard/Education";
import Skills from "../pages/dashboard/Skills";
import Certifications from "../pages/dashboard/Certifications";
import Media from "../pages/dashboard/Media";
import Templates from "../pages/dashboard/Templates";
import Settings from "../pages/dashboard/Settings";

// Admin pages
import AdminHome from "../pages/admin/AdminHome";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminTemplates from "../pages/admin/AdminTemplates";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/portfolio/:username", element: <PublicPortfolio /> },
    ],
  },

  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <DashboardHome /> },
      { path: "/dashboard/profile", element: <Profile /> },
      { path: "/dashboard/projects", element: <Projects /> },
      { path: "/dashboard/experience", element: <Experience /> },
      { path: "/dashboard/education", element: <Education /> },
      { path: "/dashboard/skills", element: <Skills /> },
      { path: "/dashboard/certifications", element: <Certifications /> },
      { path: "/dashboard/media", element: <Media /> },
      { path: "/dashboard/templates", element: <Templates /> },
      { path: "/dashboard/settings", element: <Settings /> },
    ],
  },

  {
    element: <AdminLayout />,
    children: [
      { path: "/admin", element: <AdminHome /> },
      { path: "/admin/users", element: <AdminUsers /> },
      { path: "/admin/templates", element: <AdminTemplates /> },
    ],
  },
]);

export default router;
