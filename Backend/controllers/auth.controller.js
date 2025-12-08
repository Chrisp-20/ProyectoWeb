const Usuario = require("../models/Usuario.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registro = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password)
      return res.status(400).json({ msg: "Faltan datos" });

    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ msg: "Correo ya registrado" });

    const hash = await bcrypt.hash(password, 10);

    await Usuario.create({
      nombre,
      correo,
      password: hash,
      saldo: 0,
    });

    res.json({ msg: "Usuario registrado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ msg: "Usuario no existe" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        saldo: user.saldo,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
