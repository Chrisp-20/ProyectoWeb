import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registro = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ msg: "Correo ya registrado" });

    const hash = await bcrypt.hash(contraseña, 10);

    const user = await Usuario.create({
      nombre,
      correo,
      contraseña: hash,
      saldo: 0,
    });

    res.json({ msg: "Usuario registrado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ msg: "Usuario no existe" });

    const ok = await bcrypt.compare(contraseña, user.contraseña);
    if (!ok) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id },
      "clave_secreta",
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
