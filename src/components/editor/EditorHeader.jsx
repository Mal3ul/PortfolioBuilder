// src/components/editor/EditorHeader.jsx
import React from "react";
import { Eye, Save, ArrowLeft, UploadCloud } from "lucide-react";
// import "../../styles/EditorHeader.css";
// import EditorTabNav from "./EditorTabNav";
import "../../styles/Editor.css";
// import { , Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditorHeader() {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    const handleSave = () => {
        // TODO: logique de sauvegarde (API / state global)
        console.log("Sauvegarde du portfolio");
    };
    return (

        <header className="editor-topbar">
            <div className="editor-topbar-left">
                <button className="btn btn-ghost" onClick={handleBackToDashboard}>
                    <ArrowLeft size={16} />&nbsp;
                    <span>Tableau de bord</span>
                </button>

                <div className="header-divider"></div>

                <h3 className="editor-title">Éditer le portfolio</h3>
            </div>

            <div className="editor-topbar-right">
                <button className="btn btn-primary" type="submit" onClick={handleSave}>
                    <Save size={16} />
                    &nbsp; Publier
                </button>
            </div>
        </header>

    );
}
