import { NavLink } from "react-router-dom";
import { User, FolderOpen, GraduationCap, Album, Briefcase, Award, Link, Layout } from "lucide-react";
import "../../styles/Editor.css";

const TABS = [
  { path: "profile", label: "Profil", icon: User },
  { path: "projects", label: "Projets", icon: FolderOpen },
  { path: "education", label: "Formations", icon: GraduationCap },
  { path: "certifications", label: "Certifications", icon: Album },
  { path: "experience", label: "Expériences", icon: Briefcase },
  { path: "skills", label: "Compétences", icon: Award },
  { path: "media", label: "Liens", icon: Link },
  // { path: "templates", label: "Templates", icon: Layout },
];

export default function EditorTabNav() {
  return (
    <nav className="editor-tabs">
      {TABS.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `editor-tab ${isActive ? "active" : ""}`
          }
        >
          <Icon size={16} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
