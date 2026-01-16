import { Eye } from "lucide-react";
import "../../styles/Editor.css";

export default function EditorPreview({ skills = [] }) {
  return (
    <aside className="preview-panel">
      <div className="preview-header">
        <h3>Aperçu en direct</h3>
        <button className="btn btn-outline btn-sm">
          <Eye size={16} />
        </button>
      </div>

      <div className="preview-card">
        <div className="preview-content">
          <div className="preview-avatar">👨‍💻</div>
          <h3 className="preview-name">Jean Dupont</h3>
          <p className="preview-role">Développeur Full-Stack</p>
        </div>

        <div className="preview-section">
          <p className="preview-label">À PROPOS</p>
          <p className="preview-text">
            Passionné par le développement web et les nouvelles technologies...
          </p>
        </div>

        <div className="preview-section">
          <p className="preview-label">COMPÉTENCES</p>
          <div className="preview-skills">
            {skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="badge badge-secondary badge-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
