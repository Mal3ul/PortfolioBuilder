import "../styles/AuthAlerts.css";

export default function AlertBanner({ message, error }) {
  return (
    <>
      {message && (
        <div className="alert alert-success" role="status" style={{ marginBottom: "1rem", textAlign: "center" }}>
          <span className="sr-only">Succès : </span>{message}
        </div>
      )}
      {error && (
        <div className="alert alert-error" role="alert" style={{ marginBottom: "1rem", textAlign: "center" }}>
          <span className="sr-only">Erreur : </span>{error}
        </div>
      )}
    </>
  );
}
