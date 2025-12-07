const express = require("express");
const { registro, login } = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/Register", registro);
router.post("/Login", login);

module.exports = router;
