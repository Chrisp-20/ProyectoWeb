const express = require("express");
const { 
  getPerfil, 
  depositar, 
  retirar, 
  getHistorial,
  getSaldo 
} = require("../controllers/user.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Perfil
router.get("/perfil", getPerfil);

// Saldo
router.get("/saldo", getSaldo);

// Transacciones
router.post("/depositar", depositar);
router.post("/retirar", retirar);

// Historial
router.get("/historial", getHistorial);

module.exports = router;