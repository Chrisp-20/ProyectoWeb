const express = require("express");
const { getPerfil } = require("../controllers/user.controller.js");
const { verifyToken } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/perfil", verifyToken, getPerfil);

module.exports = router;
