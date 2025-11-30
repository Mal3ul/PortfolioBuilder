import {
  Eye, Edit, Plus, TrendingUp, FolderOpen, ChevronRight
} from "lucide-react";
import "../../styles/Dashboard.css";

export default function DashboardHome({ onNavigateToEditor }) {

  const recentActivities = [
    { action: 'Projet ajouté', name: 'Application E-commerce', time: 'Il y a 2 heures' },
    { action: 'Compétence ajoutée', name: 'React.js', time: 'Il y a 5 heures' },
    { action: 'Portfolio mis à jour', name: 'Section Expériences', time: 'Hier' },
    { action: 'Template changé', name: 'Design Moderne', time: 'Il y a 2 jours' }
  ];

  const stats = [
    { label: 'Vues du portfolio', value: '324', icon: Eye },
    { label: 'Projets publiés', value: '5', icon: FolderOpen },
    { label: 'Taux de complétion', value: '75%', icon: TrendingUp }
  ];

  const progressItems = [
    { name: 'Informations personnelles', percent: 100 },
    { name: 'Expériences professionnelles', percent: 80 },
    { name: 'Projets', percent: 60 },
    { name: 'Compétences', percent: 70 }
  ];

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Tableau de bord</h1>
        <p className="dashboard-subtitle">Bienvenue sur ton espace Portfolio Builder</p>
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
            <p className="card-description">Continue à enrichir ton profil</p>
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
            </div>
            <button
              className="btn-complete-profile"
              onClick={onNavigateToEditor}
            >
              Compléter mon profil
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Activité récente</h2>
            <p className="card-description">Tes dernières modifications</p>
          </div>
          <div className="card-content">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">
                    <span className="activity-action">{activity.action}</span>
                    {" · "}
                    <span className="activity-name">{activity.name}</span>
                  </p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
