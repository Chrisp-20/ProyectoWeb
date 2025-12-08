const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1. Revisar header
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ msg: "No autorizado: falta token" });
    }

    // 2. Validar formato "Bearer token"
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token mal formado" });
    }

    // 3. Verificar token con la misma clave usada en login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Guardar ID para controladores
    req.userId = decoded.id;

    next();
  } catch (e) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
