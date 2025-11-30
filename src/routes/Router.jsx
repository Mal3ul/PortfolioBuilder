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
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    { index: true, element: <DashboardHome /> },
    { path: "profile", element: <Profile /> },
    { path: "projects", element: <Projects /> },
    { path: "experience", element: <Experience /> },
    { path: "education", element: <Education /> },
    { path: "skills", element: <Skills /> },
    { path: "certifications", element: <Certifications /> },
    { path: "media", element: <Media /> },
    { path: "templates", element: <Templates /> },
    { path: "settings", element: <Settings /> },
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
