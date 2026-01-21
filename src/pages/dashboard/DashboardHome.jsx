import {
  Eye, Edit, Plus, TrendingUp, FolderOpen, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext";
import { activityService } from "../../services/api";
import { useEffect, useState } from "react";
import "../../styles/Dashboard.css";

export default function DashboardHome({ onNavigateToEditeur }) {
  const navigate = useNavigate();
  const { profile, skills, projects, experiences, education, certifications, media } = usePortfolio();
  const [activities, setActivities] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNavigate = () => {
    navigate("/editor/profile");
  };

  // Fonction pour recharger les activités
  const loadActivities = async () => {
    try {
      const data = await activityService.getActivities();
      setActivities(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error);
      setActivities([]);
    }
  };

  // Charger les activités au montage et les rafraîchir périodiquement
  useEffect(() => {
    loadActivities();
    
    const interval = setInterval(() => {
      loadActivities();
    }, 5000); // Recharger toutes les 5 secondes
    
    return () => clearInterval(interval);
  }, []);

  // Helpers pour compter les champs remplis
  const countFilledFields = (item, fields) =>
    fields.reduce((sum, field) => sum + (item[field] && String(item[field]).trim() !== '' ? 1 : 0), 0);

  const calculateListCompletion = (list, fields) => {
    if (!list || list.length === 0) return 0;
    const total = list.length * fields.length;
    const filled = list.reduce((sum, item) => sum + countFilledFields(item, fields), 0);
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };

  // Calcul de la complétion du profil (7 champs)
  const calculateProfileCompletion = () => {
    const fields = ['firstName', 'lastName', 'title', 'bio', 'email', 'phone', 'location'];
    const total = fields.length;
    const filled = countFilledFields(profile || {}, fields);
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };

  // Calcul par section (4 items uniquement)
  const profileCompletion = calculateProfileCompletion();
  const skillsCompletion = Math.round((Math.min(skills.length, 5) / 5) * 100); // objectif 5 compétences
  const projectsCompletion = calculateListCompletion(projects, ['title', 'technologies', 'description']);

  // Parcours (exp + éducation + certifs + médias)
  const expFields = ['position', 'company', 'startDate', 'endDate', 'description'];
  const eduFields = ['diploma', 'school', 'startDate', 'endDate', 'description'];
  const certFields = ['title', 'organization', 'date', 'description'];

  const expTotal = Math.max(experiences.length, 1) * expFields.length;
  const eduTotal = Math.max(education.length, 1) * eduFields.length;
  const certTotal = Math.max(certifications.length, 1) * certFields.length;

  const expFilled = experiences.reduce((sum, item) => sum + countFilledFields(item, expFields), 0);
  const eduFilled = education.reduce((sum, item) => sum + countFilledFields(item, eduFields), 0);
  const certFilled = certifications.reduce((sum, item) => sum + countFilledFields(item, certFields), 0);

  const mediaValues = [
    media.linkedin,
    media.github,
    media.twitter,
    ...(media.websites || []),
    ...(media.links || [])
  ];
  const mediaTotal = 3 + (media.websites?.length || 0) + (media.links?.length || 0); // au moins les 3 réseaux
  const mediaFilled = mediaValues.filter((v) => v && String(v).trim() !== '').length;

  const parcoursTotal = expTotal + eduTotal + certTotal + mediaTotal;
  const parcoursFilled = expFilled + eduFilled + certFilled + mediaFilled;
  const parcoursCompletion = parcoursTotal > 0 ? Math.round((parcoursFilled / parcoursTotal) * 100) : 0;

  // Complétion globale (4 items, affichage principal sur total des champs)
  const globalCompletion = Math.round(
    (profileCompletion + skillsCompletion + projectsCompletion + parcoursCompletion) / 4
  );

  // Taux basé sur le total de champs réellement remplis
  const profileFieldsTotal = 7;
  const profileFieldsFilled = countFilledFields(profile || {}, ['firstName', 'lastName', 'title', 'bio', 'email', 'phone', 'location']);
  // Totaux/complétés pour le taux global basé sur tous les champs
  const skillsTotal = Math.max(skills.length, 1); // au moins 1 attendu
  const skillsFilled = skills.length;
  const projectsTotal = Math.max(projects.length, 1) * 3; // 3 champs par projet, au moins 1 projet attendu
  const projectsFilled = projects.reduce((sum, p) => sum + countFilledFields(p, ['title', 'technologies', 'description']), 0);

  const totalFields = profileFieldsTotal + skillsTotal + projectsTotal + parcoursTotal;
  const filledFields = profileFieldsFilled + skillsFilled + projectsFilled + parcoursFilled;
  const totalCompletion = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  const progressItems = [
    { name: 'Profil', percent: profileCompletion },
    { name: 'Compétences', percent: skillsCompletion },
    { name: 'Projets', percent: projectsCompletion },
    { name: 'Liens et médias', percent: parcoursCompletion }
  ];

  // Fonction pour calculer le temps relatif à partir d'un timestamp
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Récemment';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? 's' : ''}`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  };

  // Affichage des activités récentes (limité à 5)
  const displayedActivities = activities.length > 0 
    ? activities.slice(0, 6) 
    : [{ action: 'Aucune activité', name: 'Commence à remplir ton portfolio', timestamp: Date.now() }];

  const stats = [
    { label: 'Vues du portfolio', value: '324', icon: Eye },
    { label: 'Projets publiés', value: projects.length.toString(), icon: FolderOpen },
    { label: 'Taux de complétion', value: `${totalCompletion}%`, icon: TrendingUp }
  ];

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tableau de bord</h1>
          <p className="dashboard-subtitle">Bienvenue sur ton espace Portfolio Builder</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            const token = localStorage.getItem("token");
            if (token) {
              const decoded = JSON.parse(atob(token.split('.')[1]));
              if (decoded.id) {
                navigate(`/portfolio/${decoded.id}`);
              }
            }
          }}
        >
          <Eye size={18} />
          Visualiser mon portfolio
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="card stat-card">
            <div className="card-content">
              <div className="stat-header">
                <stat.icon size={20} className="stat-icon" />
              </div>
              <div className="stat-value">{stat.value}</div>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Complétion du portfolio</h2>
            <p className="card-description">Continuer à compléter votre profil</p>
          </div>
          <div className="card-content">
            <div className="progress-items">
              {progressItems.map((item, index) => (
                <div key={index} className="progress-item">
                  <div className="progress-header">
                    <span className="progress-name">{item.name}</span>
                    <span className="progress-percent">{item.percent}%</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            <button
              className="btn-complete-profile"
              onClick={handleNavigate}
            >
              Compléter mon profil
            </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Activité récente</h2>
            <p className="card-description">Tes dernières modifications</p>
          </div>
          <div className="card-content">
            {displayedActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">
                    <span className="activity-action">{activity.action}</span>
                    {" · "}
                    <span className="activity-name">{activity.name}</span>
                  </p>
                  <p className="activity-time">{getRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
