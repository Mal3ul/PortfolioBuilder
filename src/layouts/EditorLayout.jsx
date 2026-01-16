import { Outlet } from "react-router-dom";
import EditorHeader from "../components/editor/EditorHeader";
import EditorTabNav from "../components/editor/EditorTabNav";
import EditorPreview from "../components/editor/EditorPreview";
import "../styles/Editor.css";

export default function EditorLayout() {
  const skills = ["React", "JavaScript", "Node.js", "CSS", "Git"];

  return (
    <div className="editor-layout">
      <EditorHeader />
<br />
      <EditorTabNav />

      <div className="editor-pages">
        <div className="editor-content">
          <Outlet />
        </div>
        {/* <EditorPreview skills={skills} /> */}
      </div>
    </div>
  );
}
