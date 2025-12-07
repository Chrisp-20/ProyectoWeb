import Usuario from "../models/Usuario.js";

export const getPerfil = async (req, res) => {
  const user = await Usuario.findById(req.userId).select("-contraseña");
  res.json(user);
};
