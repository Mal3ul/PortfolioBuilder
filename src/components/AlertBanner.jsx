export default function AlertBanner({ message, error }) {
  return (
    <>
      {message && (
        <div className="alert alert-success" style={{ marginBottom: "1rem", textAlign: "center" }}>
          {message}
        </div>
      )}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1rem", textAlign: "center" }}>
          {error}
        </div>
      )}
    </>
  );
}
