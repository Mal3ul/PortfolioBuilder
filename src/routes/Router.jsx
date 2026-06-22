import { createBrowserRouter } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "../components/AdminRoute";
import EditorLayout from "../layouts/EditorLayout";

// Components
import ProtectedRoute from "../components/ProtectedRoute";

// Public
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import PublicPortfolio from "../pages/public/PublicPortfolio";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";
import MentionsLegales from "../pages/public/MentionsLegales";
import Confidentialite from "../pages/public/Confidentialite";

// Dashboard
import DashboardHome from "../pages/dashboard/DashboardHome";
import Profile from "../pages/dashboard/Profile";
import Projects from "../pages/dashboard/Projects";
import Experience from "../pages/dashboard/Experience";
import Education from "../pages/dashboard/Education";
import Skills from "../pages/dashboard/Skills";
import Certifications from "../pages/dashboard/Certifications";
import Media from "../pages/dashboard/Media";
import Templates from "../pages/dashboard/PortfolioTemplate";
import Settings from "../pages/dashboard/Settings";
import Editeur from "../pages/dashboard/PortfolioEditor";

// import EditorLayout from "../components/EditorLayout.jsx"; 
// import ProfilePage from "../pages/dashboard/Profile";


// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";

// Error
import Error from "../pages/public/Error";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
      { path: "/portfolio/:userId", element: <PublicPortfolio /> },
      { path: "/mentions-legales", element: <MentionsLegales /> },
      { path: "/confidentialite", element: <Confidentialite /> },
    ],
  },

  {
    path: "/editor",
    element: (
      <ProtectedRoute>
        <EditorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Profile /> },
      { path: "profile", element: <Profile /> },
      { path: "projects", element: <Projects /> },
      { path: "experience", element: <Experience /> },
      { path: "education", element: <Education /> },
      { path: "skills", element: <Skills /> },
      { path: "certifications", element: <Certifications /> },
      { path: "media", element: <Media /> },
      { path: "templates", element: <Templates /> },
      { path: "settings", element: <Settings /> },
      // { path: "profile", element: <ProfilePage /> },
      // { path: "/editeur", element: <Editeur /> },
    ]
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/users", element: <AdminDashboard /> },
    ],
  },
]);

export default router;
