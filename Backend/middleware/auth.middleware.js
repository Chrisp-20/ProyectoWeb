// auth.middleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No autorizado" });

  try {
    const decoded = jwt.verify(token, "clave_secreta");
    req.userId = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Token inválido" });
  }
};

module.exports = authMiddleware; 
