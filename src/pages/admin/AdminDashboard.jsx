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
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "user" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le token du localStorage
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
          id: String(user.id),
          name: String(user.name || "Sans nom"),
          email: String(user.email || ""),
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
          const email = p.user_email || p.portfolio_email || p.email || "";
          const displayUser = String(userName || email || "Sans utilisateur");
          const displayEmail = String(email || "Email non renseigné");
          const updated = p.updated_at
            ? new Date(p.updated_at).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" })
            : "-";
          return {
            id: String(p.id),
            userId: String(p.user_id),
            user: displayUser,
            email: displayEmail,
            title: String(p.title || "Portfolio"),
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
    const user = users.find(u => u.id === id);
    if (user) {
      setEditingUser(user);
      setEditForm({
        name: user.name,
        email: user.email,
        role: user.role === "Admin" ? "admin" : "user"
      });
    }
  };

  const handleSaveUser = async () => {
    if (!editForm.name || !editForm.email) {
      alert("Le nom et l'email sont requis");
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role: editForm.role }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      // Mettre à jour l'état local
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: editForm.name, email: editForm.email, role: editForm.role === "admin" ? "Admin" : "Utilisateur" }
            : u
        )
      );

      setEditingUser(null);
      alert("Utilisateur mis à jour avec succès");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: "", email: "", role: "user" });
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
    const filtered = portfolios.filter((p) =>
      p.user.toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q)
    );

    return filtered;
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
                          <th>Email</th>
                          <th>Utilisateur</th>
                          <th>Dernière mise à jour</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && (
                          <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>Chargement...</td></tr>
                        )}
                        {!loading && filteredPortfolios.length === 0 && (
                          <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>Aucun portfolio trouvé</td></tr>
                        )}
                        {!loading && filteredPortfolios.map((portfolio) => (
                          <tr key={portfolio.id}>
                            <td className="text-gray-600">{portfolio.email}</td>
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

      {/* Modal d'édition utilisateur */}
      {editingUser && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Éditer l'utilisateur</h2>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-name">Nom</label>
                <input
                  id="edit-name"
                  type="text"
                  className="input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Nom complet"
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  className="input"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-role">Rôle</label>
                <select
                  id="edit-role"
                  className="input"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={handleCancelEdit}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleSaveUser}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
