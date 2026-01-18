import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  FolderOpen,
  Search,
  MoreVertical,
  Eye,
  Shield,
  UserPlus,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/AdminDashboard.css";

const getInitials = (name = "") => name.split(" ").filter(Boolean).map((n) => n[0]).join("");

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [portfolioQuery, setPortfolioQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users from backend
        const usersRes = await fetch("http://localhost:5000/api/auth/users");
        if (!usersRes.ok) {
          throw new Error(`Users API error: ${usersRes.status}`);
        }
        const usersData = await usersRes.json();
        
        // Transform users to match table format
        const transformedUsers = (Array.isArray(usersData) ? usersData : []).map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role === "admin" ? "Admin" : "Utilisateur",
          status: "Actif",
          lastActive: new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" }),
        }));

        setUsers(transformedUsers);

        // Fetch portfolio data from backend
        const portfolioRes = await fetch("http://localhost:5000/api/portfolio");
        if (!portfolioRes.ok) {
          throw new Error(`Portfolio API error: ${portfolioRes.status}`);
        }
        const portfolioData = await portfolioRes.json();
        
        // Transform portfolio data to match table format
        if (portfolioData && portfolioData.profile) {
          const transformedPortfolios = [{
            id: 1,
            user: (portfolioData.profile?.firstName || "") + " " + (portfolioData.profile?.lastName || ""),
            title: portfolioData.profile?.title || "Portfolio",
            status: "Publié",
            updated: new Date(portfolioData.updatedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" }),
          }];
          setPortfolios(transformedPortfolios);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set empty data on error to show empty tables
        setUsers([]);
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleEditUser = (id) => {
    // Placeholder action; hook to modal or route when available
    alert("Édition du profil utilisateur " + id);
  };

  const handleDeletePortfolio = (id) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
  };

  const totalUsers = users.length;
  const publishedPortfolios = portfolios.filter((p) => p.status === "Publié").length;

  const stats = useMemo(() => ([
    { label: "Utilisateurs", value: totalUsers, icon: Users, color: "blue" },
    { label: "Portfolios publiés", value: publishedPortfolios, icon: FolderOpen, color: "purple" },
  ]), [totalUsers, publishedPortfolios]);

  const pathToTab = (pathname) => {
    if (pathname.includes("/admin/users")) return "users";
    return "portfolios"; // default (portfolios)
  };

  const tabToPath = {
    users: "/admin/users",
    portfolios: "/admin",
  };

  useEffect(() => {
    const tab = pathToTab(location.pathname);
    setActiveTab(tab);
  }, [location.pathname]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }, [searchQuery, users]);

  const filteredPortfolios = useMemo(() => {
    const q = portfolioQuery.toLowerCase();
    return portfolios.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.user.toLowerCase().includes(q)
    );
  }, [portfolioQuery, portfolios]);

  return (
    <div className="admin-panel">
      {/* <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}> 
              <ArrowLeft size={16} />
              Retour au tableau de bord
            </button>
            <div className="header-divider"></div>
            <div className="admin-header-title">
              <Shield className="admin-icon" size={20} />
              <h1>Administration</h1>
            </div>
          </div>
          <div className="admin-header-right">
            <button className="btn btn-primary">
              <UserPlus size={16} />
              Nouvel utilisateur
            </button>
          </div>
        </div>
      </header> */}

      <main className="admin-main">
        <div className="admin-stats">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="card-content">
                <div className="stat-row">
                  <div className={`stat-icon-box stat-icon-${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-tabs">
          <div className="tabs-header">
            <button
              className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => navigate(tabToPath.users)}
            >
              <Users size={16} />
              Utilisateurs
            </button>
            <button
              className={`admin-tab ${activeTab === "portfolios" ? "active" : ""}`}
              onClick={() => navigate(tabToPath.portfolios)}
            >
              <FolderOpen size={16} />
              Portfolios
            </button>
          </div>

          {activeTab === "users" && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <div className="table-header">
                    <div>
                      <h2 className="card-title">Gestion des utilisateurs</h2>
                      <p className="card-description">Gérez tous les comptes utilisateurs</p>
                    </div>
                    <div className="search-box">
                      <Search className="search-icon" size={16} />
                      <input
                        className="input search-input"
                        placeholder="Rechercher un utilisateur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Utilisateur</th>
                          <th>Rôle</th>
                          <th>Dernière activité</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="user-cell">
                                <div className="avatar avatar-sm">{getInitials(user.name)}</div>
                                <div>
                                  <p className="user-name">{user.name}</p>
                                  <p className="user-email">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${
                                user.role === "Admin" ? "badge-purple" :
                                user.role === "Premium" ? "badge-primary" :
                                "badge-secondary"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="text-gray-500">{user.lastActive}</td>
                            <td className="action-buttons">
                              <button className="btn btn-ghost action-btn" onClick={() => handleEditUser(user.id)}>Éditer</button>
                              <button className="btn btn-ghost action-btn" onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "portfolios" && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <div className="table-header">
                    <div>
                      <h2 className="card-title">Gestion des portfolios</h2>
                      <p className="card-description">Visualisez et gérez tous les portfolios</p>
                    </div>
                    <div className="search-box">
                      <Search className="search-icon" size={16} />
                      <input
                        className="input search-input"
                        placeholder="Rechercher un portfolio..."
                        value={portfolioQuery}
                        onChange={(e) => setPortfolioQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Titre</th>
                          <th>Utilisateur</th>
                          <th>Dernière mise à jour</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPortfolios.map((portfolio) => (
                          <tr key={portfolio.id}>
                            <td>{portfolio.title}</td>
                            <td className="text-gray-600">{portfolio.user}</td>
                            <td className="text-gray-500">{portfolio.updated}</td>
                            <td>
                              <button className="btn btn-ghost btn-sm action-btn" onClick={() => handleDeletePortfolio(portfolio.id)}>Supprimer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
