const Usuario = require("../models/Usuario.js");

exports.getPerfil = async (req, res) => {
  try {
    const user = await Usuario.findById(req.userId).select("-contraseña");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};
