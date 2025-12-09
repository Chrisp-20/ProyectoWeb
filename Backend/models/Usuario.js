const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    rut: {
      type: String,
      trim: true,
    },
    usuario: {
      type: String,
      trim: true,
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Correo electrónico inválido"],
    },
    fechaNacimiento: {
      type: Date,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false,
    },
    saldo: {
      type: Number,
      default: 0,
      min: [0, "El saldo no puede ser negativo"],
    },
    historial: [
      {
        tipo: {
          type: String,
          enum: ["deposito", "retiro", "apuesta", "ganancia"],
        },
        monto: Number,
        descripcion: String,
        fecha: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware para encriptar password antes de guardar
UsuarioSchema.pre("save", async function () {
  // Solo encriptar si el password fue modificado
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar passwords
UsuarioSchema.methods.compararPassword = async function (passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// Método para agregar al historial
UsuarioSchema.methods.agregarHistorial = function (tipo, monto, descripcion) {
  this.historial.push({
    tipo,
    monto,
    descripcion,
    fecha: new Date(),
  });
};

module.exports = mongoose.model("Usuario", UsuarioSchema);