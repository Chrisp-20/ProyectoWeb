const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js"); // import directo de la función
const { jugarRuleta } = require("../controllers/ruleta.controller.js");

const router = express.Router();

router.post("/apostar", authMiddleware, jugarRuleta); 

module.exports = router;
