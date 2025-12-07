import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, unique: true },
  contraseña: String,
  saldo: { type: Number, default: 0 },
  historial: { type: Array, default: [] }
});

export default mongoose.model("Usuario", UsuarioSchema);
