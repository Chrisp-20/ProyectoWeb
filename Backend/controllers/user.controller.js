const Usuario = require("../models/Usuario.js");

exports.getPerfil = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const user = await Usuario.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};
