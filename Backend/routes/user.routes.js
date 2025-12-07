const express = require("express");
const { getPerfil } = require("../controllers/user.controller.js");
const { verifyToken } = require("../middleware/auth.middleware.js");

const router = express.Router();

const usuario = await Usuario.findById(req.userId);

module.exports = router;
