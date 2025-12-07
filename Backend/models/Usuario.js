const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, unique: true },
  contraseña: String,
  saldo: { type: Number, default: 0 },
  historial: { type: Array, default: [] }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
