const express = require("express");
const { jugarRuleta } = require("../controllers/ruleta.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/apostar", authMiddleware, jugarRuleta);

module.exports = router;
