import { usePortfolio } from "../../context/PortfolioContext";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import AlertBanner from "../../components/AlertBanner";

export default function Media() {
  const { media, setMedia, saveMedia } = usePortfolio();
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [imagePreview, setImagePreview] = useState(media.profileImage || null);
  const [uploading, setUploading] = useState(false);
  const [pdfFile, setPdfFile] = useState(media.cvFile || null);
  const [pdfName, setPdfName] = useState(media.cvFileName || "");
  const [uploadingPdf, setUploadingPdf] = useState(false);
  // media = { linkedin, github, twitter, websites: [], profileImage: "", cvFile: "", cvFileName: "" }

  // Mettre à jour l'aperçu quand media change
  useEffect(() => {
    if (media.profileImage) {
      setImagePreview(media.profileImage);
    }
    if (media.cvFile) {
      setPdfFile(media.cvFile);
      setPdfName(media.cvFileName || "CV.pdf");
    }
  }, [media.profileImage, media.cvFile, media.cvFileName]);

  // Mise à jour des réseaux sociaux
  const updateSocial = (field, value) => {
    setMedia((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Ajouter un site web
  const addWebsite = () => {
    setMedia((prev) => ({
      ...prev,
      websites: [...prev.websites, ""],
    }));
  };

  // Mettre à jour un site web existant
  const updateWebsite = (index, value) => {
    const updatedWebsites = [...media.websites];
    updatedWebsites[index] = value;
    setMedia((prev) => ({ ...prev, websites: updatedWebsites }));
  };

  // Supprimer un site web
  const removeWebsite = (index) => {
    const updatedWebsites = media.websites.filter((_, i) => i !== index);
    setMedia((prev) => ({ ...prev, websites: updatedWebsites }));
  };

  // Gérer l'upload d'image
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type (JPEG ou PNG uniquement)
    if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSaveError("Formats acceptés : JPG ou PNG uniquement");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveError("L'image est trop volumineuse (max 5MB)");
      return;
    }

    setUploading(true);
    try {
      // Convertir en base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setMedia((prev) => ({ ...prev, profileImage: base64String }));
        setUploading(false);
      };
      reader.onerror = () => {
        setSaveError("Erreur lors de la lecture du fichier");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setSaveError("Erreur lors de l'upload");
      setUploading(false);
    }
  };

  // Supprimer l'image
  const removeImage = () => {
    setImagePreview(null);
    setMedia((prev) => ({ ...prev, profileImage: "" }));
  };

  // Gérer l'upload de PDF
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (file.type !== 'application/pdf') {
      setSaveError("Veuillez sélectionner un fichier PDF");
      return;
    }

    // Vérifier la taille (max 2MB pour base64)
    if (file.size > 2 * 1024 * 1024) {
      setSaveError("Le PDF est trop volumineux (max 2MB). Compressez votre PDF ou réduisez le nombre de pages.");
      return;
    }

    setUploadingPdf(true);
    try {
      // Convertir en base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPdfFile(base64String);
        setPdfName(file.name);
        setMedia((prev) => ({ ...prev, cvFile: base64String, cvFileName: file.name }));
        setSaveError(""); // Clear any previous errors
        setUploadingPdf(false);
      };
      reader.onerror = () => {
        setSaveError("Erreur lors de la lecture du fichier");
        setUploadingPdf(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setSaveError("Erreur lors de l'upload");
      setUploadingPdf(false);
    }
  };

  // Supprimer le PDF
  const removePdf = () => {
    setPdfFile(null);
    setPdfName("");
    setMedia((prev) => ({ ...prev, cvFile: "", cvFileName: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveMedia(media);
      setSaveError("");
      setSaveMessage("Médias sauvegardés !");
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveMessage("");
      setSaveError("Erreur lors de la sauvegarde");
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <form className="tab-panel" onSubmit={handleSubmit}>
      <AlertBanner message={saveMessage} error={saveError} />
      
      {/* Section Image de profil */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Image de profil</h2>
        </div>
        <div className="card-content">
          <div className="form-group">
            <label className="label">Photo de profil</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => document.getElementById('image-upload').click()}
                disabled={uploading}
              >
                <Upload size={16} />
                {uploading ? "Upload en cours..." : "Sélectionner une image"}
              </button>

              <div style={{ color: '#374151', fontSize: '0.95rem' }}>
                {imagePreview ? "Image téléchargée" : "Aucune image sélectionnée"}
              </div>

              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="btn btn-outline btn-sm"
                >
                  <X size={16} /> Supprimer l'image
                </button>
              )}

              <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'left' }}>
                Formats acceptés : JPG ou PNG (max 5MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section CV/PDF */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">CV / Document</h2>
        </div>
        <div className="card-content">
          <div className="form-group">
            <label className="label">Fichier PDF (CV)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                style={{ display: 'none' }}
                disabled={uploadingPdf}
              />

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => document.getElementById('pdf-upload').click()}
                disabled={uploadingPdf}
              >
                <Upload size={16} />
                {uploadingPdf ? "Upload en cours..." : "Sélectionner un PDF"}
              </button>

              <div style={{ color: '#374151', fontSize: '0.95rem' }}>
                {pdfFile ? `PDF sélectionné : ${pdfName}` : "Aucun PDF sélectionné"}
              </div>

              {pdfFile && (
                <button
                  type="button"
                  onClick={removePdf}
                  className="btn btn-outline btn-sm"
                >
                  <X size={16} /> Supprimer le PDF
                </button>
              )}

              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Format accepté : PDF uniquement (max 2MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Liens & Réseaux sociaux</h2>
        </div>

        <div className="card-content">
          {/* Réseaux sociaux */}
          <div className="form-group">
            <label className="label">LinkedIn</label>
            <input
              className="input"
              placeholder="https://linkedin.com/in/..."
              value={media.linkedin || ""}
              onChange={(e) => updateSocial("linkedin", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label">GitHub</label>
            <input
              className="input"
              placeholder="https://github.com/..."
              value={media.github || ""}
              onChange={(e) => updateSocial("github", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label">Twitter / X</label>
            <input
              className="input"
              placeholder="https://twitter.com/..."
              value={media.twitter || ""}
              onChange={(e) => updateSocial("twitter", e.target.value)}
            />
          </div>

          {/* Sites web personnels */}
          <div className="form-group">
            <label className="label">Sites web personnels</label>
            {media.websites.map((site, index) => (
              <div key={index} className="input-inline">
                <input
                  className="input"
                  placeholder="https://..."
                  value={site}
                  onChange={(e) => updateWebsite(index, e.target.value)}
                />
                {media.websites.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => removeWebsite(index)}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline btn-sm mt-2"
              onClick={addWebsite}
            >
              <Plus size={14} /> Ajouter un lien
            </button>
          </div>

          <div className="btn-container mt-4">
            <button type="submit" className="btn btn-add btn-primary">
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
