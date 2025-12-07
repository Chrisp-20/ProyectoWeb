const express = require("express");
const { getPerfil } = require("../controllers/user.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/Perfil", authMiddleware, getPerfil);

module.exports = router;
