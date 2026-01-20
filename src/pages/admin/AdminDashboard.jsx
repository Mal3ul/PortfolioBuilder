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
        // ✅ Récupérer le token du localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("Token manquant");
          navigate("/login");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        // Fetch users from backend
        const usersRes = await fetch("/api/admin/users", {
          headers
        });
        if (!usersRes.ok) {
          throw new Error(`Users API error: ${usersRes.status}`);
        }
        const usersData = await usersRes.json();
        
        // Transform users to match table format
        const usersList = usersData.users || [];
        const transformedUsers = usersList.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role === "admin" ? "Admin" : "Utilisateur",
          status: "Actif",
          lastActive: new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" }),
        }));

        setUsers(transformedUsers);

        // Fetch all portfolios from admin endpoint
        const portfolioRes = await fetch("/api/admin/portfolios", {
          headers
        });
        if (!portfolioRes.ok) {
          throw new Error(`Portfolio API error: ${portfolioRes.status}`);
        }
        const portfolioData = await portfolioRes.json();

        // Transform portfolios list to match table format
        const portfoliosList = portfolioData.portfolios || [];
        const transformedPortfolios = portfoliosList.map((p) => {
          const userName = p.user_name || `${p.first_name || ""} ${p.last_name || ""}`.trim();
          const displayUser = userName || p.user_email || p.portfolio_email || "";
          const updated = p.updated_at
            ? new Date(p.updated_at).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" })
            : "-";
          return {
            id: p.id,
            userId: p.user_id,
            user: displayUser,
            title: p.title || "Portfolio",
            status: "Publié",
            updated,
          };
        });
        setPortfolios(transformedPortfolios);
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
  }, [navigate]);

  const handleDeleteUser = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }
      
      // Mise à jour de l'état local après suppression réussie
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleEditUser = (id) => {
    // Placeholder action; hook to modal or route when available
    alert("Édition du profil utilisateur " + id);
  };

  const handleDeletePortfolio = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce portfolio ?")) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/portfolios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
      alert("Portfolio supprimé avec succès");
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      alert(`Suppression échouée: ${error.message}`);
    }
  };

  const handleViewPortfolio = (userId) => {
    window.open(`/portfolio/${userId}`, '_blank');
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
                            <td className="action-buttons">
                              <button className="btn btn-ghost btn-sm action-btn" onClick={() => handleViewPortfolio(portfolio.userId)}>
                                <Eye size={14} />
                                Voir
                              </button>
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
