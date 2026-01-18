// Middleware RBAC basé sur req.user (ajouté par verifyToken)

export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Non authentifié" });
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};

export const requireAnyRole = (roles) => requireRole(...roles);

// Propriétaire (id dans req.params/req.body) ou admin
export const requireSelfOrAdmin = (options = {}) => {
  const { paramKey = "userId", inBody = false } = options;
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Non authentifié" });
    const fromParams = req.params?.[paramKey];
    const fromBody = req.body?.[paramKey];
    const targetId = inBody ? fromBody : fromParams;

    if (!targetId) return res.status(400).json({ message: "Identifiant cible manquant" });

    if (req.user.role === "admin" || String(req.user.id) === String(targetId)) {
      return next();
    }
    return res.status(403).json({ message: "Accès refusé" });
  };
};
